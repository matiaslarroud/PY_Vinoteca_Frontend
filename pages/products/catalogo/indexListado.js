import { useEffect, useState } from "react";

export default function Catalogo() {
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState([]);

  // filtros
  const [busqueda, setBusqueda] = useState("");
  const [tipoProducto, setTipoProducto] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  // orden
  const [orden, setOrden] = useState("");

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/catalogo`)
      .then(res => res.json())
      .then(data => {
        setProductos(data.productos);
        setVista(data.productos);
      });
  }, []);

  useEffect(() => {
    let resultado = [...productos];

    // 🔎 FILTROS
    if (busqueda) {
      resultado = resultado.filter(p =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }

    if (tipoProducto) {
      resultado = resultado.filter(p => p.tipoProducto === tipoProducto);
    }

    if (precioMax) {
      resultado = resultado.filter(p => p.precio <= Number(precioMax));
    }

    // 🔃 ORDENAMIENTO
    switch (orden) {
      case "precio-asc":
        resultado.sort((a, b) => a.precio - b.precio);
        break;

      case "precio-desc":
        resultado.sort((a, b) => b.precio - a.precio);
        break;

      case "alfabetico":
        resultado.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case "tipo":
        resultado.sort((a, b) =>
          a.tipoProducto.localeCompare(b.tipoProducto)
        );
        break;

      default:
        break;
    }

    setVista(resultado);
  }, [busqueda, tipoProducto, precioMax, orden, productos]);

  return (
    <div className="catalogo">
      <h1 className="titulo-index">Catálogo de Productos</h1>

      {/* 🔧 FILTROS */}
      <div className="panel-filtros">
        <div className="filtro">
          <span className="icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
          />
        </div>

        <div className="filtro">
          <span className="icon">📦</span>
          <select onChange={e => setTipoProducto(e.target.value)}>
            <option value="">Todos los tipos</option>
            <option value="ProductoVino">Vinos</option>
            <option value="ProductoInsumo">Insumos</option>
            <option value="ProductoPicada">Picadas</option>
          </select>
        </div>

        <div className="filtro">
          <span className="icon">💲</span>
          <input
            type="number"
            placeholder="Precio máximo"
            value={precioMax}
            onChange={e => setPrecioMax(e.target.value)}
          />
        </div>

        <div className="filtro">
          <span className="icon">↕️</span>
          <select onChange={e => setOrden(e.target.value)}>
            <option value="">Ordenar</option>
            <option value="precio-asc">Precio ↑</option>
            <option value="precio-desc">Precio ↓</option>
            <option value="alfabetico">A - Z</option>
            <option value="tipo">Tipo</option>
          </select>
        </div>
      </div>


      {/* 🧱 GRID */}
      <div className="grid">
        {vista.map(prod => (
          <div className="card" key={prod._id}>
            <div className="img-wrapper">
              <img
                src={prod.imagen}
                alt={prod.name}
              />
            </div>

            <h3 title={prod.name}>{prod.name}</h3>

            <p className={`stock ${prod.stock === 0 ? "sin-stock" : ""}`}>
              Stock: <strong>{prod.stock}</strong>
            </p>

            <p className="precio">$ {prod.precio}</p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .catalogo {
          padding: 20px;
        }

        .titulo-pagina {
          text-align: center;
          margin-bottom: 20px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .card {
          background: #1e1e1e;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
        }

        .img-wrapper {
          height: 160px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #2a2a2a;
          border-radius: 8px;
        }

        .img-wrapper img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        h3 {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sin-stock {
          color: #ff6b6b;
        }

        .precio {
          font-weight: bold;
          color: #4caf50;
        }

        .panel-filtros {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          background: #161616;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        }

        .filtro {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          font-size: 18px;
          opacity: 0.7;
        }

        .filtro input,
        .filtro select {
          background: #1f1f1f;   /* 🔥 fondo oscuro */
          border: 1px solid #2f2f2f;
          border-radius: 10px;
          padding: 10px 12px;
          color: #ffffff;       /* 🔥 texto blanco */
          width: 100%;
          font-size: 14px;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .filtro input::placeholder {
          color: #9e9e9e;       /* placeholder visible */
        }

        .filtro input:focus,
        .filtro select:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        }

        .filtro select {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
