import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function indexGestion() {
  return (
  <>
  <h1 className="titulo-index">Informes</h1>
   <div className="botonera">
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>             
  </div>
  <div className="menu-grid">
      <Link href="./caja/indexCaja" className="boton-acceso">
          <span>Movimientos totales</span>
      </Link>
      <Link href="./registroVenta/indexRegistroVenta" className="boton-acceso">
          <span>Registro de ventas</span>
      </Link>
      <Link href="./registroCuentaCorriente/indexCuentaCorriente" className="boton-acceso">
          <span>Registro de cuentas corriente</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
