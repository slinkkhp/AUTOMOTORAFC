import { useState } from "react";

import { IconoAuto, IconoCerrar, IconoMenu } from "./Iconos.jsx";

const SECCIONES = [
  { id: "inicio", etiqueta: "Inicio" },
  { id: "servicios", etiqueta: "Servicios" },
  { id: "agendar", etiqueta: "Agendar hora" },
  { id: "inventario", etiqueta: "Inventario" },
];

/**
 * Barra de navegacion (US-02).
 * Cambia de vista mediante estado, sin recargar la pagina.
 */
export default function Navbar({ vista, onCambiarVista }) {
  const [abierto, setAbierto] = useState(false);

  const ir = (id) => {
    onCambiarVista(id);
    setAbierto(false);
  };

  return (
    <header className="navbar">
      <div className="contenedor navbar__inner">
        <button className="marca" onClick={() => ir("inicio")} aria-label="Ir al inicio">
          <span className="marca__icono">
            <IconoAuto width="21" height="21" stroke="#fff" />
          </span>
          <span>
            <span className="marca__texto">
              AUTOMOTORA<span>FC</span>
            </span>
            <span className="marca__bajada">Servicio integral</span>
          </span>
        </button>

        <nav>
          <ul className={`nav-links ${abierto ? "abierto" : ""}`}>
            {SECCIONES.map((seccion) => (
              <li key={seccion.id}>
                <button
                  className={vista === seccion.id ? "activo" : ""}
                  onClick={() => ir(seccion.id)}
                  aria-current={vista === seccion.id ? "page" : undefined}
                >
                  {seccion.etiqueta}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="nav-toggle"
          onClick={() => setAbierto((v) => !v)}
          aria-label={abierto ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={abierto}
        >
          {abierto ? <IconoCerrar /> : <IconoMenu />}
        </button>
      </div>
    </header>
  );
}
