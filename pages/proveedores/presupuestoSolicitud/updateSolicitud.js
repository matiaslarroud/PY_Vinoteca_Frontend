const { useState, useEffect } = require("react")
import Select from 'react-select';     
import { FaTrash , FaSearch} from "react-icons/fa";

import FormularioCreateProveedor from "../createProveedor"
import FormularioBusquedaProveedor from "../busquedaProveedor"
import FormularioCreateEmpleado from "../../gestion/empleado/createEmpleado"

import FormularioBusquedaInsumo from '../../products/insumos/busquedaInsumo'
import FormularioBusquedaVino from '../../products/vinos/busquedaVino'
import FormularioBusquedaPicada from '../../products/picadas/busquedaPicada'

const { default: Link } = require("next/link")

const initialStatePresupuesto = {proveedor:'', empleado:''}
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

const updatePresupuesto = ({exito,solicitudID}) => {
    const [presupuesto , setPresupuesto] = useState(initialStatePresupuesto);
    
    const [proveedores,setProveedores] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);

    const [mostrarModalBusquedaProveedor , setMostrarModalBusquedaProveedor] = useState(false)
    const [filtro , setFiltro] = useState(false) 
        
    const [productosBase, setProductosBase] = useState([]);

    const [detalleActivo, setDetalleActivo] = useState(null);
    
    const limpiarFiltros = () => {
        setProductos(productosBase);
    };
    
    const [filtroVino , setFiltroVino] = useState(initialStateVino); 
    const [filtroPicada , setFiltroPicada] = useState(initialStatePicada); 
    const [filtroInsumo , setFiltroInsumo] = useState(initialStateInsumo); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);
            
    
    const detallesValidos = detalles.filter(d => d.producto && d.cantidad > 0);
    const puedeGuardar = detallesValidos.length > 0;

    
    const fetchData_SolicitudPresupuesto = (param) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/solicitudPresupuesto/${param}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setPresupuesto(s.data)
                }
            })
        .catch((err)=>{console.log("Error al cargar solicitud de presupuesto.\nError: ",err)})
    }

    
    
    const fetchData_SolicitudPresupuestoDetalle = async (presupuestoID) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/solicitudPresupuestoDetalle/solicitudPresupuesto/${presupuestoID}`);
            const s = await res.json();
            if (s.ok) {
                console.log(s.data)
                setDetalles(s.data); // guardamos directo
            }
        } catch (err) {
            console.log("Error al cargar detalles.\nError: ", err);
        }
    };

    const fetchData_Productos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setProductos(s.data)
                    setProductosBase(s.data)
                }
            })
        .catch((err)=>{console.log("Error al cargar productos.\nError: ",err)})
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
    useEffect(()=>{
        setDetalles([]);
        fetchData_SolicitudPresupuesto(solicitudID);
        fetchData_SolicitudPresupuestoDetalle(solicitudID);
        fetchData_Proveedores();
        fetchData_Empleados();
        fetchData_Productos();
        fetchData_TipoProductos();
    }, [solicitudID])

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
    
    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;

        setDetalles(nuevosDetalles);
    };
    

    const clickChange = async(e) => {
         e.preventDefault();
         const resPresupuesto = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/solicitudPresupuesto/${solicitudID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    proveedor: presupuesto.proveedor,
                    empleado: presupuesto.empleado,
                    detalles: detalles
                })
            }
        )

        const solicitudCreada = await resPresupuesto.json();
        
        setDetalles([initialDetalle]);
        setPresupuesto(initialStatePresupuesto);
        alert(solicitudCreada.message)
        exito();
    }
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setPresupuesto({
            ...presupuesto,
            [name]: value,
        });
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"",producto: "", cantidad: 0 } }]);
        limpiarFiltros();
    };

    const [mostrarModalProveedor, setMostrarModalCreateProveedor] = useState(false)
    const [mostrarModalEmpleado, setMostrarModalCreateEmpleado] = useState(false)

    const [mostrarModalBuscarInsumo, setMostrarModalBuscarInsumo] = useState(false);
    const [mostrarModalBuscarPicada, setMostrarModalBuscarPicada] = useState(false);
    const [mostrarModalBuscarVino, setMostrarModalBuscarVino] = useState(false);

    const opciones_tipoProductos = tipoProductos.map(v => ({
        value: v,
        label: v === "ProductoVino" ? "Vino" :
                v === "ProductoPicada" ? "Picada" :
                v === "ProductoInsumo" ? "Insumo" : v
    }));
    const opciones_empleados = empleados.map(v => ({ value: v._id,label: `${v._id} - ${v.name}` }));
    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: `${v._id} - ${v.name}` }));

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
            
            {mostrarModalEmpleado && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalCreateEmpleado(false)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateEmpleado
                            exito={() => 
                                {
                                    setMostrarModalCreateEmpleado(null)
                                    fetchData_Empleados()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalProveedor && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalCreateProveedor(false)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateProveedor
                            exito={() => 
                                {
                                    setMostrarModalCreateProveedor(null)
                                    fetchData_Proveedores()
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
                <h1 className="titulo-pagina">Modificar Solicitud de Presupuesto</h1>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Proveedor:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreateProveedor(true)}>+</button>
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalBusquedaProveedor(true)}><FaSearch/></button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_proveedores}
                                value={opciones_proveedores.find(op => op.value === presupuesto.proveedor) || null}
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

                        <div className="form-col">
                            <label>
                                Empleado:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreateEmpleado(true)}>+</button>
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
                                            styles={{
                                                container: (base) => ({
                                                    ...base,
                                                    width: 150,
                                                }),
                                                control: (base, state) => ({
                                                    ...base,
                                                    width: 150,
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
                                            }}
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
                                                    width: 150,
                                                }),
                                                control: (base, state) => ({
                                                    ...base,
                                                    width: 150,
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
                                            }}
                                        />
                                    </div>
                                    
                                    <div className='form-col-item1'>
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            min={1}
                                            value={d.cantidad}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
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
                                })}
                            </div>
                        </div> 
                        <div className="form-col-precioVenta">
                            <div className="box-cargar" >
                                <div className="form-submit">
                                    <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={(e) => {
                                        if (!puedeGuardar) {
                                        alert("❌ No se puede guardar una solicitud presupuesto sin al menos un producto con cantidad.");
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
                        </div>
                    </div>
                </form>
            </div>
            <style jsx>
                {`
                    
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
                    
                    .titulo-pagina {
                        font-size: 2rem;
                        width: 100%;
                        color: white;
                        text-align: center;
                        margin-top: 2px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
                        
                    .box-cargar{
                        justify-content: center;
                        align-items: center;
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
                        width: 100%;
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-productos {
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item1 {
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
                `}
            </style>
        </>
    )
}

export default updatePresupuesto;