/** Datos de contacto e identidad de Automotora Facundo Cousino. */

export const NEGOCIO = {
  nombre: "Automotora Facundo Cousiño",
  nombreCorto: "Facundo Cousiño",
  bajada: "Compra, venta y consignación",
  descripcion:
    "Compra, venta y consignación de vehículos usados. Autos, SUV, " +
    "camionetas y vehículos de trabajo. Financiamiento disponible y " +
    "atención personalizada.",
  direccion: "Av. Camilo Henríquez 1526, Puente Alto, Región Metropolitana",
  codigoPostal: "8207882",
  comuna: "Puente Alto",
  telefono: "+56 9 5766 7906",
  // Formato internacional sin signos, como lo exige el enlace wa.me
  telefonoWsp: "56957667906",
  instagram: "https://www.instagram.com/automotorafacundocousino/",
  instagramUsuario: "@automotorafacundocousino",
  horario: "Lunes a sábado, 09:00 a 18:00 h",
};

/** Mapa de Google Maps con la dirección del local. */
export const MAPA_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Av. Camilo Henríquez 1526, Puente Alto, Chile");

/**
 * Arma el enlace de WhatsApp con el mensaje ya redactado.
 * Así el cliente no tiene que escribir nada y nosotros sabemos
 * exactamente por qué publicación está consultando.
 */
export function enlaceWhatsApp(mensaje) {
  return `https://wa.me/${NEGOCIO.telefonoWsp}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Etiquetas en castellano correcto para los valores del backend.
 *
 * El codigo del backend se mantiene sin tildes para evitar problemas de
 * codificacion en migraciones y consola, asi que la acentuacion que ve
 * el cliente se resuelve aqui.
 */
const ETIQUETAS = {
  SUV: "SUV",
  Camioneta: "Camioneta",
  Auto: "Auto",
  Furgon: "Furgón",
  "Vehiculo de trabajo": "Vehículo de trabajo",
  Bencina: "Bencina",
  Diesel: "Diésel",
  Hibrido: "Híbrido",
  Electrico: "Eléctrico",
  Gas: "Gas",
  Manual: "Manual",
  Automatica: "Automática",
  Disponible: "Disponible",
  Reservado: "Reservado",
  Vendido: "Vendido",
  "Car Wash": "Car Wash",
  "Aire Acondicionado y Climatizacion": "Aire Acondicionado y Climatización",
  "Taller Mecanico": "Taller Mecánico",
  Repuesto: "Repuesto",
  Lubricante: "Lubricante",
  Neumatico: "Neumático",
  Accesorio: "Accesorio",
  "Insumo de limpieza": "Insumo de limpieza",
};

/** Devuelve la etiqueta acentuada de un valor que viene de la API. */
export function etiqueta(valor) {
  if (!valor) return "";
  return ETIQUETAS[valor] || valor;
}

/** Formatea un kilometraje: 82000 -> "82.000 km". */
export function formatearKm(km) {
  return `${new Intl.NumberFormat("es-CL").format(Number(km) || 0)} km`;
}

/** Mensaje automático para consultar por un vehículo publicado. */
export function mensajeVehiculo(v) {
  const precio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(v.precio) || 0);

  return (
    `¡Hola ${NEGOCIO.nombreCorto}! 👋\n\n` +
    `Vi en el sitio web el *${v.titulo} ${v.anio}* y me interesa.\n\n` +
    `• Precio publicado: ${precio}\n` +
    `• Kilometraje: ${formatearKm(v.kilometraje)}\n` +
    `• Tipo: ${etiqueta(v.carroceria_display)}\n` +
    `• Combustible: ${etiqueta(v.combustible_display)}\n` +
    `• Transmisión: ${etiqueta(v.transmision_display)}\n` +
    `• Publicación N° ${v.id}\n\n` +
    `¿Sigue disponible? Me gustaría saber si reciben auto en parte de pago ` +
    `y qué alternativas de financiamiento manejan. ¡Gracias!`
  );
}

/** Mensaje automático para consultar por un servicio del taller. */
export function mensajeServicio(s) {
  const precio = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Number(s.precio_desde) || 0);

  return (
    `¡Hola ${NEGOCIO.nombreCorto}! 👋\n\n` +
    `Quisiera consultar por el servicio de *${s.nombre}*.\n\n` +
    `• Categoría: ${etiqueta(s.categoria_display)}\n` +
    `• Valor publicado: desde ${precio}\n` +
    `• Duración estimada: ${s.duracion_minutos} minutos\n\n` +
    `¿Qué disponibilidad tienen? Gracias.`
  );
}

/** Mensaje general, sin publicación asociada. */
export function mensajeGeneral() {
  return (
    `¡Hola ${NEGOCIO.nombreCorto}! 👋\n\n` +
    `Los contacto desde el sitio web. Quisiera más información sobre ` +
    `los vehículos disponibles.`
  );
}
