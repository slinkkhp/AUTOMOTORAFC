import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "../api.js";
import { formatearPrecio } from "../utils.js";
import { IconoFlechaDer, IconoFlechaIzq } from "./Iconos.jsx";
import Mensaje from "./Mensaje.jsx";
import TarjetaVehiculo from "./TarjetaVehiculo.jsx";

const CARROCERIAS = [
  ["", "Todos"], ["auto", "Autos"], ["suv", "SUV"],
  ["camioneta", "Camionetas"], ["trabajo", "Trabajo"], ["furgon", "Furgones"],
];

/** Carrusel horizontal de vehiculos destacados. */
export function CarruselVehiculos({ autos }) {
  const pista = useRef(null);
  const mover = (dir) => {
    const el = pista.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.8), behavior: "smooth" });
  };

  if (!autos.length) return null;

  return (
    <div className="carrusel">
      <button className="carrusel__nav carrusel__nav--izq" onClick={() => mover(-1)}
              aria-label="Ver anteriores">
        <IconoFlechaIzq />
      </button>
      <div className="carrusel__pista" ref={pista}>
        {autos.map((a) => <TarjetaVehiculo key={a.id} auto={a} />)}
      </div>
      <button className="carrusel__nav carrusel__nav--der" onClick={() => mover(1)}
              aria-label="Ver siguientes">
        <IconoFlechaDer />
      </button>
    </div>
  );
}

/** Catalogo completo de vehiculos con filtros (US-64, US-65). */
export default function Vehiculos() {
  const [autos, setAutos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [carroceria, setCarroceria] = useState("");
  const [marca, setMarca] = useState("");
  const [transmision, setTransmision] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.resumenVehiculos().then(setResumen).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    const q = new URLSearchParams();
    if (carroceria) q.set("carroceria", carroceria);
    if (marca) q.set("marca", marca);
    if (transmision) q.set("transmision", transmision);
    if (precioMax) q.set("precio_max", precioMax);
    const qs = q.toString();

    api
      .listarVehiculos(qs ? `?${qs}` : "")
      .then((d) => !cancelado && setAutos(d))
      .catch((e) => !cancelado && setError(e.message))
      .finally(() => !cancelado && setCargando(false));
    return () => { cancelado = true; };
  }, [carroceria, marca, transmision, precioMax]);

  const marcas = useMemo(
    () => (resumen?.marcas ?? []).map((m) => m.marca),
    [resumen]
  );

  return (
    <section className="seccion seccion--gris">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Vehículos en venta</span>
          <h2>Encuentra tu próximo auto</h2>
          <p>
            Autos, SUV, camionetas y vehículos de trabajo revisados y con
            documentación al día. Recibimos tu auto en parte de pago y
            trabajamos con financiamiento.
          </p>
        </div>

        {resumen && (
          <div className="estadisticas">
            <div className="estadistica">
              <span>Publicados</span><strong>{resumen.total_publicados}</strong>
            </div>
            <div className="estadistica">
              <span>Disponibles</span><strong>{resumen.disponibles}</strong>
            </div>
            <div className="estadistica">
              <span>En consignación</span><strong>{resumen.en_consignacion}</strong>
            </div>
            <div className="estadistica">
              <span>Desde</span><strong>{formatearPrecio(resumen.precio_desde)}</strong>
            </div>
          </div>
        )}

        <div className="filtros-auto">
          <div className="campo">
            <label htmlFor="f-carroceria">Tipo de vehículo</label>
            <select id="f-carroceria" value={carroceria}
                    onChange={(e) => setCarroceria(e.target.value)}>
              {CARROCERIAS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-marca">Marca</label>
            <select id="f-marca" value={marca} onChange={(e) => setMarca(e.target.value)}>
              <option value="">Todas</option>
              {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-trans">Transmisión</label>
            <select id="f-trans" value={transmision}
                    onChange={(e) => setTransmision(e.target.value)}>
              <option value="">Todas</option>
              <option value="manual">Manual</option>
              <option value="automatica">Automática</option>
            </select>
          </div>
          <div className="campo">
            <label htmlFor="f-precio">Precio hasta</label>
            <select id="f-precio" value={precioMax}
                    onChange={(e) => setPrecioMax(e.target.value)}>
              <option value="">Sin límite</option>
              <option value="7000000">$7.000.000</option>
              <option value="10000000">$10.000.000</option>
              <option value="15000000">$15.000.000</option>
              <option value="20000000">$20.000.000</option>
            </select>
          </div>
        </div>

        <Mensaje tipo="error" texto={error} />

        {cargando ? (
          <div className="cargando"><span className="girador" /><p>Cargando vehículos...</p></div>
        ) : autos.length === 0 ? (
          <div className="vacio">
            <p>No hay vehículos que coincidan con los filtros seleccionados.</p>
          </div>
        ) : (
          <div className="grilla-vehiculos">
            {autos.map((a) => <TarjetaVehiculo key={a.id} auto={a} />)}
          </div>
        )}
      </div>
    </section>
  );
}
