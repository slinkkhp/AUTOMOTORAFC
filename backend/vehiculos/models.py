from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class Vehiculo(models.Model):
    """Vehiculo publicado para venta o consignacion (US-64, US-65, US-66)."""

    class Carroceria(models.TextChoices):
        AUTO = "auto", "Auto"
        SUV = "suv", "SUV"
        CAMIONETA = "camioneta", "Camioneta"
        TRABAJO = "trabajo", "Vehiculo de trabajo"
        FURGON = "furgon", "Furgon"

    class Combustible(models.TextChoices):
        BENCINA = "bencina", "Bencina"
        DIESEL = "diesel", "Diesel"
        HIBRIDO = "hibrido", "Hibrido"
        ELECTRICO = "electrico", "Electrico"
        GAS = "gas", "Gas"

    class Transmision(models.TextChoices):
        MANUAL = "manual", "Manual"
        AUTOMATICA = "automatica", "Automatica"

    class Estado(models.TextChoices):
        DISPONIBLE = "disponible", "Disponible"
        RESERVADO = "reservado", "Reservado"
        VENDIDO = "vendido", "Vendido"

    marca = models.CharField(max_length=60)
    modelo = models.CharField(max_length=80)
    version = models.CharField(
        max_length=80,
        blank=True,
        help_text="Version o equipamiento, por ejemplo '2.4 4x4 Limited'.",
    )
    anio = models.PositiveIntegerField(
        "ano",
        validators=[MinValueValidator(1950)],
    )
    precio = models.DecimalField(
        max_digits=12,
        decimal_places=0,
        validators=[MinValueValidator(Decimal("0"))],
    )
    kilometraje = models.PositiveIntegerField(help_text="Kilometros recorridos.")
    carroceria = models.CharField(
        max_length=12, choices=Carroceria.choices, default=Carroceria.AUTO
    )
    combustible = models.CharField(
        max_length=12, choices=Combustible.choices, default=Combustible.BENCINA
    )
    transmision = models.CharField(
        max_length=12, choices=Transmision.choices, default=Transmision.MANUAL
    )
    color = models.CharField(max_length=40, blank=True)
    descripcion = models.TextField(blank=True)
    imagen_url = models.URLField(
        max_length=500,
        blank=True,
        help_text="Direccion de la fotografia principal del vehiculo.",
    )
    estado = models.CharField(
        max_length=12, choices=Estado.choices, default=Estado.DISPONIBLE
    )
    destacado = models.BooleanField(
        default=False, help_text="Aparece primero en el carrusel de la portada."
    )
    consignacion = models.BooleanField(
        default=False, help_text="El vehiculo se vende en consignacion."
    )
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-destacado", "-creado_en"]
        verbose_name = "vehiculo"
        verbose_name_plural = "vehiculos"

    def __str__(self):
        return f"{self.marca} {self.modelo} {self.anio}"

    @property
    def titulo(self):
        partes = [self.marca, self.modelo]
        if self.version:
            partes.append(self.version)
        return " ".join(partes)
