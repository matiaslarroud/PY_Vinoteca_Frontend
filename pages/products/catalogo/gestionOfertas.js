import { useEffect, useState } from "react";

const TIPO_LABEL = {
  ProductoVino: "Vino",
  ProductoPicada: "Picada",
  ProductoInsumo: "Insumo",
};

const TIPO_COLOR = {
  ProductoVino: "#8b0000",
  ProductoPicada: "#1565c0",
  ProductoInsumo: "#2e7d32",
};

function calcularPrecio(prod) {
  if (prod.tipoProducto === "ProductoVino" || prod.tipoProducto === "ProductoInsumo") {
    if (prod.precioCosto != null && prod.ganancia != null) {
      return prod.precioCosto + (prod.precioCosto * prod.ganancia) / 100;
    }
    return 0;
  }
  return prod.precioVenta ?? 0;
}

export default function GestionOfertas() {
  const [productos, setProductos] = useState([]);
  const [pendientes, setPendientes] = useState({});
  const [guardando, setGuardando] = useState({});
  const [filtro, setFiltro] = useState("");
  const [soloEnOferta, setSoloEnOferta] = useState(false);
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [bodegas, setBodegas] = useState([]);
  const [tiposVino, setTiposVino] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const [filtroVino, setFiltroVino] = useState({ bodega: "", tipo: "", proveedor: "", varietal: "" });
  const [filtroInsumo, setFiltroInsumo] = useState({ deposito: "", proveedor: "" });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
      .then((r) => r.json())
      .then((d) => { if (d.ok) setProductos(d.data); });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setBodegas(d.data); });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setTiposVino(d.data); });
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
      .then((r) => r.json())
      .then((d) => { if (d.data) setDepositos(d.data); });
  }, []);

  const cambiarCampo = (id, campo, valor) => {
    setPendientes((prev) => ({
      ...prev,
      [id]: { ...prev[id], [campo]: valor },
    }));
  };

  const guardar = async (prod) => {
    const estado = pendientes[prod._id] ?? {};
    const enOferta = estado.enOferta !== undefined ? estado.enOferta : prod.enOferta;
    const precioOferta =
      estado.precioOferta !== undefined ? estado.precioOferta : prod.precioOferta;

    if (enOferta && (!precioOferta || Number(precioOferta) <= 0)) {
      alert(`${prod.name}: ingresá un precio de oferta válido.`);
      return;
    }

    setGuardando((prev) => ({ ...prev, [prod._id]: true }));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/oferta/${prod._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enOferta, precioOferta: enOferta ? Number(precioOferta) : null }),
        }
      );
      const data = await res.json();
      if (data.ok) {
        setProductos((prev) =>
          prev.map((p) =>
            p._id === prod._id
              ? { ...p, enOferta: data.data.enOferta, precioOferta: data.data.precioOferta }
              : p
          )
        );
        setPendientes((prev) => {
          const copia = { ...prev };
          delete copia[prod._id];
          return copia;
        });
        alert(data.message)
      } else {
        alert(data.message)
      }
    } catch (err){
      alert(err)
    } finally {
      setGuardando((prev) => ({ ...prev, [prod._id]: false }));
    }
  };

  const lista = productos.filter((p) => {
    const coincideNombre = filtro
      ? p.name.toLowerCase().includes(filtro.toLowerCase())
      : true;
    const enOfertaActual =
      pendientes[p._id]?.enOferta !== undefined
        ? pendientes[p._id].enOferta
        : p.enOferta;
    const coincideOferta = soloEnOferta ? enOfertaActual : true;
    const coincideTipo = tipoFiltro ? p.tipoProducto === tipoFiltro : true;

    let coincideFiltrosEspecificos = true;
    if (p.tipoProducto === "ProductoVino") {
      if (filtroVino.bodega && p.bodega !== filtroVino.bodega) coincideFiltrosEspecificos = false;
      if (filtroVino.tipo && p.tipo !== filtroVino.tipo) coincideFiltrosEspecificos = false;
      if (filtroVino.proveedor && !p.proveedor?.toLowerCase().includes(filtroVino.proveedor.toLowerCase())) coincideFiltrosEspecificos = false;
      if (filtroVino.varietal && !p.varietal?.toLowerCase().includes(filtroVino.varietal.toLowerCase())) coincideFiltrosEspecificos = false;
    }
    if (p.tipoProducto === "ProductoInsumo") {
      if (filtroInsumo.deposito && p.deposito !== filtroInsumo.deposito) coincideFiltrosEspecificos = false;
      if (filtroInsumo.proveedor && !p.proveedor?.toLowerCase().includes(filtroInsumo.proveedor.toLowerCase())) coincideFiltrosEspecificos = false;
    }

    return coincideNombre && coincideOferta && coincideTipo && coincideFiltrosEspecificos;
  });

  return (
    <div className="gestion-ofertas">
      <h1 className="titulo-index">Gestión de Ofertas</h1>

      <div className="botonera">
        <div className="search-wrapper">
          <svg className="search-icon" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <div className="tipo-tabs">
          {[
            { key: "", label: "Todos" },
            { key: "ProductoVino", label: "Vino" },
            { key: "ProductoInsumo", label: "Insumo" },
            { key: "ProductoPicada", label: "Picada" },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`tipo-tab ${tipoFiltro === key ? "activo" : ""}`}
              onClick={() => {
                setTipoFiltro(key);
                setFiltroVino({ bodega: "", tipo: "", proveedor: "", varietal: "" });
                setFiltroInsumo({ deposito: "", proveedor: "" });
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <label className="chip-toggle">
          <input
            type="checkbox"
            checked={soloEnOferta}
            onChange={(e) => setSoloEnOferta(e.target.checked)}
          />
          <span className="chip-inner">
            <span className="chip-dot" />
            Solo en oferta
          </span>
        </label>
      </div>

      {tipoFiltro === "ProductoVino" && (
        <div className="filtros-especificos">
          <select
            value={filtroVino.bodega}
            onChange={(e) => setFiltroVino((p) => ({ ...p, bodega: e.target.value }))}
          >
            <option value="">Todas las bodegas</option>
            {bodegas.map((b) => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
          <select
            value={filtroVino.tipo}
            onChange={(e) => setFiltroVino((p) => ({ ...p, tipo: e.target.value }))}
          >
            <option value="">Todos los tipos</option>
            {tiposVino.map((t) => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input
            type="text"
            placeholder="Varietal..."
            value={filtroVino.varietal}
            onChange={(e) => setFiltroVino((p) => ({ ...p, varietal: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Proveedor..."
            value={filtroVino.proveedor}
            onChange={(e) => setFiltroVino((p) => ({ ...p, proveedor: e.target.value }))}
          />
        </div>
      )}

      {tipoFiltro === "ProductoInsumo" && (
        <div className="filtros-especificos">
          <select
            value={filtroInsumo.deposito}
            onChange={(e) => setFiltroInsumo((p) => ({ ...p, deposito: e.target.value }))}
          >
            <option value="">Todos los depósitos</option>
            {depositos.map((d) => <option key={d._id} value={d._id}>{d.name}</option>)}
          </select>
          <input
            type="text"
            placeholder="Proveedor..."
            value={filtroInsumo.proveedor}
            onChange={(e) => setFiltroInsumo((p) => ({ ...p, proveedor: e.target.value }))}
          />
        </div>
      )}
      <div className="contenedor-tabla">
          <div className="tabla-scroll">
              <table id="tablaVinos">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Precio normal</th>
                    <th>En oferta</th>
                    <th>Precio oferta</th>
                    <th>Descuento</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((prod) => {
                    const estadoPend = pendientes[prod._id] ?? {};
                    const enOferta =
                      estadoPend.enOferta !== undefined ? estadoPend.enOferta : prod.enOferta;
                    const precioOferta =
                      estadoPend.precioOferta !== undefined
                        ? estadoPend.precioOferta
                        : prod.precioOferta ?? "";
                    const precioNormal = calcularPrecio(prod);
                    const descuento =
                      enOferta && precioOferta && precioNormal > 0
                        ? Math.round((1 - Number(precioOferta) / precioNormal) * 100)
                        : null;
                    const hayPendiente = prod._id in pendientes;

                    return (
                      <tr key={prod._id} className={enOferta ? "fila-oferta" : ""}>
                        <td className="col-nombre">
                          <div className="nombre-wrapper">
                            {enOferta && <span className="oferta-dot" title="En oferta" />}
                            <span>{prod.name}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className="badge-tipo"
                            style={{ "--tipo-color": TIPO_COLOR[prod.tipoProducto] }}
                          >
                            {TIPO_LABEL[prod.tipoProducto] ?? prod.tipoProducto}
                          </span>
                        </td>
                        <td className="col-precio">
                          <span className="precio-valor">$ {precioNormal.toFixed(2)}</span>
                        </td>
                        <td className="col-toggle">
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={enOferta}
                              onChange={(e) =>
                                cambiarCampo(prod._id, "enOferta", e.target.checked)
                              }
                            />
                            <span className="slider" />
                          </label>
                        </td>
                        <td className="col-precio-oferta">
                          <div className="input-precio-wrapper">
                            <span className="input-prefix">$</span>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              value={precioOferta}
                              disabled={!enOferta}
                              onChange={(e) =>
                                cambiarCampo(prod._id, "precioOferta", e.target.value)
                              }
                            />
                          </div>
                        </td>
                        <td className="col-descuento">
                          {descuento !== null ? (
                            <span className={`badge-descuento ${descuento > 0 ? "positivo" : "negativo"}`}>
                              {descuento > 0 ? `-${descuento}%` : `+${Math.abs(descuento)}%`}
                            </span>
                          ) : (
                            <span className="badge-descuento neutro">—</span>
                          )}
                        </td>
                        <td className="col-accion">
                          <button
                            className={`btn-guardar ${hayPendiente ? "activo" : ""}`}
                            disabled={!hayPendiente || guardando[prod._id]}
                            onClick={() => guardar(prod)}
                          >
                            {guardando[prod._id] ? (
                              <span className="spinner" />
                            ) : (
                              "Guardar"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {lista.length === 0 && (
                    <tr>
                      <td colSpan={7} className="empty-state">
                        <svg viewBox="0 0 48 48" fill="none">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5"/>
                          <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
                        </svg>
                        <span>No se encontraron productos</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
          </div>
        </div>

      

      <style jsx>{`
        .gestion-ofertas {
          padding: 28px 24px;
          max-width: 80%;
          margin: 0 auto;
        }
        /* Header */
        .page-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .page-subtitle {
          margin: 4px 0 0;
          font-size: 13px;
          color: #555;
        }
        /* Alerta */
        .alerta {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 16px;
          border-radius: 10px;
          margin-bottom: 20px;
          cursor: pointer;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          transition: opacity 0.15s;
        }
        .alerta:hover { opacity: 0.8; }
        .alerta.ok  { background: #0d1f0d; color: #5dd65f; border: 1px solid #1e4d1e; }
        .alerta.error { background: #1f0d0d; color: #e06060; border: 1px solid #4d1e1e; }
        .alerta-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .alerta.ok .alerta-icon   { background: #1e4d1e; }
        .alerta.error .alerta-icon { background: #4d1e1e; }
        /* Filtros */
        .barra-filtros {
          display: flex;
          gap: 12px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          width: 15px;
          height: 15px;
          color: #555;
          pointer-events: none;
        }
        .search-wrapper input {
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 10px;
          padding: 9px 14px 9px 36px;
          color: #e0e0e0;
          font-size: 13.5px;
          width: 280px;
          transition: border-color 0.2s;
        }
        .search-wrapper input::placeholder { color: #444; }
        .search-wrapper input:focus { outline: none; border-color: #8b0000; }
        /* Chip toggle */
        .chip-toggle { cursor: pointer; }
        .chip-toggle input { display: none; }
        .chip-inner {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid #2a2a2a;
          background: #141414;
          color: #666;
          font-size: 13px;
          transition: all 0.2s;
          user-select: none;
        }
        .chip-toggle input:checked ~ .chip-inner {
          border-color: #8b0000;
          color: #e08080;
          background: #1a0808;
        }
        .chip-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.5;
          transition: opacity 0.2s;
        }
        .chip-toggle input:checked ~ .chip-inner .chip-dot { opacity: 1; }
        /* Tabla */
        .tabla-wrapper {
          overflow-x: auto;
          border-radius: 14px;
          border: 1px solid #1e1e1e;
          background: #0f0f0f;
        }
        .tabla-ofertas {
          width: 100%;
          border-collapse: collapse;
          font-size: 13.5px;
        }
        .tabla-ofertas thead tr {
          border-bottom: 1px solid #1e1e1e;
        }
        .tabla-ofertas th {
          padding: 12px 18px;
          text-align: left;
          color: #444;
          font-weight: 600;
          font-size: 11.5px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: #0f0f0f;
        }
        .tabla-ofertas td {
          padding: 14px 18px;
          border-bottom: 1px solid #171717;
          vertical-align: middle;
        }
        .tabla-ofertas tbody tr:last-child td { border-bottom: none; }
        .tabla-ofertas tbody tr {
          transition: background 0.15s;
        }
        .tabla-ofertas tbody tr:hover td { background: #161616; }
        .fila-oferta td { background: #120808; }
        .fila-oferta:hover td { background: #180a0a !important; }
        /* Nombre */
        .col-nombre { color: #ddd; font-weight: 500; max-width: 240px; }
        .nombre-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .oferta-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c0392b;
          flex-shrink: 0;
          box-shadow: 0 0 6px #c0392b88;
        }
        /* Badge tipo */
        .badge-tipo {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
          background: color-mix(in srgb, var(--tipo-color) 80%, transparent);
          border: 1px solid color-mix(in srgb, var(--tipo-color) 60%, transparent);
          letter-spacing: 0.03em;
        }
        /* Precio */
        .col-precio { white-space: nowrap; }
        .precio-valor { color: #888; font-variant-numeric: tabular-nums; }
        /* Toggle */
        .col-toggle { text-align: center; }
        .switch { position: relative; display: inline-block; width: 38px; height: 21px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; inset: 0;
          background: #252525; border-radius: 21px; transition: 0.25s;
          border: 1px solid #333;
        }
        .slider:before {
          position: absolute; content: "";
          height: 15px; width: 15px; left: 3px; bottom: 2px;
          background: #555; border-radius: 50%; transition: 0.25s;
        }
        input:checked + .slider { background: #8b0000; border-color: #a30000; }
        input:checked + .slider:before { background: #fff; transform: translateX(16px); }
        /* Input precio oferta */
        .col-precio-oferta { min-width: 140px; }
        .input-precio-wrapper {
          display: flex;
          align-items: center;
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          overflow: hidden;
          width: 130px;
          transition: border-color 0.2s;
        }
        .input-precio-wrapper:focus-within { border-color: #8b0000; }
        .input-prefix {
          padding: 0 8px;
          color: #444;
          font-size: 13px;
          border-right: 1px solid #2a2a2a;
          line-height: 32px;
          background: #111;
          user-select: none;
        }
        .input-precio-wrapper input {
          background: transparent;
          border: none;
          padding: 7px 10px;
          color: #e0e0e0;
          width: 100%;
          font-size: 13px;
          font-variant-numeric: tabular-nums;
        }
        .input-precio-wrapper input:disabled { opacity: 0.3; cursor: not-allowed; }
        .input-precio-wrapper input:focus { outline: none; }
        /* Badge descuento */
        .col-descuento { white-space: nowrap; }
        .badge-descuento {
          display: inline-block;
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
          font-variant-numeric: tabular-nums;
        }
        .badge-descuento.positivo { background: #0d1f0d; color: #5dd65f; border: 1px solid #1a3d1a; }
        .badge-descuento.negativo { background: #1f0d0d; color: #e06060; border: 1px solid #3d1a1a; }
        .badge-descuento.neutro   { color: #333; background: transparent; }
        /* Botón guardar */
        .col-accion { text-align: right; }
        .btn-guardar {
          padding: 7px 18px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: #1a1a1a;
          color: #3a3a3a;
          cursor: not-allowed;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
          min-width: 80px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .btn-guardar.activo {
          background: #8b0000;
          border-color: #a30000;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 2px 12px #8b000044;
        }
        .btn-guardar.activo:hover { background: #a30000; box-shadow: 0 2px 16px #8b000066; }
        /* Spinner */
        .spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 2px solid #ffffff44;
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        /* Tipo tabs */
        .tipo-tabs {
          display: flex;
          gap: 4px;
          background: #111;
          border: 1px solid #222;
          border-radius: 10px;
          padding: 3px;
        }
        .tipo-tab {
          padding: 6px 14px;
          border-radius: 7px;
          border: none;
          background: transparent;
          color: #555;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.18s;
          white-space: nowrap;
        }
        .tipo-tab:hover { color: #aaa; background: #1a1a1a; }
        .tipo-tab.activo { background: #1e1e1e; color: #e0e0e0; border: 1px solid #2a2a2a; }
        .tipo-tab.activo[data-key="ProductoVino"] { color: #e08080; border-color: #8b000055; background: #1a0808; }
        /* Filtros específicos por tipo */
        .filtros-especificos {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 16px;
          padding: 14px 16px;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          animation: slideDown 0.18s ease;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .filtros-especificos select,
        .filtros-especificos input[type="text"] {
          background: #141414;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 7px 12px;
          color: #ddd;
          font-size: 13px;
          height: 34px;
          transition: border-color 0.2s;
          min-width: 160px;
        }
        .filtros-especificos select { cursor: pointer; }
        .filtros-especificos select option { background: #1a1a1a; }
        .filtros-especificos input[type="text"]::placeholder { color: #444; }
        .filtros-especificos select:focus,
        .filtros-especificos input[type="text"]:focus { outline: none; border-color: #8b0000; }
        /* Empty state */
        .empty-state {
          text-align: center;
          padding: 48px 0;
          color: #333;
        }
        .empty-state svg {
          display: block;
          margin: 0 auto 12px;
          width: 40px;
          height: 40px;
          color: #2a2a2a;
        }
        .empty-state span {
          display: block;
          font-size: 14px;
          color: #444;
        }
      `}</style>
    </div>
  );
}
