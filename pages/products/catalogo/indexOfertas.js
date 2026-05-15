import { useEffect, useState } from "react";

const TIPO_LABEL = {
  ProductoVino: "Vino",
  ProductoPicada: "Picada",
  ProductoInsumo: "Insumo",
};

export default function VitranaOfertas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("");
  const [orden, setOrden] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/ofertas`)
      .then((r) => r.json())
      .then((d) => {
        if (d.ok) setProductos(d.productos);
      })
      .finally(() => setCargando(false));
  }, []);

  const vista = productos
    .filter((p) => {
      const coincideNombre = busqueda
        ? p.name.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      const coincideTipo = tipoFiltro ? p.tipoProducto === tipoFiltro : true;
      return coincideNombre && coincideTipo;
    })
    .sort((a, b) => {
      if (orden === "desc-asc") return a.descuento - b.descuento;
      if (orden === "desc-desc") return b.descuento - a.descuento;
      if (orden === "precio-asc") return a.precioOferta - b.precioOferta;
      if (orden === "precio-desc") return b.precioOferta - a.precioOferta;
      if (orden === "alfa") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="vitrina">
      <div className="vitrina-header">
        <div className="header-inner">
          <h1 className="titulo-index">🏷️ Vitrina de Ofertas</h1>
          <div className="header-accent" />
          {!cargando && (
            <span className="pill-contador">
              {productos.length} producto{productos.length !== 1 ? "s" : ""} en promoción
            </span>
          )}
        </div>
      </div>

      <div className="panel-filtros">
        <div className="filtro">
          <span className="filtro-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="filtro">
          <span className="filtro-icon">📦</span>
          <select value={tipoFiltro} onChange={(e) => setTipoFiltro(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="ProductoVino">Vinos</option>
            <option value="ProductoInsumo">Insumos</option>
            <option value="ProductoPicada">Picadas</option>
          </select>
        </div>
        <div className="filtro">
          <span className="filtro-icon">↕️</span>
          <select value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="">Ordenar por...</option>
            <option value="desc-desc">Mayor descuento primero</option>
            <option value="desc-asc">Menor descuento primero</option>
            <option value="precio-asc">Precio oferta ↑</option>
            <option value="precio-desc">Precio oferta ↓</option>
            <option value="alfa">A - Z</option>
          </select>
        </div>
      </div>

      {cargando && (
        <div className="skeleton-grid">
          {[...Array(8)].map((_, i) => (
            <div className="skeleton-card" key={i}>
              <div className="skeleton-img" />
              <div className="skeleton-body">
                <div className="skeleton-line short" />
                <div className="skeleton-line" />
                <div className="skeleton-line medium" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!cargando && vista.length === 0 && (
        <div className="sin-resultados">
          <span className="sin-resultados-icon">🏷️</span>
          <p>No hay productos en oferta en este momento.</p>
        </div>
      )}

      <div className="grid">
        {vista.map((prod) => (
          <div
            className={`card${prod.stock === 0 ? " sin-stock-card" : ""}`}
            key={prod._id}
          >
            {prod.descuento > 0 && (
              <div className="badge-descuento">-{prod.descuento}%</div>
            )}

            {prod.stock === 0 && (
              <div className="overlay-agotado">
                <span>AGOTADO</span>
              </div>
            )}

            <div className="img-wrapper">
              {prod.imagen ? (
                <img src={prod.imagen} alt={prod.name} />
              ) : (
                <div className="sin-imagen">
                  {prod.tipoProducto === "ProductoVino"
                    ? "🍷"
                    : prod.tipoProducto === "ProductoPicada"
                    ? "🧀"
                    : "📦"}
                </div>
              )}
            </div>

            <div className="card-body">
              <span
                className="badge-tipo"
                style={{
                  background:
                    prod.tipoProducto === "ProductoVino"
                      ? "#8b0000"
                      : prod.tipoProducto === "ProductoPicada"
                      ? "#1565c0"
                      : "#2e7d32",
                }}
              >
                {TIPO_LABEL[prod.tipoProducto] ?? prod.tipoProducto}
              </span>

              <h3 title={prod.name}>{prod.name}</h3>

              <p className={`stock ${prod.stock === 0 ? "sin-stock" : ""}`}>
                Stock:{" "}
                <strong>{prod.stock === 0 ? "Sin stock" : prod.stock}</strong>
              </p>

              <div className="precios">
                <span className="precio-original">
                  $ {prod.precioOriginal.toFixed(2)}
                </span>
                <span className="precio-oferta">
                  $ {prod.precioOferta.toFixed(2)}
                </span>
              </div>

              {prod.descuento > 0 && (
                <p className="ahorro">
                  Ahorrás ${" "}
                  {(prod.precioOriginal - prod.precioOferta).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .vitrina {
          padding: 20px 24px;
        }

        /* ── Header ── */
        .vitrina-header {
          margin-bottom: 28px;
        }
        .header-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .header-accent {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #8b0000, #c0392b);
          border-radius: 2px;
          margin-top: -6px;
        }
        .pill-contador {
          display: inline-block;
          background: #1e1e1e;
          border: 1px solid #2a2a2a;
          color: #aaa;
          font-size: 0.82rem;
          padding: 4px 14px;
          border-radius: 20px;
        }

        /* ── Filtros ── */
        .panel-filtros {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          background: #161616;
          border: 1px solid #222;
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 32px;
        }
        .filtro {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #1f1f1f;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          padding: 0 12px;
          transition: border-color 0.2s;
        }
        .filtro:focus-within {
          border-color: #8b0000;
        }
        .filtro-icon {
          font-size: 14px;
          flex-shrink: 0;
          opacity: 0.7;
        }
        .filtro input,
        .filtro select {
          background: transparent;
          border: none;
          padding: 10px 0;
          color: #fff;
          width: 100%;
          font-size: 14px;
        }
        .filtro input:focus,
        .filtro select:focus {
          outline: none;
        }
        .filtro select option {
          background: #1f1f1f;
        }

        /* ── Skeleton ── */
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .skeleton-card {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
        }
        .skeleton-img {
          height: 170px;
          background: linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        .skeleton-body {
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          width: 100%;
        }
        .skeleton-line.short { width: 40%; }
        .skeleton-line.medium { width: 65%; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Sin resultados ── */
        .sin-resultados {
          text-align: center;
          padding: 4rem;
          color: #444;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .sin-resultados-icon {
          font-size: 3rem;
          opacity: 0.3;
        }
        .sin-resultados p {
          font-size: 0.95rem;
        }

        /* ── Grid y Cards ── */
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }
        .card {
          background: #1e1e1e;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          border: 1px solid #2a2a2a;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
          animation: fadeInCard 0.3s ease both;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: #8b0000;
          box-shadow: 0 8px 24px rgba(139, 0, 0, 0.2);
        }
        .sin-stock-card {
          opacity: 0.6;
        }
        @keyframes fadeInCard {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Overlay agotado ── */
        .overlay-agotado {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .overlay-agotado span {
          background: rgba(0, 0, 0, 0.65);
          color: #ff6b6b;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 3px;
          padding: 5px 14px;
          border-radius: 4px;
          border: 1px solid rgba(255, 107, 107, 0.4);
          transform: rotate(-15deg);
        }

        /* ── Badge descuento ── */
        .badge-descuento {
          position: absolute;
          top: 10px;
          right: 10px;
          background: #8b0000;
          color: #fff;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          z-index: 1;
          box-shadow: 0 0 10px rgba(139, 0, 0, 0.6);
        }

        /* ── Imagen ── */
        .img-wrapper {
          height: 170px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #141414;
          border-bottom: 1px solid #222;
        }
        .img-wrapper img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
        .sin-imagen {
          font-size: 3.5rem;
          opacity: 0.25;
        }

        /* ── Card body ── */
        .card-body {
          padding: 14px;
        }
        .badge-tipo {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 8px;
        }
        h3 {
          margin: 0 0 6px;
          font-size: 15px;
          font-weight: 600;
          color: #eee;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .stock {
          font-size: 12px;
          color: #666;
          margin: 0 0 10px;
        }
        .sin-stock strong {
          color: #ff6b6b;
        }
        .precios {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .precio-original {
          font-size: 13px;
          color: #555;
          text-decoration: line-through;
        }
        .precio-oferta {
          font-size: 20px;
          font-weight: 700;
          color: #69f06b;
        }
        .ahorro {
          font-size: 11px;
          color: #4caf50;
          margin: 6px 0 0;
        }
      `}</style>
    </div>
  );
}
