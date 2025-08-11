import { FaWineGlassAlt, FaCog , FaUserFriends, FaTruck, FaClipboardList, FaChartBar } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
  <>
  <h1 className="titulo-pagina">Entusiasmo por el Vino</h1>

  <div className="menu-grid">
      <div className="boton-acceso">
        <Link href="/products/indexProducts">
          <FaWineGlassAlt className="icono" />
          <span>Productos</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="/clientes/indexClientes" className="boton-acceso">
          <FaUserFriends className="icono" />
          <span>Clientes</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="/proveedores/indexProveedor" className="boton-acceso">
          <FaTruck className="icono" />
          <span>Proveedores</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="/gestion/createBodega" className="boton-acceso">
          <FaChartBar className="icono" />
          <span>Reportes</span>
        </Link>
      </div>
      <div className="boton-acceso">
        <Link href="/gestion/indexGestion" className="boton-acceso">
          <FaCog className="icono" />
          <span>Gestion</span>
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
