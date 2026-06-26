import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FaBox , FaUserFriends, FaTruck , FaCashRegister, FaShoppingCart  } from "react-icons/fa";
import LowStockGrid from "@/components/lowStock-grid";
import NewNotaPedido from "./clientes/notaPedido/newNotaPedido";

export default function Home() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [mostrarModalNotaPedido, setMostrarModalNotaPedido] = useState(false);

  const cargarProductos = () => {
    if (usuario?.rol === "administrador") {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/lowStock`)
        .then((res) => res.json())
        .then((data) => setLowStockProducts(data.data))
        .catch(console.error);
    }
  };

  useEffect(() => {
    const sesion = sessionStorage.getItem("usuario");
    if (!sesion) {
      router.push("/login");
      return;
    }
    setUsuario(JSON.parse(sesion));
  }, []);

  useEffect(() => {
    if (!usuario) return;

    if (usuario.rol === "vendedor") {
      router.push("/clientes/indexClientes");
      return;
    }

    if (usuario.rol === "cliente") {
      router.push("/tienda");
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
      {mostrarModalNotaPedido && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setMostrarModalNotaPedido(false)}>&times;</button>
            <NewNotaPedido exito={() => setMostrarModalNotaPedido(false)} />
          </div>
        </div>
      )}

      <div className="header">
        <h1>Bienvenido, {usuario.usuario}</h1>
        <button className="btn-notaPedido" onClick={() => setMostrarModalNotaPedido(true)}>
          <FaShoppingCart /> Nueva Nota Pedido
        </button>
      </div>

      <h2 className="titulo-index">Entusiasmo por el Vino</h2>
      <br/>
      <div className="menu-grid">
        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="boton-acceso">
            <Link href="/products/indexProducts">
              <FaBox  className="icono" /><br/>
              <span>Productos</span>
            </Link>
          </div>
        )}

        <div className="boton-acceso">
          <Link href="/clientes/indexClientes">
            <FaUserFriends className="icono" /><br/>
            <span>Clientes</span>
          </Link>
        </div>

        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="boton-acceso">
            <Link href="/proveedores/indexProveedor">
              <FaTruck className="icono" /><br/>
              <span>Proveedores</span>
            </Link>
          </div>
        )}

        {/* 🔒 Solo administrador puede ver caja */}
        {usuario.rol === "administrador" && (
          <div className="boton-acceso">
            <Link href="/gestion/informes/indexInformes">
              <FaCashRegister  className="icono" /><br/>
              <span>Informes</span>
            </Link>
          </div>
        )}
      </div>
      
      <div className="lowstock-container">
        {/* 🔒 Solo administrador puede ver proveedores */}
        {usuario.rol === "administrador" && (
          <div className="lowstock-wrapper">
            <LowStockGrid
              products={lowStockProducts}
              title="Productos con Stock Bajo"
              recargar={cargarProductos} 
            />
          </div>
        )}
      </div>

      <style jsx>{`
        .lowstock-container {
          width: 100%;
          max-width: 900px; /* controla el ancho máximo */
          margin: 20px auto;
          padding: 10px;
          display: flex;
          justify-content: center;
        }


        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          color: white;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .header h1 {
          font-size: clamp(1.2rem, 4vw, 2rem);
          margin: 0;
        }

        .lowstock-wrapper{
          width:100%
        }

        .btn-notaPedido {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #a30000;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 10px 20px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .btn-notaPedido:hover {
          background: #c70000;
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .btn-notaPedido {
            width: 100%;
            justify-content: center;
          }
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
