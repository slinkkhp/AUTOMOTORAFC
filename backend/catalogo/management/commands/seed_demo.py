"""Carga datos de demostracion para AUTOMOTORAFC.

Uso:  python manage.py seed_demo
"""

from django.core.management.base import BaseCommand

from catalogo.models import Servicio
from inventario.models import Producto

SERVICIOS = [
    {
        "nombre": "Lavado Premium Detallado",
        "slug": "lavado-premium-detallado",
        "categoria": Servicio.Categoria.CAR_WASH,
        "descripcion": (
            "Lavado exterior a mano, limpieza profunda de interior, aspirado, "
            "abrillantado de neumaticos y encerado de proteccion."
        ),
        "precio_desde": 25000,
        "duracion_minutos": 90,
        "destacado": True,
    },
    {
        "nombre": "Lavado Express",
        "slug": "lavado-express",
        "categoria": Servicio.Categoria.CAR_WASH,
        "descripcion": "Lavado exterior rapido con secado y limpieza de vidrios.",
        "precio_desde": 9000,
        "duracion_minutos": 30,
    },
    {
        "nombre": "Pulido y Tratamiento Ceramico",
        "slug": "pulido-tratamiento-ceramico",
        "categoria": Servicio.Categoria.CAR_WASH,
        "descripcion": (
            "Correccion de pintura en tres pasos y sellado ceramico con "
            "proteccion hidrofoba de larga duracion."
        ),
        "precio_desde": 120000,
        "duracion_minutos": 300,
    },
    {
        "nombre": "Recarga de Aire Acondicionado",
        "slug": "recarga-aire-acondicionado",
        "categoria": Servicio.Categoria.CLIMATIZACION,
        "descripcion": (
            "Vaciado, prueba de fugas con nitrogeno y recarga de gas "
            "refrigerante R134a o R1234yf segun el vehiculo."
        ),
        "precio_desde": 45000,
        "duracion_minutos": 60,
        "destacado": True,
    },
    {
        "nombre": "Sanitizacion de Ductos",
        "slug": "sanitizacion-ductos",
        "categoria": Servicio.Categoria.CLIMATIZACION,
        "descripcion": (
            "Eliminacion de hongos y bacterias en el sistema de ventilacion "
            "mas cambio de filtro de polen."
        ),
        "precio_desde": 28000,
        "duracion_minutos": 45,
    },
    {
        "nombre": "Diagnostico de Climatizacion",
        "slug": "diagnostico-climatizacion",
        "categoria": Servicio.Categoria.CLIMATIZACION,
        "descripcion": (
            "Revision de compresor, condensador, presiones de trabajo y "
            "deteccion electronica de fugas."
        ),
        "precio_desde": 15000,
        "duracion_minutos": 40,
    },
    {
        "nombre": "Mantencion Preventiva 10.000 km",
        "slug": "mantencion-preventiva-10000",
        "categoria": Servicio.Categoria.MECANICA,
        "descripcion": (
            "Cambio de aceite y filtros, revision de 30 puntos, niveles, "
            "frenos y sistema de suspension."
        ),
        "precio_desde": 65000,
        "duracion_minutos": 120,
        "destacado": True,
    },
    {
        "nombre": "Servicio de Frenos",
        "slug": "servicio-frenos",
        "categoria": Servicio.Categoria.MECANICA,
        "descripcion": (
            "Cambio de pastillas, rectificado de discos y purga del sistema "
            "hidraulico de frenos."
        ),
        "precio_desde": 55000,
        "duracion_minutos": 150,
    },
    {
        "nombre": "Scanner y Diagnostico Electronico",
        "slug": "scanner-diagnostico-electronico",
        "categoria": Servicio.Categoria.MECANICA,
        "descripcion": (
            "Lectura de codigos de falla OBD-II, analisis de sensores en "
            "tiempo real e informe tecnico detallado."
        ),
        "precio_desde": 20000,
        "duracion_minutos": 60,
    },
]

PRODUCTOS = [
    ("Filtro de aceite Toyota Corolla", "FIL-0012", "repuesto", 8900, 42, 10),
    ("Filtro de aire motor universal", "FIL-0034", "repuesto", 12500, 28, 10),
    ("Pastillas de freno delanteras ceramicas", "FRE-0101", "repuesto", 38900, 16, 6),
    ("Disco de freno ventilado 280mm", "FRE-0102", "repuesto", 45000, 8, 6),
    ("Aceite sintetico 5W-30 (4L)", "LUB-0201", "lubricante", 32900, 55, 15),
    ("Aceite semisintetico 10W-40 (4L)", "LUB-0202", "lubricante", 24900, 31, 15),
    ("Liquido de frenos DOT 4 (500ml)", "LUB-0203", "lubricante", 6500, 4, 8),
    ("Neumatico 195/65 R15", "NEU-0301", "neumatico", 58900, 24, 8),
    ("Neumatico 205/55 R16", "NEU-0302", "neumatico", 67900, 12, 8),
    ("Gas refrigerante R134a (kg)", "INS-0401", "insumo", 18900, 19, 5),
    ("Shampoo automotriz pH neutro (5L)", "INS-0402", "insumo", 14900, 23, 6),
    ("Cera liquida carnauba (500ml)", "INS-0403", "insumo", 11900, 3, 5),
    ("Filtro de polen / cabina", "FIL-0035", "repuesto", 9900, 37, 10),
    ("Bateria 12V 65Ah", "ACC-0501", "accesorio", 89900, 7, 4),
    ("Juego de plumillas limpiaparabrisas", "ACC-0502", "accesorio", 13900, 45, 10),
]


class Command(BaseCommand):
    help = "Carga servicios y productos de demostracion."

    def handle(self, *args, **options):
        creados_servicios = 0
        for data in SERVICIOS:
            _, creado = Servicio.objects.update_or_create(
                slug=data["slug"], defaults=data
            )
            creados_servicios += int(creado)

        creados_productos = 0
        for nombre, sku, categoria, precio, stock, minimo in PRODUCTOS:
            _, creado = Producto.objects.update_or_create(
                sku=sku,
                defaults={
                    "nombre": nombre,
                    "categoria": categoria,
                    "precio": precio,
                    "stock": stock,
                    "stock_minimo": minimo,
                },
            )
            creados_productos += int(creado)

        self.stdout.write(
            self.style.SUCCESS(
                f"Listo. Servicios: {Servicio.objects.count()} "
                f"({creados_servicios} nuevos). "
                f"Productos: {Producto.objects.count()} "
                f"({creados_productos} nuevos)."
            )
        )
