from decimal import Decimal

from django.core.validators import MinValueValidator
from django.db import models


class Producto(models.Model):
    """Repuesto o insumo del inventario de AUTOMOTORAFC (US-07, US-08)."""

    class Categoria(models.TextChoices):
        REPUESTO = "repuesto", "Repuesto"
        LUBRICANTE = "lubricante", "Lubricante"
        NEUMATICO = "neumatico", "Neumatico"
        ACCESORIO = "accesorio", "Accesorio"
        INSUMO = "insumo", "Insumo de limpieza"

    nombre = models.CharField(max_length=150)
    sku = models.CharField(
        max_length=40,
        unique=True,
        help_text="Codigo interno unico del producto.",
    )
    categoria = models.CharField(
        max_length=20,
        choices=Categoria.choices,
        default=Categoria.REPUESTO,
    )
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(
        max_digits=10,
        decimal_places=0,
        validators=[MinValueValidator(Decimal("0"))],
    )
    stock = models.PositiveIntegerField(default=0)
    stock_minimo = models.PositiveIntegerField(
        default=5,
        help_text="Umbral bajo el cual el producto se marca como stock critico.",
    )
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nombre"]
        verbose_name = "producto"
        verbose_name_plural = "productos"

    def __str__(self):
        return f"{self.sku} - {self.nombre}"

    @property
    def stock_critico(self):
        return self.stock <= self.stock_minimo
