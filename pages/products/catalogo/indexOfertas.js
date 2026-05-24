import { useEffect, useState } from "react";

const TIPO_LABEL = {
  ProductoVino: "Vino",
  ProductoPicada: "Picada",
  ProductoInsumo: "Insumo",
};

const TIPO_COLOR_RGB = {
  ProductoVino:   [139,   0,   0],
  ProductoPicada: [ 21, 101, 192],
  ProductoInsumo: [ 46, 125,  50],
};

export default function VitranaOfertas() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("ProductoVino");
  const [filtroVino, setFiltroVino] = useState({ bodega: "", tipo: "", proveedor: "", varietal: "" });
  const [orden, setOrden] = useState("");
  const [exportando, setExportando] = useState(false);
  const [bodegas, setBodegas] = useState([]);
  const [tiposVino, setTiposVino] = useState([]);
  const [varietales, setVarietales] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  useEffect(() => {
    const BASE = process.env.NEXT_PUBLIC_BACKEND_URL;
    Promise.all([
      fetch(`${BASE}/products/productFoto/ofertas`).then((r) => r.json()),
      fetch(`${BASE}/gestion/products`).then((r) => r.json()),
    ]).then(([ofertasData, todosData]) => {
      if (ofertasData.ok && todosData.ok) {
        const mapaCompleto = {};
        for (const p of todosData.data) mapaCompleto[p._id] = p;
        const merged = ofertasData.productos.map((p) => ({
          ...p,
          bodega:    mapaCompleto[p._id]?.bodega    ?? null,
          tipo:      mapaCompleto[p._id]?.tipo      ?? null,
          varietal:  mapaCompleto[p._id]?.varietal  ?? null,
          proveedor: mapaCompleto[p._id]?.proveedor ?? null,
        }));
        setProductos(merged);
      }
    }).finally(() => setCargando(false));

    fetch(`${BASE}/gestion/bodega`).then((r) => r.json()).then((d) => { if (d.data) setBodegas(d.data); });
    fetch(`${BASE}/gestion/tipoVino`).then((r) => r.json()).then((d) => { if (d.data) setTiposVino(d.data); });
    fetch(`${BASE}/gestion/varietal`).then((r) => r.json()).then((d) => { if (d.data) setVarietales(d.data); });
    fetch(`${BASE}/gestion/proveedor`).then((r) => r.json()).then((d) => { if (d.data) setProveedores(d.data); });
  }, []);

  const vista = productos
    .filter((p) => {
      const coincideNombre = busqueda
        ? p.name.toLowerCase().includes(busqueda.toLowerCase())
        : true;
      const coincideTipo = tipoFiltro ? p.tipoProducto === tipoFiltro : true;

    let coincideFiltrosEspecificos = true;
    if (p.tipoProducto === "ProductoVino") {
      if (filtroVino.bodega    && String(p.bodega)    !== filtroVino.bodega)    coincideFiltrosEspecificos = false;
      if (filtroVino.tipo      && String(p.tipo)      !== filtroVino.tipo)      coincideFiltrosEspecificos = false;
      if (filtroVino.varietal  && String(p.varietal)  !== filtroVino.varietal)  coincideFiltrosEspecificos = false;
      if (filtroVino.proveedor && String(p.proveedor) !== filtroVino.proveedor) coincideFiltrosEspecificos = false;
    }

      return coincideNombre && coincideTipo && coincideFiltrosEspecificos;
    })
    .sort((a, b) => {
      if (orden === "desc-asc") return a.descuento - b.descuento;
      if (orden === "desc-desc") return b.descuento - a.descuento;
      if (orden === "precio-asc") return a.precioOferta - b.precioOferta;
      if (orden === "precio-desc") return b.precioOferta - a.precioOferta;
      if (orden === "alfa") return a.name.localeCompare(b.name);
      return 0;
    });

  const exportarPDF = async () => {
    if (vista.length === 0) return;
    setExportando(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

      const W = 210, H = 297;
      const ML = 14, MR = 14;
      const CW = W - ML - MR;
      const ROW_H = 22;
      const HEADER_H = 40;
      const FOOTER_H = 14;
      const SUBHEADER_H = 14;
      const today = new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });

      const rowsPerFirstPage = Math.floor((H - HEADER_H - FOOTER_H - 6) / ROW_H);
      const rowsPerNextPage  = Math.floor((H - SUBHEADER_H - FOOTER_H - 6) / ROW_H);
      const totalPages = Math.ceil(
        Math.max(0, vista.length - rowsPerFirstPage) / rowsPerNextPage + 1
      );

      let page = 1;
      let y = 0;

      // ── Header principal ──────────────────────────────────────────
      const drawHeader = () => {
        doc.setFillColor(14, 14, 14);
        doc.rect(0, 0, W, HEADER_H - 4, "F");
        doc.setFillColor(139, 0, 0);
        doc.rect(0, HEADER_H - 4, W, 4, "F");

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
        doc.text("OFERTAS ESPECIALES", ML, 18);

        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(150, 150, 150);
        doc.text("Lista de precios en promoción", ML, 26);

        doc.setFontSize(8);
        doc.setTextColor(110, 110, 110);
        doc.text(today, W - MR, 14, { align: "right" });

        const pill = `${vista.length} producto${vista.length !== 1 ? "s" : ""} en oferta`;
        const pillW = doc.getTextWidth(pill) + 8;
        doc.setFillColor(30, 30, 30);
        doc.roundedRect(W - MR - pillW, 19, pillW, 7, 2, 2, "F");
        doc.setFontSize(7.5);
        doc.setTextColor(160, 160, 160);
        doc.text(pill, W - MR - pillW / 2, 24, { align: "center" });

        y = HEADER_H + 4;
      };

      // ── Sub-header para páginas 2+ ─────────────────────────────
      const drawSubHeader = () => {
        doc.setFillColor(14, 14, 14);
        doc.rect(0, 0, W, SUBHEADER_H - 2, "F");
        doc.setFillColor(139, 0, 0);
        doc.rect(0, SUBHEADER_H - 2, W, 2, "F");
        doc.setFontSize(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(200, 200, 200);
        doc.text("OFERTAS ESPECIALES", ML, 9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(today, W - MR, 9, { align: "right" });
        y = SUBHEADER_H + 4;
      };

      // ── Footer ────────────────────────────────────────────────────
      const drawFooter = (pageNum) => {
        doc.setFillColor(14, 14, 14);
        doc.rect(0, H - FOOTER_H, W, FOOTER_H, "F");
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(90, 90, 90);
        doc.text("Precios sujetos a cambios sin previo aviso.", ML, H - 5);
        doc.text(`Página ${pageNum} de ${totalPages}`, W - MR, H - 5, { align: "right" });
      };

      // ── Fila de producto ──────────────────────────────────────────
      const drawRow = (prod, idx) => {
        const tc = TIPO_COLOR_RGB[prod.tipoProducto] || [80, 80, 80];
        const isEven = idx % 2 === 0;

        // Fondo alternado
        doc.setFillColor(isEven ? 250 : 255, isEven ? 250 : 255, isEven ? 250 : 255);
        doc.rect(ML, y, CW, ROW_H, "F");

        // Barra lateral de color de tipo
        doc.setFillColor(...tc);
        doc.rect(ML, y, 4.5, ROW_H, "F");

        // Número de ítem
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(190, 190, 190);
        doc.text(String(idx + 1).padStart(2, "0"), ML + 7, y + 8);

        // Nombre
        doc.setFontSize(10.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(25, 25, 25);
        const nameStr = doc.splitTextToSize(prod.name, 85)[0];
        doc.text(nameStr, ML + 15, y + 9);

        // Tipo + stock
        const tipoLabel = (TIPO_LABEL[prod.tipoProducto] ?? prod.tipoProducto).toUpperCase();
        doc.setFontSize(6.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...tc);
        doc.text(tipoLabel, ML + 15, y + 16);

        doc.setFont("helvetica", "normal");
        if (prod.stock === 0) {
          doc.setTextColor(200, 50, 50);
          doc.text("· SIN STOCK", ML + 15 + doc.getTextWidth(tipoLabel) + 1.5, y + 16);
        } else {
          doc.setTextColor(140, 140, 140);
          doc.text(`· Stock: ${prod.stock}`, ML + 15 + doc.getTextWidth(tipoLabel) + 1.5, y + 16);
        }

        // ── Área de precios (derecha) ──
        const priceAreaX = W - MR;

        // Precio de oferta
        doc.setFontSize(13);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(46, 125, 50);
        doc.text(`$ ${prod.precioOferta.toFixed(2)}`, priceAreaX, y + 10, { align: "right" });

        // Precio original tachado
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(170, 170, 170);
        const origStr = `$ ${prod.precioOriginal.toFixed(2)}`;
        const origX = priceAreaX - 38;
        doc.text(origStr, origX, y + 10, { align: "right" });
        const origW = doc.getTextWidth(origStr);
        doc.setDrawColor(160, 160, 160);
        doc.setLineWidth(0.25);
        doc.line(origX - origW, y + 9.2, origX, y + 9.2);

        // Badge de descuento
        if (prod.descuento > 0) {
          const badgeTxt = `-${prod.descuento}%`;
          const badgeW = doc.getTextWidth(badgeTxt) + 5;
          const badgeX = priceAreaX - 50 - badgeW;
          doc.setFillColor(139, 0, 0);
          doc.roundedRect(badgeX, y + 3, badgeW, 7, 1.5, 1.5, "F");
          doc.setFontSize(7.5);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(255, 255, 255);
          doc.text(badgeTxt, badgeX + badgeW / 2, y + 8, { align: "center" });
        }

        // Ahorro
        if (prod.descuento > 0) {
          const saving = (prod.precioOriginal - prod.precioOferta).toFixed(2);
          doc.setFontSize(7);
          doc.setFont("helvetica", "normal");
          doc.setTextColor(76, 175, 80);
          doc.text(`Ahorrás $${saving}`, priceAreaX, y + 17, { align: "right" });
        }

        // Separador
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.1);
        doc.line(ML + 4.5, y + ROW_H, ML + CW, y + ROW_H);

        y += ROW_H;
      };

      // ── Renderizado ───────────────────────────────────────────────
      drawHeader();

      vista.forEach((prod, idx) => {
        const isFirstPage = page === 1;
        const rowsInThisPage = isFirstPage ? rowsPerFirstPage : rowsPerNextPage;
        const rowsUsedBefore = isFirstPage ? 0 : rowsPerFirstPage + (page - 2) * rowsPerNextPage;
        const posInPage = idx - rowsUsedBefore;

        if (idx > 0 && posInPage === 0) {
          drawFooter(page);
          doc.addPage();
          page++;
          drawSubHeader();
        }

        drawRow(prod, idx);
      });

      drawFooter(page);

      const filename = `ofertas-${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(filename);
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="vitrina">
      <div className="vitrina-header">
        <div className="header-inner">
          <h1 className="titulo-index">Vitrina de Ofertas</h1>
          <div className="header-actions">
            {!cargando && (
              <span className="pill-contador">
                {vista.length} producto{vista.length !== 1 ? "s" : ""} en pantalla
              </span>
            )}
            <button
              className="btn-exportar"
              onClick={exportarPDF}
              disabled={exportando || vista.length === 0}
              title="Exportar productos visibles a PDF"
            >
              {exportando ? (
                <span className="export-spinner" />
              ) : (
                <svg viewBox="0 0 20 20" fill="none" width="15" height="15">
                  <path d="M10 3v9M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14v1a2 2 0 002 2h10a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              )}
              {exportando ? "Generando..." : "Exportar PDF"}
            </button>
          </div>
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
        {tipoFiltro === "ProductoVino" && (
          <>
            <div className="filtro">
              <select
                value={filtroVino.bodega}
                onChange={(e) => setFiltroVino((p) => ({ ...p, bodega: e.target.value }))}
              >
                <option value="">Todas las bodegas</option>
                {bodegas.map((b) => <option key={b._id} value={String(b._id)}>{b.name}</option>)}
              </select>
            </div>
            <div className="filtro">
              <select
                value={filtroVino.tipo}
                onChange={(e) => setFiltroVino((p) => ({ ...p, tipo: e.target.value }))}
              >
                <option value="">Todos los tipos</option>
                {tiposVino.map((t) => <option key={t._id} value={String(t._id)}>{t.name}</option>)}
              </select>
            </div>
            <div className="filtro">
              <select
                value={filtroVino.varietal}
                onChange={(e) => setFiltroVino((p) => ({ ...p, varietal: e.target.value }))}
              >
                <option value="">Todos los varietales</option>
                {varietales.map((v) => <option key={v._id} value={String(v._id)}>{v.name}</option>)}
              </select>
            </div>
            <div className="filtro">
              <select
                value={filtroVino.proveedor}
                onChange={(e) => setFiltroVino((p) => ({ ...p, proveedor: e.target.value }))}
              >
                <option value="">Todos los proveedores</option>
                {proveedores.map((pv) => <option key={pv._id} value={String(pv._id)}>{pv.name}</option>)}
              </select>
            </div>
          </>
        )}
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
        @media (max-width: 480px) {
          .header-inner { gap: 8px; }
        }
        .header-accent {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #8b0000, #c0392b);
          border-radius: 2px;
          margin-top: -6px;
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
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
        .btn-exportar {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          border-radius: 8px;
          border: 1px solid #2a2a2a;
          background: #1a1a1a;
          color: #ccc;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-exportar:hover:not(:disabled) {
          background: #8b0000;
          border-color: #a30000;
          color: #fff;
          box-shadow: 0 2px 12px #8b000044;
        }
        .btn-exportar:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .export-spinner {
          display: inline-block;
          width: 13px;
          height: 13px;
          border: 2px solid #ffffff33;
          border-top-color: #ccc;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

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
        @media (max-width: 480px) {
          .grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
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

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .vitrina { padding: 14px 12px; }
          .vitrina-header { margin-bottom: 18px; }
          .panel-filtros { padding: 12px; gap: 10px; margin-bottom: 20px; }
          .skeleton-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .skeleton-img { height: 120px; }
          .img-wrapper { height: 130px; }
          h3 { font-size: 13px; }
          .precio-oferta { font-size: 17px; }
          .card-body { padding: 10px; }
          .badge-tipo { font-size: 10px; padding: 2px 8px; }
          .badge-descuento { font-size: 11px; padding: 3px 8px; }
          .btn-exportar { padding: 7px 12px; font-size: 12px; }
          .sin-resultados { padding: 2rem; }
        }
      `}</style>
    </div>
  );
}
