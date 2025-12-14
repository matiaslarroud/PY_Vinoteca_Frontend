const { useState, useEffect, use } = require("react")
import Select from 'react-select';    
import {  FaSearch} from "react-icons/fa"; 

const { default: Link } = require("next/link")
import FormularioBusqueedaCliente from "../busquedaCliente"


const busquedaRemitoCliente = ({exito, filtro, onChangeFiltro , filtroDetalle , onChangeFiltroDetalle }) => {
    const initialState = {remitoID: '' , cliente:'',totalPrecio:0, totalBultos:0, fecha:'', comprobanteVentaID:'', transporteID:'', entregado:false}
    
    const [remito , setRemito] = useState(initialState);
    const [puedeGuardar, setPuedeGuardar] = useState(false);
    const [pedidos, setPedidos] = useState([]);
    const [productos, setProductos] = useState([]);
    const [transporte , setTransporte] = useState([])
    const [clientes, setClientes] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [comprobantesVenta, setComprobantesVenta] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
            
    const [filtros, setFiltros] = useState(filtro);
    const [mostrarModalBusquedaCliente, setMostrarModalBusquedaCliente] = useState(false);
        
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
            setDetalles(filtroDetalle)
    }, [filtro,filtroDetalle]);
        
    const borrarFiltros = () => {
            setFiltros(initialState);
            onChangeFiltro(initialState);
            setDetalles([])
            onChangeFiltroDetalle([]);
    }

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;
        setDetalles(nuevosDetalles);
        onChangeFiltroDetalle(nuevosDetalles)
    };

    const calcularTotalPrecio = (detalles) => {
        const totalPedido = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.importe || 0), 0)
            : 0;
        setRemito((prev) => ({ ...prev, totalPrecio: totalPedido }));
    };

    
    const calcularTotalBultos = (detalles) => {
        const totalPedido = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0)
            : 0;
        setRemito((prev) => ({ ...prev, totalBultos: totalPedido }));
    };

    const fetchData_ComprobanteVentaDetalle = async (comprobanteID) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVentaDetalle/ComprobanteVenta/${comprobanteID}`);
            const s = await res.json();
            if (s.ok) {
                setDetalles(                    
                    s.data.map(d => ({ ...initialDetalle, ...d }))
                );
                calcularTotalPrecio(s.data);
                calcularTotalBultos(s.data);
            }
        } catch (err) {
            console.log("Error al cargar vinos.\nError: ", err);
        }
    };

    const fetchData_ComprobantesVenta = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta`);
            const s = await res.json();
            if (s.ok) {
                const comprobantesSinRemito = s.data.filter(c => c.remitoCreado === false);
                setComprobantesVenta(comprobantesSinRemito || []);
            }
        } catch (err) {
            console.log("Error al cargar comprobantes de venta.\nError: ", err);
            setComprobantesVenta([]);
        }
    };

    const fetchData_Productos = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`);
            const s = await res.json();
            if (s.ok) setProductos(s.data || []);
        } catch (err) {
            console.log("Error al cargar productos.\nError: ", err);
            setProductos([]);
        }
    };
    
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

    const fetchData_Transporte = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte`);
            const s = await res.json();
            if (s.ok) setTransporte(s.data || []);
        } catch (err) {
            console.log("Error al cargar transportes.\nError: ", err);
            setTransporte([]);
        }
    };

    const fetchData_Clientes = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`);
            const s = await res.json();
            setClientes(s.data || []);
        } catch (err) {
            console.log("Error al cargar clientes.\nError: ", err);
            setClientes([]);
        }
    };

    const fetchData_PedidosByCliente = async (cliente) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/cliente/${cliente}`);
            const s = await res.json();
            setPedidos(s.data || []); 
        } catch (err) {
            console.log("Error al cargar pedidos.\nError: ", err);
            setPedidos([]);
        }
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"" , producto: ""}}]);
    };
    
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/buscar`, {
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
        onChangeFiltroDetalle(detalles);

        if (name === 'comprobanteVentaID' && value) {
            setPuedeGuardar(true);
            fetchData_ComprobanteVentaDetalle(value);
        }
    };
    
    const inputChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
        onChangeFiltroDetalle(detalles); 
    };

    useEffect(() => {
        fetchData_ComprobantesVenta();
        fetchData_Productos();
        fetchData_TipoProductos();
        fetchData_Clientes();
        fetchData_Transporte();
    }, []);
    
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

    useEffect(() => {
        if (remito.cliente) {
            fetchData_PedidosByCliente(remito.cliente);
        } else {
            setPedidos([]);
        }
    }, [remito.cliente]);

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

    const opciones_clientes = clientes.map(v => ({
        value: v._id, label: v.name
    }));

    const opciones_comprobantesVenta = comprobantesVenta && pedidos.length > 0
        ? comprobantesVenta
            .filter(v => pedidos.some(p => p._id === v.notaPedido))
            .map(v => ({
                value: v._id,
                label: `${v._id} - ${v.tipoComprobante} - ${v.fecha.split("T")[0]} - $${v.total}`,
                total: v.total
            }))
        : []; 

    const opciones_transporte = transporte.map(v => ({
        value: v._id, label: v.name
    }));
   

    return(
        <>

            <div className="form-container">
                <h1 className="titulo-pagina">Busqueda Avanzada de Remito</h1>
                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Remito N° :
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={filtros.remitoID}
                                name="remitoID"
                                onChange={inputChange}
                                />
                        </div>
                        <div className="form-col">
                            <label>
                                Cliente:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_clientes}
                                value={opciones_clientes.find(op => op.value === filtros.cliente) || null}
                                onChange={selectChange}
                                name='cliente'
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

                        <div className="form-col">
                            <label>
                                Comprobante de Venta:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_comprobantesVenta}
                                value={opciones_comprobantesVenta.find(op => op.value === filtros.comprobanteVentaID) || null}
                                onChange={selectChange}
                                name='comprobanteVentaID'
                                placeholder="Comprobante de venta..."
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

                        <div className="form-col">
                            <label>
                                Transporte:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_transporte}
                                value={opciones_transporte.find(op => op.value === filtros.transporteID) || null}
                                onChange={selectChange}
                                name='transporteID'
                                placeholder="Transporte..."
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
                        
                        <div className="form-col">
                                <label>
                                    Fecha:
                                </label>
                            <input type="date" onChange={inputChange} value={filtros.fecha} name="fecha" />
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
                                                width: 300, // ⬅️ ancho fijo total
                                                }),
                                                control: (base) => ({
                                                ...base,
                                                minWidth: 300,
                                                maxWidth: 300,
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
                                ))}
                            </div>
                        </div> 


                        <div className="form-col-precioVenta">
                            <div className="form-secondary">
                                <label htmlFor="precioVenta" className="label-box">
                                    Total Bultos:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    value={filtros.totalBultos}
                                    onChange={inputChange}
                                    name="totalBultos"
                                />
                                <label htmlFor="precioVenta" className="label-box">
                                    Total Precio:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    onChange={inputChange}
                                    value={filtros.totalPrecio}
                                    name="totalPrecio"
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

                        .form-col {
                            flex: 1;
                            min-width: 200px;
                            display: flex;
                            flex-direction: column;
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
                            max-width: 400px;
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

export default busquedaRemitoCliente;