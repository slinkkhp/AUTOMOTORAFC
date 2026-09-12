"""Rutas raiz del proyecto AUTOMOTORAFC."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)


def health(_request):
    """Endpoint de salud usado por Azure App Service."""
    return JsonResponse({"status": "ok", "servicio": "automotora-fc-back"})


urlpatterns = [
    path("", health),
    path("health/", health, name="health"),
    path("admin/", admin.site.urls),
    path("api/", include("catalogo.urls")),
    path("api/", include("inventario.urls")),
    path("api/", include("citas.urls")),
    # Documentacion OpenAPI / Swagger UI (US-12)
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path(
        "api/redoc/",
        SpectacularRedocView.as_view(url_name="schema"),
        name="redoc",
    ),
]
