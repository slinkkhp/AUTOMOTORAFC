from rest_framework import serializers

from .models import Producto


class ProductoSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )
    stock_critico = serializers.BooleanField(read_only=True)
    valor_inventario = serializers.SerializerMethodField()

    class Meta:
        model = Producto
        fields = [
            "id",
            "nombre",
            "sku",
            "categoria",
            "categoria_display",
            "descripcion",
            "precio",
            "stock",
            "stock_minimo",
            "stock_critico",
            "valor_inventario",
            "activo",
            "creado_en",
            "actualizado_en",
        ]
        read_only_fields = ["creado_en", "actualizado_en"]

    def get_valor_inventario(self, obj) -> float:
        return float(obj.precio) * obj.stock

    def validate_sku(self, value):
        return value.strip().upper()
