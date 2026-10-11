from django.test import TestCase
from rest_framework.test import APIClient

from .models import Vehiculo


class VehiculoAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.disponible = Vehiculo.objects.create(
            marca="Toyota", modelo="Hilux", anio=2019, precio=18990000,
            kilometraje=82000, carroceria="camioneta", combustible="diesel",
            transmision="manual", destacado=True)
        Vehiculo.objects.create(
            marca="Kia", modelo="Morning", anio=2021, precio=7490000,
            kilometraje=41000, carroceria="auto")
        Vehiculo.objects.create(
            marca="Chevrolet", modelo="Sail", anio=2017, precio=5200000,
            kilometraje=120000, carroceria="auto", estado="vendido")

    def test_el_publico_no_ve_los_vendidos(self):
        r = self.client.get("/api/vehiculos/")
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data["count"], 2)

    def test_el_panel_admin_puede_ver_todos(self):
        r = self.client.get("/api/vehiculos/?todos=1")
        self.assertEqual(r.data["count"], 3)

    def test_filtro_por_carroceria(self):
        r = self.client.get("/api/vehiculos/?carroceria=camioneta")
        self.assertEqual(r.data["count"], 1)
        self.assertEqual(r.data["results"][0]["modelo"], "Hilux")

    def test_filtro_por_precio_maximo(self):
        r = self.client.get("/api/vehiculos/?precio_max=8000000")
        self.assertEqual(r.data["count"], 1)
        self.assertEqual(r.data["results"][0]["modelo"], "Morning")

    def test_solo_destacados(self):
        r = self.client.get("/api/vehiculos/?destacados=1")
        self.assertEqual(r.data["count"], 1)

    def test_los_destacados_van_primero(self):
        r = self.client.get("/api/vehiculos/")
        self.assertEqual(r.data["results"][0]["modelo"], "Hilux")

    def test_titulo_compone_marca_modelo_y_version(self):
        self.disponible.version = "2.4 4x4"
        self.disponible.save()
        r = self.client.get(f"/api/vehiculos/{self.disponible.id}/")
        self.assertEqual(r.data["titulo"], "Toyota Hilux 2.4 4x4")

    def test_crear_vehiculo_normaliza_la_marca(self):
        r = self.client.post("/api/vehiculos/", {
            "marca": "  nissan ", "modelo": "Versa", "anio": 2020,
            "precio": 9500000, "kilometraje": 55000}, format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["marca"], "Nissan")

    def test_resumen_entrega_totales_del_catalogo(self):
        r = self.client.get("/api/vehiculos/resumen/")
        self.assertEqual(r.data["total_publicados"], 2)
        self.assertEqual(r.data["disponibles"], 2)
        self.assertEqual(r.data["vendidos"], 1)
        self.assertEqual(r.data["precio_desde"], 7490000)
