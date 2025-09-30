import { useEffect, useState } from "react";
import { FaWineGlassAlt, FaCog , FaUserFriends, FaTruck, FaClipboardList, FaChartBar } from "react-icons/fa";
import Link from "next/link";
import LowStockGrid from "@/components/lowStock-grid";

export default function Home() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/lowStock`)
      .then((res) => {return res.json()})
        .then((s) => {
          console.log(s.data)
          setLowStockProducts(s.data)
        }
      )
      .catch((err) => console.error(err));
  }, []);

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
      {/* <div className="boton-acceso">
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
      </div> */}
  </div>
  <div className="menu-grid">
    <div className="lowstock-wrapper">
      <LowStockGrid
        products={lowStockProducts}
        title="Productos con Stock Bajo"
      />
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

    .lowstock-wrapper {
      width: 100%;
      display: flex;
      justify-content: center; /* Centra horizontalmente el grid */
      margin-top: 40px;
    }
    
    .boton-acceso {
      display: flex;
      flex-direction: column; /* Ícono arriba, texto abajo */
      align-items: center;
      justify-content: center;

      background: linear-gradient(145deg, rgba(42, 39, 39, 0.9), rgba(25, 23, 23, 0.8));
      color: white;
      font-size: 1.5rem;
      padding: 30px;

      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);

      cursor: pointer;
      text-align: center;
      transition: all 0.3s ease;
    }

    .boton-acceso:hover {
      background: linear-gradient(145deg, #a30000, #c70000);
      transform: translateY(-6px) scale(1.02);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
    }

    .icono {
      font-size: 3rem;
      margin-bottom: 10px; /* separa icono del texto */
    }

  `}
  </style>
</>
  );
}
