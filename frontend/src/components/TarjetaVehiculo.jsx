import {
  enlaceWhatsApp, etiqueta, formatearKm, mensajeVehiculo,
} from "../config.js";
import { formatearPrecio } from "../utils.js";
import {
  IconoAuto, IconoCalendario, IconoCambio, IconoCombustible,
  IconoVelocimetro, IconoWhatsapp,
} from "./Iconos.jsx";

/** Tarjeta de un vehiculo publicado, con consulta directa por WhatsApp. */
export default function TarjetaVehiculo({ auto }) {
  const reservado = auto.estado === "reservado";

  return (
    <article className="auto aparecer">
      <div className="auto__foto">
        {auto.imagen_url ? (
          <img src={auto.imagen_url} alt={`${auto.titulo} ${auto.anio}`} loading="lazy" />
        ) : (
          <span className="auto__sinfoto">
            <IconoAuto width="44" height="44" />
            Foto no disponible
          </span>
        )}

        <div className="auto__etiquetas">
          {auto.destacado && <span className="etiqueta etiqueta--rojo">Destacado</span>}
          {auto.consignacion && <span className="etiqueta etiqueta--azul">Consignación</span>}
          {reservado && <span className="etiqueta etiqueta--gris">Reservado</span>}
        </div>
      </div>

      <div className="auto__cuerpo">
        <p className="auto__marca">{auto.marca}</p>
        <h3 className="auto__titulo">
          {auto.modelo} <span style={{ color: "var(--texto-2)" }}>{auto.anio}</span>
        </h3>
        {auto.version && <p className="auto__version">{auto.version}</p>}

        <div className="auto__fichas">
          <span className="ficha"><IconoVelocimetro /> {formatearKm(auto.kilometraje)}</span>
          <span className="ficha"><IconoCalendario width="15" height="15" /> {auto.anio}</span>
          <span className="ficha"><IconoCombustible /> {etiqueta(auto.combustible_display)}</span>
          <span className="ficha"><IconoCambio /> {etiqueta(auto.transmision_display)}</span>
        </div>

        <div className="auto__pie">
          <strong className="auto__precio">{formatearPrecio(auto.precio)}</strong>
          <a
            className="btn btn--wsp btn--bloque"
            href={enlaceWhatsApp(mensajeVehiculo(auto))}
            target="_blank"
            rel="noreferrer"
          >
            <IconoWhatsapp /> Consultar por este vehículo
          </a>
        </div>
      </div>
    </article>
  );
}
