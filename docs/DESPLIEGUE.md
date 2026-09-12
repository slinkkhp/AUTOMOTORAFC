# Guia de despliegue en Azure

Documenta el despliegue de AUTOMOTORAFC en Microsoft Azure con CI/CD desde
Azure DevOps.

---

## 1. Recursos necesarios en Azure

| Recurso | Nombre sugerido | Notas |
|---------|-----------------|-------|
| Resource Group | `rg-automotorafc` | Agrupa todo el proyecto |
| App Service Plan | `plan-automotorafc` | Linux. B1 o superior |
| App Service (backend) | `automotora-fc-back` | Runtime **Python 3.11** |
| App Service (frontend) | `automotora-fc-front` | Runtime **Node 20 LTS** |
| Azure Database for PostgreSQL | `psql-automotorafc` | Flexible Server, ver seccion 4 |

---

## 2. Variables de aplicacion (App Service > Configuration)

### Backend `automotora-fc-back`

| Nombre | Valor |
|--------|-------|
| `DJANGO_SECRET_KEY` | Una clave larga y aleatoria **distinta** a la de desarrollo |
| `DJANGO_DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `automotora-fc-back.azurewebsites.net` |
| `CORS_ALLOWED_ORIGINS` | `https://automotora-fc-front.azurewebsites.net` |
| `DATABASE_URL` | Cadena de conexion de PostgreSQL (seccion 4) |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `ENABLE_ORYX_BUILD` | `true` |

**Startup Command:** `bash /home/site/wwwroot/startup.sh`

### Frontend `automotora-fc-front`

| Nombre | Valor |
|--------|-------|
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `ENABLE_ORYX_BUILD` | `true` |
| `WEBSITE_NODE_DEFAULT_VERSION` | `~20` |

**Startup Command:** `npm start`

> `VITE_API_URL` **no** se configura aqui. Vite sustituye esa variable durante
> la compilacion, asi que se define en el pipeline (variable `apiUrl`). Si la
> cambias, hay que volver a compilar y desplegar.

---

## 3. Pipelines en Azure DevOps

### 3.1 Grupos de variables

En **Pipelines > Library > + Variable group**:

**`automotorafc-backend`**
- `azureSubscription`: nombre de la service connection
- `appServiceName`: `automotora-fc-back`

**`automotorafc-frontend`**
- `azureSubscription`: nombre de la service connection
- `appServiceName`: `automotora-fc-front`
- `apiUrl`: `https://automotora-fc-back.azurewebsites.net`

### 3.2 Service connection

**Project Settings > Service connections > New service connection >
Azure Resource Manager > Service principal (automatic)**. Selecciona la
suscripcion y el resource group, y anota el nombre que le des: ese valor va en
`azureSubscription`.

### 3.3 Crear los pipelines

Por cada uno (backend y frontend):

1. **Pipelines > New pipeline**
2. Elige el origen del codigo: **GitHub** o **Azure Repos Git**
3. **Existing Azure Pipelines YAML file**
4. Elige `/azure-pipelines-backend.yml` (o el del frontend)
5. **Run**

Ambos pipelines tienen filtros por ruta: un cambio en `backend/` no dispara el
pipeline del frontend, y viceversa.

### 3.4 Que hace cada pipeline

**Backend**
1. Instala Python 3.11 y las dependencias
2. `manage.py check`
3. Verifica que no falten migraciones sin generar
4. Ejecuta las 13 pruebas unitarias
5. Empaqueta y despliega en App Service

**Frontend**
1. Instala Node 20 y las dependencias
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
> de que la persistencia no sobrevive a los reinicios del App Service.

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
| Backend en linea | `https://automotora-fc-back.azurewebsites.net/health/` |
| Swagger UI | `https://automotora-fc-back.azurewebsites.net/api/docs/` |
| Endpoint de servicios | `https://automotora-fc-back.azurewebsites.net/api/servicios/` |
| Frontend | `https://automotora-fc-front.azurewebsites.net/` |

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
| El frontend carga pero no muestra datos | Falta el origen del frontend en `CORS_ALLOWED_ORIGINS` del backend |
| `DisallowedHost` en el backend | Agrega el dominio a `DJANGO_ALLOWED_HOSTS` |
| El frontend devuelve 404 en rutas internas | `server.js` no se esta ejecutando: revisa que el Startup Command sea `npm start` |
| Llamadas a `localhost:8000` en produccion | El pipeline se ejecuto sin la variable `apiUrl`: definela y vuelve a desplegar |
| Los datos desaparecen tras un reinicio | Se esta usando SQLite: configura `DATABASE_URL` (seccion 4) |
| CSS sin aplicar en el admin de Django | `collectstatic` fallo: revisa los logs de `startup.sh` |
