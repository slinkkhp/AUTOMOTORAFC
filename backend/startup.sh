#!/usr/bin/env bash
# Script de arranque para Azure App Service (US-14).
# Configurar en: App Service > Configuration > General settings > Startup Command
#   bash /home/site/wwwroot/startup.sh
set -e

echo "[startup] Aplicando migraciones..."
python manage.py migrate --noinput

echo "[startup] Recolectando archivos estaticos..."
python manage.py collectstatic --noinput

echo "[startup] Levantando Gunicorn..."
exec gunicorn config.wsgi:application \
    --bind=0.0.0.0:${PORT:-8000} \
    --workers=3 \
    --timeout=600 \
    --access-logfile '-' \
    --error-logfile '-'
