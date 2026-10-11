/** Iconos SVG en linea: evitan dependencias externas y pesan casi nada. */

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export const IconoAuto = (p) => (
  <svg {...base} {...p}>
    <path d="M5 17h14M6 17v2M18 17v2" />
    <path d="M3 13l1.6-4.5A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.5L21 13v4H3z" />
    <circle cx="7.5" cy="14.5" r="1" />
    <circle cx="16.5" cy="14.5" r="1" />
  </svg>
);

export const IconoGota = (p) => (
  <svg {...base} {...p}>
    <path d="M12 2.5s6 6.6 6 11a6 6 0 0 1-12 0c0-4.4 6-11 6-11z" />
  </svg>
);

export const IconoNieve = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
    <path d="M9.5 4.8 12 7l2.5-2.2M9.5 19.2 12 17l2.5 2.2" />
  </svg>
);

export const IconoLlave = (p) => (
  <svg {...base} {...p}>
    <path d="M14.7 6.3a4.5 4.5 0 1 0 3 3L21 6l-1.5-1.5L18 6l-1.5-1.5L18 3l-1.5-1.5z" />
    <path d="m11.5 9.5-8 8a2.1 2.1 0 0 0 3 3l8-8" />
  </svg>
);

export const IconoCaja = (p) => (
  <svg {...base} {...p}>
    <path d="M21 8v8a2 2 0 0 1-1 1.7l-7 4a2 2 0 0 1-2 0l-7-4A2 2 0 0 1 3 16V8a2 2 0 0 1 1-1.7l7-4a2 2 0 0 1 2 0l7 4A2 2 0 0 1 21 8z" />
    <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
  </svg>
);

export const IconoCalendario = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </svg>
);

export const IconoReloj = (p) => (
  <svg {...base} width="15" height="15" {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconoCheck = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
);

export const IconoAlerta = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5M12 16h.01" />
  </svg>
);

export const IconoBuscar = (p) => (
  <svg {...base} width="17" height="17" {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);

export const IconoBasura = (p) => (
  <svg {...base} width="17" height="17" {...p}>
    <path d="M4 7h16M10 11v6M14 11v6" />
    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
  </svg>
);

export const IconoMenu = (p) => (
  <svg {...base} width="24" height="24" {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const IconoCerrar = (p) => (
  <svg {...base} width="24" height="24" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

/** Devuelve el icono que corresponde a cada categoria de servicio. */
export function iconoPorCategoria(categoria, props = {}) {
  const mapa = {
    car_wash: IconoGota,
    climatizacion: IconoNieve,
    mecanica: IconoLlave,
  };
  const Componente = mapa[categoria] || IconoAuto;
  return <Componente {...props} />;
}

/* ---- Iconos agregados para vehiculos, contacto y administracion ---- */

export const IconoWhatsapp = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.38-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35z" />
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.22-8.24 8.22z" />
  </svg>
);

export const IconoInstagram = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconoUbicacion = (p) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const IconoTelefono = (p) => (
  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 16.9v2.5a2 2 0 0 1-2.2 2 19.5 19.5 0 0 1-8.5-3 19.2 19.2 0 0 1-5.9-5.9 19.5 19.5 0 0 1-3-8.6A2 2 0 0 1 3.4 2H6a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.5 2.1L7 9.8a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6a2 2 0 0 1 1.7 2z" />
  </svg>
);

export const IconoVelocimetro = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.5 18a9.5 9.5 0 1 1 17 0" />
    <path d="M12 14.5 16 9" />
    <circle cx="12" cy="16" r="1.4" />
  </svg>
);

export const IconoCombustible = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 20V5a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15" />
    <path d="M3 20h11" />
    <path d="M13 9h3.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 0 3 0V9l-2.6-2.6" />
  </svg>
);

export const IconoCambio = (p) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M6 4v16M12 4v16M18 4v10" />
    <circle cx="6" cy="4" r="1.6" />
    <circle cx="12" cy="4" r="1.6" />
    <circle cx="18" cy="4" r="1.6" />
    <path d="M6 12h12" />
  </svg>
);

export const IconoFlechaIzq = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </svg>
);

export const IconoFlechaDer = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </svg>
);

export const IconoImagen = (p) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.6" />
    <path d="m4 17 4.5-4.5 3 3L15 12l5 5" />
  </svg>
);

export const IconoLapiz = (p) => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  </svg>
);

export const IconoEscudo = (p) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 2.5 20 6v6c0 4.6-3.3 8.6-8 9.5-4.7-.9-8-4.9-8-9.5V6z" />
  </svg>
);
