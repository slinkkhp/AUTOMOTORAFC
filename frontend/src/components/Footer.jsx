import { BASE_URL } from "../api.js";

/** Pie de pagina con accesos a la documentacion de la API. */
export default function Footer({ onCambiarVista }) {
  return (
    <footer className="footer">
      <div className="contenedor">
        <div className="footer__grilla">
          <div>
            <h4>AUTOMOTORAFC</h4>
            <p style={{ maxWidth: "38ch" }}>
              Servicio automotriz integral: Car Wash, climatizacion y taller
              mecanico. Agenda en linea y control de inventario en una sola
              plataforma.
            </p>
          </div>

          <div>
            <h4>Plataforma</h4>
            <ul>
              <li>
                <a onClick={() => onCambiarVista("servicios")} href="#servicios">
                  Servicios
                </a>
              </li>
              <li>
                <a onClick={() => onCambiarVista("agendar")} href="#agendar">
                  Agendar hora
                </a>
              </li>
              <li>
                <a onClick={() => onCambiarVista("inventario")} href="#inventario">
                  Inventario
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4>Desarrollo</h4>
            <ul>
              <li>
                <a href={`${BASE_URL}/api/docs/`} target="_blank" rel="noreferrer">
                  Documentacion Swagger
                </a>
              </li>
              <li>
                <a href={`${BASE_URL}/api/schema/`} target="_blank" rel="noreferrer">
                  Esquema OpenAPI
                </a>
              </li>
              <li>
                <a href={`${BASE_URL}/admin/`} target="_blank" rel="noreferrer">
                  Panel de administracion
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__base">
          <span>
            &copy; {new Date().getFullYear()} AUTOMOTORAFC. Proyecto academico.
          </span>
          <span>React 18 + Vite &middot; Django 5.1 + DRF &middot; Microsoft Azure</span>
        </div>
      </div>
    </footer>
  );
}
