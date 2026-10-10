#!/usr/bin/env bash
# Script de arranque para Azure App Service (US-14).
# Startup Command:  bash /home/site/wwwroot/startup.sh
#
# Se mantiene lo MINIMO en el arranque: en el plan F1 la app se apaga
# cuando nadie la usa y cada arranque en frio consume cuota de CPU.
# Por eso collectstatic se ejecuta en el pipeline, no aqui.
set -e

echo "[startup] Python: $(python --version 2>&1) en $(which python)"

echo "[startup] Aplicando migraciones..."
python manage.py migrate --noinput

echo "[startup] Levantando Gunicorn en el puerto ${PORT:-8000}..."
# 'python -m gunicorn' no depende de que el ejecutable este en el PATH.
# 1 worker: suficiente para el plan F1 y reduce el consumo de memoria.
exec python -m gunicorn config.wsgi:application \
    --bind=0.0.0.0:${PORT:-8000} \
    --workers=1 \
    --threads=4 \
    --timeout=600 \
    --access-logfile '-' \
    --error-logfile '-'
