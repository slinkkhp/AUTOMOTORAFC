import { useEffect, useState } from "react";

import AgendarCita from "./components/AgendarCita.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Inventario from "./components/Inventario.jsx";
import Navbar from "./components/Navbar.jsx";
import Servicios from "./components/Servicios.jsx";

/**
 * Componente raiz de la SPA (US-01, US-02).
 *
 * La navegacion se resuelve con estado local en lugar de un router: cambiar de
 * vista no recarga la pagina ni pide nada al servidor.
 */
export default function App() {
  const [vista, setVista] = useState("inicio");
  const [servicioElegido, setServicioElegido] = useState(null);

  // Cada cambio de vista vuelve al inicio del documento.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vista]);

  /** Salta al formulario de reserva con el servicio ya seleccionado. */
  const agendarServicio = (idServicio) => {
    setServicioElegido(idServicio);
    setVista("agendar");
  };

  const cambiarVista = (nueva) => {
    if (nueva !== "agendar") setServicioElegido(null);
    setVista(nueva);
  };

  return (
    <>
      <Navbar vista={vista} onCambiarVista={cambiarVista} />

      <main>
        {vista === "inicio" && (
          <>
            <Hero onCambiarVista={cambiarVista} />
            <Servicios onAgendar={agendarServicio} />
          </>
        )}

        {vista === "servicios" && <Servicios onAgendar={agendarServicio} />}

        {vista === "agendar" && (
          <AgendarCita servicioPreseleccionado={servicioElegido} />
        )}

        {vista === "inventario" && <Inventario />}
      </main>

      <Footer onCambiarVista={cambiarVista} />
    </>
  );
}
