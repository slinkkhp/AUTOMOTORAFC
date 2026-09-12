from datetime import datetime, time, timedelta

from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Cita
from .serializers import CitaSerializer

# Bloques de atencion: 09:00 a 18:00, cada una hora.
HORA_APERTURA = time(9, 0)
HORA_CIERRE = time(18, 0)


@extend_schema(tags=["Citas"])
class CitaViewSet(viewsets.ModelViewSet):
    """Agendamiento y seguimiento de citas de servicio."""

    queryset = Cita.objects.select_related("servicio").all()
    serializer_class = CitaSerializer
    search_fields = ["nombre_cliente", "patente", "email"]
    ordering_fields = ["fecha", "creado_en"]

    def get_queryset(self):
        queryset = Cita.objects.select_related("servicio").all()
        estado = self.request.query_params.get("estado")
        if estado:
            queryset = queryset.filter(estado=estado)
        return queryset

    @extend_schema(
        summary="Bloques horarios disponibles para una fecha",
        parameters=[
            OpenApiParameter(
                name="fecha",
                description="Fecha a consultar en formato YYYY-MM-DD.",
                required=True,
                type=str,
            )
        ],
    )
    @action(detail=False, methods=["get"])
    def disponibilidad(self, request):
        fecha_raw = request.query_params.get("fecha")
        try:
            fecha = datetime.strptime(fecha_raw, "%Y-%m-%d").date()
        except (TypeError, ValueError):
            return Response(
                {"detail": "Debes indicar 'fecha' con el formato YYYY-MM-DD."},
                status=400,
            )

        tomados = set(
            Cita.objects.filter(
                fecha=fecha,
                estado__in=[Cita.Estado.PENDIENTE, Cita.Estado.CONFIRMADA],
            ).values_list("hora", flat=True)
        )

        bloques = []
        actual = datetime.combine(fecha, HORA_APERTURA)
        cierre = datetime.combine(fecha, HORA_CIERRE)
        while actual < cierre:
            bloques.append(
                {
                    "hora": actual.strftime("%H:%M"),
                    "disponible": actual.time() not in tomados,
                }
            )
            actual += timedelta(hours=1)

        return Response({"fecha": fecha, "bloques": bloques})
