# Automotora Facundo Cousiño

Plataforma web desacoplada para la **compra, venta y consignacion de vehiculos
usados** de Automotora Facundo Cousiño (Puente Alto, Region Metropolitana), con
agendamiento de servicios de taller en linea e inventario de repuestos.

| Capa | Tecnologia | App Service |
|------|-----------|-------------|
| Frontend | React 18 + Vite (SPA) | `automotorafc-web` |
| Backend | Python 3.11 + Django 5.1 + DRF | `automotorafc-api` |
| Documentacion | OpenAPI 3.0 + Swagger UI (`drf-spectacular`) | `/api/docs/` |
| CI/CD | Azure Pipelines + Azure App Service | Azure DevOps |

---

## Que hace la aplicacion

**Para el cliente**

- Catalogo de vehiculos en venta con filtros por tipo de carroceria, marca,
  transmision y precio tope.
- Carrusel de destacados en la portada.
- Consulta por WhatsApp con el mensaje **ya redactado**: al tocar el boton de
  una publicacion, el mensaje llega al telefono del local con el titulo, ano,
  precio, kilometraje, carroceria, combustible, transmision y numero de
  publicacion. El cliente no escribe nada y en el local se sabe de inmediato
  por cual vehiculo consulta. Lo mismo aplica a los servicios del taller.
- Agendamiento de horas por bloques horarios, con validacion de disponibilidad.
- Contacto con direccion enlazada a Google Maps, telefono e Instagram.

**Para la automotora** (panel `/admin` de la SPA)

- Publicar, editar y dar de baja vehiculos, con precio, kilometraje, marca,
  modelo, version, ano, color, fotografia y descripcion.
- Marcar un vehiculo como destacado (aparece en el carrusel), en consignacion,
  reservado o vendido. Los vendidos dejan de mostrarse en el catalogo publico.
- Control del inventario de repuestos e insumos, con alerta de stock critico.

> **Pendiente conocido (US-78):** el panel de administracion **todavia no exige
> inicio de sesion**. Cualquiera que conozca la direccion puede modificar las
> publicaciones. Antes de usarlo con datos reales de clientes hay que
> implementar autenticacion y control de acceso, por la Ley 19.628 sobre
> proteccion de la vida privada. La interfaz muestra un aviso visible al
> respecto.

---

## Estructura del repositorio

```
AUTOMOTORAFC/
├── backend/                     API REST en Django
│   ├── config/                  Proyecto Django (settings, urls, wsgi)
│   ├── vehiculos/               Catalogo de vehiculos en venta
│   ├── catalogo/                Servicios automotrices
│   ├── inventario/              Repuestos e insumos
│   ├── citas/                   Agendamiento de horas
│   ├── startup.sh               Script de arranque para Azure (US-14)
│   ├── requirements.txt         Dependencias de produccion
│   └── requirements-dev.txt     Dependencias para desarrollo local
├── frontend/                    SPA en React + Vite
│   ├── src/components/          Componentes de la interfaz
│   ├── src/config.js            Datos del negocio y mensajes de WhatsApp
│   ├── src/logo.js              Logo y favicon embebidos (WebP en data URI)
│   ├── src/api.js               Cliente HTTP de la API
│   └── server.js                Servidor estatico para App Service
├── azure-pipelines-backend.yml  Pipeline CI/CD del backend
├── azure-pipelines-frontend.yml Pipeline CI/CD del frontend
└── docs/DESPLIEGUE.md           Guia paso a paso de despliegue
```

Los datos de contacto, el telefono de WhatsApp y los textos del negocio estan
centralizados en `frontend/src/config.js`: para cambiar una direccion o un
numero se edita un solo archivo.

---

## Puesta en marcha local

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt

cp .env.example .env               # ajusta los valores si lo necesitas
python manage.py migrate
python manage.py seed_demo         # 12 vehiculos, 9 servicios y 15 productos
python manage.py runserver
```

La API queda disponible en `http://127.0.0.1:8000`.

> En local conviene instalar `requirements-dev.txt` en lugar de
> `requirements.txt`: omite `gunicorn` y `psycopg`, que solo hacen falta en el
> servidor y necesitan compilador en Windows. Se recomienda **Python 3.12**:
> las versiones mas nuevas aun no tienen ruedas precompiladas para todas las
> dependencias y obligan a instalar Visual C++ Build Tools.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env               # VITE_API_URL=http://127.0.0.1:8000
npm run dev
```

La aplicacion queda disponible en `http://localhost:5173`.

> El primer `npm install` genera `package-lock.json`. Conviene **commitearlo**:
> con el archivo presente el pipeline usa `npm ci`, que instala versiones
> exactas y hace las compilaciones reproducibles.

---

## Endpoints de la API

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `GET` `POST` | `/api/vehiculos/` | Catalogo de vehiculos en venta |
| `GET` `PATCH` `DELETE` | `/api/vehiculos/{id}/` | Detalle de una publicacion |
| `GET` | `/api/vehiculos/resumen/` | Totales del catalogo y conteo por marca |
| `GET` | `/api/servicios/` | Catalogo de servicios (filtro `?categoria=`) |
| `GET` `POST` | `/api/productos/` | Inventario de repuestos e insumos |
| `GET` `PUT` `DELETE` | `/api/productos/{id}/` | Detalle de un producto |
| `GET` | `/api/productos/resumen/` | Totales del inventario |
| `GET` `POST` | `/api/citas/` | Listado y creacion de citas |
| `GET` | `/api/citas/disponibilidad/?fecha=YYYY-MM-DD` | Bloques horarios libres |
| `GET` | `/api/docs/` | **Swagger UI interactivo** |
| `GET` | `/api/schema/` | Esquema OpenAPI 3.0 |
| `GET` | `/health/` | Health check para App Service |

### Filtros de `/api/vehiculos/`

Se pueden combinar libremente:

| Parametro | Ejemplo | Efecto |
|-----------|---------|--------|
| `carroceria` | `?carroceria=camioneta` | `auto`, `suv`, `camioneta`, `trabajo`, `furgon` |
| `marca` | `?marca=toyota` | Coincidencia exacta, sin distinguir mayusculas |
| `transmision` | `?transmision=automatica` | `manual` o `automatica` |
| `combustible` | `?combustible=diesel` | `bencina`, `diesel`, `hibrido`, `electrico`, `gas` |
| `estado` | `?estado=reservado` | `disponible`, `reservado`, `vendido` |
| `precio_max` | `?precio_max=10000000` | Precio menor o igual |
| `anio_min` | `?anio_min=2018` | Ano mayor o igual |
| `destacados` | `?destacados=1` | Solo los del carrusel |
| `todos` | `?todos=1` | **Incluye los vendidos** (uso del panel interno) |

### Reglas de negocio implementadas

- El catalogo publico **oculta los vehiculos vendidos**; el panel interno los ve
  pasando `?todos=1`.
- Los vehiculos **destacados** se ordenan primero y, dentro de cada grupo, por
  fecha de publicacion descendente.
- La **marca** se normaliza al guardar: `"  nissan "` queda como `"Nissan"`.
- No se pueden agendar citas en **fechas pasadas**.
- Un **bloque horario** solo admite una cita activa (pendiente o confirmada);
  al cancelar una cita el bloque vuelve a liberarse.
- Los **SKU** se normalizan a mayusculas y deben ser unicos.
- Un producto se marca como **stock critico** cuando `stock <= stock_minimo`.
- Atencion de **09:00 a 18:00**, en bloques de una hora.

---

## Pruebas

```bash
cd backend
python manage.py test
```

22 pruebas cubren el catalogo de vehiculos (filtrado, ocultamiento de vendidos,
orden de destacados, normalizacion de marca y totales del resumen), los
servicios, el inventario y las reglas de agendamiento.

---

## Despliegue

El detalle completo esta en [`docs/DESPLIEGUE.md`](docs/DESPLIEGUE.md).

---

## Trazabilidad con las historias de usuario

| Historia | Donde se implementa |
|----------|---------------------|
| US-01 Interfaz general | `frontend/src/App.jsx`, `components/Hero.jsx` |
| US-02 Navegacion sin recarga | `components/Navbar.jsx` (estado, sin router) |
| US-03/04/05 Modulos de servicios | `components/Servicios.jsx`, `catalogo/` |
| US-06 Formulario de citas | `components/AgendarCita.jsx`, `citas/` |
| US-07 Registro de repuestos | `components/Inventario.jsx` (formulario) |
| US-08 Tabla de inventario | `components/Inventario.jsx` (tabla + buscador) |
| US-09/10 Endpoints REST | `inventario/views.py`, `citas/views.py` |
| US-11 CORS | `config/settings.py` (`CORS_ALLOWED_ORIGINS`) |
| US-12 Swagger UI | `config/urls.py` (`/api/docs/`) |
| US-13 Pipeline CI/CD | `azure-pipelines-*.yml` |
| US-14 Configuracion y arranque | `backend/startup.sh`, variables de entorno |
| US-64 Catalogo de vehiculos | `vehiculos/`, `components/Vehiculos.jsx` |
| US-65 Filtros del catalogo | `vehiculos/views.py`, `components/Vehiculos.jsx` |
| US-66 Publicar y editar vehiculos | `components/AdminVehiculos.jsx` |
| US-78 Autenticacion del panel | **Pendiente**, ver aviso mas arriba |
