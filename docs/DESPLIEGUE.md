# Guia de despliegue en Azure

Documenta el despliegue de Automotora Facundo Cousiño en Microsoft Azure con
CI/CD desde Azure DevOps.

---

## 1. Recursos necesarios en Azure

| Recurso | Nombre usado | Notas |
|---------|--------------|-------|
| Resource Group | `rg-automotorafc` | Agrupa todo el proyecto |
| App Service Plan | `plan-automotorafc` | Linux. Ver seccion 1.1 |
| App Service (backend) | `automotorafc-api` | Runtime **Python 3.11** |
| App Service (frontend) | `automotorafc-web` | Runtime **Node 22 LTS** |
| Azure Database for PostgreSQL | `psql-automotorafc` | Flexible Server, ver seccion 4 |

Azure agrega un sufijo aleatorio al dominio de cada App Service. Los dominios
reales de este proyecto son:

- Backend: `automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net`
- Frontend: `automotorafc-web-hgdqhpefcucggzg9.eastus2-01.azurewebsites.net`

Conviene copiarlos desde el portal en lugar de armarlos a mano: asumir
`<nombre>.azurewebsites.net` da un dominio que no existe, y el despliegue del
pipeline falla con *Resource doesn't exist*.

### 1.1 Sobre el plan F1 (gratuito)

En F1 el plan tiene una **cuota diaria de 60 minutos de CPU que se comparte por
suscripcion y region**, no por aplicacion. Al agotarse, Azure detiene los sitios
y responden `403 Site Disabled` con el mensaje "Se ha excedido la cuota". La
cuota se reinicia a las **00:00 UTC** (21:00 en Chile continental).

Tres consecuencias practicas:

1. Una aplicacion que falla al arrancar y queda reiniciandose en bucle consume
   la cuota del dia completa en poco tiempo, y deja sin servicio tambien a las
   demas aplicaciones de esa suscripcion y region. Conviene borrar las
   aplicaciones que quedaron inservibles antes de crear las nuevas.
2. Crear un plan nuevo **no** entrega cuota nueva: el limite es de la
   suscripcion y la region, no del plan.
3. Si hay que seguir trabajando el mismo dia, la salida sin costo es crear las
   aplicaciones en **otra region** (por ejemplo Central US) dentro de la misma
   suscripcion.

Con un plan B1 o superior el limite desaparece, pero deja de ser gratuito.

---

## 2. Variables de aplicacion (App Service > Configuration)

### Backend `automotorafc-api`

| Nombre | Valor |
|--------|-------|
| `DJANGO_SECRET_KEY` | Una clave larga y aleatoria **distinta** a la de desarrollo |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net` |
| `CORS_ALLOWED_ORIGINS` | `https://automotorafc-web-hgdqhpefcucggzg9.eastus2-01.azurewebsites.net` |
| `DATABASE_URL` | Cadena de conexion de PostgreSQL (seccion 4) |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `ENABLE_ORYX_BUILD` | `true` |

**Startup Command:** `bash /home/site/wwwroot/startup.sh`

### Frontend `automotorafc-web`

| Nombre | Valor |
|--------|-------|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `ENABLE_ORYX_BUILD` | `true` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~22` |

**Startup Command:** `npm start`

> `VITE_API_URL` **no** se configura aqui. Vite sustituye esa variable durante
> la compilacion, asi que se define en el pipeline (variable `apiUrl`). Si la
> cambias, hay que volver a compilar y desplegar.

---

## 3. Pipelines en Azure DevOps

### 3.1 Service connection

**Project Settings > Service connections > New service connection >
Azure Resource Manager > Service principal (automatic)**. Selecciona la
suscripcion y el resource group, y anota el nombre que le des: ese valor es el
que va en la variable `azureSubscription` de los dos archivos YAML. En este
proyecto la conexion se llama `azure-automotorafc`.

### 3.2 Environment

Los dos pipelines despliegan contra un *environment* llamado `produccion`. Hay
que crearlo antes del primer despliegue en **Pipelines > Environments > New
environment** (tipo *None*), o el pipeline falla con
*Environment produccion could not be found*.

### 3.3 Variables

Los valores van **escritos directamente en los archivos YAML**, en el bloque
`variables` de cada uno:

```yaml
# azure-pipelines-backend.yml
variables:
  - name: azureSubscription
    value: "azure-automotorafc"
  - name: appServiceName
    value: "automotorafc-api"
```

```yaml
# azure-pipelines-frontend.yml
variables:
  - name: azureSubscription
    value: "azure-automotorafc"
  - name: appServiceName
    value: "automotorafc-web"
  - name: apiUrl
    value: "https://automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net"
```

No se usan *variable groups* de la Library. Un grupo de variables declarado en
el YAML que no exista en la Library hace fallar el pipeline antes de ejecutar
cualquier paso, con *Variable group was not found*; teniendo los valores a la
vista en el archivo el repositorio queda autocontenido.

### 3.4 Crear los pipelines

Por cada uno (backend y frontend):

1. **Pipelines > New pipeline**
2. **GitHub** → autoriza y selecciona el repositorio `slinkkhp/AUTOMOTORAFC`
3. **Existing Azure Pipelines YAML file**
4. Elige `/azure-pipelines-backend.yml` (o el del frontend)
5. **Run**

El codigo vive en GitHub y los pipelines leen desde alli. Si se prefiere tenerlo
en Azure Repos, se importa con **Repos > Import repository** apuntando a
`https://github.com/slinkkhp/AUTOMOTORAFC` y en el paso 2 se elige
**Azure Repos Git**.

Ambos pipelines tienen filtros por ruta: un cambio en `backend/` no dispara el
pipeline del frontend, y viceversa.

### 3.5 Que hace cada pipeline

**Backend**
1. Instala Python 3.11 y las dependencias
2. `manage.py check`
3. Verifica que no falten migraciones sin generar
4. Ejecuta las 22 pruebas unitarias
5. `collectstatic`
6. Empaqueta y despliega en App Service

El entorno virtual se crea en `$(Agent.TempDirectory)/venv`, **fuera** de la
carpeta que se empaqueta, y el paso de copia excluye `antenv/`, `venv/`,
`__pycache__/` y `db.sqlite3`. Un entorno virtual guarda rutas absolutas de la
maquina donde se creo, asi que si viaja dentro del paquete el servidor intenta
ejecutar binarios de `/home/vsts/work/...`, que ahi no existen, y la aplicacion
muere con `exit code 127`.

**Frontend**
1. Instala Node 22 y las dependencias con `npm ci`
2. `npm run build` inyectando `VITE_API_URL`
3. Empaqueta `dist/` + `server.js` + manifiestos
4. Despliega en App Service

El stage de `Deploy` solo corre en la rama `main`. Las pull requests ejecutan
unicamente el stage de `Build`.

---

## 4. Base de datos

El disco de App Service es **efimero**: si se usa SQLite, los datos se pierden
en cada reinicio o redespliegue. Para produccion:

```bash
az postgres flexible-server create \
  --resource-group rg-automotorafc \
  --name psql-automotorafc \
  --tier Burstable --sku-name Standard_B1ms \
  --database-name automotorafc
```

Luego define en el backend:

```
DATABASE_URL=postgresql://USUARIO:PASSWORD@psql-automotorafc.postgres.database.azure.com:5432/automotorafc?sslmode=require
```

`startup.sh` ejecuta `python manage.py migrate` en cada arranque, asi que el
esquema se crea solo en el primer despliegue.

> **Alternativa academica:** si no se dispone de PostgreSQL, la aplicacion
> funciona con SQLite sin cambios, pero hay que dejar constancia en el informe
> de que la persistencia no sobrevive a los reinicios del App Service. Para este
> proyecto eso significa que **las publicaciones de vehiculos cargadas desde el
> panel se pierden** en cada redespliegue.

---

## 5. Alternativa sin pipelines: Deployment Center

Si el ramo solo exige despliegue continuo (no un pipeline con stages), se puede
usar **App Service > Deployment Center**, donde Oryx compila en el servidor con
`SCM_DO_BUILD_DURING_DEPLOYMENT=true`.

Diferencia importante: con esa ruta **no** hay pruebas automaticas ni aparece
nada en la pestana *Pipelines* de Azure DevOps. Los archivos
`azure-pipelines-*.yml` de este repositorio implementan la ruta completa, que es
la que evidencia CI real (build + tests + deploy).

---

## 6. Verificacion posterior al despliegue

| Comprobacion | URL esperada |
|--------------|--------------|
| Backend en linea | `https://automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net/health/` |
| Swagger UI | `https://automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net/api/docs/` |
| Catalogo de vehiculos | `https://automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net/api/vehiculos/` |
| Endpoint de servicios | `https://automotorafc-api-grfuedbudmcjcwaw.eastus2-01.azurewebsites.net/api/servicios/` |
| Frontend | `https://automotorafc-web-hgdqhpefcucggzg9.eastus2-01.azurewebsites.net/` |

Para cargar los datos de ejemplo en produccion, usa la consola SSH del App
Service:

```bash
cd /home/site/wwwroot
python manage.py seed_demo
```

---

## 7. Problemas frecuentes

| Sintoma | Causa y solucion |
|---------|------------------|
| `403 Site Disabled` / "Se ha excedido la cuota" | Se agoto la cuota diaria del plan F1. Ver seccion 1.1 |
| La aplicacion responde 503 y el log muestra `exit code 127` | Viajo un entorno virtual dentro del paquete: sus rutas absolutas no existen en el servidor. Ver seccion 3.5 |
| El despliegue falla con *Resource doesn't exist* | El `appServiceName` no coincide con el nombre real, o la aplicacion esta en otro resource group que el de la service connection |
| *Variable group was not found* | El YAML declara un grupo de la Library que no existe. Ver seccion 3.3 |
| *Environment produccion could not be found* | Falta crear el environment. Ver seccion 3.2 |
| El frontend carga pero no muestra datos | Falta el origen del frontend en `CORS_ALLOWED_ORIGINS` del backend |
| `DisallowedHost` en el backend | Agrega el dominio a `DJANGO_ALLOWED_HOSTS` |
| El frontend devuelve 404 en rutas internas | `server.js` no se esta ejecutando: revisa que el Startup Command sea `npm start` |
| Llamadas a `localhost:8000` en produccion | El pipeline se ejecuto sin la variable `apiUrl`: definela y vuelve a desplegar |
| Los datos desaparecen tras un reinicio | Se esta usando SQLite: configura `DATABASE_URL` (seccion 4) |
| CSS sin aplicar en el admin de Django | `collectstatic` fallo: revisa los logs del pipeline |
