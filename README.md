# AUTOMOTORAFC

Plataforma web desacoplada para la gestion de servicios automotrices, agendamiento
de citas en linea e inventario de repuestos de **AUTOMOTORAFC**.

| Capa | Tecnologia | App Service |
|------|-----------|-------------|
| Frontend | React 18 + Vite (SPA) | `automotora-fc-front` |
| Backend | Python 3.11 + Django 5.1 + DRF | `automotora-fc-back` |
| Documentacion | OpenAPI 3.0 + Swagger UI (`drf-spectacular`) | `/api/docs/` |
| CI/CD | Azure Pipelines + Azure App Service | Azure DevOps |

---

## Estructura del repositorio

```
AUTOMOTORAFC/
├── backend/                     API REST en Django
│   ├── config/                  Proyecto Django (settings, urls, wsgi)
│   ├── catalogo/                Servicios automotrices
│   ├── inventario/              Repuestos e insumos
│   ├── citas/                   Agendamiento de horas
│   ├── startup.sh               Script de arranque para Azure (US-14)
│   └── requirements.txt
├── frontend/                    SPA en React + Vite
│   ├── src/components/          Componentes de la interfaz
│   ├── src/api.js               Cliente HTTP de la API
│   └── server.js                Servidor estatico para App Service
├── azure-pipelines-backend.yml  Pipeline CI/CD del backend
├── azure-pipelines-frontend.yml Pipeline CI/CD del frontend
└── docs/DESPLIEGUE.md           Guia paso a paso de despliegue
```

---

## Puesta en marcha local

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env               # ajusta los valores si lo necesitas
python manage.py migrate
python manage.py seed_demo         # carga 9 servicios y 15 productos de ejemplo
python manage.py runserver
```

La API queda disponible en `http://127.0.0.1:8000`.

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
| `GET` | `/api/servicios/` | Catalogo de servicios (filtro `?categoria=`) |
| `GET` `POST` | `/api/productos/` | Inventario de repuestos e insumos |
| `GET` `PUT` `DELETE` | `/api/productos/{id}/` | Detalle de un producto |
| `GET` | `/api/productos/resumen/` | Totales del inventario |
| `GET` `POST` | `/api/citas/` | Listado y creacion de citas |
| `GET` | `/api/citas/disponibilidad/?fecha=YYYY-MM-DD` | Bloques horarios libres |
| `GET` | `/api/docs/` | **Swagger UI interactivo** |
| `GET` | `/api/schema/` | Esquema OpenAPI 3.0 |
| `GET` | `/health/` | Health check para App Service |

### Reglas de negocio implementadas

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

13 pruebas cubren el catalogo, el inventario y las reglas de agendamiento.

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
