from rest_framework import serializers

from .models import Servicio


class ServicioSerializer(serializers.ModelSerializer):
    categoria_display = serializers.CharField(
        source="get_categoria_display", read_only=True
    )

    class Meta:
        model = Servicio
        fields = [
            "id",
            "nombre",
            "slug",
            "categoria",
            "categoria_display",
            "descripcion",
            "precio_desde",
            "duracion_minutos",
            "destacado",
            "activo",
        ]
