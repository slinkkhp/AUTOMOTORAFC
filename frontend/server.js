/**
 * Servidor estatico para Azure App Service (US-13, US-14).
 *
 * Oryx ejecuta `npm run build` y deja la SPA compilada en /dist. App Service
 * necesita un proceso que la sirva: este archivo lo hace y ademas reenvia
 * cualquier ruta desconocida a index.html para que la navegacion del cliente
 * no devuelva 404.
 */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(dist, { maxAge: "1h", index: false }));

app.get("*", (_req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(port, () => {
  console.log(`[automotora-fc-front] escuchando en el puerto ${port}`);
});
