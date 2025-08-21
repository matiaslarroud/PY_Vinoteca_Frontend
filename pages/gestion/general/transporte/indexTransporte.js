import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioTransporteCreate from "./createTransporte";
import FormularioTransporteUpdate from "./updateTransporte";

const { default: Link } = require("next/link");

const indexTransporte = () => {
  const router = useRouter();

  const [transportes, setTransportes] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  const [banderaUpdate, setBanderaUpdate] = useState(false);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDestinoLocalidad, setFiltroDestinoLocalidad] = useState('');
  const [filtroDestinoProvincia, setFiltroDestinoProvincia] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte`);
    const { data } = await res.json();
    setTransportes(data);
    setBanderaUpdate(false)
  };
  const fetchData_Transporte_Detalle = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporteDetalle`);
      const { data } = await res.json();
      if (data) {
          setDetalles(data);
      } else {
          console.error("Error al cargar los destinos del transporte");
      }
  };

  const fetchData_Provincias = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`);
    const { data } = await res.json();
    setProvincias(data);
  };

  const fetchData_Localidades = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`);
    const { data } = await res.json();
    setLocalidades(data);
  };

  useEffect(() => {
    fetchData();
    fetchData_Provincias(); 
    fetchData_Localidades();
    fetchData_Transporte_Detalle();
  }, [banderaUpdate]);

  const deleteTransporte = async (transporteID) => {
    if (!transporteID) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte/${transporteID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => fetchData())
      .catch((err) => console.error("Error al eliminar transporte:", err));
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const transportesFiltrados = transportes
  .filter(t => {
    const detallesTransporte = detalles.filter(d => d.transporteID === t._id);

    const criterioProv = filtroDestinoProvincia.toLowerCase();
    const criterioLoc = filtroDestinoLocalidad.toLowerCase();

    const coincideDestino = detallesTransporte.some(d => {
      const nombreProv = provincias.find(p => p._id === d.provincia)?.name.toLowerCase() || "";
      const nombreLoc = localidades.find(l => l._id === d.localidad)?.name.toLowerCase() || "";

      const matchProv = criterioProv === "" || nombreProv.includes(criterioProv);
      const matchLoc = criterioLoc === "" || nombreLoc.includes(criterioLoc);


      return matchProv && matchLoc;
    });

    // ✅ Filtro final: nombre del transporte y destinos
    return (
      t.name.toLowerCase().includes(filtroNombre.toLowerCase()) &&
      coincideDestino
    );
  })
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();

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
              <FormularioTransporteCreate
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
              <FormularioTransporteUpdate
                transporteID={mostrarModalUpdate}
                exito={() => {
                  setMostrarModalUpdate(null);
                  fetchData();
                  setBanderaUpdate(true);
                }}
              />
            </div>
          </div>
        )}

        <h1 className="titulo-pagina">Transportes</h1>

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
              placeholder="Filtrar por nombre transporte..."
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por localidad destino..."
              value={filtroDestinoLocalidad}
              onChange={(e) => setFiltroDestinoLocalidad(e.target.value)}
            />
            <input
              type="text"
              placeholder="Filtrar por provincia destino..."
              value={filtroDestinoProvincia}
              onChange={(e) => setFiltroDestinoProvincia(e.target.value)}
            />
          </div>


          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transportesFiltrados.map(({ _id, name}) => {
                  return (
                    <tr key={_id}>
                      <td>{name}</td>
                      <td>
                        <div className="acciones">
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteTransporte(_id)} className="btn-icon" title="Eliminar">
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

export default indexTransporte;
