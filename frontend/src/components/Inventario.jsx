import { useCallback, useEffect, useMemo, useState } from "react";

import { api } from "../api.js";
import { formatearPrecio } from "../utils.js";
import { IconoBasura, IconoBuscar } from "./Iconos.jsx";
import Mensaje from "./Mensaje.jsx";

const CATEGORIAS = [
  ["repuesto", "Repuesto"],
  ["lubricante", "Lubricante"],
  ["neumatico", "Neumatico"],
  ["accesorio", "Accesorio"],
  ["insumo", "Insumo de limpieza"],
];

const FORM_VACIO = {
  nombre: "",
  sku: "",
  categoria: "repuesto",
  precio: "",
  stock: "",
  stock_minimo: "5",
};

/** Panel administrativo de inventario (US-07, US-08). */
export default function Inventario() {
  const [productos, setProductos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [lista, totales] = await Promise.all([
        api.listarProductos(),
        api.resumenInventario(),
      ]);
      setProductos(lista);
      setResumen(totales);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const actualizar = (campo) => (evento) => {
    setForm((f) => ({ ...f, [campo]: evento.target.value }));
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setError("");
    setExito("");
    setGuardando(true);

    try {
      const creado = await api.crearProducto({
        ...form,
        precio: Number(form.precio),
        stock: Number(form.stock),
        stock_minimo: Number(form.stock_minimo),
      });
      setExito(`Producto "${creado.nombre}" registrado con el codigo ${creado.sku}.`);
      setForm(FORM_VACIO);
      await cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (producto) => {
    if (!window.confirm(`Eliminar "${producto.nombre}" del inventario?`)) return;
    try {
      await api.eliminarProducto(producto.id);
      setExito(`Producto "${producto.nombre}" eliminado.`);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  const filtrados = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return productos;
    return productos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(termino) ||
        p.sku.toLowerCase().includes(termino)
    );
  }, [productos, busqueda]);

  return (
    <section className="seccion seccion--gris">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Modulo administrativo</span>
          <h2>Inventario de repuestos e insumos</h2>
          <p>
            Registra nuevos productos y controla las existencias. Los items bajo el
            stock minimo se destacan automaticamente.
          </p>
        </div>

        {resumen && (
          <div className="estadisticas">
            <div className="estadistica">
              <span>Productos activos</span>
              <strong>{resumen.total_productos}</strong>
            </div>
            <div className="estadistica">
              <span>Unidades en bodega</span>
              <strong>{resumen.unidades_totales}</strong>
            </div>
            <div className="estadistica estadistica--alerta">
              <span>Stock critico</span>
              <strong>{resumen.productos_stock_critico}</strong>
            </div>
            <div className="estadistica">
              <span>Valorizacion</span>
              <strong>{formatearPrecio(resumen.valor_total)}</strong>
            </div>
          </div>
        )}

        <Mensaje tipo="ok" texto={exito} />
        <Mensaje tipo="error" texto={error} />

        <div className="inventario-layout">
          <form className="panel" onSubmit={guardar}>
            <h3 style={{ marginBottom: 18 }}>Registrar producto</h3>

            <div className="campos" style={{ gridTemplateColumns: "1fr" }}>
              <div className="campo">
                <label htmlFor="p-nombre">
                  Nombre <span>*</span>
                </label>
                <input
                  id="p-nombre"
                  required
                  value={form.nombre}
                  onChange={actualizar("nombre")}
                  placeholder="Filtro de aceite"
                />
              </div>

              <div className="campo">
                <label htmlFor="p-sku">
                  Codigo SKU <span>*</span>
                </label>
                <input
                  id="p-sku"
                  required
                  value={form.sku}
                  onChange={actualizar("sku")}
                  placeholder="FIL-0012"
                />
                <small className="campo__ayuda">Debe ser unico.</small>
              </div>

              <div className="campo">
                <label htmlFor="p-categoria">
                  Categoria <span>*</span>
                </label>
                <select
                  id="p-categoria"
                  value={form.categoria}
                  onChange={actualizar("categoria")}
                >
                  {CATEGORIAS.map(([valor, etiqueta]) => (
                    <option key={valor} value={valor}>
                      {etiqueta}
                    </option>
                  ))}
                </select>
              </div>

              <div className="campo">
                <label htmlFor="p-precio">
                  Precio (CLP) <span>*</span>
                </label>
                <input
                  id="p-precio"
                  type="number"
                  min="0"
                  required
                  value={form.precio}
                  onChange={actualizar("precio")}
                  placeholder="8900"
                />
              </div>

              <div className="campo">
                <label htmlFor="p-stock">
                  Stock inicial <span>*</span>
                </label>
                <input
                  id="p-stock"
                  type="number"
                  min="0"
                  required
                  value={form.stock}
                  onChange={actualizar("stock")}
                  placeholder="20"
                />
              </div>

              <div className="campo">
                <label htmlFor="p-minimo">Stock minimo</label>
                <input
                  id="p-minimo"
                  type="number"
                  min="0"
                  value={form.stock_minimo}
                  onChange={actualizar("stock_minimo")}
                />
              </div>
            </div>

            <button
              className="btn btn--primario btn--bloque"
              type="submit"
              disabled={guardando}
              style={{ marginTop: 20 }}
            >
              {guardando ? "Guardando..." : "Agregar al inventario"}
            </button>
          </form>

          <div>
            <div className="buscador">
              <IconoBuscar />
              <input
                type="search"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por nombre o SKU..."
                aria-label="Buscar productos"
              />
            </div>

            <div className="tabla-envoltorio">
              {cargando ? (
                <div className="cargando">
                  <span className="girador" />
                  <p>Cargando inventario...</p>
                </div>
              ) : filtrados.length === 0 ? (
                <div className="vacio">
                  <p>
                    {busqueda
                      ? "Ningun producto coincide con la busqueda."
                      : "Aun no hay productos registrados."}
                  </p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Producto</th>
                      <th>Categoria</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {filtrados.map((producto) => (
                      <tr key={producto.id}>
                        <td className="sku">{producto.sku}</td>
                        <td>
                          <strong>{producto.nombre}</strong>
                        </td>
                        <td>{producto.categoria_display}</td>
                        <td>{formatearPrecio(producto.precio)}</td>
                        <td>
                          <span
                            className={`etiqueta-stock ${
                              producto.stock_critico ? "etiqueta-stock--critico" : ""
                            }`}
                          >
                            {producto.stock} u.
                            {producto.stock_critico && " - bajo"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-icono"
                            onClick={() => eliminar(producto)}
                            aria-label={`Eliminar ${producto.nombre}`}
                            title="Eliminar producto"
                          >
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
      </div>
    </section>
  );
}
