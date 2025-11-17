import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaWineGlassAlt, FaUserFriends, FaTruck } from "react-icons/fa";
import LowStockGrid from "@/components/lowStock-grid";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  useEffect(() => {
    const sesion = sessionStorage.getItem("usuario");
    if (!sesion) {
      router.push("/login");
      return;
    }
    setUsuario(JSON.parse(sesion));

    // // Cargar productos con stock bajo
    // fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/lowStock`)
    //   .then((res) => res.json())
    //   .then((data) => setLowStockProducts(data.data))
    //   .catch(console.error);
  }, []);

  useEffect(() => {
    if (!usuario) return;

    if (usuario.rol === "vendedor") {
      router.push("/clientes/indexClientes");
      return;
    }

    // Si es administrador, cargar stock bajo
    if (usuario.rol === "administrador") {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/lowStock`)
        .then((res) => res.json())
        .then((data) => setLowStockProducts(data.data))
        .catch(console.error);
    }
  }, [usuario]);

  if (!usuario) return null;

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    router.push("/login");
  };

  return (
    <>
      <div className="header">
        <h1>Bienvenido, {usuario.usuario}</h1>
      </div>

      <h2 className="titulo-pagina">Entusiasmo por el Vino</h2>
      <br/>
      <div className="menu-grid">
        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="boton-acceso">
            <Link href="/products/indexProducts">
              <FaTruck className="icono" />
              <span>Productos</span>
            </Link>
          </div>
        )}

        <div className="boton-acceso">
          <Link href="/clientes/indexClientes">
            <FaUserFriends className="icono" />
            <span>Clientes</span>
          </Link>
        </div>

        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="boton-acceso">
            <Link href="/proveedores/indexProveedor">
              <FaTruck className="icono" />
              <span>Proveedores</span>
            </Link>
          </div>
        )}
      </div>
      
      <div className="menu-grid">
        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="lowstock-wrapper">
            <LowStockGrid
              products={lowStockProducts}
              title="Productos con Stock Bajo"
            />
          </div>
        )}
        
      </div>

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          color: white;
        }
        button {
          background: #a30000;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          cursor: pointer;
        }
        button:hover {
          background: #c70000;
        }
        .titulo-pagina {
          font-size: 2.5rem;
          color: white;
          text-align: center;
          margin-top: 20px;
        }
      `}</style>
    </>
  );
}
