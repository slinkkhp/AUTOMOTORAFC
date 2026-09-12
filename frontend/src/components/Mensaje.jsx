import { IconoAlerta, IconoCheck } from "./Iconos.jsx";

/** Banner de exito o error reutilizable. */
export default function Mensaje({ tipo, texto }) {
  if (!texto) return null;
  const esOk = tipo === "ok";
  return (
    <div className={`mensaje mensaje--${esOk ? "ok" : "error"} aparecer`} role="alert">
      {esOk ? <IconoCheck /> : <IconoAlerta />}
      <span>{texto}</span>
    </div>
  );
}
