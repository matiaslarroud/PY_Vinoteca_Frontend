import Link from "next/link";
import { FaHome , FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/router';

export default function indexUbicaciones() {
  const router = useRouter();
  return (
  <>
  <h1 className="titulo-index">Gestion General</h1>
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
      <Link href="pais/indexPais" className="boton-acceso">
        <span>Paises</span>
      </Link>
      <Link href="provincia/indexProvincia" className="boton-acceso">
        <span>Provincias</span>
      </Link>
      <Link href="localidad/indexLocalidad" className="boton-acceso">
        <span>Localidades</span>
      </Link>
      <Link href="barrio/indexBarrio" className="boton-acceso">
        <span>Barrios</span>
      </Link>
      <Link href="calle/indexCalle" className="boton-acceso">
        <span>Calles</span>
      </Link>
      <Link href="bodega/indexBodega" className="boton-acceso">
        <span>Bodegas</span>
      </Link>
      <Link href="bodega_paraje/indexParaje" className="boton-acceso">
        <span>Parajes</span>
      </Link>
      <Link href="vino_crianza/indexCrianza" className="boton-acceso">
        <span>Crianzas de Vino</span>
      </Link>
      <Link href="vino_volumen/indexVolumen" className="boton-acceso">
        <span>Volumenes</span>
      </Link>
      <Link href="vino_tipo/indexVinoTipo" className="boton-acceso">
        <span>Tipos de Vino</span>
      </Link>
      <Link href="vino_uva/indexUva" className="boton-acceso">
        <span>Uvas</span>
      </Link>
      <Link href="vino_varietal/indexVarietal" className="boton-acceso">
        <span>Varietales</span>
      </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
