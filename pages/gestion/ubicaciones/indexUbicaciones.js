import Link from "next/link";
import { FaHome , FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/router';

export default function indexUbicaciones() {
  const router = useRouter();
  return (
  <>
  <h1 className="titulo-pagina">Gestion Ubicaciones</h1>
   <div className="botonera">
    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
        <FaArrowLeft />
    </button>
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>             
  </div>
  <div className="menu-grid">
      <Link href="pais/indexPais" className="boton-acceso">
          <span>Pais</span>
      </Link>
      <Link href="provincia/indexProvincia" className="boton-acceso">
          <span>Provincia</span>
      </Link>
      <Link href="localidad/indexLocalidad" className="boton-acceso">
          <span>Localidad</span>
      </Link>
      <Link href="barrio/indexBarrio" className="boton-acceso">
          <span>Barrio</span>
      </Link>
      <Link href="calle/indexCalle" className="boton-acceso">
          <span>Calle</span>
      </Link>
      <Link href="deposito/indexDeposito" className="boton-acceso">
          <span>Deposito</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
