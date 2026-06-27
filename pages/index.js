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
  const [vinosMasVendidos, setVinosMasVendidos] = useState([]);
  const [clientesInactivos, setClientesInactivos] = useState([]);
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

    // Si es administrador, cargar stock bajo + mini-dashboard
    if (usuario.rol === "administrador") {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/lowStock`)
        .then((res) => res.json())
        .then((data) => setLowStockProducts(data.data))
        .catch(console.error);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVentaDetalle/mas-vendidos?top=5`)
        .then(r => r.json()).then(d => setVinosMasVendidos(d.data || [])).catch(console.error);

      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/inactivos?dias=30`)
        .then(r => r.json()).then(d => setClientesInactivos((d.data || []).slice(0, 5))).catch(console.error);
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

      {usuario.rol === "administrador" && (
        <div className="dashboard-container">

          <div className="dash-panel">
            <div className="dash-header">
              <span className="dash-titulo">Top 5 Vinos más vendidos</span>
              <Link href="/gestion/informes/vinosMasVendidos/indexVinosMasVendidos" className="dash-link">Ver completo →</Link>
            </div>
            <table className="dash-table">
              <thead>
                <tr><th>#</th><th>Vino</th><th>Bodega</th><th>Unidades</th></tr>
              </thead>
              <tbody>
                {vinosMasVendidos.map(v => (
                  <tr key={v.productoID}>
                    <td>
                      <span className={`rank-dot rank-${v.ranking <= 3 ? ['oro','plata','bronce'][v.ranking-1] : 'normal'}`}>{v.ranking}</span>
                    </td>
                    <td className="td-nombre">{v.nombre}</td>
                    <td>{v.bodega}</td>
                    <td><span className="cant">{v.cantidadVendida}</span></td>
                  </tr>
                ))}
                {vinosMasVendidos.length === 0 && (
                  <tr><td colSpan={4} className="td-empty">Sin datos en los últimos 30 días</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="dash-panel">
            <div className="dash-header">
              <span className="dash-titulo">Top 5 Clientes Inactivos (+30 días)</span>
              <Link href="/gestion/informes/clientesInactivos/indexClientesInactivos" className="dash-link">Ver completo →</Link>
            </div>
            <table className="dash-table">
              <thead>
                <tr><th>Nombre</th><th>Días sin comprar</th></tr>
              </thead>
              <tbody>
                {clientesInactivos.map(c => (
                  <tr key={c.clienteID}>
                    <td className="td-nombre">{c.nombre}</td>
                    <td>
                      <span className={`dias-badge ${c.diasSinComprar > 180 ? 'critico' : c.diasSinComprar > 90 ? 'alto' : c.diasSinComprar === null ? 'nunca' : 'medio'}`}>
                        {c.diasSinComprar !== null ? `${c.diasSinComprar}d` : '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {clientesInactivos.length === 0 && (
                  <tr><td colSpan={2} className="td-empty">Sin clientes inactivos</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      <style jsx>{`
        .lowstock-container {
          width: 100%;
          max-width: 900px;
          margin: 24px auto 16px;
          padding: 0 10px;
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

        /* ── MINI DASHBOARD ──────────────────────── */
        .dashboard-container {
          display: flex;
          gap: 16px;
          max-width: 900px;
          margin: 0 auto 32px;
          padding: 0 10px;
          flex-wrap: wrap;
        }

        .dash-panel {
          flex: 1;
          min-width: 280px;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
          overflow: hidden;
        }

        .dash-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #0f172a;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .dash-titulo { color: #e5e7eb; font-size: 0.8rem; font-weight: 700; }

        .dash-link { color: #60a5fa; font-size: 0.72rem; text-decoration: none; }
        .dash-link:hover { text-decoration: underline; }

        .dash-table { width: 100%; border-collapse: collapse; }

        .dash-table thead th {
          padding: 8px 12px;
          text-align: center;
          color: #6b7280;
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dash-table tbody tr {
          border-top: 1px solid rgba(255,255,255,0.05);
          transition: background 0.1s;
          height: 41px;
        }
        .dash-table tbody tr:hover { background: rgba(255,255,255,0.04); }

        .dash-table tbody td {
          padding: 0 12px;
          font-size: 0.8rem;
          color: #d1d5db;
          text-align: center;
          height: 41px;
        }

        .td-nombre {
          text-align: left;
          font-weight: 600;
          color: #f3f4f6;
          max-width: 160px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .td-empty { color: #4b5563; font-style: italic; padding: 16px; }

        .rank-dot {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
        }
        .rank-oro    { background: rgba(234,179,8,0.2);   color: #fde047; }
        .rank-plata  { background: rgba(148,163,184,0.2); color: #cbd5e1; }
        .rank-bronce { background: rgba(180,83,9,0.2);    color: #fb923c; }
        .rank-normal { background: rgba(75,85,99,0.2);    color: #9ca3af; }

        .cant { font-weight: 700; color: #34d399; }

        .dias-badge {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 700;
        }
        .critico { background: rgba(220,38,38,0.2);   color: #f87171; border: 1px solid rgba(248,113,113,0.3); }
        .alto    { background: rgba(217,119,6,0.2);   color: #fbbf24; border: 1px solid rgba(251,191,36,0.3);  }
        .medio   { background: rgba(79,70,229,0.2);   color: #a5b4fc; border: 1px solid rgba(165,180,252,0.3); }
        .nunca   { background: rgba(107,114,128,0.2); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
      `}</style>
    </>
  );
}
