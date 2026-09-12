from django.db.models import F, Sum
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Producto
from .serializers import ProductoSerializer


@extend_schema(tags=["Inventario"])
class ProductoViewSet(viewsets.ModelViewSet):
    """CRUD de repuestos e insumos del inventario."""

    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    search_fields = ["nombre", "sku", "descripcion"]
    ordering_fields = ["nombre", "precio", "stock", "creado_en"]

    def get_queryset(self):
        queryset = Producto.objects.all()
        categoria = self.request.query_params.get("categoria")
        if categoria:
            queryset = queryset.filter(categoria=categoria)
        if self.request.query_params.get("stock_critico") in ("1", "true", "True"):
            queryset = queryset.filter(stock__lte=F("stock_minimo"))
        return queryset

    @extend_schema(
        summary="Resumen del inventario",
        description="Totales agregados para el panel administrativo.",
    )
    @action(detail=False, methods=["get"])
    def resumen(self, _request):
        productos = Producto.objects.filter(activo=True)
        return Response(
            {
                "total_productos": productos.count(),
                "unidades_totales": productos.aggregate(t=Sum("stock"))["t"] or 0,
                "productos_stock_critico": productos.filter(
                    stock__lte=F("stock_minimo")
                ).count(),
                "valor_total": float(
                    productos.aggregate(v=Sum(F("precio") * F("stock")))["v"] or 0
                ),
            }
        )
