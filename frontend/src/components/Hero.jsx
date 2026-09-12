import { IconoGota, IconoLlave, IconoNieve } from "./Iconos.jsx";

const DESTACADOS = [
  {
    Icono: IconoGota,
    titulo: "Car Wash Premium",
    detalle: "Lavado detallado y encerado",
    precio: "Desde $9.000",
  },
  {
    Icono: IconoNieve,
    titulo: "Climatizacion",
    detalle: "Recarga y sanitizacion de A/C",
    precio: "Desde $15.000",
  },
  {
    Icono: IconoLlave,
    titulo: "Taller Mecanico",
    detalle: "Mantencion y diagnostico",
    precio: "Desde $20.000",
  },
];

/** Portada de la plataforma (US-01). */
export default function Hero({ onCambiarVista }) {
  return (
    <section className="hero">
      <div className="contenedor hero__inner">
        <div>
          <span className="pastilla">
            <span className="punto" />
            Agenda en linea disponible
          </span>

          <h1>
            Tu auto en manos <em>expertas</em>, sin filas ni llamadas
          </h1>

          <p className="hero__texto">
            Car Wash, climatizacion y taller mecanico en un solo lugar. Reserva tu
            hora en menos de un minuto y deja que nos ocupemos del resto.
          </p>

          <div className="hero__acciones">
            <button className="btn btn--primario" onClick={() => onCambiarVista("agendar")}>
              Agendar mi hora
            </button>
            <button className="btn btn--fantasma" onClick={() => onCambiarVista("servicios")}>
              Ver servicios
            </button>
          </div>

          <div className="hero__cifras">
            <div className="cifra">
              <strong>+2.400</strong>
              <span>Servicios realizados</span>
            </div>
            <div className="cifra">
              <strong>9</strong>
              <span>Servicios disponibles</span>
            </div>
            <div className="cifra">
              <strong>4.8/5</strong>
              <span>Satisfaccion</span>
            </div>
          </div>
        </div>

        <aside className="hero__tarjeta">
          <h3>Nuestras especialidades</h3>
          {DESTACADOS.map(({ Icono, titulo, detalle, precio }) => (
            <div className="linea-servicio" key={titulo}>
              <span className="linea-servicio__icono">
                <Icono width="19" height="19" />
              </span>
              <span>
                <strong>{titulo}</strong>
                <small>{detalle}</small>
              </span>
              <span className="linea-servicio__precio">{precio}</span>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
