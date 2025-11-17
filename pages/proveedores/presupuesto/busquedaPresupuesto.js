const { useState, useEffect } = require("react")
import Select from 'react-select';          
import { FaTrash} from "react-icons/fa";
import FormularioEmpleadoCreate from '../../gestion/empleado/createEmpleado'
import FormularioClienteCreate from '../../clientes/createCliente'

const { default: Link } = require("next/link")

const initialStatePresupuesto = {presupuestoID:'' , total:'', proveedor:'', solicitudPresupuesto:'', empleado:'', medioPago:''}
const initialDetalle = { tipoProducto: "",producto: "", cantidad: 0, precio: 0, importe: 0, presupuesto:'' };

const busquedaProveedor = ({ exito, filtro, onChangeFiltro , filtroDetalle , onChangeFiltroDetalle }) => {
    const [presupuesto , setPresupuesto] = useState(initialStatePresupuesto);
    
    const [proveedores,setProveedores] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [mediosPago,setMediosPago] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
    const [solicitudesPresupuesto,setSolicitudesPresupuesto] = useState([]);
                
    const [filtros, setFiltros] = useState(filtro);
    
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
            setDetalles(filtroDetalle)
    }, [filtro,filtroDetalle]);
    
    const borrarFiltros = () => {
            setFiltros(initialStatePresupuesto);
            onChangeFiltro(initialStatePresupuesto);
            setDetalles([])
            onChangeFiltroDetalle([]);
    };
    
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
                }
            })
        .catch((err)=>{console.log("Error al cargar productos.\nError: ",err)})
    }
    
    const fetchData_MediosPago = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/medioPago`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setMediosPago(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar los medios de pago.\nError: ",err)})
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
    
    const fetchData_Solicitudes = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/solicitudPresupuesto`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setSolicitudesPresupuesto(s.data);
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
        fetchData_Proveedores();
        fetchData_Empleados();
        fetchData_Productos();
        fetchData_MediosPago();
        fetchData_TipoProductos();
        fetchData_Solicitudes();
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

    
    
const agregarDetallePresupuesto = async (solicitudID) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/solicitudPresupuestoDetalle/solicitudPresupuesto/${solicitudID}`
    );
    const s = await res.json();

    if (!s.ok) {
      console.error("Error al cargar detalles de la solicitud:", s.message);
      return;
    }

    // s.data es un array de detalles [{producto, cantidad}, ...]
    const nuevosDetalles = await Promise.all(
      s.data.map(async (detalle) => {
        let precio = 0;
        let importe = 0;
        // Buscamos los datos del producto
        const prodRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/${detalle.producto}`
        );
        const prodData = await prodRes.json();

        if (!prodData.ok) return null;


        if(prodData.data.precioCosto){
            ganancia = ( prodData.data.ganancia ) / 100;
            precio = prodData.data.precioCosto + ( prodData.data.precioCosto * ganancia )
            importe = precio * detalle.cantidad;
        }

        if(prodData.data.precioVenta){
            precio = prodData.data.precioVenta
            importe = ( prodData.data.precioVenta)* detalle.cantidad ;
        }

        return {
          tipoProducto: prodData.data.tipo || "",
          producto: detalle.producto,
          cantidad: detalle.cantidad,
          precio,
          importe
        };
      })
    );

    // Filtramos por si alguno vino como null
    const filtrados = nuevosDetalles.filter((d) => d !== null);

    // Actualizamos el estado con todos los detalles nuevos
    setDetalles((prev) => [...prev, ...filtrados]);

  } catch (error) {
    console.error("Error de red al cargar detalles del presupuesto:", error);
  }
};

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;

        setDetalles(nuevosDetalles);
        onChangeFiltroDetalle(nuevosDetalles)
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/presupuesto/buscar`, {
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

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"",producto: "", cantidad: 0, precio: 0, importe: 0 } }]);
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
    const opciones_empleados = empleados.map(v => ({ value: v._id,label: `${v._id} - ${v.name}` }));
    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: `${v._id} - ${v.name}` }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: `${v.name}` }));
    const opciones_solicitudes = solicitudesPresupuesto.filter((s)=>{return s.proveedor === filtros.proveedor })
        .map(v => {
            return {
                value: v._id,
                label: `${v._id}`
            };
        }
    );

    return(
        <>
                <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Busqueda Avanzada de Presupuesto</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Presupuesto N° :
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={filtros.presupuestoID}
                                name="presupuestoID"
                                onChange={inputChange}
                                />
                        </div>
                        <div className="form-col">
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

                        <div className="form-col">
                            <label>
                                Solicitud de Presupuesto:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_solicitudes}
                                value={opciones_solicitudes.find(op => op.value === filtros.solicitudPresupuesto) || null}
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

                        <div className="form-col">
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
                                
                                {detalles.map((d, i) => {

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
                                })}
                            </div>
                        </div> 
                        <div className="form-col-precioVenta">
                            <div className="box-cargar" >
                                <label htmlFor="precioVenta">Total:
                                    <input
                                        type="number"
                                        className='precio-venta'
                                        onChange={inputChange}
                                        value={filtros.total}
                                        name="total"
                                    />
                                </label>
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
                        text-align: center;
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

export default busquedaProveedor;