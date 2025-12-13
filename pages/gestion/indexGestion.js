import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function indexGestion() {
  return (
  <>
  <h1 className="titulo-index">Gestion</h1>
   <div className="botonera">
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>             
  </div>
  <div className="menu-grid">
      <Link href="./tablasVarias/indexGeneral" className="boton-acceso">
          <span>Tablas Varias</span>
      </Link>
      <Link href="./deposito/indexDeposito" className="boton-acceso">
          <span>Deposito</span>
      </Link>
      <Link href="./empleado/indexEmpleado" className="boton-acceso">
          <span>Empleado</span>
      </Link>
      <Link href="./transporte/indexTransporte" className="boton-acceso">
          <span>Transporte</span>
      </Link>
      <Link href="./usuario/indexUsuario" className="boton-acceso">
          <span>Usuario</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
