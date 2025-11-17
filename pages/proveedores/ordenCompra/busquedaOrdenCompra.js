const { useState, useEffect } = require("react")
import Select from 'react-select';          
import { FaTrash} from "react-icons/fa";
// import FormularioEmpleadoCreate from '../../gestion/general/empleado/createEmpleado'
// import FormularioClienteCreate from '../createCliente'
// import FormularioMedioPagoCreate from '../../gestion/general/medioPago/createMedioPago'

const { default: Link } = require("next/link")

const initialStateOrdenCompra = {
        total:'', fecha:'', fechaEntrega:'', proveedor:'', empleado:'',
        presupuesto:'', medioPago:'', ordenCompraID:''
    }
const initialDetalle = { 
         tipoProducto: "", producto: "", cantidad: 0, precio: 0, importe: 0, ordenCompra:'' 
    };

const busquedaOrdenCompra = ({ exito, filtro, onChangeFiltro , filtroDetalle , onChangeFiltroDetalle }) => {
    const [proveedores,setProveedores] = useState([])
    const [presupuestos,setPresupuestos] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [mediosPago,setMediosPago] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
                    
        const [filtros, setFiltros] = useState(filtro);
        
        // Sincroniza con los cambios del padre
        useEffect(() => {
                setFiltros(filtro);
                setDetalles(filtroDetalle)
        }, [filtro,filtroDetalle]);
        
        const borrarFiltros = () => {
                setFiltros(initialStateOrdenCompra);
                onChangeFiltro(initialStateOrdenCompra);
                setDetalles([])
                onChangeFiltroDetalle([]);
        };
    
    const detallesValidos = detalles.filter(d => d.producto && d.cantidad > 0);
    const puedeGuardar = detallesValidos.length > 0;

    const fetchData_Presupuestos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/presupuesto`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setPresupuestos(s.data)
                }
            })
        .catch((err)=>{console.log("Error al cargar presupuestos.\nError: ",err)})
    }
    
    const fetchData_TipoProductos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/tipos`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setTipoProductos(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar tipos de productos.\nError: ",err)})
    }

    const fetchData_Productos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setProductos(s.data)
                }
            })
        .catch((err)=>{console.log("Error al cargar productos.\nError: ",err)})
    }
    
    const fetchData_Proveedores = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProveedores(s.data)
                })
    }

    const fetchData_Empleados = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/empleado`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setEmpleados(s.data)
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
        fetchData_Proveedores();
        fetchData_Empleados();
        fetchData_Presupuestos();
        fetchData_MediosPago();
        fetchData_Productos();
        fetchData_TipoProductos();
    }, [])

    useEffect(() => {
        if (!productos.length || !detalles.length) return;

        const detallesConTipo = detalles.map((d) => {
            const prod = productos.find((p) => p._id === d.producto);

            return {
                ...d,
                tipoProducto: d.tipoProducto || (prod ? prod.tipoProducto : ""),
            };
        });
        
        const isDifferent = JSON.stringify(detalles) !== JSON.stringify(detallesConTipo);
        if (isDifferent) {
            setDetalles(detallesConTipo);
        }
    }, [productos, detalles]);


    const handleBuscar = async (e) => {
        e.preventDefault();

        // Armamos el cuerpo a enviar
        const body = {
            ...filtros,
            detalles: detalles.map(d => ({
                tipoProducto: d.tipoProducto,
                producto: d.producto
            }))
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra/buscar`, {
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

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;

        setDetalles(nuevosDetalles);
        onChangeFiltroDetalle(nuevosDetalles)
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

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"" , producto: "", cantidad: 0, precio: 0, importe: 0 } }]);
    };

    const opciones_tipoProductos = tipoProductos.map(v => ({
        value: v,
        label: v === "ProductoVino" ? "Vino" :
                v === "ProductoPicada" ? "Picada" :
                v === "ProductoInsumo" ? "Insumo" : v
    }));
    const opciones_productos = productos
        .map(v => ({
            value: v._id,
            label: v.name,
            stock: v.stock,
            tipoProducto: v.tipoProducto
        }));
    const opciones_empleados = empleados.map(v => ({ value: v._id,label: v.name }));
    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));
    const opciones_presupuestos = presupuestos
        .map(v => {
            return {
                value: v._id,
                label: v._id,
                proveedor: v.proveedor,
                total: v.total
            };
        }
    );

    return(
        <><div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Busqueda Avanzada de Orden de Compra</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Orden de Compra N° :
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={filtros.ordenCompraID}
                                name="ordenCompraID"
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
                                Empleado:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_empleados}
                                value={opciones_empleados.find(op => op.value === filtros.empleado) || null}
                                onChange={selectChange}
                                name='empleado'
                                placeholder="Empleado..."
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
                                Presupuesto:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_presupuestos}
                                value={opciones_presupuestos.find(op => op.value === filtros.presupuesto) || null}
                                onChange={selectChange}
                                name='presupuesto'
                                placeholder="Presupuesto..."
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
                    </div>
                    <div className="form-row">
                        <div className="form-col-productos">
                            <label>
                                    Productos:
                                    <button type="button" className="btn-add-producto" onClick={agregarDetalle}>
                                        + Agregar Producto
                                    </button>
                            </label>
                            <div className="form-group-presupuesto">
                                
                                {detalles.map((d, i) => (
                                <div key={i} className="presupuesto-item">
                                    <div className='form-col-item1'>
                                        <Select
                                            className="form-select-react"
                                            classNamePrefix="rs"
                                            options={opciones_tipoProductos}
                                            value={opciones_tipoProductos.find(op => op.value === d.tipoProducto) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "tipoProducto", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Tipo de Producto..."
                                            isClearable
                                            styles={{
                                                container: (base) => ({
                                                ...base,
                                                width: 120, // ⬅️ ancho fijo total
                                                }),
                                                control: (base) => ({
                                                ...base,
                                                minWidth: 150,
                                                maxWidth: 150,
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
                                    <div className='form-col-item1'>
                                        <Select
                                            className="form-select-react"
                                            classNamePrefix="rs"
                                            options={opciones_productos.filter(op => op.tipoProducto === d.tipoProducto)}
                                            value={opciones_productos.find(op => op.value === d.producto) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "producto", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Producto..."
                                            isClearable
                                            styles={{
                                                container: (base) => ({
                                                ...base,
                                                width: 150, // ⬅️ ancho fijo total
                                                }),
                                                control: (base) => ({
                                                ...base,
                                                minWidth: 150,
                                                maxWidth: 150,
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

                                    <div className='form-col-item2'>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => {
                                                const productos = detalles.filter((_, index) => index !== i);
                                                setDetalles(productos);
                                            }}
                                            >                                    
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div> 


                        <div className="form-col-precioVenta">
                            <div className="form-secondary">
                                <label>
                                    Fecha de Entrega:
                                </label>
                                <input type="date" onChange={inputChange} value={filtros.fechaEntrega} name="fechaEntrega" required />
                            </div>
                            <div className="form-secondary">
                                <label htmlFor="precioVenta" className="label-box">
                                    Total:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    value={filtros.total}
                                    name="total"
                                    />
                            </div>
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
                        .modal {
                            position: fixed;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background-color: rgba(0,0,0,0.5); /* oscurece fondo */
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1000;
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
                        .btn-icon {
                            background-color: #8b0000;
                            color: white;
                            padding: 0.8rem;
                            font-size: 1.2rem;
                            border-radius: 50%;
                            border: none;
                            cursor: pointer;
                            width: 2.5rem;
                            height: 2.5rem;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: background-color 0.3s, transform 0.2s;
                        }
                        
                        .btn-icon:hover {
                        background-color: #a30000;
                        transform: translateY(-3px);
                        }

                        .modal-content {
                            background-color: #121212;
                            padding: 40px;
                            border-radius: 12px;
                            width: 90%;
                            height:80%;
                            max-width: 500px;
                            max-height: 800px;
                            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                            position: relative;
                            margin: 20px;
                        }

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

                        .titulo-pagina {
                            text-align: center;
                            font-size: 2rem;
                            margin-bottom: 1.5rem;
                            font-weight: bold;
                            color: #f5f5f5;
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

                        

                        .form-col-productos {
                            flex: 8;
                            min-width: 0; /* Importante para que no desborde */
                            display: flex;
                            flex-direction: column;
                        }
                            
                        .form-col-item1 {
                            flex: 3;
                            min-width: 0; /* Importante para que no desborde */
                            display: flex;
                            flex-direction: column;
                        }
                            
                        .form-col-item2 {
                            flex: 2;
                            min-width: 0; /* Importante para que no desborde */
                            display: flex;
                            flex-direction: column;
                        }

                        .form-col-precioVenta {
                            flex: 2;
                            min-width: 0;
                            display: flex;
                            flex-direction: column;
                        }


                        label {
                            font-weight: 500;
                            margin-bottom: 0.5rem;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        }

                        .precio-venta {
                            max-width: 100px;
                        }

                        input:focus {
                            border-color: #571212ff;
                        }

                        .precio-venta {
                            flex-direction: column;
                            align-items: flex-end;
                            justify-content: flex-start;
                            flex: 1;
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

                        .form-group-presupuesto {
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;
                            height: 160px;
                            overflow-y: auto;
                            padding-right: 8px;
                        }

                        .presupuesto-item {
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                            flex-wrap: wrap;
                        }

                        .presupuesto-item input[type="number"] {
                            width: 80px;
                        }

                        .form-secondary {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr); /* 2 columnas */
                            gap: 16px;
                            margin-top: 12px;
                            }

                            .form-col,
                            .form-group {
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            }
                            
                            .form-col1,
                            .form-group {
                            display: flex;
                            flex-direction: column;
                            width: 250;
                            }

                            .form-col label,
                            .form-group label {
                            margin-bottom: 4px;
                            font-size: 14px;
                            color: #ddd;
                            }

                            .form-group input {
                            background-color: #2c2c2c;
                            border: 1px solid #444;
                            border-radius: 8px;
                            padding: 8px;
                            color: white;
                            width: 100%;
                            }

                            .form-group input:focus {
                            outline: none;
                            border-color: #666;
                            }


                        .btn-remove {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.4rem 0.8rem;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .btn-add-producto {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 8px;
                            cursor: pointer;
                            align-self: flex-start;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .btn-add-producto:hover {
                            background-color: #571212ff;
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
                        
                        .titulo-pagina {
                            font-size: 2rem;
                            color: white;
                            text-align: center;
                            margin-top: 2px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
                        
                        .form-secondary {
                            display: flex;
                            flex-direction: column;
                            gap: 0.75rem;
                            padding: 1rem;
                            background-color: #1e1e1e;
                            border-radius: 12px;
                            box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                            font-family: 'Segoe UI', sans-serif;
                            color: #f0f0f0;
                            max-width: 200px;
                        }

                        .label-box {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            font-size: 1rem;
                            cursor: pointer;
                        }

                        .checkbox-envio {
                            width: 18px;
                            height: 18px;
                            accent-color: #8B0000; /* color vino para el checkbox */
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

                        .form-col label {
                            display: flex;
                            align-items: center;
                            color: white;
                            font-weight: bold;
                            margin-bottom: 0.5rem;
                        }

                        .form-col input[type="date"] {
                            width: 220px;
                            background-color: #2c2c2c;
                            color: white;
                            border: 1px solid #444;
                            border-radius: 8px;
                            padding: 0.4rem 0.6rem;
                            font-size: 1rem;
                            outline: none;
                        }

                        .form-col input[type="date"]::-webkit-calendar-picker-indicator {
                            filter: invert(1); /* icono blanco en navegadores webkit */
                        }


                `}
            </style>
        </>
    )
}

export default busquedaOrdenCompra;