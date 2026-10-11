import { LOGO } from "../logo.js";
import { NEGOCIO, enlaceWhatsApp, mensajeGeneral } from "../config.js";
import { IconoAuto, IconoLlave, IconoUbicacion, IconoWhatsapp } from "./Iconos.jsx";

/** Portada del sitio (US-01). */
export default function Hero({ onCambiarVista }) {
  return (
    <section className="hero">
      <div className="contenedor hero__inner">
        <div>
          <img className="hero__logo" src={LOGO} alt={NEGOCIO.nombre} />

          <span className="pastilla">
            <span className="punto" />
            Compra · Venta · Consignación
          </span>

          <h1>
            Tu próximo auto está <em>aquí</em>, en Puente Alto
          </h1>

          <p className="hero__texto">
            Autos, SUV, camionetas y vehículos de trabajo usados, revisados y con
            documentación al día. Financiamiento disponible, atención
            personalizada y recibimos tu auto en parte de pago.
          </p>

          <div className="hero__acciones">
            <button className="btn btn--primario" onClick={() => onCambiarVista("vehiculos")}>
              <IconoAuto width="19" height="19" /> Ver vehículos en venta
            </button>
            <a className="btn btn--wsp" href={enlaceWhatsApp(mensajeGeneral())}
               target="_blank" rel="noreferrer">
              <IconoWhatsapp /> Escríbenos por WhatsApp
            </a>
          </div>

          <div className="hero__cifras">
            <div className="cifra">
              <strong>+10</strong><span>Vehículos publicados</span>
            </div>
            <div className="cifra">
              <strong>3</strong><span>Servicios de taller</span>
            </div>
            <div className="cifra">
              <strong>Puente Alto</strong><span>Camilo Henríquez 1526</span>
            </div>
          </div>
        </div>

        <aside className="hero__tarjeta">
          <h3>¿Qué necesitas hoy?</h3>

          <div className="linea-servicio">
            <span className="linea-servicio__icono"><IconoAuto width="19" height="19" /></span>
            <span>
              <strong>Comprar un vehículo</strong>
              <small>Revisa el catálogo y consulta por WhatsApp</small>
            </span>
          </div>

          <div className="linea-servicio">
            <span className="linea-servicio__icono">🔁</span>
            <span>
              <strong>Vender o consignar el tuyo</strong>
              <small>Tasación sin costo y nosotros publicamos</small>
            </span>
          </div>

          <div className="linea-servicio">
            <span className="linea-servicio__icono"><IconoLlave width="19" height="19" /></span>
            <span>
              <strong>Agendar un servicio</strong>
              <small>Car Wash, climatización y taller mecánico</small>
            </span>
          </div>

          <div className="linea-servicio">
            <span className="linea-servicio__icono"><IconoUbicacion width="19" height="19" /></span>
            <span>
              <strong>Visitarnos</strong>
              <small>{NEGOCIO.horario}</small>
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}
