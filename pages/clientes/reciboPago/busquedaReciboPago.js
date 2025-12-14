const { useState, useEffect } = require("react")
import Select from 'react-select';     
import { FaTrash , FaSearch} from "react-icons/fa";
import FormularioBusqueedaCliente from "../busquedaCliente"

const { default: Link } = require("next/link")

const initialStateRecibo = {
        total:0, fecha:'', clienteID:'', medioPagoID:'',reciboID: ''
    }

const busquedaReciboPago = ({ exito, filtro, onChangeFiltro }) => {
    const [recibo , setRecibo] = useState(initialStateRecibo);
    
    const [clientes,setClientes] = useState([])
    const [mediosPago,setMediosPago] = useState([])
        
    const [filtros, setFiltros] = useState(filtro);
        
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
    }, [filtro]);
        
        const borrarFiltros = () => {
                setFiltros(initialStateRecibo);
                onChangeFiltro(initialStateRecibo);
        };

    const fetchData_Clientes = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setClientes(s.data)
                })
    }

    const fetchData_MediosPago = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setMediosPago(s.data)
                })
    }
    useEffect(()=>{
        fetchData_Clientes();
        fetchData_MediosPago();
    }, [])


   const handleBuscar = async (e) => {
        e.preventDefault();

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/reciboPago/buscar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(filtros),
        });

        const data = await res.json();
        if (data.ok){
            exito(data.data);
        } else {
            exito({})
        }
    };
      
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";
        
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros);
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
    };
    const [mostrarModalBusquedaCliente, setMostrarModalBusquedaCliente] = useState(false);


    const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));

    return(
        <>
            <div className="form-container">
                
                <h1 className="titulo-pagina">Busqueda Avanzada de Recibo de Pago</h1>
                <br/>
                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">

                        <div className="form-col1">
                            <label>
                                Recibo Pago N°:
                            </label> 
                            <input
                                type="number"
                                className="input-secondary"
                                onChange={inputChange}
                                value={filtros.reciboID}
                                name="reciboID"
                                />
                        </div>
                        <div className="form-col1">
                            <label>
                                Cliente:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_clientes}
                                value={opciones_clientes.find(op => op.value === filtros.clienteID) || null}
                                onChange={selectChange}
                                name='clienteID'
                                placeholder="Cliente..."
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: 220, // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 220,
                                    maxWidth: 220,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: 8,
                                    }),
                                    singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis', // ⬅️ evita que el texto se desborde
                                    }),
                                    menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    }),
                                    option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#444' : '#2c2c2c',
                                    color: 'white',
                                    }),
                                    input: (base) => ({
                                    ...base,
                                    color: 'white',
                                    }),
                                }}
                            />
                        </div>

                        <div className="form-col1">
                            <label>
                                Medio de Pago:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_mediosPago}
                                value={opciones_mediosPago.find(op => op.value === filtros.medioPagoID) || null}
                                onChange={selectChange}
                                name='medioPagoID'
                                placeholder="Medio de Pago..."
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: 220, // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 220,
                                    maxWidth: 220,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: 8,
                                    }),
                                    singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis', // ⬅️ evita que el texto se desborde
                                    }),
                                    menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    }),
                                    option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#444' : '#2c2c2c',
                                    color: 'white',
                                    }),
                                    input: (base) => ({
                                    ...base,
                                    color: 'white',
                                    }),
                                }}
                            />
                        </div>

                        <div className="form-col1">
                            <label>
                                Total:
                            </label> 
                            <input
                                type="number"
                                className="input-secondary"
                                onChange={inputChange}
                                value={filtros.total}
                                name="total"
                                />
                        </div>

                        <div className="form-col1">
                                <label>
                                    Fecha:
                                </label>
                            <input type="date" onChange={inputChange} value={filtros.fecha} name="fecha" />
                        </div>
                    </div>
                    <div className="form-submit">
                        <button type="submit" className="submit-btn" onClick={handleBuscar}>Buscar</button>
                        <button
                        type="button"
                        className="submit-btn"
                        style={{ backgroundColor: "#444", marginLeft: "1rem" }}
                        onClick={borrarFiltros}
                        >
                        Borrar filtros
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>
                {`

                        .form-container {
                            background-color: #1f1f1f;
                            color: #fff;
                            padding: 2rem;
                            border-radius: 16px;
                            width: 100%;
                            height: 100%;
                            margin: 0 auto;
                            box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
                        }

                        .formulario-presupuesto {
                            display: flex;
                            flex-direction: column;
                            gap: 2rem;
                        }

                        .form-row {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 1.5rem;
                        }


                        label {
                            font-weight: 500;
                            margin-bottom: 0.5rem;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }

                        input:focus {
                            border-color: #571212ff;
                        }

                        .btn-plus {
                            background-color: transparent;
                            color: #651616ff;
                            border: none;
                            font-size: 1.2rem;
                            cursor: pointer;
                        }

                        .btn-plus:hover {
                            color: #571212ff;
                            transform: translateY(-3px);
                        }

                        .submit-btn {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.8rem 1.5rem;
                            font-size: 1rem;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .submit-btn:hover {
                            background-color: #571212ff;
                            transform: translateY(-3px);
                        }

                        .form-submit {
                            justify-content: center;
                            text-align: center;
                            margin-top: 1rem;
                        }

                        
                        button.submit-btn {
                            padding: 0.75rem 1rem;
                            background-color: #8B0000;
                            color: #fff;
                            border: none;
                            border-radius: 8px;
                            font-size: 1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: background-color 0.3s ease;
                        }

                        button.submit-btn:hover {
                            background-color: rgb(115, 8, 8);
                            transform: translateY(-3px);
                        }

                        input[type="text"],
                        input[type="number"] {
                            background-color: #2c2c2c;
                            color: white;
                            border: 1px solid #444;
                            border-radius: 8px;
                            padding: 0.6rem;
                            font-size: 1rem;
                            outline: none;
                            transition: border-color 0.2s ease-in-out;
                        }

                        .input-secondary {
                            padding: 0.65rem 1rem;
                            font-size: 1rem;
                            border-radius: 8px;
                            border: 1px solid #ccc;
                            background-color: #f9f9f9;
                            color: #333;
                            transition: border-color 0.3s, box-shadow 0.3s;
                        }

                        .input-secondary:focus {
                            border-color: #8B0000;
                            box-shadow: 0 0 5px rgba(139, 0, 0, 0.6);
                            outline: none;
                        }
                        
                        .titulo-pagina {
                            font-size: 2rem;
                            color: white;
                            text-align: center;
                            margin-top: 2px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                        }
                `}
            </style>
        </>
    )
}

export default busquedaReciboPago;