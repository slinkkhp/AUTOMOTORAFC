from django.db import models


class Servicio(models.Model):
    """Servicio automotriz ofrecido por AUTOMOTORAFC (US-03, US-04, US-05)."""

    class Categoria(models.TextChoices):
        CAR_WASH = "car_wash", "Car Wash"
        CLIMATIZACION = "climatizacion", "Aire Acondicionado y Climatizacion"
        MECANICA = "mecanica", "Taller Mecanico"

    nombre = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)
    categoria = models.CharField(max_length=20, choices=Categoria.choices)
    descripcion = models.TextField()
    precio_desde = models.DecimalField(max_digits=10, decimal_places=0)
    duracion_minutos = models.PositiveIntegerField(default=60)
    destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["categoria", "nombre"]
        verbose_name = "servicio"
        verbose_name_plural = "servicios"

    def __str__(self):
        return self.nombre
