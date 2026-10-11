from django.contrib import admin

from .models import Vehiculo


@admin.register(Vehiculo)
class VehiculoAdmin(admin.ModelAdmin):
    list_display = ("marca", "modelo", "anio", "precio", "kilometraje",
                    "estado", "destacado")
    list_filter = ("estado", "carroceria", "combustible", "transmision",
                   "destacado", "consignacion")
    search_fields = ("marca", "modelo", "version")
    list_editable = ("estado", "destacado")
