import { useState } from "react";

import AdminVehiculos from "./AdminVehiculos.jsx";
import Inventario from "./Inventario.jsx";
import { IconoAlerta } from "./Iconos.jsx";

/**
 * Panel de administracion: concentra la gestion de publicaciones de
 * vehiculos y el inventario de repuestos en un solo lugar.
 */
export default function Admin() {
  const [pestana, setPestana] = useState("vehiculos");

  return (
    <section className="seccion seccion--gris">
      <div className="contenedor">
        <div className="seccion__encabezado">
          <span className="seccion__etiqueta">Panel interno</span>
          <h2>Administración</h2>
          <p>
            Publica vehículos, actualiza su estado y controla el inventario de
            repuestos e insumos del taller.
          </p>
        </div>

        <div className="aviso-seguridad">
          <IconoAlerta width="18" height="18" />
          <span>
            <strong>Pendiente US-78:</strong> este panel todavía no exige inicio
            de sesión. Cualquiera con la dirección puede modificar las
            publicaciones. Antes de usarlo con datos reales hay que implementar
            autenticación y control de acceso (Ley 19.628).
          </span>
        </div>

        <div className="admin-tabs">
          <button className={`admin-tab ${pestana === "vehiculos" ? "activo" : ""}`}
                  onClick={() => setPestana("vehiculos")}>
            Vehículos en venta
          </button>
          <button className={`admin-tab ${pestana === "repuestos" ? "activo" : ""}`}
                  onClick={() => setPestana("repuestos")}>
            Inventario de repuestos
          </button>
        </div>

        {pestana === "vehiculos" ? <AdminVehiculos /> : <Inventario embebido />}
      </div>
    </section>
  );
}
