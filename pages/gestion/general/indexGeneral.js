import Link from "next/link";
import { FaHome , FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/router';

export default function indexUbicaciones() {
  const router = useRouter();
  return (
  <>
  <h1 className="titulo-pagina">Gestion General</h1>
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
      <Link href="medioPago/indexMedioPago" className="boton-acceso">
        <span>Medios de Pago</span>
      </Link>
      <Link href="iva/indexCondicionIva" className="boton-acceso">
        <span>Condiciones de IVA</span>
      </Link>
      <Link href="tipoComprobante/indexTipo" className="boton-acceso">
        <span>Tipos de Comprobante</span>
      </Link>
      <Link href="empleado/indexEmpleado" className="boton-acceso">
        <span>Empleados</span>
      </Link>
      <Link href="transporte/indexTransporte" className="boton-acceso">
        <span>Transportes</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
