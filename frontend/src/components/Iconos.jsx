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
