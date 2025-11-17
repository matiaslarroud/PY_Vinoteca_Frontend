const { useState, useEffect } = require("react")
import Select from 'react-select';          
import { FaTrash} from "react-icons/fa";
// import FormularioEmpleadoCreate from '../../gestion/empleado/createEmpleado'
// import FormularioClienteCreate from '../createCliente'
import FormularioMedioPagoCreate from '../../gestion/tablasVarias/medioPago/createMedioPago'

const { default: Link } = require("next/link")

const initialStateComprobante = {
        total:0, fecha:'', proveedor:'', medioPago:'' , comprobanteCompra:'', comprobanteID:''
    }

const busquedaComprobantepago = ({ exito, filtro, onChangeFiltro }) => {
    const [comprobantePago , setComprobantePago] = useState(initialStateComprobante);
    
    const [comprobantesCompra , setComprobantesCompra] = useState([])
    const [ordenesCompra , setOrdenesCompra] = useState([])
    const [proveedores,setProveedores] = useState([])
    const [mediosPago,setMediosPago] = useState([])
                        
    const [filtros, setFiltros] = useState(filtro);
    
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
    }, [filtro]);
    
    const borrarFiltros = () => {
            setFiltros(initialStateComprobante);
            onChangeFiltro(initialStateComprobante);
    };

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
            console.log("Error con el envio de datos.")
            return
        }

        exito();
    }  

    const handleBuscar = async (e) => {
        e.preventDefault();

        // Armamos el cuerpo a enviar
        const body = {
            ...filtros
        };

        console.log(filtros)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobantePago/buscar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
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
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
    };


    const [mostrarModalCreate1, setMostrarModalCreate1] = useState(false);
    const [mostrarModalCreate3, setMostrarModalCreate3] = useState(false);

    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));

    const opciones_comprobantesCompra = comprobantesCompra
    .map(v => ({
        value: v._id,
        label: v._id,
        ordenCompra: v.ordenCompra
    }))




    return(
        <>
            {mostrarModalCreate1 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate1(false)}>&times;</button>
                    <FormularioMedioPagoCreate
                    exito={() => {
                        setMostrarModalCreate1(false);
                        fetchData_MediosPago();
                    }}
                    />
                </div>
            </div>
            )}
            {/* {mostrarModalCreate3 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate3(false)}>&times;</button>
                    <FormularioClienteCreate
                    exito={() => {
                        setMostrarModalCreate3(false);
                        fetchData_Clientes();
                    }}
                    />
                </div>
                </div>
            )} */}


            <div className="form-container">
                
                <h1 className="titulo-pagina">Busqueda Avanzada de Comprobante de Pago</h1>
                <br/>
                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Comprobante de Pago N° :
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={filtros.comprobanteID}
                                name="comprobanteID"
                                onChange={inputChange}
                                />
                        </div>
                        <div className="form-col1">
                            <label>
                                Proveedor:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_proveedores}
                                value={opciones_proveedores.find(op => op.value === filtros.proveedor) || null}
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
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_comprobantesCompra}
                                value={opciones_comprobantesCompra.find(op => op.value === filtros.comprobanteCompra) || null}
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
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_mediosPago}
                                value={opciones_mediosPago.find(op => op.value === filtros.medioPago) || null}
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
                                value={filtros.total}
                                name="total"
                                />
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

                        .form-submit {
                            justify-content: center;
                            margin-top: 1rem;
                            text-align:center;
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

export default busquedaComprobantepago;