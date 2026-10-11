from rest_framework import serializers

from .models import Vehiculo


class VehiculoSerializer(serializers.ModelSerializer):
    titulo = serializers.CharField(read_only=True)
    carroceria_display = serializers.CharField(
        source="get_carroceria_display", read_only=True
    )
    combustible_display = serializers.CharField(
        source="get_combustible_display", read_only=True
    )
    transmision_display = serializers.CharField(
        source="get_transmision_display", read_only=True
    )
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = Vehiculo
        fields = [
            "id", "titulo", "marca", "modelo", "version", "anio", "precio",
            "kilometraje", "carroceria", "carroceria_display",
            "combustible", "combustible_display",
            "transmision", "transmision_display",
            "color", "descripcion", "imagen_url",
            "estado", "estado_display", "destacado", "consignacion",
            "creado_en", "actualizado_en",
        ]
        read_only_fields = ["creado_en", "actualizado_en"]

    def validate_marca(self, value):
        return value.strip().title()

    def validate_modelo(self, value):
        return value.strip()
