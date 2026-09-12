import { useEffect, useState } from "react";

import { api } from "../api.js";
import { hoyISO } from "../utils.js";
import Mensaje from "./Mensaje.jsx";

const FORM_VACIO = {
  nombre_cliente: "",
  email: "",
  telefono: "",
  servicio: "",
  marca_vehiculo: "",
  modelo_vehiculo: "",
  patente: "",
  fecha: hoyISO(),
  hora: "",
  comentarios: "",
};

/** Formulario de agendamiento de citas en linea (US-06). */
export default function AgendarCita({ servicioPreseleccionado }) {
  const [form, setForm] = useState({
    ...FORM_VACIO,
    servicio: servicioPreseleccionado || "",
  });
  const [servicios, setServicios] = useState([]);
  const [bloques, setBloques] = useState([]);
  const [cargandoBloques, setCargandoBloques] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  // Catalogo para el desplegable de servicios.
  useEffect(() => {
    api.listarServicios().then(setServicios).catch((e) => setError(e.message));
  }, []);

  // Si el usuario llego desde una tarjeta, preseleccionamos ese servicio.
  useEffect(() => {
    if (servicioPreseleccionado) {
      setForm((f) => ({ ...f, servicio: String(servicioPreseleccionado) }));
    }
  }, [servicioPreseleccionado]);

  // Bloques horarios disponibles para la fecha elegida.
  useEffect(() => {
    if (!form.fecha) return;
    let cancelado = false;
    setCargandoBloques(true);

    api
      .disponibilidad(form.fecha)
      .then((datos) => {
        if (cancelado) return;
        setBloques(datos.bloques);
        // Si la hora elegida dejo de estar disponible, la limpiamos.
        setForm((f) => {
          const sigueLibre = datos.bloques.some(
            (b) => b.hora === f.hora && b.disponible
          );
          return sigueLibre ? f : { ...f, hora: "" };
        });
      })
      .catch((e) => {
        if (!cancelado) setError(e.message);
      })
      .finally(() => {
        if (!cancelado) setCargandoBloques(false);
      });

    return () => {
      cancelado = true;
    };
  }, [form.fecha]);

  const actualizar = (campo) => (evento) => {
    setForm((f) => ({ ...f, [campo]: evento.target.value }));
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    setError("");
    setExito("");

    if (!form.hora) {
      setError("Selecciona un bloque horario disponible.");
      return;
    }

    setEnviando(true);
    try {
      const cita = await api.crearCita({ ...form, servicio: Number(form.servicio) });
      setExito(
        `Cita confirmada para el ${cita.fecha} a las ${cita.hora.slice(0, 5)} h. ` +
          `Enviamos el detalle a ${cita.email}.`
      );
      setForm({ ...FORM_VACIO, fecha: form.fecha });
      const datos = await api.disponibilidad(form.fecha);
      setBloques(datos.bloques);
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="seccion">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Reserva en linea</span>
          <h2>Agenda tu hora</h2>
          <p>
            Elige el servicio, la fecha y el bloque horario. Te confirmamos por
            correo dentro de las proximas horas habiles.
          </p>
        </div>

        <Mensaje tipo="ok" texto={exito} />
        <Mensaje tipo="error" texto={error} />

        <form className="formulario-citas" onSubmit={enviar}>
          <div className="panel">
            <div className="campos">
              <div className="campo campo--ancho">
                <label htmlFor="servicio">
                  Servicio <span>*</span>
                </label>
                <select
                  id="servicio"
                  required
                  value={form.servicio}
                  onChange={actualizar("servicio")}
                >
                  <option value="">Selecciona un servicio</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.categoria_display} - {s.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label htmlFor="nombre">
                  Nombre completo <span>*</span>
                </label>
                <input
                  id="nombre"
                  required
                  value={form.nombre_cliente}
                  onChange={actualizar("nombre_cliente")}
                  placeholder="Santiago Nunez"
                />
              </div>

              <div className="campo">
                <label htmlFor="email">
                  Correo electronico <span>*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={actualizar("email")}
                  placeholder="nombre@correo.cl"
                />
              </div>

              <div className="campo">
                <label htmlFor="telefono">
                  Telefono <span>*</span>
                </label>
                <input
                  id="telefono"
                  required
                  value={form.telefono}
                  onChange={actualizar("telefono")}
                  placeholder="+56 9 1234 5678"
                />
              </div>

              <div className="campo">
                <label htmlFor="patente">
                  Patente <span>*</span>
                </label>
                <input
                  id="patente"
                  required
                  maxLength={10}
                  value={form.patente}
                  onChange={actualizar("patente")}
                  placeholder="ABCD12"
                />
              </div>

              <div className="campo">
                <label htmlFor="marca">
                  Marca <span>*</span>
                </label>
                <input
                  id="marca"
                  required
                  value={form.marca_vehiculo}
                  onChange={actualizar("marca_vehiculo")}
                  placeholder="Toyota"
                />
              </div>

              <div className="campo">
                <label htmlFor="modelo">
                  Modelo <span>*</span>
                </label>
                <input
                  id="modelo"
                  required
                  value={form.modelo_vehiculo}
                  onChange={actualizar("modelo_vehiculo")}
                  placeholder="Corolla"
                />
              </div>

              <div className="campo campo--ancho">
                <label htmlFor="comentarios">Comentarios</label>
                <textarea
                  id="comentarios"
                  value={form.comentarios}
                  onChange={actualizar("comentarios")}
                  placeholder="Cuentanos si notaste algun ruido, falla o detalle relevante."
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="campo" style={{ marginBottom: 20 }}>
              <label htmlFor="fecha">
                Fecha <span>*</span>
              </label>
              <input
                id="fecha"
                type="date"
                required
                min={hoyISO()}
                value={form.fecha}
                onChange={actualizar("fecha")}
              />
            </div>

            <div className="campo" style={{ marginBottom: 20 }}>
              <label>
                Bloque horario <span>*</span>
              </label>
              {cargandoBloques ? (
                <div className="cargando" style={{ padding: "28px 0" }}>
                  <span className="girador" />
                </div>
              ) : (
                <div className="bloques">
                  {bloques.map((bloque) => (
                    <button
                      type="button"
                      key={bloque.hora}
                      className={`bloque ${form.hora === bloque.hora ? "activo" : ""}`}
                      disabled={!bloque.disponible}
                      title={bloque.disponible ? "Disponible" : "Bloque ya reservado"}
                      onClick={() => setForm((f) => ({ ...f, hora: bloque.hora }))}
                    >
                      {bloque.hora}
                    </button>
                  ))}
                </div>
              )}
              <small className="campo__ayuda">
                Atencion de lunes a sabado, de 09:00 a 18:00 h.
              </small>
            </div>

            <button
              className="btn btn--primario btn--bloque"
              type="submit"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Confirmar reserva"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
