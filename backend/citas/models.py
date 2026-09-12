from django.db import models


class Cita(models.Model):
    """Reserva de un servicio automotriz hecha por un cliente (US-06)."""

    class Estado(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        CONFIRMADA = "confirmada", "Confirmada"
        COMPLETADA = "completada", "Completada"
        CANCELADA = "cancelada", "Cancelada"

    # Datos del cliente
    nombre_cliente = models.CharField(max_length=120)
    email = models.EmailField()
    telefono = models.CharField(max_length=20)

    # Servicio solicitado
    servicio = models.ForeignKey(
        "catalogo.Servicio",
        on_delete=models.PROTECT,
        related_name="citas",
    )

    # Datos del vehiculo
    marca_vehiculo = models.CharField(max_length=60)
    modelo_vehiculo = models.CharField(max_length=60)
    patente = models.CharField(max_length=10)

    # Agendamiento
    fecha = models.DateField()
    hora = models.TimeField()
    comentarios = models.TextField(blank=True)
    estado = models.CharField(
        max_length=12,
        choices=Estado.choices,
        default=Estado.PENDIENTE,
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fecha", "-hora"]
        verbose_name = "cita"
        verbose_name_plural = "citas"
        constraints = [
            models.UniqueConstraint(
                fields=["fecha", "hora"],
                condition=models.Q(estado__in=["pendiente", "confirmada"]),
                name="unica_cita_por_bloque_horario",
            )
        ]

    def __str__(self):
        return f"{self.nombre_cliente} - {self.fecha} {self.hora:%H:%M}"
