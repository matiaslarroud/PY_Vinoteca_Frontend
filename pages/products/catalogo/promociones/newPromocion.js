const { useState, useEffect } = require("react")
import Select from 'react-select';   
import { FaTrash , FaSearch} from "react-icons/fa";

// import FormularioCreateMedioPago from "../gestion/tablasVarias/medioPago/createMedioPago"

// import FormularioBusquedaInsumo from '../../products/insumos/busquedaInsumo'
// import FormularioBusquedaVino from '../../products/vinos/busquedaVino'
// import FormularioBusquedaPicada from '../../products/picadas/busquedaPicada'

const { default: Link } = require("next/link")

const initialStateOferta = {total:'', name:''}

const initialDetalle = {
    tipoProducto: "",
    producto: "",
    cantidad: 0,
    precio: 0,
    oferta:"",
    importe: 0,
    descuento:0
};

const initialStateVino = {name:'',stock:0 , stockMinimo:'', proveedor:'' , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'' , varietal:'' , volumen:'' , deposito:''}
const initialStateInsumo = {name:'',stock:0, stockMinimo:'' , precioCosto:0 , ganancia:0 , deposito:'' , proveedor:''}
const initialStatePicada = {name:'',stock:0, stockMinimo:'' , precioVenta:0 , deposito:''}


const createPresupuesto = ({exito}) => {
    const [oferta , setOferta] = useState(initialStateOferta);
    
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

    useEffect(()=>{
        setDetalles([]);
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

    const clickChange = async(e) => {
         e.preventDefault();
         const bodyData = {
            total: oferta.total,
            name: oferta.name,
            detalles : detalles
         }

         const resOferta = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/oferta`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(bodyData)
            }
        )

        const ofertaCreada = await resOferta.json();
        
        if(!ofertaCreada.ok){
            alert(ofertaCreada.message)
            return
        }
        setDetalles([initialDetalle]);
        setOferta(initialStateOferta);
        alert(ofertaCreada.message)
        exito();
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setOferta({
            ...oferta , 
                [name]:value
        })   
    }

    const handleDetalleChange = (index, field, value) => {
    const nuevosDetalles = [...detalles];

    // Siempre convertir valor de entrada a número si corresponde
    const numValue = parseFloat(value) || 0;

    if (field === "cantidad") {
        nuevosDetalles[index].cantidad = numValue;
        nuevosDetalles[index].importe =
            (nuevosDetalles[index].precio || 0) * numValue;
    }

    else if (field === "precio") {
        nuevosDetalles[index].precio = numValue;
        nuevosDetalles[index].importe =
            numValue * (nuevosDetalles[index].cantidad || 0);
    }

    else {
        // Para cualquier otro campo (ej: nombre, productoVino, etc.)
        nuevosDetalles[index][field] = value;
    }

    setDetalles(nuevosDetalles);
    calcularTotal(nuevosDetalles);
};

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setOferta({
            ...oferta,
            [name]: value,
        });
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"",producto: "", cantidad: 0, precio: 0, importe: 0,descuento:0 } }]);
        limpiarFiltros();
    };
    
    const calcularTotal = (detalles) => {
        const totalPresupuesto = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.importe || 0), 0)
                : 0;
        setOferta((prev) => ({ ...prev, total:totalPresupuesto }));
    };

    
    const [mostrarModalBuscarInsumo, setMostrarModalBuscarInsumo] = useState(false);
    const [mostrarModalBuscarPicada, setMostrarModalBuscarPicada] = useState(false);
    const [mostrarModalBuscarVino, setMostrarModalBuscarVino] = useState(false);

    const opciones_tipoProductos = tipoProductos.map(v => ({
        value: v,
        label: v === "ProductoVino" ? "Vino" :
                v === "ProductoPicada" ? "Picada" :
                v === "ProductoInsumo" ? "Insumo" : v
    }));

    return(
        <>
           
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


            {/* SEGUIR DESDE ACA */}

            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Cargar Oferta</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Proveedor:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalProveedor(true)}>+</button>
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
                                Solicitud de Presupuesto:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalSolicitudPresupuesto(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_solicitudes}
                                value={opciones_solicitudes.find(op => op.value === presupuesto.solicitudPresupuesto) || null}
                                onChange={selectChange}
                                name='solicitudPresupuesto'
                                placeholder="Solicitud de presupuesto..."
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
                                Medio de Pago:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalMedioPago(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_mediosPago}
                                value={opciones_mediosPago.find(op => op.value === presupuesto.medioPago) || null}
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
                                            value={d.cantidad}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
                                        />
                                    </div>
                                    
                                    <div className='form-col-item1'>
                                        <input
                                            type="number"
                                            placeholder="Precio Unitario"
                                            min={0}
                                            value={d.precio}
                                            onChange={(e) => handleDetalleChange(i, "precio", e.target.value)}
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
                        <div className="box-cargar" >
                                <label htmlFor="precioVenta">Total:
                                    <input
                                        type="number"
                                        className='precio-venta'
                                        onChange={inputChange}
                                        value={presupuesto.total}
                                        name="total"
                                        disabled
                                    />
                                </label>
                                <div className="form-submit">
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
                                    Cargar
                                    </button>
                                </div>
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
                        
                    .box-cargar{
                        justify-content: center;
                        align-items: center;
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
                    
                    .form-col-item1,
                    {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
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
                `}
            </style>
        </>
    )
}

export default createPresupuesto;