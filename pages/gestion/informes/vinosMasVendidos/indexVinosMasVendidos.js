import { useState } from "react";
import { FaHome, FaArrowLeft, FaSearch } from "react-icons/fa";
import { useRouter } from "next/router";

const { default: Link } = require("next/link");

const getRankingClass = (ranking) => {
  if (ranking === 1) return 'rank-oro';
  if (ranking === 2) return 'rank-plata';
  if (ranking === 3) return 'rank-bronce';
  return 'rank-normal';
};

const indexVinosMasVendidos = () => {
  const router = useRouter();
  const [filtros, setFiltros] = useState({ fechaInicio: '', fechaFin: '', top: '10' });
  const [vinos, setVinos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [orden, setOrden] = useState({ campo: 'ranking', asc: true });

  const inputChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    setCargando(true);
    setBuscado(true);
    try {
      const params = new URLSearchParams({ top: filtros.top });
      if (filtros.fechaInicio) params.append('fechaInicio', filtros.fechaInicio);
      if (filtros.fechaFin)    params.append('fechaFin',    filtros.fechaFin);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVentaDetalle/mas-vendidos?${params}`
      );
      const response = await res.json();
      if (!res.ok || !response.ok) {
        alert(response.message || '❌ Error al obtener datos');
        return;
      }
      setVinos(response.data);
    } catch (error) {
      console.error(error);
      alert('❌ Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const toggleOrden = (campo) => {
    setOrden(prev => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const vinosOrdenados = [...vinos].sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;
    let aVal = a[campo];
    let bVal = b[campo];
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();
    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });

  const totalUnidades  = vinos.reduce((acc, v) => acc + v.cantidadVendida, 0);
  const totalImporte   = vinos.reduce((acc, v) => acc + v.importeTotal, 0);
  const thClass = (campo) => orden.campo === campo ? 'th-activo' : '';

  return (
    <>
      <div className="box">
        <h1 className="titulo-index">Vinos Más Vendidos</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon" title="Volver al menú">
            <Link href="/"><FaHome /></Link>
          </button>
        </div>

        {/* FILTROS */}
        <div className="filtros-wrapper">
          <div className="filtros-box">
            <div className="campo-fecha">
              <label>Fecha inicio</label>
              <input type="date" name="fechaInicio" value={filtros.fechaInicio} onChange={inputChange} />
            </div>
            <div className="campo-fecha">
              <label>Fecha fin</label>
              <input type="date" name="fechaFin" value={filtros.fechaFin} onChange={inputChange} />
            </div>
            <div className="campo-top">
              <label>Mostrar</label>
              <select name="top" value={filtros.top} onChange={inputChange} className="select-top">
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
                <option value="todos">Todos</option>
              </select>
            </div>
            <button className="btn-buscar" onClick={fetchData} disabled={cargando}>
              <FaSearch /> {cargando ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        {/* CARDS RESUMEN */}
        {buscado && !cargando && (
          <div className="resumen-container">
            <div className="card-stat verde">
              <span className="stat-titulo">Productos distintos</span>
              <span className="stat-valor">{vinos.length}</span>
            </div>
            <div className="card-stat azul">
              <span className="stat-titulo">Unidades vendidas</span>
              <span className="stat-valor">{totalUnidades.toLocaleString('es-AR')}</span>
            </div>
            <div className="card-stat dorado">
              <span className="stat-titulo">Importe total</span>
              <span className="stat-valor">${totalImporte.toLocaleString('es-AR')}</span>
            </div>
          </div>
        )}

        {/* ESTADO */}
        {cargando && <div className="cargando-wrap"><p className="cargando">Buscando...</p></div>}

        {!cargando && buscado && vinos.length === 0 && (
          <div className="sin-datos">No se encontraron ventas para el período seleccionado.</div>
        )}

        {/* TABLA */}
        {!cargando && vinosOrdenados.length > 0 && (
          <div className="tabla-wrapper">
            <div className="tabla-scroll">
              <table>
                <thead>
                  <tr>
                    <th className={thClass('ranking')} onClick={() => toggleOrden('ranking')}>#</th>
                    <th className={thClass('nombre')} onClick={() => toggleOrden('nombre')}>Vino ⬍</th>
                    <th className={thClass('bodega')} onClick={() => toggleOrden('bodega')}>Bodega ⬍</th>
                    <th className={thClass('varietal')} onClick={() => toggleOrden('varietal')}>Varietal ⬍</th>
                    <th className={thClass('tipo')} onClick={() => toggleOrden('tipo')}>Tipo ⬍</th>
                    <th className={thClass('volumen')} onClick={() => toggleOrden('volumen')}>Volumen ⬍</th>
                    <th className={thClass('cantidadVendida')} onClick={() => toggleOrden('cantidadVendida')}>Unidades ⬍</th>
                    <th className={thClass('importeTotal')} onClick={() => toggleOrden('importeTotal')}>Importe ⬍</th>
                    <th className={thClass('nroComprobantes')} onClick={() => toggleOrden('nroComprobantes')}>Ventas ⬍</th>
                  </tr>
                </thead>
                <tbody>
                  {vinosOrdenados.map(({ ranking, productoID, nombre, bodega, varietal, tipo, volumen, cantidadVendida, importeTotal, nroComprobantes }) => (
                    <tr key={productoID}>
                      <td data-label="#">
                        <span className={`rank-badge ${getRankingClass(ranking)}`}>{ranking}</span>
                      </td>
                      <td data-label="Vino" className="td-nombre">{nombre}</td>
                      <td data-label="Bodega">{bodega}</td>
                      <td data-label="Varietal">{varietal}</td>
                      <td data-label="Tipo">{tipo}</td>
                      <td data-label="Volumen">{volumen}</td>
                      <td data-label="Unidades">
                        <span className={`cant-badge ${ranking === 1 ? 'cant-top' : 'cant-normal'}`}>
                          {cantidadVendida.toLocaleString('es-AR')}
                        </span>
                      </td>
                      <td data-label="Importe" className="td-importe">
                        ${importeTotal.toLocaleString('es-AR')}
                      </td>
                      <td data-label="Ventas">{nroComprobantes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!buscado && (
          <div className="sin-datos">
            Seleccioná los filtros y presioná Buscar para ver el ranking.
          </div>
        )}
      </div>

      <style jsx>{`

        /* ── FILTROS ─────────────────────────────── */
        .filtros-wrapper {
          display: flex;
          justify-content: center;
          margin: 20px 0 16px;
          padding: 0 12px;
        }

        .filtros-box {
          background: #1a1a1a;
          border: 1px solid rgba(255,255,255,0.09);
          padding: 20px 28px;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.45);
          display: flex;
          align-items: flex-end;
          gap: 20px;
          flex-wrap: wrap;
        }

        .campo-fecha, .campo-top {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .campo-fecha label, .campo-top label {
          color: #9ca3af;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .campo-fecha input[type="date"],
        .select-top {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #374151;
          background: #111827;
          color: #fff;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        .campo-fecha input[type="date"]:focus,
        .select-top:focus {
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.2);
        }

        .btn-buscar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 20px;
          background: #4f46e5;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          white-space: nowrap;
        }

        .btn-buscar:hover:not(:disabled) {
          background: #4338ca;
          transform: translateY(-1px);
        }

        .btn-buscar:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          max-width: 220px;
          padding: 16px 20px;
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          box-shadow: 0 6px 20px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .verde  { background: linear-gradient(135deg, #065f46, #047857); }
        .azul   { background: linear-gradient(135deg, #1d4ed8, #1e40af); }
        .dorado { background: linear-gradient(135deg, #92400e, #b45309); }

        .stat-titulo {
          font-size: 0.72rem;
          color: rgba(255,255,255,0.8);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .stat-valor {
          font-size: 1.7rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.1;
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
          min-width: 750px;
        }

        thead {
          background: #0f172a;
        }

        thead th {
          padding: 13px 14px;
          text-align: center;
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

        tbody tr:last-child { border-bottom: none; }
        tbody tr:hover { background: rgba(255,255,255,0.04); }

        tbody td {
          padding: 11px 14px;
          font-size: 0.875rem;
          color: #d1d5db;
          vertical-align: middle;
          text-align: center;
        }

        .td-nombre {
          font-weight: 600;
          color: #f3f4f6;
        }

        .td-importe {
          font-weight: 600;
          color: #34d399;
        }

        /* Badges ranking */
        .rank-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .rank-oro    { background: rgba(234,179,8,0.25);  color: #fde047; border: 1px solid rgba(253,224,71,0.4); }
        .rank-plata  { background: rgba(148,163,184,0.2); color: #cbd5e1; border: 1px solid rgba(203,213,225,0.35); }
        .rank-bronce { background: rgba(180,83,9,0.25);   color: #fb923c; border: 1px solid rgba(251,146,60,0.35); }
        .rank-normal { background: rgba(75,85,99,0.2);    color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }

        /* Badge cantidad */
        .cant-badge {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 999px;
          font-size: 0.82rem;
          font-weight: 700;
        }

        .cant-top    { background: rgba(5,150,105,0.2); color: #34d399; border: 1px solid rgba(52,211,153,0.35); }
        .cant-normal { background: rgba(75,85,99,0.15); color: #d1d5db; border: 1px solid rgba(156,163,175,0.2); }

        /* Cargando / sin datos */
        .cargando-wrap {
          display: flex;
          justify-content: center;
          padding: 48px;
        }

        .cargando { color: #6b7280; font-size: 15px; }

        .sin-datos {
          text-align: center;
          color: #6b7280;
          padding: 48px 24px;
          font-size: 15px;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.06);
          margin: 0 12px 32px;
        }

        /* ── MOBILE: cards por fila ──────────────── */
        @media (max-width: 768px) {
          .filtros-box {
            flex-direction: column;
            align-items: stretch;
            width: 100%;
            box-sizing: border-box;
          }

          .btn-buscar {
            justify-content: center;
          }

          .tabla-wrapper {
            background: transparent;
            box-shadow: none;
            border: none;
            margin: 0 8px 32px;
          }

          .tabla-scroll { overflow-x: visible; }

          table { display: block; min-width: unset; }

          thead { display: none; }

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

          tbody tr:hover { background: #131f2f; }

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

          .card-stat { min-width: 120px; }
          .stat-valor { font-size: 1.4rem; }
        }
      `}</style>
    </>
  );
};

export default indexVinosMasVendidos;
