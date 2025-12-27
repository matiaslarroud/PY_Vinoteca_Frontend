import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaEye, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";

import FormularioMovimientoCreate from "./createCaja";
import FormularioMovimientoUpdate from "./updateCaja";
import FormularioMovimientoView from "./viewCaja";

const { default: Link } = require("next/link");

const indexTransporte = () => {
  const router = useRouter();

  const [cajas, setCajas] = useState([]);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(null);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
  const [mostrarModalView, setMostrarModalView] = useState(null);
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/caja`);
    const { data } = await res.json();
    setCajas(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

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
              <FormularioMovimientoCreate
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
              <FormularioMovimientoUpdate
                movimientoID={mostrarModalUpdate}
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
              <FormularioMovimientoView
                movimientoID={mostrarModalView}
                exito={() => {
                  setMostrarModalView(null);
                  fetchData();
                }}
              />
            </div>
          </div>
        )}

        <h1 className="titulo-index">Caja Diaria</h1>

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

          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                  <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                  <th onClick={() => toggleOrden('persona')}>Persona ⬍</th>
                  <th onClick={() => toggleOrden('referencia')}>Referencia ⬍</th>
                  <th onClick={() => toggleOrden('tipo')}>Tipo ⬍</th>
                  <th onClick={() => toggleOrden('medioPago')}>Medio de Pago ⬍</th>
                  <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cajas.map(({ _id, fecha , persona , referencia , tipo , medioPago , total}) => {
                  return (
                    <tr key={_id}
                        className={!tipo ? "mov-salida" : "mov-entrada"}
                    >
                      <td>{_id}</td>
                      <td>{fecha.split("T")[0]}</td>
                      <td>{persona}</td>
                      <td>{referencia}</td>
                      <td>{tipo ? "ENTRADA" : "SALIDA"}</td>
                      <td>{medioPago}</td>
                      <td>{total}</td>
                      <td>
                        <div className="acciones">
                          <button onClick={() => setMostrarModalView(_id)} className="btn-icon" title="Visualizar">
                            <FaEye />
                          </button>
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                            <FaEdit />
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
          .mov-salida {
            color: #ff4d4f;
            font-weight: 600;
          }

          .mov-entrada {
            color: #ffffffff;
          }
        `}</style>

      </div>
    </>
  );
};

export default indexTransporte;
