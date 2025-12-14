const { useState, useEffect } = require("react")
import Select from 'react-select';     
import { FaSearch} from "react-icons/fa";

import FormularioCreateProveedor from "../createProveedor"
import FormularioCreateComprobanteCompra from "../comprobanteCompra/newComprobanteCompra"
import FormularioCreateMedioPago from "../../gestion/tablasVarias/medioPago/createMedioPago"
import FormularioBusquedaProveedor from "../busquedaProveedor"

const { default: Link } = require("next/link")

const initialStateComprobante = {
        total:0, fecha:'', proveedor:'', medioPago:'' , comprobanteCompra:''
    }

const newComprobantepago = ({exito}) => {
    const [comprobantePago , setComprobantePago] = useState(initialStateComprobante);
    const [comprobantesCompra , setComprobantesCompra] = useState([])
    const [ordenesCompra , setOrdenesCompra] = useState([])
    const [proveedores,setProveedores] = useState([])
    const [mediosPago,setMediosPago] = useState([])

    const [mostrarModalBusquedaProveedor , setMostrarModalBusquedaProveedor] = useState(false)
    const [filtro , setFiltro] = useState(false) 

    const fetchData_Proveedores = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProveedores(s.data)
                })
    }

    const fetchData_MediosPago = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setMediosPago(s.data)
                })
    }

    const fetchData_OrdenesCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setOrdenesCompra(s.data)
                })
    }

    const fetchData_ComprobantesCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobanteCompra`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setComprobantesCompra(s.data)
                })
    }
    useEffect(()=>{
        fetchData_Proveedores();
        fetchData_MediosPago();
        fetchData_OrdenesCompra();
        fetchData_ComprobantesCompra();
    }, [])

    function convertirArchivoABase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    const clickChange = async(e) => {
        e.preventDefault();
        const bodyData = {
            total: comprobantePago.total,
            comprobanteCompra: comprobantePago.comprobanteCompra,
            medioPago : comprobantePago.medioPago
        };

        const resComprobante = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobantePago`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })

        const comprobanteCreado = await resComprobante.json();

        if(!comprobanteCreado.ok){
            alert(comprobanteCreado.message)
            return
        }

        setComprobantePago(initialStateComprobante);
        alert(comprobanteCreado.message);
        exito();

    }
  

    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setComprobantePago({
            ...comprobantePago,
            [name]: value,
        });
    };

    const inputChange = (e) => {
        const { name, value } = e.target;

        setComprobantePago({
            ...comprobantePago,
            [name]: name === "total" ? Number(value) : value,
        });
    };


    const [mostrarModalProveedor, setMostrarModalProveedor] = useState(false);
    const [mostrarModalComprobanteCompra, setMostrarModalComprobanteCompra] = useState(false);
    const [mostrarModalMedioPago, setMostrarModalMedioPago] = useState(false);

    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));

    const ordenes = ordenesCompra.filter(o => o.proveedor === comprobantePago.proveedor)
    const ordenIds = ordenes.map(o => o._id);
    const opciones_comprobantesCompra = comprobantesCompra
    .map(v => ({
        value: v._id,
        label: v._id,
        ordenCompra: v.ordenCompra
    }))
    .filter(c => ordenIds.includes(c.ordenCompra));




    return(
        <>

            {mostrarModalBusquedaProveedor && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalBusquedaProveedor(false)}>&times;</button>
                    <FormularioBusquedaProveedor
                    filtro={filtro} 
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setProveedores(resultados);
                        setMostrarModalBusquedaProveedor(false);
                    } else {
                        alert("❌ No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)}
                    />
                </div>
                </div>
            )}
            {mostrarModalProveedor && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalProveedor(false)}>&times;</button>
                    <FormularioCreateProveedor
                    exito={() => {
                        setMostrarModalProveedor(false);
                        fetchData_Proveedores();
                    }}
                    />
                </div>
            </div>
            )}

            {mostrarModalComprobanteCompra && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalComprobanteCompra(false)}>&times;</button>
                    <FormularioCreateComprobanteCompra
                    exito={() => {
                        setMostrarModalComprobanteCompra(false);
                        fetchData_ComprobantesCompra();
                    }}
                    />
                </div>
                </div>
            )}

            {mostrarModalMedioPago && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalMedioPago(false)}>&times;</button>
                    <FormularioCreateMedioPago
                    exito={() => {
                        setMostrarModalComprobanteCompra(false);
                        fetchData_MediosPago();
                    }}
                    />
                </div>
                </div>
            )}


            <div className="form-container">
                
                <h1 className="titulo-pagina">Cargar Comprobante de Pago</h1>
                <br/>
                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Proveedor:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalProveedor(true)}>+</button>
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalBusquedaProveedor(true)}><FaSearch/></button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_proveedores}
                                value={opciones_proveedores.find(op => op.value === comprobantePago.proveedor) || null}
                                onChange={selectChange}
                                name='proveedor'
                                placeholder="Proveedor..."
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
                                Comprobante de Compra:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalComprobanteCompra(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_comprobantesCompra}
                                value={opciones_comprobantesCompra.find(op => op.value === comprobantePago.comprobanteCompra) || null}
                                onChange={selectChange}
                                name='comprobanteCompra'
                                placeholder="Comprobante de compra..."
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalMedioPago(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_mediosPago}
                                value={opciones_mediosPago.find(op => op.value === comprobantePago.medioPago) || null}
                                onChange={selectChange}
                                name='medioPago'
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
                                value={comprobantePago.total}
                                name="total"
                                />
                        </div>
                        
                        <div className="form-submit">
                            <button
                            type="submit"
                            className="submit-btn"
                            onClick={(e) => {
                                clickChange(e);
                            }}
                            >
                            Cargar
                            </button>
                        </div>
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

                        .form-submit {
                            justify-content: center;
                            margin-top: 1rem;
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

export default newComprobantepago;