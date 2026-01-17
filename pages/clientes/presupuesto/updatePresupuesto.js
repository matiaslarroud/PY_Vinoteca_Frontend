const { useState, useEffect } = require("react")
import Select from 'react-select';      
import { FaTrash , FaSearch} from "react-icons/fa";

import FormularioEmpleadoCreate from '../../gestion/empleado/createEmpleado'
import FormularioClienteCreate from '../createCliente'
import FormularioBusqueedaCliente from "../busquedaCliente"

import FormularioBusquedaInsumo from '../../products/insumos/busquedaInsumo'
import FormularioBusquedaVino from '../../products/vinos/busquedaVino'
import FormularioBusquedaPicada from '../../products/picadas/busquedaPicada'

const { default: Link } = require("next/link")

const initialStatePresupuesto = {total:'', cliente:'', empleado:''}
const initialDetalle = {
    tipoProducto: "",
    producto: "",
    cantidad: 0,
    precio: 0,
    presupuesto:"",
    importe: 0,
    productos: []
};

const initialStateVino = {name:'',stock:0 , stockMinimo:'', proveedor:'' , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'' , varietal:'' , volumen:'' , deposito:''}
const initialStateInsumo = {name:'',stock:0, stockMinimo:'' , precioCosto:0 , ganancia:0 , deposito:'' , proveedor:''}
const initialStatePicada = {name:'',stock:0, stockMinimo:'' , precioVenta:0 , deposito:''}

const updatePresupuesto = ({exito,presupuestoID}) => {
    const [presupuesto , setPresupuesto] = useState(initialStatePresupuesto);
    
    const [clientes,setClientes] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [productosBase, setProductosBase] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
    const [filtro , setFiltro] = useState(); 
    
    const [filtroVino , setFiltroVino] = useState(initialStateVino); 
    const [filtroPicada , setFiltroPicada] = useState(initialStatePicada); 
    const [filtroInsumo , setFiltroInsumo] = useState(initialStateInsumo); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);

    const [detalleActivo, setDetalleActivo] = useState(null);
    
    const limpiarFiltros = () => {
        setProductos(productosBase);
    };
    
    const detallesValidos = detalles.filter(d => d.producto && d.cantidad > 0);
    const puedeGuardar = detallesValidos.length > 0;

    const fetchData_Presupuesto = async (presupuestoID) => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/${presupuestoID}`)
            .then((a)=>{
                return a.json();
            })
                .then((s)=>{
                    if(s.ok){
                        setPresupuesto(s.data)
                    }
                })
            .catch((err)=>{console.log("Error al cargar vinos.\nError: ",err)})
    }
    
    const fetchData_PresupuestoDetalle = async (presupuestoID) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuestoDetalle/presupuesto/${presupuestoID}`);
            const s = await res.json();
            if (s.ok) {
                setDetalles(s.data); // guardamos directo
            }
        } catch (err) {
            console.log("Error al cargar detalles.\nError: ", err);
        }
    };

    
    const fetchData_Productos = async() => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setProductos(s.data)
                    setProductosBase(s.data)
                }
            })
        .catch((err)=>{console.log("Error al cargar vinos.\nError: ",err)})
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
    
    const fetchData_Clientes = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setClientes(s.data)
                })
    }

    const fetchData_Empleados = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/empleado`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setEmpleados(s.data)
                })
    }

    useEffect(() => {
        if (!presupuestoID) return;

        fetchData_Clientes();
        fetchData_Empleados();
        fetchData_TipoProductos();
        fetchData_Productos();
        fetchData_Presupuesto(presupuestoID);
        fetchData_PresupuestoDetalle(presupuestoID);
    }, [presupuestoID]);

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


    const clickChange = async(e) => {
         e.preventDefault();
         const resPresupuesto = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/${presupuestoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    cliente: presupuesto.cliente,
                    empleado: presupuesto.empleado,
                    total: presupuesto.total,
                    detalles:detalles
                })
            }
        )

        const presupuestoCreado = await resPresupuesto.json();
        if(!presupuestoCreado.ok) {
            alert(presupuestoCreado.message)
            return
        }
        
        setDetalles([initialDetalle]);
        setPresupuesto(initialStatePresupuesto);
        alert(presupuestoCreado.message)
        exito();
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setPresupuesto({
            ...presupuesto , 
                [name]:value
        })   
    }


    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;
        
        const prod = productos.find(p => p._id === nuevosDetalles[index].producto);

        if (prod) {
            if(prod.precioCosto){
                const ganancia = prod.ganancia;
                const precio = prod.precioCosto + ((prod.precioCosto * ganancia) / 100);

                nuevosDetalles[index].precio = precio;
                nuevosDetalles[index].importe = precio * nuevosDetalles[index].cantidad;
            }
            if(!prod.precioCosto && prod.precioVenta){
                const precio = prod.precioVenta;

                nuevosDetalles[index].precio = precio;
                nuevosDetalles[index].importe = precio * nuevosDetalles[index].cantidad;
            }

        } else {
            nuevosDetalles[index].precio = 0;
            nuevosDetalles[index].importe = 0;
        }

        setDetalles(nuevosDetalles);
        calcularTotal(nuevosDetalles);
    };
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setPresupuesto({
            ...presupuesto,
            [name]: value,
        });
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"", producto: "", precio: 0, importe: 0 } }]);
        limpiarFiltros();
    };
    
    const calcularTotal = (detalles) => {
        const totalPresupuesto = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.importe || 0), 0)
                : 0;
        setPresupuesto((prev) => ({ ...prev, total:totalPresupuesto }));
    };
    
    const [mostrarModalEmpleado, setMostrarModalEmpleado] = useState(false);
    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
    const [mostrarModalBusquedaCliente, setMostrarModalBusquedaCliente] = useState(false);

    const [mostrarModalBuscarInsumo, setMostrarModalBuscarInsumo] = useState(false);
    const [mostrarModalBuscarPicada, setMostrarModalBuscarPicada] = useState(false);
    const [mostrarModalBuscarVino, setMostrarModalBuscarVino] = useState(false);

     const opciones_tipoProductos = tipoProductos.map(v => ({
        value: v,
        label: v === "ProductoVino" ? "Vino" :
                v === "ProductoPicada" ? "Picada" :
                v === "ProductoInsumo" ? "Insumo" : v
    }));

    const opciones_empleados = empleados.map(v => ({ value: v._id,label: v.name }));
    const opciones_clientes = clientes.map(v => ({ value: v._id,label: `${v.name} ${v.lastname}` }));

    const customStyle = {
        container: (base) => ({
            ...base,
            width: 180,
        }),
        control: (base, state) => ({
            ...base,
            width: 180,
            backgroundColor: '#2c2c2c !important',
            borderColor: state.isFocused ? '#666' : '#444',
            borderRadius: 8,
            color: 'white',
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
        singleValue: (base) => ({
            ...base,
            color: 'white !important',
        }),
        input: (base) => ({
            ...base,
            color: 'white !important',
        }),
    }
    return(
        <>
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
           
            {mostrarModalEmpleado && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalEmpleado(false)}>&times;</button>
                    <FormularioEmpleadoCreate
                    exito={() => {
                        setMostrarModalEmpleado(false);
                        fetchData_Empleados();
                    }}
                    />
                </div>
                </div>
            )}

            {mostrarModalCliente && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCliente(false)}>&times;</button>
                    <FormularioClienteCreate
                    exito={() => {
                        setMostrarModalCliente(false);
                        fetchData_Clientes();
                    }}
                    />
                </div>
                </div>
            )}
           
            {mostrarModalBuscarInsumo && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalBuscarInsumo(false)}>&times;</button>
                    <FormularioBusquedaInsumo
                    filtro={filtroInsumo} 
                    exito={(resultados) => {
                        if (resultados.length > 0) {
                            const copia = [...detalles];
                            copia[detalleActivo].productos = resultados;
                            setDetalles(copia);
                            setMostrarModalBuscarInsumo(false);
                        }
                    }}

                    onChangeFiltro={(nuevoFiltro) => setFiltroInsumo(nuevoFiltro)}
                    />
                </div>
                </div>
            )}
           
            {mostrarModalBuscarPicada && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalBuscarPicada(false)}>&times;</button>
                    <FormularioBusquedaPicada
                        filtro={filtroPicada} // ✅ le pasamos el estado actual
                        filtroDetalle={filtroDetalle}
                        exito={(resultados) => {
                            if (resultados.length > 0) {
                                const copia = [...detalles];
                                copia[detalleActivo].productos = resultados;
                                setDetalles(copia);
                                setMostrarModalBuscarPicada(false);
                            }
                        }}

                        onChangeFiltro={(nuevoFiltro) => setFiltroPicada(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
                        onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
                    />
                </div>
                </div>
            )}
           
            {mostrarModalBuscarVino && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalBuscarVino(false)}>&times;</button>
                    <FormularioBusquedaVino
                        filtro={filtroVino} // ✅ le pasamos el estado actual
                        filtroDetalle={filtroDetalle}
                        exito={(resultados) => {
                            if (resultados.length > 0) {
                                const copia = [...detalles];
                                copia[detalleActivo].productos = resultados;
                                setDetalles(copia);
                                setMostrarModalBuscarVino(false);
                            }
                        }}

                        onChangeFiltro={(nuevoFiltro) => setFiltroVino(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
                        onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
                    />
                </div>
                </div>
            )}

            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Modificar Presupuesto</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Cliente:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCliente(true)}>+</button>
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalBusquedaCliente(true)}><FaSearch/></button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_clientes}
                                value={opciones_clientes.find(op => op.value === presupuesto.cliente) || null}
                                onChange={selectChange}
                                name='cliente'
                                placeholder="Cliente..."
                                isClearable
                                styles={customStyle}
                            />
                        </div>

                        <div className="form-col">
                            <label>
                                Empleado:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalEmpleado(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_empleados}
                                value={opciones_empleados.find(op => op.value === presupuesto.empleado) || null}
                                onChange={selectChange}
                                name='empleado'
                                placeholder="Empleado..."
                                isClearable
                                styles={customStyle}
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
                                
                                {detalles.map((d, i) => {
                                                                
                                    const opciones_productos = (
                                            d.productos && d.productos.length > 0
                                                ? d.productos        // ← filtrados SOLO de este detalle
                                                : productosBase      // ← base completa
                                        ).map(v => ({
                                            value: v._id,
                                            label: v.name,
                                            stock: v.stock,
                                            tipoProducto: v.tipoProducto
                                        }));


                                return <div key={i} className="presupuesto-item">
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
                                            styles={customStyle}
                                        />
                                    </div>
                                    
                                    <div className='form-col-item1'>
                                        {d.tipoProducto && (
                                        <button
                                                    type="button"
                                                    className="btn-plus"
                                                    onClick={() => {
                                                        if (d.tipoProducto === 'ProductoInsumo') {
                                                            setDetalleActivo(i);
                                                            setMostrarModalBuscarInsumo(true);
                                                        } 
                                                        else if (d.tipoProducto === 'ProductoPicada') {
                                                            setDetalleActivo(i);
                                                            setMostrarModalBuscarPicada(true);
                                                        } 
                                                        else if (d.tipoProducto === 'ProductoVino') {
                                                            setDetalleActivo(i);
                                                            setMostrarModalBuscarVino(true);
                                                        }
                                                    }}
                                                    title="Búsqueda avanzada"
                                                >
                                                    <FaSearch />
                                            </button>
                                        )}
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
                                                    width: '100%',
                                                }),
                                                control: (base, state) => ({
                                                    ...base,
                                                    width: '100%',
                                                    backgroundColor: '#2c2c2c',
                                                    borderColor: state.isFocused ? '#666' : '#444',
                                                    borderRadius: 8,
                                                    color: 'white',
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
                                                singleValue: (base) => ({
                                                    ...base,
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
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            min={1}
                                            max={opciones_productos.find((p) => p.value === d.producto)?.stock || 0}
                                            value={d.cantidad}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className='form-col-item2'>
                                        <span>Importe: ${d.importe.toFixed(2)}</span>
                                    </div>

                                    <div className='form-col-item2'>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => {
                                                const productos = detalles.filter((_, index) => index !== i);
                                                setDetalles(productos);
                                                calcularTotal(productos);
                                            }}
                                            >                                    
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                })}
                            </div>
                        </div>
                    </div> 
                    <div className='form-row'>
                        <div className="form-secondary">
                            <label htmlFor="precioVenta" className="label-box">
                                Total:
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={presupuesto.total}
                                name="total"
                                disabled
                                />
                            <button
                                type="submit"
                                className="submit-btn"
                                onClick={(e) => {
                                    if (!puedeGuardar) {
                                    alert("❌ No se puede guardar un presupuesto sin al menos un producto con cantidad.");
                                    e.preventDefault();
                                    return;
                                    }
                                    clickChange(e);
                                }}
                                >
                                Guardar
                                </button>
                        </div>
                    </div>
                        
                </form>
            </div>
            <style jsx>
                {`                  
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
                        min-width: 250px;
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-productos {
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
                        min-height: 200px;
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
                        background-color: #8B0000;
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
                        
                    .form-secondary {
                            display: flex;
                            flex-direction: column;
                            align-items: center; /* centra horizontalmente */
                           gap: 0.5rem;
                    }
                        
                    .form-secondary {
                            display: flex;
                            flex-direction: column;
                            gap: 0.5rem;
                            padding: 1rem;
                            background-color: #1e1e1e;
                            border-radius: 12px;
                            box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                            font-family: 'Segoe UI', sans-serif;
                            color: #f0f0f0;
                            max-width: 200px;
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
                            width: 100%;
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
                        width:100%;
                        transition: border-color 0.2s ease-in-out;
                    }

                    .input-secondary {
                            padding: 0.65rem 1rem;
                            font-size: 1rem;
                            border-radius: 8px;
                            border: 1px solid #ccc;
                            background-color: #f9f9f9;
                            color: #333;
                            width:100%;
                            transition: border-color 0.3s, box-shadow 0.3s;
                    }
                            
                     /* --- ARREGLO PARA QUE LOS SELECT NO SE PISEN --- */
                    .presupuesto-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-wrap: wrap;            /* Permite bajar a otra línea si falta espacio */
                    }
                    .form-col-item1,
                    .form-col-item2 {
                        flex: 0 0 auto;             /* ❗ Evita que se achiquen y se encimen */
                        display: flex;
                        flex-direction: column;
                    }
                    /* Opcional: evitar que react-select se expanda */
                    .form-select-react {
                        min-width: 150px;
                        max-width: 180px;
                    }
                `}
            </style>
        </>
    )
}

export default updatePresupuesto;