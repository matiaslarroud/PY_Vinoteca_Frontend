import Link from "next/link";

export default function indexGestion() {
  return (
  <>
  <h1 className="titulo-pagina">Gestion</h1>

  <div className="menu-grid">
      <div className="boton-acceso">
        <Link href="bodega/indexBodega">
          <span>Bodega</span>
        </Link>
      </div>
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
  </div>

  <style jsx>{`
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
