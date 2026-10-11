from django.db.models import Avg, Count, Min
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Vehiculo
from .serializers import VehiculoSerializer


@extend_schema(tags=["Vehiculos"])
class VehiculoViewSet(viewsets.ModelViewSet):
    """Catalogo de vehiculos en venta y consignacion."""

    queryset = Vehiculo.objects.all()
    serializer_class = VehiculoSerializer
    search_fields = ["marca", "modelo", "version", "descripcion"]
    ordering_fields = ["precio", "anio", "kilometraje", "creado_en"]

    def get_queryset(self):
        qs = Vehiculo.objects.all()
        p = self.request.query_params

        # El publico solo ve lo que esta a la venta; el panel admin lo ve todo.
        if p.get("todos") not in ("1", "true", "True"):
            qs = qs.exclude(estado=Vehiculo.Estado.VENDIDO)

        for campo in ("carroceria", "combustible", "transmision", "estado", "marca"):
            valor = p.get(campo)
            if valor:
                qs = qs.filter(**{f"{campo}__iexact": valor})

        if p.get("destacados") in ("1", "true", "True"):
            qs = qs.filter(destacado=True)
        if (v := p.get("precio_max")) and v.isdigit():
            qs = qs.filter(precio__lte=int(v))
        if (v := p.get("anio_min")) and v.isdigit():
            qs = qs.filter(anio__gte=int(v))
        return qs

    @extend_schema(summary="Resumen del catalogo de vehiculos")
    @action(detail=False, methods=["get"])
    def resumen(self, _request):
        disponibles = Vehiculo.objects.filter(estado=Vehiculo.Estado.DISPONIBLE)
        return Response({
            "total_publicados": Vehiculo.objects.exclude(
                estado=Vehiculo.Estado.VENDIDO).count(),
            "disponibles": disponibles.count(),
            "reservados": Vehiculo.objects.filter(
                estado=Vehiculo.Estado.RESERVADO).count(),
            "vendidos": Vehiculo.objects.filter(
                estado=Vehiculo.Estado.VENDIDO).count(),
            "en_consignacion": disponibles.filter(consignacion=True).count(),
            "precio_desde": disponibles.aggregate(m=Min("precio"))["m"] or 0,
            "precio_promedio": round(
                disponibles.aggregate(a=Avg("precio"))["a"] or 0),
            "marcas": list(
                disponibles.values("marca")
                .annotate(total=Count("id"))
                .order_by("-total", "marca")
            ),
        })
