import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioTransporteCreate from "./createTransporte";
import FormularioTransporteUpdate from "./updateTransporte";

const { default: Link } = require("next/link");

const indexTransporte = () => {
  const router = useRouter();

  const [transportes, setTransportes] = useState([]);
  const [banderaUpdate, setBanderaUpdate] = useState(false);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte`);
    const { data } = await res.json();
    setTransportes(data);
    setBanderaUpdate(false)
  };

  useEffect(() => {
    fetchData();
  }, [banderaUpdate]);

  const deleteTransporte = async (transporteID) => {
    if (!transporteID) return;
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
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
    

    // ✅ Filtro final: nombre del transporte y destinos
    return (
      t.name.toLowerCase().includes(filtroNombre.toLowerCase())
    );
  })
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    if (campo === 'codigo'){
      aVal=a._id;
      bVal=b._id;
    }

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
          </div>


          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                  <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {transportesFiltrados.map(({ _id, name}) => {
                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
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
        `}
        </style>
      </div>
    </>
  );
};

export default indexTransporte;
