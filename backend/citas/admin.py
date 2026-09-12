from django.contrib import admin

from .models import Cita


@admin.register(Cita)
class CitaAdmin(admin.ModelAdmin):
    list_display = ("nombre_cliente", "servicio", "fecha", "hora", "estado")
    list_filter = ("estado", "fecha", "servicio")
    search_fields = ("nombre_cliente", "patente", "email")
    date_hierarchy = "fecha"
