from datetime import date, timedelta

from django.test import TestCase
from rest_framework.test import APIClient

from catalogo.models import Servicio

from .models import Cita


class CitaAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.servicio = Servicio.objects.create(
            nombre="Mantencion", slug="mantencion",
            categoria=Servicio.Categoria.MECANICA,
            descripcion="Mantencion preventiva.", precio_desde=65000,
        )
        self.manana = (date.today() + timedelta(days=1)).isoformat()

    def _payload(self, **extra):
        datos = {
            "nombre_cliente": "Santiago Nunez",
            "email": "santiago@example.cl",
            "telefono": "+56912345678",
            "servicio": self.servicio.id,
            "marca_vehiculo": "Toyota",
            "modelo_vehiculo": "Corolla",
            "patente": "ab-1234",
            "fecha": self.manana,
            "hora": "10:00",
        }
        datos.update(extra)
        return datos

    def test_agenda_una_cita(self):
        respuesta = self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(respuesta.status_code, 201)
        self.assertEqual(respuesta.data["patente"], "AB1234")
        self.assertEqual(respuesta.data["estado"], "pendiente")

    def test_rechaza_fecha_pasada(self):
        pasado = (date.today() - timedelta(days=1)).isoformat()
        respuesta = self.client.post(
            "/api/citas/", self._payload(fecha=pasado), format="json"
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("fecha", respuesta.data)

    def test_rechaza_bloque_horario_ocupado(self):
        self.client.post("/api/citas/", self._payload(), format="json")
        respuesta = self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("hora", respuesta.data)

    def test_bloque_cancelado_vuelve_a_estar_disponible(self):
        primera = self.client.post("/api/citas/", self._payload(), format="json")
        Cita.objects.filter(pk=primera.data["id"]).update(estado=Cita.Estado.CANCELADA)
        respuesta = self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(respuesta.status_code, 201)

    def test_disponibilidad_marca_bloques_tomados(self):
        self.client.post("/api/citas/", self._payload(), format="json")
        respuesta = self.client.get(f"/api/citas/disponibilidad/?fecha={self.manana}")
        bloques = {b["hora"]: b["disponible"] for b in respuesta.data["bloques"]}
        self.assertEqual(len(bloques), 9)
        self.assertFalse(bloques["10:00"])
        self.assertTrue(bloques["11:00"])

    def test_disponibilidad_requiere_fecha_valida(self):
        respuesta = self.client.get("/api/citas/disponibilidad/?fecha=no-es-fecha")
        self.assertEqual(respuesta.status_code, 400)
