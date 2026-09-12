/**
 * Cliente HTTP de la API de AUTOMOTORAFC.
 *
 * La URL base se inyecta en tiempo de build con VITE_API_URL para no
 * hardcodear el App Service del backend (US-11, US-14).
 */
const BASE_URL = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(
  /\/$/,
  ""
);

/** Convierte el cuerpo de error de DRF en un mensaje legible. */
function formatearError(cuerpo) {
  if (!cuerpo || typeof cuerpo !== "object") return "Ocurrio un error inesperado.";
  if (cuerpo.detail) return cuerpo.detail;
  return Object.entries(cuerpo)
    .map(([campo, mensajes]) => {
      const texto = Array.isArray(mensajes) ? mensajes.join(" ") : String(mensajes);
      return campo === "non_field_errors" ? texto : `${campo}: ${texto}`;
    })
    .join("\n");
}

async function request(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${BASE_URL}${ruta}`, {
      headers: { "Content-Type": "application/json" },
      ...opciones,
    });
  } catch {
    throw new Error(
      "No se pudo conectar con el servidor. Verifica que la API este disponible."
    );
  }

  if (respuesta.status === 204) return null;

  const cuerpo = await respuesta.json().catch(() => null);
  if (!respuesta.ok) throw new Error(formatearError(cuerpo));
  return cuerpo;
}

/** DRF pagina las respuestas: devolvemos siempre el arreglo de resultados. */
function comoLista(respuesta) {
  if (Array.isArray(respuesta)) return respuesta;
  return respuesta?.results ?? [];
}

export const api = {
  listarServicios: (categoria) =>
    request(`/api/servicios/${categoria ? `?categoria=${categoria}` : ""}`).then(
      comoLista
    ),

  listarProductos: () => request("/api/productos/").then(comoLista),
  crearProducto: (datos) =>
    request("/api/productos/", { method: "POST", body: JSON.stringify(datos) }),
  eliminarProducto: (id) => request(`/api/productos/${id}/`, { method: "DELETE" }),
  resumenInventario: () => request("/api/productos/resumen/"),

  listarCitas: () => request("/api/citas/").then(comoLista),
  crearCita: (datos) =>
    request("/api/citas/", { method: "POST", body: JSON.stringify(datos) }),
  disponibilidad: (fecha) => request(`/api/citas/disponibilidad/?fecha=${fecha}`),
};

export { BASE_URL };
