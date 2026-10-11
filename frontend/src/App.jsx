import { useEffect, useState } from "react";

import { api } from "./api.js";
import Admin from "./components/Admin.jsx";
import AgendarCita from "./components/AgendarCita.jsx";
import Contacto from "./components/Contacto.jsx";
import Footer from "./components/Footer.jsx";
import Hero from "./components/Hero.jsx";
import Navbar from "./components/Navbar.jsx";
import Servicios from "./components/Servicios.jsx";
import Vehiculos, { CarruselVehiculos } from "./components/Vehiculos.jsx";

/**
 * Componente raiz de la SPA (US-01, US-02).
 *
 * La navegacion se resuelve con estado local en lugar de un router: cambiar de
 * vista no recarga la pagina ni pide nada al servidor.
 */
export default function App() {
  const [vista, setVista] = useState("inicio");
  const [servicioElegido, setServicioElegido] = useState(null);
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [vista]);

  // Vehiculos destacados para el carrusel de la portada.
  useEffect(() => {
    api.listarVehiculos("?destacados=1").then(setDestacados).catch(() => {});
  }, []);

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

            {destacados.length > 0 && (
              <section className="seccion">
                <div className="contenedor">
                  <div className="seccion__encabezado">
                    <span className="seccion__etiqueta">Destacados de la semana</span>
                    <h2>Vehículos recién ingresados</h2>
                    <p>
                      Desliza para verlos. Cada publicación abre una consulta por
                      WhatsApp con los datos del vehículo ya escritos.
                    </p>
                  </div>
                  <CarruselVehiculos autos={destacados} />
                  <div style={{ marginTop: 22 }}>
                    <button className="btn btn--primario"
                            onClick={() => cambiarVista("vehiculos")}>
                      Ver todo el catálogo
                    </button>
                  </div>
                </div>
              </section>
            )}

            <Servicios onAgendar={agendarServicio} />
            <Contacto />
          </>
        )}

        {vista === "vehiculos" && <Vehiculos />}
        {vista === "servicios" && <Servicios onAgendar={agendarServicio} />}
        {vista === "agendar" && <AgendarCita servicioPreseleccionado={servicioElegido} />}
        {vista === "contacto" && <Contacto />}
        {vista === "admin" && <Admin />}
      </main>

      <Footer onCambiarVista={cambiarVista} />
    </>
  );
}
