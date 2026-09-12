from django.test import TestCase
from rest_framework.test import APIClient

from .models import Producto


class ProductoAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Producto.objects.create(
            nombre="Filtro de aceite", sku="FIL-001", precio=8900, stock=40,
            stock_minimo=10,
        )
        Producto.objects.create(
            nombre="Cera liquida", sku="INS-001", categoria="insumo", precio=11900,
            stock=2, stock_minimo=5,
        )

    def test_crear_producto_normaliza_el_sku(self):
        respuesta = self.client.post(
            "/api/productos/",
            {"nombre": "Bujia", "sku": "rep-002", "precio": 7900, "stock": 12},
            format="json",
        )
        self.assertEqual(respuesta.status_code, 201)
        self.assertEqual(respuesta.data["sku"], "REP-002")

    def test_sku_duplicado_es_rechazado(self):
        respuesta = self.client.post(
            "/api/productos/",
            {"nombre": "Otro filtro", "sku": "FIL-001", "precio": 1000, "stock": 1},
            format="json",
        )
        self.assertEqual(respuesta.status_code, 400)

    def test_marca_stock_critico(self):
        respuesta = self.client.get("/api/productos/?stock_critico=1")
        self.assertEqual(respuesta.data["count"], 1)
        self.assertTrue(respuesta.data["results"][0]["stock_critico"])

    def test_resumen_agrega_totales(self):
        respuesta = self.client.get("/api/productos/resumen/")
        self.assertEqual(respuesta.data["total_productos"], 2)
        self.assertEqual(respuesta.data["unidades_totales"], 42)
        self.assertEqual(respuesta.data["productos_stock_critico"], 1)
        self.assertEqual(respuesta.data["valor_total"], 8900 * 40 + 11900 * 2)
