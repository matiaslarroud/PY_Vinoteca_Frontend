import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function indexGestion() {
  return (
  <>
  <h1 className="titulo-pagina">Gestion</h1>
   <div className="botonera">
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>             
  </div>
  <div className="menu-grid">
      <Link href="./ubicaciones/indexUbicaciones" className="boton-acceso">
          <span>Gestion ubicaciones</span>
      </Link>
      <Link href="./vinos/indexVinos" className="boton-acceso">
          <span>Gestion vinos</span>
      </Link>
      <Link href="./general/indexGeneral" className="boton-acceso">
          <span>Gestion general</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
