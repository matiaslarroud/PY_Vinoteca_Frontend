import { useEffect, useState } from "react";
import { FaHome, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/router";

const { default: Link } = require("next/link");

const getDiasBadgeClass = (dias) => {
  if (dias === null) return 'badge-nunca';
  if (dias > 180) return 'badge-critico';
  if (dias > 90)  return 'badge-alto';
  return 'badge-medio';
};

const indexClientesInactivos = () => {
  const router = useRouter();
  const [dias, setDias] = useState(30);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [orden, setOrden] = useState({ campo: 'diasSinComprar', asc: false });

  const fetchData = async (d) => {
    if (!d || d < 1) return;
    setCargando(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/inactivos?dias=${d}`
      );
      const response = await res.json();
      if (!res.ok || !response.ok) {
        alert(response.message || '❌ Error al obtener datos');
        return;
      }
      setClientes(response.data);
    } catch (error) {
      console.error(error);
      alert('❌ Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData(dias);
  }, [dias]);

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const clientesOrdenados = [...clientes].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    let aVal = a[campo];
    let bVal = b[campo];
    if (aVal === null) return 1;
    if (bVal === null) return -1;
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });

  const thClass = (campo) =>
    orden.campo === campo ? 'th-activo' : '';

  return (
    <>
      <div className="box">
        <h1 className="titulo-index">Clientes Inactivos</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon" title="Volver al menú">
            <Link href="/"><FaHome /></Link>
          </button>
        </div>

        {/* FILTRO */}
        <div className="filtro-container">
          <div className="filtro-box">
            <span className="filtro-label">Días sin compra</span>
            <input
              type="number"
              min={1}
              value={dias}
              onChange={(e) => setDias(Number(e.target.value))}
              className="input-dias"
            />
          </div>
        </div>

        {/* CARD RESUMEN */}
        <div className="resumen-container">
          <div className="card-stat azul">
            <span className="stat-titulo">Clientes inactivos</span>
            <span className="stat-valor">{clientes.length}</span>
          </div>
          <div className="card-stat rojo">
            <span className="stat-titulo">Críticos (+180 días)</span>
            <span className="stat-valor">
              {clientes.filter(c => c.diasSinComprar > 180 || c.diasSinComprar === null).length}
            </span>
          </div>
          <div className="card-stat naranja">
            <span className="stat-titulo">Sin compras nunca</span>
            <span className="stat-valor">
              {clientes.filter(c => c.diasSinComprar === null).length}
            </span>
          </div>
        </div>

        {/* TABLA */}
        {cargando ? (
          <div className="cargando-wrap">
            <p className="cargando">Cargando...</p>
          </div>
        ) : clientesOrdenados.length === 0 ? (
          <div className="sin-datos">No hay clientes inactivos con ese criterio.</div>
        ) : (
          <div className="tabla-wrapper">
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th className={thClass('clienteID')} onClick={() => toggleOrden('clienteID')}>ID ⬍</th>
                    <th className={thClass('nombre')} onClick={() => toggleOrden('nombre')}>Nombre ⬍</th>
                    <th className={thClass('email')} onClick={() => toggleOrden('email')}>Email ⬍</th>
                    <th className={thClass('telefono')} onClick={() => toggleOrden('telefono')}>Teléfono ⬍</th>
                    <th className={thClass('fechaUltimaCompra')} onClick={() => toggleOrden('fechaUltimaCompra')}>Última Compra ⬍</th>
                    <th className={thClass('diasSinComprar')} onClick={() => toggleOrden('diasSinComprar')}>Días inactivo ⬍</th>
                    <th className={thClass('totalHistorico')} onClick={() => toggleOrden('totalHistorico')}>Total Histórico ⬍</th>
                    <th className={thClass('cuentaCorriente')} onClick={() => toggleOrden('cuentaCorriente')}>Cta. Cte. ⬍</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesOrdenados.map(({ clienteID, nombre, email, telefono, fechaUltimaCompra, diasSinComprar, totalHistorico, cuentaCorriente }) => (
                    <tr key={clienteID}>
                      <td data-label="ID">{clienteID}</td>
                      <td data-label="Nombre" className="td-nombre">{nombre}</td>
                      <td data-label="Email"><a href={`mailto:${email}`} className="link-email">{email}</a></td>
                      <td data-label="Teléfono">{telefono}</td>
                      <td data-label="Última Compra">{fechaUltimaCompra || <span className="nunca">Sin compras</span>}</td>
                      <td data-label="Días inactivo">
                        <span className={`dias-badge ${getDiasBadgeClass(diasSinComprar)}`}>
                          {diasSinComprar !== null ? `${diasSinComprar} días` : '—'}
                        </span>
                      </td>
                      <td data-label="Total Histórico" className="td-total">
                        ${totalHistorico.toLocaleString('es-AR')}
                      </td>
                      <td data-label="Cta. Cte.">
                        <span className={`badge-cc ${cuentaCorriente ? 'cc-si' : 'cc-no'}`}>
                          {cuentaCorriente ? 'Sí' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`

        /* ── FILTRO ──────────────────────────────── */
        .filtro-container {
          display: flex;
          justify-content: center;
          margin: 20px 0 16px;
        }

        .filtro-box {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.09);
          padding: 18px 28px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .filtro-label {
          color: #d1d5db;
          font-size: 14px;
          font-weight: 500;
        }

        .input-dias {
          width: 80px;
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #111827;
          color: #fff;
          font-size: 15px;
          outline: none;
          text-align: center;
          transition: border-color 0.2s;
        }

        .input-dias:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.25);
        }

        /* ── CARDS RESUMEN ───────────────────────── */
        .resumen-container {
          display: flex;
          gap: 14px;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 24px;
          padding: 0 12px;
        }

        .card-stat {
          flex: 1;
          min-width: 140px;
          max-width: 200px;
          padding: 16px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .azul  { background: linear-gradient(135deg, #1d4ed8, #1e40af); }
        .rojo  { background: linear-gradient(135deg, #b91c1c, #991b1b); }
        .naranja { background: linear-gradient(135deg, #b45309, #92400e); }

        .stat-titulo {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .stat-valor {
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        /* ── TABLA FLOTANTE ──────────────────────── */
        .tabla-wrapper {
          margin: 0 12px 40px;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow:
            0 10px 40px rgba(0,0,0,0.55),
            0 0 0 1px rgba(255,255,255,0.04) inset;
          overflow: hidden;
        }

        .tabla-scroll {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 700px;
        }

        thead {
          background: #0f172a;
        }

        thead th {
          padding: 13px 16px;
          text-align: left;
          color: #6b7280;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: color 0.15s;
        }

        thead th:hover, thead th.th-activo {
          color: #e5e7eb;
        }

        tbody tr {
          border-bottom: 1px solid rgba(255,255,255,0.05);
          transition: background 0.12s;
        }

        tbody tr:last-child {
          border-bottom: none;
        }

        tbody tr:hover {
          background: rgba(255,255,255,0.04);
        }

        tbody td {
          padding: 12px 16px;
          font-size: 0.875rem;
          color: #d1d5db;
          vertical-align: middle;
        }

        .td-nombre {
          font-weight: 600;
          color: #f3f4f6;
        }

        .td-total {
          font-weight: 600;
          color: #34d399;
        }

        .link-email {
          color: #60a5fa;
          text-decoration: none;
        }

        .link-email:hover {
          text-decoration: underline;
        }

        .nunca {
          color: #6b7280;
          font-style: italic;
          font-size: 0.82rem;
        }

        /* Badges días */
        .dias-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.78rem;
          font-weight: 700;
        }

        .badge-critico {
          background: rgba(220,38,38,0.2);
          color: #f87171;
          border: 1px solid rgba(248,113,113,0.35);
        }

        .badge-alto {
          background: rgba(217,119,6,0.2);
          color: #fbbf24;
          border: 1px solid rgba(251,191,36,0.35);
        }

        .badge-medio {
          background: rgba(79,70,229,0.2);
          color: #a5b4fc;
          border: 1px solid rgba(165,180,252,0.35);
        }

        .badge-nunca {
          background: rgba(107,114,128,0.2);
          color: #9ca3af;
          border: 1px solid rgba(156,163,175,0.3);
        }

        /* Badge cta cte */
        .badge-cc {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .cc-si {
          background: rgba(5,150,105,0.2);
          color: #34d399;
          border: 1px solid rgba(52,211,153,0.3);
        }

        .cc-no {
          background: rgba(75,85,99,0.25);
          color: #9ca3af;
          border: 1px solid rgba(156,163,175,0.2);
        }

        /* Cargando / Sin datos */
        .cargando-wrap {
          display: flex;
          justify-content: center;
          padding: 48px;
        }

        .cargando {
          color: #6b7280;
          font-size: 15px;
        }

        .sin-datos {
          text-align: center;
          color: #6b7280;
          padding: 48px;
          font-size: 15px;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          margin: 0 12px;
        }

        /* ── MOBILE: cards por fila ──────────────── */
        @media (max-width: 768px) {
          .tabla-wrapper {
            background: transparent;
            box-shadow: none;
            border: none;
            margin: 0 8px 32px;
          }

          .tabla-scroll {
            overflow-x: visible;
          }

          table {
            display: block;
            min-width: unset;
          }

          thead {
            display: none;
          }

          tbody {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          tbody tr {
            display: block;
            background: #111827;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,0.08);
            box-shadow: 0 4px 20px rgba(0,0,0,0.45);
            padding: 14px 16px;
            border-bottom: none;
          }

          tbody tr:hover {
            background: #131f2f;
          }

          tbody td {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 7px 0;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            font-size: 0.85rem;
          }

          tbody td:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }

          tbody td::before {
            content: attr(data-label);
            color: #6b7280;
            font-size: 0.7rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            flex-shrink: 0;
            margin-right: 10px;
          }

          .filtro-box {
            width: 100%;
            justify-content: space-between;
            box-sizing: border-box;
          }

          .card-stat {
            min-width: 100px;
          }

          .stat-valor {
            font-size: 1.6rem;
          }
        }
      `}</style>
    </>
  );
};

export default indexClientesInactivos;
