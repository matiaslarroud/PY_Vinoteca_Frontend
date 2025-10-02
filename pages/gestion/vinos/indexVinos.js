import Link from "next/link";
import { FaHome , FaArrowLeft } from "react-icons/fa";
import { useRouter } from 'next/router';

export default function indexGestion() {
  const router = useRouter();
  return (
  <>
  <h1 className="titulo-pagina">Gestion</h1>
  <div className="botonera">
      <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
        <FaArrowLeft />
      </button>
      <button className="btn-icon"title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
      </button>             
    </div>
  <div className="menu-grid">
    <Link href="bodega/indexBodega" className="boton-acceso">
      <span>Bodega</span>
    </Link>
    <Link href="bodega_paraje/indexParaje" className="boton-acceso">
      <span>Paraje Bodega</span>
    </Link>
    <Link href="vino_crianza/indexCrianza" className="boton-acceso">
      <span>Crianza</span>
    </Link>
    <Link href="vino_tipo/indexVinoTipo" className="boton-acceso">
      <span>Tipo Vino</span>
    </Link>
    <Link href="vino_uva/indexUva" className="boton-acceso">
      <span>Uva</span>
    </Link>
    <Link href="vino_varietal/indexVarietal" className="boton-acceso">
      <span>Varietal</span>
    </Link>
    <Link href="vino_volumen/indexVolumen" className="boton-acceso">
      <span>Volumen</span>
    </Link>
  </div>

  <style jsx>{`
  `}
  </style>
</>
  );
}
