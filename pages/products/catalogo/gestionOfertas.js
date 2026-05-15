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
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState("");
  const [soloEnOferta, setSoloEnOferta] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setProductos(d.data);
      });
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
      setMensaje({ tipo: "error", texto: `❌ "${prod.name}": ingresá un precio de oferta válido.` });
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
        setMensaje({ tipo: "ok", texto: `✔️ "${prod.name}" actualizado.` });
      } else {
        setMensaje({ tipo: "error", texto: data.message });
      }
    } catch {
      setMensaje({ tipo: "error", texto: "❌ Error de conexión." });
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
    return coincideNombre && coincideOferta;
  });

  return (
    <div className="gestion-ofertas">
      <h1 className="titulo-index">Gestión de Ofertas</h1>

      {mensaje && (
        <div
          className={`alerta ${mensaje.tipo}`}
          onClick={() => setMensaje(null)}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="barra-filtros">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={soloEnOferta}
            onChange={(e) => setSoloEnOferta(e.target.checked)}
          />
          Solo en oferta
        </label>
      </div>

      <div className="tabla-wrapper">
        <table className="tabla-ofertas">
          <thead>
            <tr>
              <th>#</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Precio normal</th>
              <th>En oferta</th>
              <th>Precio de oferta</th>
              <th>Descuento</th>
              <th>Guardar</th>
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
                  <td className="col-id">{prod._id}</td>
                  <td className="col-nombre">{prod.name}</td>
                  <td>
                    <span
                      className="badge-tipo"
                      style={{ background: TIPO_COLOR[prod.tipoProducto] }}
                    >
                      {TIPO_LABEL[prod.tipoProducto] ?? prod.tipoProducto}
                    </span>
                  </td>
                  <td className="col-precio">$ {precioNormal.toFixed(2)}</td>
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
                  <td>
                    <button
                      className={`btn-guardar ${hayPendiente ? "activo" : ""}`}
                      disabled={!hayPendiente || guardando[prod._id]}
                      onClick={() => guardar(prod)}
                    >
                      {guardando[prod._id] ? "..." : "Guardar"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {lista.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#666" }}>
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .gestion-ofertas {
          padding: 20px;
        }
        .alerta {
          padding: 12px 18px;
          border-radius: 8px;
          margin-bottom: 16px;
          cursor: pointer;
          font-size: 0.9rem;
        }
        .alerta.ok { background: #1a3a1a; color: #69f06b; border: 1px solid #2e7d32; }
        .alerta.error { background: #3a1a1a; color: #f06b6b; border: 1px solid #7d2e2e; }
        .barra-filtros {
          display: flex;
          gap: 16px;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .barra-filtros input[type="text"] {
          background: #1f1f1f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 8px 14px;
          color: #fff;
          font-size: 14px;
          width: 260px;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #aaa;
          font-size: 14px;
          cursor: pointer;
        }
        .tabla-wrapper {
          overflow-x: auto;
        }
        .tabla-ofertas {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .tabla-ofertas th {
          background: #111;
          padding: 10px 14px;
          text-align: left;
          color: #888;
          font-weight: 600;
          border-bottom: 1px solid #222;
        }
        .tabla-ofertas td {
          padding: 10px 14px;
          border-bottom: 1px solid #1e1e1e;
          vertical-align: middle;
        }
        .tabla-ofertas tr:hover td { background: #1a1a1a; }
        .fila-oferta td { background: #1a0a0a; }
        .fila-oferta:hover td { background: #220d0d !important; }
        .col-id { color: #555; width: 60px; }
        .col-nombre { font-weight: 500; color: #eee; max-width: 220px; }
        .badge-tipo {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          white-space: nowrap;
        }
        .col-precio { color: #aaa; white-space: nowrap; }
        .col-toggle { text-align: center; }
        .col-precio-oferta input {
          background: #1f1f1f;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 6px 10px;
          color: #fff;
          width: 110px;
          font-size: 13px;
        }
        .col-precio-oferta input:disabled { opacity: 0.35; cursor: not-allowed; }
        .col-precio-oferta input:focus { outline: none; border-color: #8b0000; }
        .badge-descuento {
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }
        .badge-descuento.positivo { background: #1a3a1a; color: #69f06b; }
        .badge-descuento.negativo { background: #3a1a1a; color: #f06b6b; }
        .badge-descuento.neutro { color: #555; background: transparent; }
        /* Toggle switch */
        .switch { position: relative; display: inline-block; width: 40px; height: 22px; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
          position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background: #333; border-radius: 22px; transition: 0.3s;
        }
        .slider:before {
          position: absolute; content: "";
          height: 16px; width: 16px; left: 3px; bottom: 3px;
          background: #fff; border-radius: 50%; transition: 0.3s;
        }
        input:checked + .slider { background: #8b0000; }
        input:checked + .slider:before { transform: translateX(18px); }
        /* Guardar button */
        .btn-guardar {
          padding: 6px 16px; border-radius: 6px; border: none;
          background: #333; color: #666; cursor: not-allowed;
          font-size: 13px; transition: all 0.2s;
        }
        .btn-guardar.activo {
          background: #8b0000; color: #fff; cursor: pointer;
        }
        .btn-guardar.activo:hover { background: #a30000; }
      `}</style>
    </div>
  );
}
