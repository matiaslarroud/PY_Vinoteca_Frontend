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
  const [resumenCaja, setResumenCaja] = useState(null);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(null);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
  const [mostrarModalView, setMostrarModalView] = useState(null);
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/caja`);
    const { data, resumen } = await res.json();
    setCajas(data);
    setResumenCaja(resumen);
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


  const cajasFiltradas = cajas
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


        <h1 className="titulo-index">Movimientos Totales</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon"title="Volver al menú">
              <Link href="/" >
                  <FaHome />
              </Link>
          </button>
          <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Movimiento">
            <FaPlus />
          </button>
        </div>

        <div className="contenedor-tabla">
          {resumenCaja && (
            <div className="resumen-caja">
              <div className="card-resumen ingreso">
                <span className="titulo">Ingresos</span>
                <span className="valor">${resumenCaja.ingresos}</span>
              </div>

              <div className="card-resumen egreso">
                <span className="titulo">Egresos</span>
                <span className="valor">${resumenCaja.egresos}</span>
              </div>

              <div className="card-resumen saldo">
                <span className="titulo">Saldo Caja</span>
                <span className="valor">${resumenCaja.saldoCaja}</span>
              </div>

              <div className="card-resumen cc">
                <span className="titulo">Cuenta Corriente</span>
                <span className="valor">${resumenCaja.cuentaCorriente}</span>
              </div>
            </div>
          )}


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
                {cajasFiltradas.map(({ _id, fecha , persona, personaNombre , referencia , tipo , medioPagoNombre , total}) => {
                  return (
                    <tr key={_id}
                        className={
                          tipo === 'CUENTA_CORRIENTE'
                            ? 'mov-cuentaCorriente'
                            : tipo === 'SALIDA'
                              ? 'mov-salida'
                              : 'mov-entrada'
                        }

                    >
                      <td>{_id}</td>
                      <td>{fecha.split("T")[0]}</td>
                      <td>{`${persona} - ${personaNombre}`}</td>
                      <td>{referencia}</td>
                      <td>{
                          tipo === 'CUENTA_CORRIENTE'
                            ? 'CUENTA CORRIENTE'
                            : tipo === 'ENTRADA'
                              ? 'ENTRADA'
                              : 'SALIDA'
                        }
                      </td>
                      <td>{medioPagoNombre}</td>
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

          .mov-cuentaCorriente {
            color: #6b7027ff;
          }

          .resumen-caja {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 16px;
          }

          .card-resumen {
            padding: 14px;
            border-radius: 8px;
            color: #fff;
            display: flex;
            flex-direction: column;
          }

          .card-resumen .titulo {
            font-size: 0.8rem;
            opacity: 0.9;
          }

          .card-resumen .valor {
            font-size: 1.4rem;
            font-weight: bold;
          }

          .ingreso {
            background: #2e7d32;
          }

          .egreso {
            background: #c62828;
          }

          .saldo {
            background: #1565c0;
          }

          .cc {
            background: #f9a825;
            color: #000;
          }

        `}</style>

      </div>
    </>
  );
};

export default indexTransporte;
