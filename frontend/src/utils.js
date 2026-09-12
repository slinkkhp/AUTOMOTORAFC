/** Formatea un monto como peso chileno sin decimales. */
export function formatearPrecio(valor) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0);
}

/** Convierte minutos a un texto corto: 90 -> "1 h 30 min". */
export function formatearDuracion(minutos) {
  if (minutos < 60) return `${minutos} min`;
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  return resto ? `${horas} h ${resto} min` : `${horas} h`;
}

/** Fecha de hoy en formato YYYY-MM-DD segun la zona horaria local. */
export function hoyISO() {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60000;
  return new Date(ahora - desfase).toISOString().slice(0, 10);
}
