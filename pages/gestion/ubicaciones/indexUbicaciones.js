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
      <div className="boton-acceso">
        <Link href="pais/indexPais" className="boton-acceso">
          <span>Pais</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="provincia/indexProvincia" className="boton-acceso">
          <span>Provincia</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="localidad/indexLocalidad" className="boton-acceso">
          <span>Localidad</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="barrio/indexBarrio" className="boton-acceso">
          <span>Barrio</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="calle/indexCalle" className="boton-acceso">
          <span>Calle</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="deposito/indexDeposito" className="boton-acceso">
          <span>Deposito</span>
        </Link>
      </div>
  </div>

  <style jsx>{`
    .botonera {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin: 2rem auto;
    }

    .btn-icon {
      background-color: #8b0000;
      color: white;
      padding: 0.8rem;
      font-size: 1.2rem;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      width: 3.2rem;
      height: 3.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.3s, transform 0.2s;
    }
    
    .btn-icon:hover {
      background-color: #a30000;
      transform: translateY(-3px);
    }
    
    button {
        background-color: #8B0000;
        color: white;
        font-size: 1.1rem;
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .titulo-pagina {
      font-size: 3rem;
      color: white;
      text-align: center;
      margin-top: 60px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
    }
    .menu-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      padding: 40px;
      max-width: 1000px;
      margin: 0 auto;
    }

    .boton-acceso {
      display: flex;
      background-color:rgba(42, 39, 39,.7);
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 2rem;
      padding: 30px
    }
    .boton-acceso:hover {
      background-color: #a30000;
      transform: translateY(-5px);
    }
    .icono {
      font-size: 3rem;
      margin-bottom: 12px;
    }
  `}
  </style>
</>
  );
}
