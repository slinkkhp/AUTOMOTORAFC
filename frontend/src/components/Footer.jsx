import { LOGO } from "../logo.js";
import { BASE_URL } from "../api.js";
import { MAPA_URL, NEGOCIO, enlaceWhatsApp, mensajeGeneral } from "../config.js";
import { IconoInstagram, IconoWhatsapp } from "./Iconos.jsx";

/** Pie de pagina con contacto, redes y accesos tecnicos. */
export default function Footer({ onCambiarVista }) {
  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__grilla">
          <div>
            <img className="footer__logo" src={LOGO} alt={NEGOCIO.nombre} />
            <p style={{ maxWidth: "40ch" }}>{NEGOCIO.descripcion}</p>
            <div className="redes" style={{ marginTop: 18 }}>
              <a className="red red--wsp" href={enlaceWhatsApp(mensajeGeneral())}
                 target="_blank" rel="noreferrer">
                <IconoWhatsapp /> WhatsApp
              </a>
              <a className="red red--ig" href={NEGOCIO.instagram}
                 target="_blank" rel="noreferrer">
                <IconoInstagram /> Instagram
              </a>
            </div>
          </div>

          <div>
            <h4>Sitio</h4>
            <ul>
              <li><a onClick={() => onCambiarVista("vehiculos")} href="#vehiculos">Vehículos en venta</a></li>
              <li><a onClick={() => onCambiarVista("servicios")} href="#servicios">Servicios del taller</a></li>
              <li><a onClick={() => onCambiarVista("agendar")} href="#agendar">Agendar hora</a></li>
              <li><a onClick={() => onCambiarVista("contacto")} href="#contacto">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4>Dónde estamos</h4>
            <ul>
              <li><a href={MAPA_URL} target="_blank" rel="noreferrer">{NEGOCIO.direccion}</a></li>
              <li><a href={`tel:+${NEGOCIO.telefonoWsp}`}>{NEGOCIO.telefono}</a></li>
              <li>{NEGOCIO.horario}</li>
              <li style={{ marginTop: 12 }}>
                <a href={`${BASE_URL}/api/docs/`} target="_blank" rel="noreferrer">
                  Documentación de la API
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>&copy; {new Date().getFullYear()} {NEGOCIO.nombre}. Puente Alto, Chile.</span>
          <span>React 18 + Vite · Django 5.1 + DRF · Microsoft Azure</span>
        </div>
      </div>
    </footer>
  );
}
