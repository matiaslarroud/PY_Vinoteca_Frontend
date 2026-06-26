import { useEffect, useState } from "react";

const tipoLabel = {
  ProductoVino: "Vino",
  ProductoInsumo: "Insumo",
  ProductoPicada: "Picada",
};

// Precio efectivo de un producto (respeta la oferta si está activa)
const precioEfectivo = (prod) =>
  prod.enOferta && prod.precioOferta != null ? prod.precioOferta : prod.precio;

export default function Tienda() {
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargarProductos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/catalogo`)
      .then((res) => res.json())
      .then((data) => {
        // Solo productos con stock real disponible
        const disponibles = (data.productos || []).filter((p) => p.stock > 0);
        setProductos(disponibles);
        setVista(disponibles);
      })
      .catch(console.error);
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  useEffect(() => {
    let resultado = [...productos];
    if (busqueda) {
      resultado = resultado.filter((p) =>
        p.name.toLowerCase().includes(busqueda.toLowerCase())
      );
    }
    setVista(resultado);
  }, [busqueda, productos]);

  const agregarAlCarrito = (prod) => {
    setCarrito((prev) => {
      const existente = prev.find((i) => i.producto === prod._id);
      if (existente) {
        // no superar el stock disponible
        if (existente.cantidad >= prod.stock) return prev;
        return prev.map((i) =>
          i.producto === prod._id
            ? { ...i, cantidad: i.cantidad + 1, importe: (i.cantidad + 1) * i.precio }
            : i
        );
      }
      const precio = precioEfectivo(prod);
      return [
        ...prev,
        {
          producto: prod._id,
          name: prod.name,
          precio,
          stock: prod.stock,
          cantidad: 1,
          importe: precio,
        },
      ];
    });
  };

  const cambiarCantidad = (productoID, delta) => {
    setCarrito((prev) =>
      prev
        .map((i) => {
          if (i.producto !== productoID) return i;
          const nuevaCantidad = i.cantidad + delta;
          if (nuevaCantidad < 1) return i;
          if (nuevaCantidad > i.stock) return i;
          return { ...i, cantidad: nuevaCantidad, importe: nuevaCantidad * i.precio };
        })
        .filter(Boolean)
    );
  };

  const quitarDelCarrito = (productoID) => {
    setCarrito((prev) => prev.filter((i) => i.producto !== productoID));
  };

  const total = carrito.reduce((acc, i) => acc + i.importe, 0);

  const comprar = async () => {
    if (carrito.length === 0) {
      alert("El carrito está vacío.");
      return;
    }
    setEnviando(true);
    try {
      const detalles = carrito.map((i) => ({
        producto: i.producto,
        cantidad: i.cantidad,
        precio: i.precio,
        importe: i.importe,
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/tienda/notaPedido`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ total, detalles }),
      });
      const data = await res.json();

      if (!data.ok) {
        alert(data.message || "No se pudo generar el pedido.");
        setEnviando(false);
        return;
      }

      const notaId = data.data?._id;

      // Armar el mensaje de WhatsApp al dueño con el resumen del pedido
      const resumen = carrito
        .map((i) => `• ${i.name} x${i.cantidad} = $${i.importe}`)
        .join("%0A");
      const texto = `Hola!%0A%0aLe envío mi pedido para procesar:%0A%0a🛒 Pedido: ${notaId}%0A${resumen}%0A%0a💵 Monto Total: $${total}%0A%0aQuedo a la espera de la confirmación.`;
      const telefono = process.env.NEXT_PUBLIC_WHATSAPP_DUENO;
      window.open(`https://wa.me/${telefono}?text=${texto}`, "_blank");

      alert(`✔️ Pedido N°${notaId} creado. Coordiná el pago por WhatsApp con el dueño.`);
      setCarrito([]);
      cargarProductos(); // refrescar stock real
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="tienda">
      <h1 className="titulo-index">Tienda</h1>

      <div className="layout">
        {/* VITRINA */}
        <div className="vitrina">
          <div className="panel-filtros">
            <div className="filtro">
              <span className="icon">🔍</span>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
          </div>

          <div className="grid">
            {vista.map((prod) => (
              <div className="card" key={prod._id}>
                <div className="img-wrapper">
                  <img src={prod.imagen} alt={prod.name} />
                </div>
                <h3 title={prod.name}>{prod.name}</h3>
                <p className="tipo">{tipoLabel[prod.tipoProducto] || ""}</p>
                <p className="stock">
                  Disponibles:{" "}
                  <strong>
                    {prod.stock - (carrito.find((i) => i.producto === prod._id)?.cantidad ?? 0)}
                  </strong>
                </p>
                {prod.enOferta && prod.precioOferta != null ? (
                  <p className="precio">
                    <span className="tachado">$ {prod.precio}</span> $ {prod.precioOferta}
                  </p>
                ) : (
                  <p className="precio">$ {prod.precio}</p>
                )}
                <button className="btn-add" onClick={() => agregarAlCarrito(prod)}>
                  Agregar
                </button>
              </div>
            ))}
            {vista.length === 0 && <p>No hay productos disponibles.</p>}
          </div>
        </div>

        {/* CARRITO */}
        <aside className="carrito">
          <h2>🛒 Carrito</h2>
          {carrito.length === 0 && <p className="vacio">El carrito está vacío.</p>}
          {carrito.map((i) => (
            <div className="item" key={i.producto}>
              <div className="item-info">
                <span className="item-name" title={i.name}>{i.name}</span>
                <span className="item-precio">$ {i.precio}</span>
              </div>
              <div className="item-controles">
                <button onClick={() => cambiarCantidad(i.producto, -1)}>-</button>
                <span>{i.cantidad}</span>
                <button onClick={() => cambiarCantidad(i.producto, 1)}>+</button>
                <span className="item-importe">$ {i.importe}</span>
                <button className="btn-quitar" onClick={() => quitarDelCarrito(i.producto)}>
                  ✕
                </button>
              </div>
            </div>
          ))}

          <div className="total">
            <span>Total:</span>
            <strong>$ {total}</strong>
          </div>

          <button
            className="btn-comprar"
            onClick={comprar}
            disabled={enviando || carrito.length === 0}
          >
            {enviando ? "Enviando..." : "Comprar"}
          </button>
        </aside>
      </div>

      <style jsx>{`
        .tienda {
          padding: 20px;
        }
        .layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: 20px;
          align-items: start;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
        }
        .card {
          background: #1e1e1e;
          border-radius: 10px;
          padding: 15px;
          text-align: center;
        }
        .img-wrapper {
          height: 150px;
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
        .tipo {
          font-size: 0.8rem;
          opacity: 0.7;
        }
        .precio {
          font-weight: bold;
          color: #4caf50;
        }
        .tachado {
          text-decoration: line-through;
          color: #9e9e9e;
          margin-right: 6px;
        }
        .btn-add {
          background: #a30000;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 8px 14px;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
        }
        .btn-add:hover {
          background: #c70000;
        }
        .panel-filtros {
          background: #161616;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 20px;
        }
        .filtro {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .filtro input {
          background: #1f1f1f;
          border: 1px solid #2f2f2f;
          border-radius: 10px;
          padding: 10px 12px;
          color: #fff;
          width: 100%;
        }
        .carrito {
          background: #161616;
          border-radius: 12px;
          padding: 16px;
          position: sticky;
          top: 20px;
        }
        .carrito h2 {
          margin-top: 0;
        }
        .vacio {
          opacity: 0.7;
        }
        .item {
          border-bottom: 1px solid #2f2f2f;
          padding: 8px 0;
        }
        .item-info {
          display: flex;
          justify-content: space-between;
          gap: 8px;
        }
        .item-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 170px;
        }
        .item-controles {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
        }
        .item-controles button {
          background: #2c2c2c;
          color: white;
          border: 1px solid #444;
          border-radius: 6px;
          width: 26px;
          height: 26px;
          cursor: pointer;
        }
        .item-importe {
          margin-left: auto;
          font-weight: bold;
          color: #4caf50;
        }
        .btn-quitar {
          border-color: #a30000 !important;
        }
        .total {
          display: flex;
          justify-content: space-between;
          margin: 16px 0;
          font-size: 1.2rem;
        }
        .btn-comprar {
          background: #2e7d32;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px;
          width: 100%;
          font-size: 1.1rem;
          cursor: pointer;
        }
        .btn-comprar:disabled {
          background: #555;
          cursor: not-allowed;
        }
        .btn-comprar:hover:not(:disabled) {
          background: #388e3c;
        }
        @media (max-width: 768px) {
          .layout {
            grid-template-columns: 1fr;
          }
          .carrito {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
