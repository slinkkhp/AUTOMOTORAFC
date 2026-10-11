import {
  MAPA_URL, NEGOCIO, enlaceWhatsApp, mensajeGeneral,
} from "../config.js";
import {
  IconoInstagram, IconoReloj, IconoTelefono, IconoUbicacion, IconoWhatsapp,
} from "./Iconos.jsx";

/** Datos de contacto, ubicacion y redes sociales. */
export default function Contacto() {
  return (
    <section className="seccion seccion--contacto">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Contáctanos</span>
          <h2>Estamos en Puente Alto</h2>
          <p>
            Escríbenos por WhatsApp y te respondemos al tiro. También puedes
            visitarnos en el local o seguirnos en Instagram para ver las
            publicaciones nuevas.
          </p>
        </div>

        <div className="contacto-grilla">
          <div className="contacto-tarjeta">
            <div className="dato">
              <span className="dato__icono"><IconoUbicacion /></span>
              <span>
                <strong>Dirección</strong>
                <a href={MAPA_URL} target="_blank" rel="noreferrer">
                  {NEGOCIO.direccion}
                  <br />
                  CP {NEGOCIO.codigoPostal} · Ver en el mapa
                </a>
              </span>
            </div>

            <div className="dato">
              <span className="dato__icono"><IconoTelefono /></span>
              <span>
                <strong>Teléfono y WhatsApp</strong>
                <a href={`tel:+${NEGOCIO.telefonoWsp}`}>{NEGOCIO.telefono}</a>
              </span>
            </div>

            <div className="dato">
              <span className="dato__icono"><IconoReloj width="19" height="19" /></span>
              <span>
                <strong>Horario de atención</strong>
                <span>{NEGOCIO.horario}</span>
              </span>
            </div>

            <div className="redes">
              <a className="red red--wsp" href={enlaceWhatsApp(mensajeGeneral())}
                 target="_blank" rel="noreferrer">
                <IconoWhatsapp /> Escribir por WhatsApp
              </a>
              <a className="red red--ig" href={NEGOCIO.instagram}
                 target="_blank" rel="noreferrer">
                <IconoInstagram /> {NEGOCIO.instagramUsuario}
              </a>
            </div>
          </div>

          <div className="contacto-tarjeta">
            <h3 style={{ marginBottom: 14, color: "#fff" }}>
              Compra, venta y consignación
            </h3>
            <p style={{ color: "rgba(238,242,251,.78)", marginBottom: 18 }}>
              {NEGOCIO.descripcion}
            </p>

            <div className="dato">
              <span className="dato__icono">🚗</span>
              <span>
                <strong>Vendemos tu auto en consignación</strong>
                <span>Nos encargamos de la publicación, las visitas y los papeles.</span>
              </span>
            </div>
            <div className="dato">
              <span className="dato__icono">🔁</span>
              <span>
                <strong>Recibimos tu auto en parte de pago</strong>
                <span>Tasación sin costo y en el momento.</span>
              </span>
            </div>
            <div className="dato">
              <span className="dato__icono">💳</span>
              <span>
                <strong>Financiamiento disponible</strong>
                <span>Te ayudamos a encontrar la alternativa que te acomode.</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
