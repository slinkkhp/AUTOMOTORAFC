import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import { FAVICON } from "./logo.js";
import "./styles.css";

// El favicon tambien viaja embebido: asi la pestana muestra el escudo
// aunque los archivos estaticos no se hayan copiado.
for (const rel of ["icon", "apple-touch-icon"]) {
  const link = document.querySelector(`link[rel="${rel}"]`) ||
    document.head.appendChild(Object.assign(document.createElement("link"), { rel }));
  link.href = FAVICON;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
