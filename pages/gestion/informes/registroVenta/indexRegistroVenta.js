import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft, FaSearch, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import Select from 'react-select';       
import FormularioBusqueedaCliente from "../../../clientes/busquedaCliente"

const { default: Link } = require("next/link");

const indexTransporte = () => {
  const router = useRouter();
  
  const [registro , setRegistro] = useState({cliente:''});

  const [cajas, setCajas] = useState([]);
  const [resumenCaja, setResumenCaja] = useState(null);

  const [clientes, setClientes] = useState([]);
  const [mostrarModalBusquedaCliente, setMostrarModalBusquedaCliente] = useState(false);
  const [orden, setOrden] = useState({ campo: '', asc: true });
  const [filtro , setFiltro] = useState(); 

  const fetchData = async (param) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/caja/cliente/${param}`);
    const { data , resumen } = await res.json();
    setCajas(data);
    setResumenCaja(resumen);
  };

  const fetchData_Clientes = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`);
    const { data } = await res.json();
    setClientes(data);
  };
    
  const selectChange = (selectedOption, actionMeta) => {
      const name = actionMeta.name;
      const value = selectedOption ? selectedOption.value : "";
      setRegistro({
          ...registro,
          [name]: value,
      });
  };

  useEffect(() => {
    fetchData_Clientes();
  }, []);

  useEffect(() => {
    if (!registro.cliente) return;

    fetchData(registro.cliente);
  }, [registro.cliente]);

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };
    
  const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
  
  const customStyle = {
      container: base => ({
      ...base,
      width: "100%",
      }),
      control: base => ({
      ...base,
      width: "100%",
      backgroundColor: "#2c2c2c",
      color: "white",
      border: "1px solid #444",
      borderRadius: 8,
      }),
      singleValue: base => ({
      ...base,
      color: "white",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      }),
      menu: base => ({
      ...base,
      backgroundColor: "#2c2c2c",
      color: "white",
      }),
      option: (base, { isFocused }) => ({
      ...base,
      backgroundColor: isFocused ? "#444" : "#2c2c2c",
      color: "white",
      }),
      input: base => ({
      ...base,
      color: "white",
      }),
  }

  return (
      <>
        <div className="box">
        
        {mostrarModalBusquedaCliente && (
            <div className="modal">
            <div className="modal-content">
                <button className="close" onClick={() => setMostrarModalBusquedaCliente(false)}>&times;</button>
                <FormularioBusqueedaCliente
                filtro={filtro} 
                exito={(resultados) => {
                if (resultados.length > 0) {
                    setClientes(resultados);
                    setMostrarModalBusquedaCliente(false);
                } else {
                    alert("❌ No se encontraron resultados");
                }
                }}
                onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)}
                />
            </div>
            </div>
        )}

        <h1 className="titulo-index">Registro de Ventas</h1>

        <div className="cliente-container">
          <div className="botonera2">
            <label className="cliente-label">
              Cliente
              <button
                type="button"
                className="btn-plus"
                onClick={() => setMostrarModalBusquedaCliente(true)}
              >
                <FaSearch />
              </button>
            </label>

            <Select
              className="form-select-react"
              classNamePrefix="rs"
              options={opciones_clientes}
              value={opciones_clientes.find(op => op.value === registro.cliente) || null}
              onChange={selectChange}
              name="cliente"
              placeholder="Buscar cliente..."
              isClearable
              styles={customStyle}
            />
          </div>
        </div>


        <div className="contenedor-tabla">


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
          </div>

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
                      <td>{persona}</td>
                      <td>{referencia}</td>
                      <td>{
                          tipo === 'CUENTA_CORRIENTE'
                            ? 'CUENTA CORRIENTE'
                            : tipo === 'ENTRADA'
                              ? 'ENTRADA'
                              : 'SALIDA'
                        }
                      </td>
                      <td>{medioPago}</td>
                      <td>{total}</td>
                      <td>
                        <div className="acciones">
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


          /* Contenedor centrado en pantalla */
          .cliente-container {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 10px;
          }

          /* Caja del select */
          .botonera2 {
            width: 420px;
            background: #1e1e1e;
            padding: 24px;
            border-radius: 14px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }

          /* Label */
          .cliente-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #ffffff;
            font-size: 15px;
            margin-bottom: 8px;
            font-weight: 500;
          }

          /* Botón buscar */
          .btn-plus {
            background: #3a3a3a;
            border: none;
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn-plus:hover {
            background: #571212ff;
            transform: scale(1.05);
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
