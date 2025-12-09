import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaEye } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioOrdenCreate from "./createOrdenProduccion";
import FormularioOrdenUpdate from "./updateOrdenProduccion";
import FormularioOrdenView from "./viewOrdenProduccion";

const { default: Link } = require("next/link");

const indexOrdenProduccion = () => {
  const router = useRouter();

  const [ordenes, setOrdenes] = useState([]);
  const [picadas, setPicadas] = useState([]);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
  const [mostrarModalView, setMostrarModalView] = useState(null);

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
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion/${ordenID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((s) => {
          if(s.ok){
            alert(s.message);
            fetchData()
          } else {
            alert(s.message)
          }
      })
      .catch((err) => console.error("❌ Error al eliminar orden de produccion:", err));
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };        
    
  const handleCheck = async (_id) => {
  const orden = ordenes.find((r) => r._id === _id);

  if (!orden) return;

  if (orden.estadoProduccion) {
    alert("❌ Esta orden de produccion ya finalizo.");
    return;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion/finalizar/${_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      }
    );

    // Parsear el JSON SIEMPRE
    const data = await res.json();

    if (!res.ok) {
      // Mostrar faltantes de forma clara
      if (data.faltantes) {
        const mensaje = data.faltantes
          .map(f => 
            `🧂 Insumo: ${f.insumoNombre}\n` +
            `📦 Disponible: ${f.disponible}\n` +
            `📝 Requerido: ${f.requerido}\n` +
            `❌ Falta: ${f.faltante}`
          )
          .join("\n\n");

        alert("Stock insuficiente para finalizar la orden:\n\n" + mensaje);
      } else {
        alert(data.message || "❌ Error al finalizar la orden.");
      }

      return; // No sigas actualizando estado
    }

    // Éxito → marcar como finalizada en la UI
    setOrdenes((prev) =>
      prev.map((r) =>
        r._id === _id ? { ...r, estadoProduccion: true } : r
      )
    );

    alert("✔️ Orden finalizada correctamente.");

  } catch (error) {
    console.error(error);
    alert("❌ Hubo un problema al marcar como finalizada la orden de producción.");
  }
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

        {mostrarModalView && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setMostrarModalView(null)}>&times;</button>
              <FormularioOrdenView
                ordenID={mostrarModalView}
                exito={() => {
                  setMostrarModalView(null);
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
                  <th onClick={() => toggleOrden('estadoProduccion')}>Finalizada ⬍</th>
                  <th onClick={() => toggleOrden('fechaElaboracion')}>Fecha de elaboracion ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ordenesFiltradas.map(({ _id, fechaElaboracion , estadoProduccion }) => {
                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
                      <td className="columna">
                          <input
                              type="checkbox"
                              className="toggle"
                              title="Produccion finalizada..."
                              checked={estadoProduccion}
                              onChange={() => handleCheck(_id)}
                          />
                      </td>
                      <td>{fechaElaboracion.split("T")[0]}</td>
                      <td>
                        <div className="acciones">
                          <button className="btn-icon" title="Modificar" onClick={() => {
                                  setMostrarModalView(_id);
                              }}
                          >
                            <FaEye />
                          </button>
                          <button className="btn-icon" title="Modificar" onClick={() => {
                                  if (estadoProduccion) {
                                  alert("❌ Esta orden de producción ya finalizo y no se puede modificar.");
                                  return;
                                  }
                                  setMostrarModalUpdate(_id);
                              }}
                          >
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
                    input[type="checkbox"].toggle {
                        appearance: none;
                        -webkit-appearance: none;
                        width: 50px;
                        height: 26px;
                        background: #444;
                        border-radius: 50px;
                        position: relative;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        outline: none;
                        border: 2px solid #666;
                    }

                    input[type="checkbox"].toggle::before {
                        content: "";
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        top: 2px;
                        left: 2px;
                        background: #707070ff;
                        border-radius: 50%;
                        transition: transform 0.3s ease;
                    }

                    input[type="checkbox"].toggle:checked {
                        background: #8b0000; /* verde moderno */
                        border-color: #000000ff;
                    }
        `}</style>
      </div>
    </>
  );
};

export default indexOrdenProduccion;
