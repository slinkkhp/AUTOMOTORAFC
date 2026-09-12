from datetime import date

from rest_framework import serializers

from .models import Cita


class CitaSerializer(serializers.ModelSerializer):
    servicio_nombre = serializers.CharField(source="servicio.nombre", read_only=True)
    estado_display = serializers.CharField(source="get_estado_display", read_only=True)

    class Meta:
        model = Cita
        fields = [
            "id",
            "nombre_cliente",
            "email",
            "telefono",
            "servicio",
            "servicio_nombre",
            "marca_vehiculo",
            "modelo_vehiculo",
            "patente",
            "fecha",
            "hora",
            "comentarios",
            "estado",
            "estado_display",
            "creado_en",
        ]
        read_only_fields = ["creado_en"]
        # El UniqueConstraint del modelo genera un validador automatico con un
        # mensaje poco claro; lo desactivamos para usar validate() mas abajo.
        validators = []

    def validate_fecha(self, value):
        if value < date.today():
            raise serializers.ValidationError(
                "No es posible agendar una cita en una fecha pasada."
            )
        return value

    def validate_patente(self, value):
        return value.strip().upper().replace("-", "")

    def validate(self, attrs):
        fecha = attrs.get("fecha", getattr(self.instance, "fecha", None))
        hora = attrs.get("hora", getattr(self.instance, "hora", None))
        ocupado = Cita.objects.filter(
            fecha=fecha,
            hora=hora,
            estado__in=[Cita.Estado.PENDIENTE, Cita.Estado.CONFIRMADA],
        )
        if self.instance is not None:
            ocupado = ocupado.exclude(pk=self.instance.pk)
        if ocupado.exists():
            raise serializers.ValidationError(
                {"hora": "Ese bloque horario ya se encuentra reservado."}
            )
        return attrs
