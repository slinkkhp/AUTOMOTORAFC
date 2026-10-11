import { useState } from "react";

import { LOGO } from "../logo.js";
import { NEGOCIO, enlaceWhatsApp, mensajeGeneral } from "../config.js";
import { IconoCerrar, IconoMenu, IconoWhatsapp } from "./Iconos.jsx";

const SECCIONES = [
  { id: "inicio", etiqueta: "Inicio" },
  { id: "vehiculos", etiqueta: "Vehículos" },
  { id: "servicios", etiqueta: "Servicios" },
  { id: "agendar", etiqueta: "Agendar" },
  { id: "contacto", etiqueta: "Contacto" },
  { id: "admin", etiqueta: "Admin" },
];

/** Barra de navegacion (US-02): cambia de vista por estado, sin recargar. */
export default function Navbar({ vista, onCambiarVista }) {
  const [abierto, setAbierto] = useState(false);
  const ir = (id) => { onCambiarVista(id); setAbierto(false); };

  return (
    <header className="navbar">
      <div className="contenedor navbar__inner">
        <button className="marca" onClick={() => ir("inicio")} aria-label="Ir al inicio">
          <img className="marca__logo" src={LOGO}
               alt={NEGOCIO.nombre} width="83" height="46" />
          <span>
            <span className="marca__texto">
              FACUNDO <span>COUSIÑO</span>
            </span>
            <span className="marca__bajada">Automotora</span>
          </span>
        </button>

        <nav>
          <ul className={`nav-links ${abierto ? "abierto" : ""}`}>
            {SECCIONES.map((s) => (
              <li key={s.id}>
                <button className={vista === s.id ? "activo" : ""}
                        onClick={() => ir(s.id)}
                        aria-current={vista === s.id ? "page" : undefined}>
                  {s.etiqueta}
                </button>
              </li>
            ))}
            <li>
              <a className="btn btn--wsp" style={{ marginLeft: 6 }}
                 href={enlaceWhatsApp(mensajeGeneral())}
                 target="_blank" rel="noreferrer">
                <IconoWhatsapp /> WhatsApp
              </a>
            </li>
          </ul>
        </nav>

        <button className="nav-toggle" onClick={() => setAbierto((v) => !v)}
                aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={abierto}>
          {abierto ? <IconoCerrar /> : <IconoMenu />}
        </button>
      </div>
    </header>
  );
}
