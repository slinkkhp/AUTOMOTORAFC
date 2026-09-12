from django.test import TestCase
from rest_framework.test import APIClient

from .models import Servicio


class ServicioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.servicio = Servicio.objects.create(
            nombre="Lavado Express",
            slug="lavado-express",
            categoria=Servicio.Categoria.CAR_WASH,
            descripcion="Lavado exterior rapido.",
            precio_desde=9000,
            duracion_minutos=30,
        )
        Servicio.objects.create(
            nombre="Servicio oculto",
            slug="servicio-oculto",
            categoria=Servicio.Categoria.MECANICA,
            descripcion="No debe aparecer en el listado.",
            precio_desde=1000,
            activo=False,
        )

    def test_listado_solo_devuelve_servicios_activos(self):
        respuesta = self.client.get("/api/servicios/")
        self.assertEqual(respuesta.status_code, 200)
        self.assertEqual(respuesta.data["count"], 1)
        self.assertEqual(respuesta.data["results"][0]["slug"], "lavado-express")

    def test_filtro_por_categoria(self):
        respuesta = self.client.get("/api/servicios/?categoria=mecanica")
        self.assertEqual(respuesta.data["count"], 0)

    def test_incluye_etiqueta_legible_de_categoria(self):
        respuesta = self.client.get("/api/servicios/")
        self.assertEqual(
            respuesta.data["results"][0]["categoria_display"], "Car Wash"
        )
