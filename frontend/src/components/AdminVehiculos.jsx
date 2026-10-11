import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../api.js";
import { etiqueta, formatearKm } from "../config.js";
import { formatearPrecio } from "../utils.js";
import {
  IconoBasura, IconoBuscar, IconoImagen, IconoLapiz,
} from "./Iconos.jsx";
import Mensaje from "./Mensaje.jsx";

const VACIO = {
  marca: "", modelo: "", version: "", anio: new Date().getFullYear(),
  precio: "", kilometraje: "", carroceria: "auto", combustible: "bencina",
  transmision: "manual", color: "", descripcion: "", imagen_url: "",
  estado: "disponible", destacado: false, consignacion: false,
};

const CARROCERIAS = [["auto","Auto"],["suv","SUV"],["camioneta","Camioneta"],
                     ["trabajo","Vehículo de trabajo"],["furgon","Furgón"]];
const COMBUSTIBLES = [["bencina","Bencina"],["diesel","Diésel"],["hibrido","Híbrido"],
                      ["electrico","Eléctrico"],["gas","Gas"]];
const ESTADOS = [["disponible","Disponible"],["reservado","Reservado"],["vendido","Vendido"]];

/** Alta, edicion y baja de vehiculos publicados (US-64, US-66). */
export default function AdminVehiculos() {
  const [autos, setAutos] = useState([]);
  const [form, setForm] = useState(VACIO);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      setAutos(await api.listarVehiculos("?todos=1"));
      setError("");
    } catch (e) { setError(e.message); } finally { setCargando(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiar = (campo) => (e) =>
    setForm((f) => ({
      ...f,
      [campo]: e.target.type === "checkbox" ? e.target.checked : e.target.value,
    }));

  const limpiar = () => { setForm(VACIO); setEditando(null); };

  const guardar = async (e) => {
    e.preventDefault();
    setError(""); setExito(""); setGuardando(true);
    const datos = {
      ...form,
      anio: Number(form.anio),
      precio: Number(form.precio),
      kilometraje: Number(form.kilometraje),
    };
    try {
      if (editando) {
        const a = await api.actualizarVehiculo(editando, datos);
        setExito(`Vehículo "${a.titulo}" actualizado.`);
      } else {
        const a = await api.crearVehiculo(datos);
        setExito(`Vehículo "${a.titulo}" publicado correctamente.`);
      }
      limpiar();
      await cargar();
    } catch (e) { setError(e.message); } finally { setGuardando(false); }
  };

  const editar = (a) => {
    setEditando(a.id);
    setForm({
      marca: a.marca, modelo: a.modelo, version: a.version ?? "", anio: a.anio,
      precio: a.precio, kilometraje: a.kilometraje, carroceria: a.carroceria,
      combustible: a.combustible, transmision: a.transmision, color: a.color ?? "",
      descripcion: a.descripcion ?? "", imagen_url: a.imagen_url ?? "",
      estado: a.estado, destacado: a.destacado, consignacion: a.consignacion,
    });
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const eliminar = async (a) => {
    if (!window.confirm(`¿Eliminar la publicación de ${a.titulo} ${a.anio}?`)) return;
    try {
      await api.eliminarVehiculo(a.id);
      setExito(`Publicación de ${a.titulo} eliminada.`);
      if (editando === a.id) limpiar();
      await cargar();
    } catch (e) { setError(e.message); }
  };

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    if (!t) return autos;
    return autos.filter((a) =>
      `${a.marca} ${a.modelo} ${a.version} ${a.anio}`.toLowerCase().includes(t));
  }, [autos, busqueda]);

  return (
    <>
      <Mensaje tipo="ok" texto={exito} />
      <Mensaje tipo="error" texto={error} />

      <div className="inventario-layout">
        <form className="panel" onSubmit={guardar}>
          <h3 style={{ marginBottom: 18 }}>
            {editando ? "Editar publicación" : "Publicar vehículo"}
          </h3>

          <div className="campos" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="campo">
              <label htmlFor="v-marca">Marca <span>*</span></label>
              <input id="v-marca" required value={form.marca}
                     onChange={cambiar("marca")} placeholder="Toyota" />
            </div>
            <div className="campo">
              <label htmlFor="v-modelo">Modelo <span>*</span></label>
              <input id="v-modelo" required value={form.modelo}
                     onChange={cambiar("modelo")} placeholder="Hilux" />
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="v-version">Versión</label>
              <input id="v-version" value={form.version}
                     onChange={cambiar("version")} placeholder="2.4 4x4 SR" />
            </div>
            <div className="campo">
              <label htmlFor="v-anio">Año <span>*</span></label>
              <input id="v-anio" type="number" min="1950" max="2100" required
                     value={form.anio} onChange={cambiar("anio")} />
            </div>
            <div className="campo">
              <label htmlFor="v-km">Kilometraje <span>*</span></label>
              <input id="v-km" type="number" min="0" required
                     value={form.kilometraje} onChange={cambiar("kilometraje")}
                     placeholder="82000" />
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="v-precio">Precio (CLP) <span>*</span></label>
              <input id="v-precio" type="number" min="0" required
                     value={form.precio} onChange={cambiar("precio")}
                     placeholder="18990000" />
            </div>
            <div className="campo">
              <label htmlFor="v-carroceria">Tipo</label>
              <select id="v-carroceria" value={form.carroceria} onChange={cambiar("carroceria")}>
                {CARROCERIAS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="v-comb">Combustible</label>
              <select id="v-comb" value={form.combustible} onChange={cambiar("combustible")}>
                {COMBUSTIBLES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            </div>
            <div className="campo">
              <label htmlFor="v-trans">Transmisión</label>
              <select id="v-trans" value={form.transmision} onChange={cambiar("transmision")}>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </select>
            </div>
            <div className="campo">
              <label htmlFor="v-color">Color</label>
              <input id="v-color" value={form.color} onChange={cambiar("color")}
                     placeholder="Blanco" />
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="v-img">Dirección de la fotografía</label>
              <input id="v-img" type="url" value={form.imagen_url}
                     onChange={cambiar("imagen_url")}
                     placeholder="https://..." />
              <small className="campo__ayuda">
                Pega aquí el enlace de una imagen. Si lo dejas vacío, la tarjeta
                muestra un marcador de posición.
              </small>
            </div>
            <div className="campo campo--ancho">
              <label htmlFor="v-desc">Descripción</label>
              <textarea id="v-desc" value={form.descripcion}
                        onChange={cambiar("descripcion")}
                        placeholder="Mantenciones al dia, un solo dueño, revisión técnica vigente..." />
            </div>
            <div className="campo">
              <label htmlFor="v-estado">Estado</label>
              <select id="v-estado" value={form.estado} onChange={cambiar("estado")}>
                {ESTADOS.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
              </select>
            </div>
            <div className="campo" style={{ justifyContent: "flex-end", gap: 10 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                <input type="checkbox" checked={form.destacado}
                       onChange={cambiar("destacado")} style={{ width: "auto" }} />
                Destacar en portada
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 500 }}>
                <input type="checkbox" checked={form.consignacion}
                       onChange={cambiar("consignacion")} style={{ width: "auto" }} />
                En consignación
              </label>
            </div>
          </div>

          <button className="btn btn--primario btn--bloque" type="submit"
                  disabled={guardando} style={{ marginTop: 20 }}>
            {guardando ? "Guardando..." : editando ? "Guardar cambios" : "Publicar vehículo"}
          </button>
          {editando && (
            <button type="button" className="btn btn--claro btn--bloque"
                    onClick={limpiar} style={{ marginTop: 10 }}>
              Cancelar edición
            </button>
          )}
        </form>

        <div>
          <div className="buscador">
            <IconoBuscar />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
                   placeholder="Buscar por marca, modelo o año..."
                   aria-label="Buscar vehículos" />
          </div>

          <div className="tabla-envoltorio">
            {cargando ? (
              <div className="cargando"><span className="girador" /><p>Cargando...</p></div>
            ) : filtrados.length === 0 ? (
              <div className="vacio"><p>No hay vehículos publicados.</p></div>
            ) : (
              <table className="tabla-admin">
                <thead>
                  <tr>
                    <th>Foto</th><th>Vehículo</th><th>Año</th>
                    <th>Km</th><th>Precio</th><th>Estado</th><th />
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((a) => (
                    <tr key={a.id}>
                      <td>
                        {a.imagen_url
                          ? <img src={a.imagen_url} alt="" />
                          : <span className="sin-img"><IconoImagen width="16" height="16" /></span>}
                      </td>
                      <td>
                        <strong>{a.marca} {a.modelo}</strong>
                        {a.version && <><br /><span className="sku">{a.version}</span></>}
                      </td>
                      <td>{a.anio}</td>
                      <td>{formatearKm(a.kilometraje)}</td>
                      <td>{formatearPrecio(a.precio)}</td>
                      <td>
                        <span className={`etiqueta-stock ${
                          a.estado === "vendido" ? "etiqueta-stock--critico" : ""}`}>
                          {etiqueta(a.estado_display)}
                        </span>
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>
                        <button className="btn-icono" onClick={() => editar(a)}
                                title="Editar" aria-label={`Editar ${a.titulo}`}>
                          <IconoLapiz />
                        </button>
                        <button className="btn-icono" onClick={() => eliminar(a)}
                                title="Eliminar" aria-label={`Eliminar ${a.titulo}`}>
                          <IconoBasura />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
