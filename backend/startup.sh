#!/usr/bin/env bash
# Script de arranque para Azure App Service (US-14).
# Startup Command:  bash /home/site/wwwroot/startup.sh
set -e

echo "[startup] Python: $(python --version 2>&1) en $(which python)"

echo "[startup] Aplicando migraciones..."
python manage.py migrate --noinput

echo "[startup] Recolectando archivos estaticos..."
# No abortamos el arranque si collectstatic falla: la API debe quedar
# disponible aunque el admin se vea sin estilos.
python manage.py collectstatic --noinput || \
    echo "[startup] AVISO: collectstatic fallo, se continua igual."

echo "[startup] Levantando Gunicorn en el puerto ${PORT:-8000}..."
# 'python -m gunicorn' en vez de 'gunicorn' a secas: no depende de que el
# ejecutable este en el PATH del contenedor.
exec python -m gunicorn config.wsgi:application \
    --bind=0.0.0.0:${PORT:-8000} \
    --workers=2 \
    --timeout=600 \
    --access-logfile '-' \
    --error-logfile '-'
