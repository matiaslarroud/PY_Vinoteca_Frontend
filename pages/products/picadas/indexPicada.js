import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioPicadaCreate from "./createPicada";
import FormularioPicadaUpdate from "./updatePicada";

const { default: Link } = require("next/link");

const IndexPicada = () => {
  const router = useRouter();

  const [picadas, setPicadas] = useState([]);
  const [depositos, setDepositos] = useState([]);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDeposito, setFiltroDeposito] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada`);
    const { data } = await res.json();
    setPicadas(data);
  };

  const fetchData_Depositos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`);
    const { data } = await res.json();
    setDepositos(data);
  };

  useEffect(() => {
    fetchData();
    fetchData_Depositos();
  }, []);

  const deleteProduct = async (productID) => {
    if (!productID) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada/${productID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => fetchData())
      .catch((err) => console.error("Error al eliminar Picada:", err));
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const picadasFiltradas = picadas
    .filter(p => {
      const depositoNombre = depositos.find(d => d._id === p.deposito)?.name || '';
      return (
        p.name.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        depositoNombre.toLowerCase().includes(filtroDeposito.toLowerCase()) &&
        (filtroPrecio === '' || p.precioVenta.toString().includes(filtroPrecio))
      );
    })
    .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal, bVal;
    if (campo === 'codigo') {
      aVal = a._id;
      bVal = b._id;
    }
    if (campo === 'deposito') {
      aVal = depositos.find(d => d._id === a.deposito)?.name || '';
      bVal = depositos.find(d => d._id === b.deposito)?.name || '';
    } else {
      aVal = a[campo];
      bVal = b[campo];
    }

    // Si es string, pasamos a minúscula para ordenar insensible a mayúsculas
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    // Si el campo es precioVenta, convertimos a número para ordenar numéricamente
    if (campo === 'precioVenta') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });


  return (
      <>
        <div className="box">
        {mostrarModalCreate && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setMostrarModalCreate(false)}>&times;</button>
              <FormularioPicadaCreate
                exito={() => {
                  setMostrarModalCreate(false);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}

        {mostrarModalUpdate && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setMostrarModalUpdate(null)}>&times;</button>
              <FormularioPicadaUpdate
                picadaID={mostrarModalUpdate}
                exito={() => {
                  setMostrarModalUpdate(null);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}

        <h1 className="titulo-pagina">Picadas</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon"title="Volver al menú">
              <Link href="/" >
                  <FaHome />
              </Link>
          </button>
          <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Picada">
            <FaPlus />
          </button>
        </div>

        <div className="contenedor-tabla">
          <div className="filtros">
            <input
              type="text"
              placeholder="Filtrar por nombre..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por depósito..."
              value={filtroDeposito}
              onChange={(e) => setFiltroDeposito(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por precio..."
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(e.target.value)}
            />
          </div>

          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                  <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                  <th onClick={() => toggleOrden('deposito')}>Depósito ⬍</th>
                  <th onClick={() => toggleOrden('precioVenta')}>Precio ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {picadasFiltradas.map(({ _id, name, deposito, precioVenta }) => {
                  const depositoEncontrado = depositos.find((p) => p._id === deposito);
                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
                      <td>{name}</td>
                      <td>{depositoEncontrado?.name}</td>
                      <td>${precioVenta}</td>
                      <td>
                        <div className="acciones">
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteProduct(_id)} className="btn-icon" title="Eliminar">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <style jsx>{`
          .box {
            height: 100%;
            width: 100%;
          }

          .titulo-pagina {
            font-size: 3rem;
            color: white;
            text-align: center;
            margin-top: 2rem;
          }

          .botonera {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem auto;
          }

          .btn-icon {
            background-color: #8b0000;
            color: white;
            padding: 0.8rem;
            font-size: 1.2rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            width: 3.2rem;
            height: 3.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, transform 0.2s;
          }

          .btn-icon:hover {
            background-color: #a30000;
            transform: translateY(-3px);
          }

          .contenedor-tabla {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #222;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }

          .filtros {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .filtros input {
            padding: 10px;
            font-size: 1rem;
            border-radius: 6px;
            border: 1px solid #ccc;
            min-width: 220px;
          }

          .tabla-scroll {
            overflow-x: auto;
            max-height: 500px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #333;
            color: white;
          }

          th, td {
            text-align: center;
            padding: 12px;
            border-bottom: 1px solid #555;
          }

          th {
            background-color: #111;
            cursor: pointer;
          }

          .acciones {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .modal {
            position: fixed;
            inset: 0; /* top: 0; bottom: 0; left: 0; right: 0 */
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem; /* para espacio lateral en pantallas pequeñas */
            overflow-y: auto;
          }

          .modal-content {
            background-color: #121212;
            padding: 2rem;
            border-radius: 10px;
            width: 100%;
            max-width: 1200px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
          }

          .close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 1.5rem;
            background: transparent;
            border: none;
            cursor: pointer;
          }
        `}</style>
      </div>
    </>
  );
};

export default IndexPicada;
