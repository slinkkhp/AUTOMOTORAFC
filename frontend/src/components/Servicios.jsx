import { useEffect, useState } from "react";

import { api } from "../api.js";
import { formatearDuracion, formatearPrecio } from "../utils.js";
import { IconoReloj, iconoPorCategoria } from "./Iconos.jsx";
import Mensaje from "./Mensaje.jsx";

const CATEGORIAS = [
  { valor: "", etiqueta: "Todos" },
  { valor: "car_wash", etiqueta: "Car Wash" },
  { valor: "climatizacion", etiqueta: "Aire Acondicionado" },
  { valor: "mecanica", etiqueta: "Taller Mecanico" },
];

/** Catalogo de servicios automotrices (US-03, US-04, US-05). */
export default function Servicios({ onAgendar }) {
  const [servicios, setServicios] = useState([]);
  const [categoria, setCategoria] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError("");

    api
      .listarServicios(categoria)
      .then((datos) => {
        if (!cancelado) setServicios(datos);
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [categoria]);

  return (
    <section className="seccion seccion--gris">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Nuestros servicios</span>
          <h2>Todo lo que tu vehiculo necesita</h2>
          <p>
            Tecnicos certificados, repuestos originales y garantia escrita en cada
            trabajo. Filtra por categoria para encontrar lo que buscas.
          </p>
        </div>

        <div className="filtros">
          {CATEGORIAS.map((c) => (
            <button
              key={c.valor || "todos"}
              className={`filtro ${categoria === c.valor ? "activo" : ""}`}
              onClick={() => setCategoria(c.valor)}
            >
              {c.etiqueta}
            </button>
          ))}
        </div>

        <Mensaje tipo="error" texto={error} />

        {cargando ? (
          <div className="cargando">
            <span className="girador" />
            <p>Cargando servicios...</p>
          </div>
        ) : servicios.length === 0 ? (
          <div className="vacio">
            <p>No hay servicios disponibles en esta categoria.</p>
          </div>
        ) : (
          <div className="grilla-servicios">
            {servicios.map((servicio) => (
              <article className="tarjeta aparecer" key={servicio.id}>
                {servicio.destacado && <span className="insignia">Popular</span>}

                <span className="tarjeta__icono">
                  {iconoPorCategoria(servicio.categoria, { width: 22, height: 22 })}
                </span>

                <p className="tarjeta__categoria">{servicio.categoria_display}</p>
                <h3>{servicio.nombre}</h3>
                <p className="tarjeta__descripcion">{servicio.descripcion}</p>

                <div className="tarjeta__pie">
                  <div className="tarjeta__precio">
                    <small>Desde</small>
                    <strong>{formatearPrecio(servicio.precio_desde)}</strong>
                    <span className="duracion">
                      <IconoReloj /> {formatearDuracion(servicio.duracion_minutos)}
                    </span>
                  </div>
                  <button
                    className="btn btn--primario"
                    onClick={() => onAgendar(servicio.id)}
                  >
                    Agendar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
