from drf_spectacular.utils import extend_schema
from rest_framework import viewsets

from .models import Servicio
from .serializers import ServicioSerializer


@extend_schema(tags=["Servicios"])
class ServicioViewSet(viewsets.ModelViewSet):
    """CRUD del catalogo de servicios automotrices."""

    queryset = Servicio.objects.filter(activo=True)
    serializer_class = ServicioSerializer
    search_fields = ["nombre", "descripcion"]
    ordering_fields = ["nombre", "precio_desde", "duracion_minutos"]

    def get_queryset(self):
        queryset = Servicio.objects.all()
        if self.action in ("list", "retrieve"):
            queryset = queryset.filter(activo=True)
        categoria = self.request.query_params.get("categoria")
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        return queryset
