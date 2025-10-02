import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioOrdenCreate from "./createOrdenProduccion";
import FormularioOrdenUpdate from "./updateOrdenProduccion";

const { default: Link } = require("next/link");

const indexOrdenProduccion = () => {
  const router = useRouter();

  const [ordenes, setOrdenes] = useState([]);
  const [picadas, setPicadas] = useState([]);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

  const [filtroPicada, setFiltroPicada] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion`);
    const { data } = await res.json();
    setOrdenes(data);
  };

  const fetchData_Picadas = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ProductPicada`);
    const { data } = await res.json();
    setPicadas(data);
  };

  useEffect(() => {
    fetchData();
    fetchData_Picadas();
  }, []);

  const ordenesFiltradas = ordenes
    .sort((a, b) => {

      const campo = orden.campo;
      if (!campo) return 0;

      let aVal = a[campo];
      let bVal = b[campo];

    if (campo === 'codigo') {
        aVal = a._id;
        bVal = b._id;
    }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });

  const deleteOrden = async (ordenID) => {
    if (!ordenID) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion/${ordenID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => fetchData())
      .catch((err) => console.error("Error al eliminar orden de produccion:", err));
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  return (
      <>
        <div className="box">
        {mostrarModalCreate && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setMostrarModalCreate(false)}>&times;</button>
              <FormularioOrdenCreate
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
              <FormularioOrdenUpdate
                ordenID={mostrarModalUpdate}
                exito={() => {
                  setMostrarModalUpdate(null);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}

        <h1 className="titulo-pagina">Ordenes de Produccion</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon"title="Volver al menú">
              <Link href="/" >
                  <FaHome />
              </Link>
          </button>
          <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Orden de Produccion">
            <FaPlus />
          </button>
        </div>

        <div className="contenedor-tabla">

          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                  <th onClick={() => toggleOrden('fechaElaboracion')}>Fecha de elaboracion ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map(({ _id, fechaElaboracion }) => {
                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
                      <td>{fechaElaboracion.split("T")[0]}</td>
                      <td>
                        <div className="acciones">
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteOrden(_id)} className="btn-icon" title="Eliminar">
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
        `}</style>
      </div>
    </>
  );
};

export default indexOrdenProduccion;
