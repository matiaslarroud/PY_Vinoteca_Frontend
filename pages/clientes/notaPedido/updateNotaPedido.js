const { useState, useEffect } = require("react")
import Select from 'react-select';      
import { FaTrash , FaSearch} from "react-icons/fa";

import FormularioEmpleadoCreate from '../../gestion/empleado/createEmpleado'
import FormularioClienteCreate from '../createCliente'
import FormularioMedioPagoCreate from '../../gestion/tablasVarias/medioPago/createMedioPago'  
import FormularioProvinciaCreate from "../../gestion/tablasVarias/provincia/createProvincia"
import FormularioLocalidadCreate from "../../gestion/tablasVarias/localidad/createLocalidad"
import FormularioBarrioCreate from "../../gestion/tablasVarias/barrio/createBarrio"
import FormularioCalleCreate from "../../gestion/tablasVarias/calle/createCalle" 
import FormularioBusqueedaCliente from "../busquedaCliente"

import FormularioBusquedaInsumo from '../../products/insumos/busquedaInsumo'
import FormularioBusquedaVino from '../../products/vinos/busquedaVino'
import FormularioBusquedaPicada from '../../products/picadas/busquedaPicada'

const { default: Link } = require("next/link")

const initialStateNotaPedido = {total:'', cliente:'', empleado:''}
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

const updateNotaPedido = ({exito,notaPedidoID}) => {
    const [notaPedido , setNotaPedido] = useState(initialStateNotaPedido);
    
    const [clientes,setClientes] = useState([])
    const [presupuestos,setPresupuestos] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [mediosPago,setMediosPago] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
    const [habilitado, setHabilitado] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);
    const [provincias,setProvincias] = useState([])
    const [localidades,setLocalidades] = useState([])
    const [barrios,setBarrios] = useState([])
    const [calles,setCalles] = useState([])
    const [habilitadoDescuento, setHabilitadoDescuento] = useState(false);
    const [filtro , setFiltro] = useState(); 
    
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

    const fetchData_Productos = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products`)
            .then((a)=>{
                return a.json();
            })
                .then((s)=>{
                    if(s.ok){
                        setProductos(s.data);
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
    
    const fetchData_Provincias = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setProvincias(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar provincias.\nError: ",err)})
    }
    
    const fetchData_Localidades = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setLocalidades(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar localidades.\nError: ",err)})
    }
    
    const fetchData_Barrios = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setBarrios(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar barrios.\nError: ",err)})
    }
    
    const fetchData_Calles = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    setCalles(s.data);
                }
            })
        .catch((err)=>{console.log("Error al cargar calles.\nError: ",err)})
    }

    const ajustarStockTemporal = (param) => {
        if (productos.length === 0) return; 
        const nuevosProductos = [...productos];

        param.forEach((p) => {
            if (p.producto) {
            const prod = nuevosProductos.find((a) => a._id === p.producto);
            
            if (prod) {
                prod.stock += p.cantidad;
            }
            }
        });

        setProductos(nuevosProductos);
    };

    const fetchData_NotaPedidoDetalle = async (notaPedidoID) => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedidoDetalle/notaPedido/${notaPedidoID}`)
        .then((a) => a.json())
        .then((s) => {
            if (s.ok) {
                setDetalles(
                    s.data.map(d => ({
                        ...initialDetalle,
                        ...d
                    }))
                );
            }
        })
        .catch((err) => console.log("Error al cargar vinos.\nError: ", err));
};

    const fetchData_NotaPedido = async (notaPedidoID) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${notaPedidoID}`);
        const s = await res.json();

        if (!s.ok || !s.data) {
            console.warn("No se pudo cargar la nota de pedido o los datos son inválidos");
            return;
        }

        const {
            total,
            cliente,
            fechaEntrega,
            empleado,
            envio,
            presupuesto,
            medioPago,
            provincia,
            localidad,
            barrio,
            calle,
            altura,
            deptoNumero,
            deptoLetra,
            descuento
        } = s.data;

        // Marca la bandera si hay descuento
        if (descuento > 0) {
            setNotaPedido((prev) => ({
                ...prev,
                descuentoBandera: true
            }));
        }

        // Actualiza todo el estado de notaPedido
        setNotaPedido((prev) => ({
            ...prev,
            total: total ?? 0,
            cliente: Number(cliente) || "",
            empleado: Number(empleado) || "",
            envio: envio ?? false,
            presupuesto: Number(presupuesto) || "",
            medioPago: Number(medioPago) || "",
            fechaEntrega: fechaEntrega ? fechaEntrega.split("T")[0] : "",
            provincia: Number(provincia) || "",
            localidad: Number(localidad) || "",
            barrio: Number(barrio) || "",
            calle: Number(calle) || "",
            altura: Number(altura) || "",
            deptoNumero: deptoNumero ?? "",
            deptoLetra: deptoLetra ?? "",
            descuento: descuento ?? 0
        }));

        // Habilita según el campo "envio"
        setHabilitado(envio ?? false);
    } catch (err) {
        console.error("Error al cargar nota de pedido.\nError:", err);
    }
};



    const fetchData_Presupuestos = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto`)
            .then((a)=>{
                return a.json();
            })
                .then((s)=>{
                    if(s.ok){
                        setPresupuestos(s.data)
                    }
                })
            .catch((err)=>{console.log("Error al cargar vinos.\nError: ",err)})
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

    const fetchData_MediosPago = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setMediosPago(s.data)
                })
    }
     useEffect(() => {
        if (!notaPedidoID) return;

        fetchData_Clientes();
        fetchData_Empleados();
        fetchData_MediosPago();
        fetchData_TipoProductos();
        fetchData_Presupuestos();
        fetchData_Productos();
        fetchData_Provincias();
        fetchData_Localidades();
        fetchData_Barrios();
        fetchData_Calles();
        fetchData_NotaPedido(notaPedidoID);
        fetchData_NotaPedidoDetalle(notaPedidoID);
    }, [notaPedidoID]);

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

    const handleCheckboxChange = (e) => {
        setHabilitado(e.target.checked);

        setNotaPedido({
            ...notaPedido,
            envio: e.target.checked,
        });
    };

    const formatDateInput = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toISOString().split('T')[0]; 
    };


    const clickChange = async(e) => {
        e.preventDefault();
        const bodyData = {
            total: notaPedido.total,
            cliente: notaPedido.cliente,
            empleado: notaPedido.empleado,
            medioPago: notaPedido.medioPago,
            fechaEntrega: notaPedido.fechaEntrega,
            envio: notaPedido.envio,
            descuento: notaPedido.descuento,
            detalles: detalles
        };

        if (notaPedido.presupuesto) {
            bodyData.presupuesto = notaPedido.presupuesto;
        }
        
        if(notaPedido.envio){
            bodyData.provincia = notaPedido.provincia;
            bodyData.localidad = notaPedido.localidad;
            bodyData.barrio = notaPedido.barrio;
            bodyData.calle = notaPedido.calle;
            bodyData.altura = notaPedido.altura;
            bodyData.deptoNumero = notaPedido.deptoNumero;
            bodyData.deptoLetra = notaPedido.deptoLetra;
        }

        if(notaPedido.fechaEntrega===""){
            alert("❌ Faltan completar algunos campos obligatorios.")
            return
        }

        // ENVIA NOTA DE PEDIDO
        const resNotaPedido = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${notaPedidoID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })

        const notaPedidoCreado = await resNotaPedido.json();
        if(!notaPedidoCreado.ok){
            alert(notaPedidoCreado.message);
            return
        }            
            
        setDetalles([initialDetalle]);
        setNotaPedido(initialStateNotaPedido);
        alert(notaPedidoCreado.message)
        exito();
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setNotaPedido({
            ...notaPedido , 
                [name]:value
        })   
    }

    const handleCheckboxChangeDescuento = (e) => {
        setHabilitadoDescuento(e.target.checked);
        setNotaPedido({
            ...notaPedido,
            descuentoBandera: e.target.checked,
        });
    };


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

        setNotaPedido({
            ...notaPedido,
            [name]: value,
        });
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"", producto: "", precio: 0, importe: 0 } }]);
        limpiarFiltros();
    };
    
    const calcularTotal = (detalles) => {
        const totalNotaPedido = detalles.reduce((acc, d) => acc + d.importe, 0);
        setNotaPedido((prev) => ({ ...prev, total:totalNotaPedido }));
    };

    const [mostrarModalEmpleado, setMostrarModalEmpleado] = useState(false);
    const [mostrarModalCliente, setMostrarModalCliente] = useState(false);
    const [mostrarModalMedioPago, setMostrarModalMedioPago] = useState(false);
    const [mostrarModalProvincia, setMostrarModalProvincia] = useState(false);
    const [mostrarModalLocalidad, setMostrarModalLocalidad] = useState(false);
    const [mostrarModalBarrio, setMostrarModalBarrio] = useState(false);
    const [mostrarModalCalle, setMostrarModalCalle] = useState(false);
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
    const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));
    const opciones_presupuestos = presupuestos.filter((s)=>{return s.cliente === notaPedido.cliente })
            .map(v => {
                const cliente = clientes.find(c => c._id === v.cliente);
                return {
                    value: v._id,
                    label: `${v._id} - ${v.fecha.split("T")[0]} - $${v.total}`,
                    cliente: v.cliente,
                    total: v.total
                };
            }
        );
    
    
    const opciones_provincias = provincias.map(v => ({ value: v._id,label: v.name }));
    const opciones_localidades = localidades
        .filter((s)=>{return s.provincia === Number(notaPedido.provincia)})
        .map(v => ({ value: v._id,label: v.name }));
    const opciones_barrios = barrios
        .filter((s)=>{return s.localidad === Number(notaPedido.localidad)})
        .map(v => ({ value: v._id,label: v.name }));
    const opciones_calles = calles
        .filter((s)=>{return s.barrio === Number(notaPedido.barrio)})
        .map(v => ({ value: v._id,label: v.name }));
    
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
    return(
        <>
            {mostrarModalProvincia && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalProvincia(false)}>&times;</button>
                    <FormularioProvinciaCreate
                    exito={() => {
                        setMostrarModalProvincia(false);
                        fetchData_Provincias();
                    }}
                    />
                </div>
            </div>
            )}
            {mostrarModalLocalidad && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalLocalidad(false)}>&times;</button>
                    <FormularioLocalidadCreate
                    exito={() => {
                        setMostrarModalLocalidad(false);
                        fetchData_Localidades();
                    }}
                    />
                </div>
            </div>
            )}
            {mostrarModalBarrio && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalBarrio(false)}>&times;</button>
                    <FormularioBarrioCreate
                    exito={() => {
                        setMostrarModalBarrio(false);
                        fetchData_Barrios();
                    }}
                    />
                </div>
            </div>
            )}
            {mostrarModalCalle && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCalle(false)}>&times;</button>
                    <FormularioCalleCreate
                    exito={() => {
                        setMostrarModalCalle(false);
                        fetchData_Calles();
                    }}
                    />
                </div>
            </div>
            )}
            {mostrarModalMedioPago && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalMedioPago(false)}>&times;</button>
                    <FormularioMedioPagoCreate
                    exito={() => {
                        setMostrarModalMedioPago(false);
                        fetchData_MediosPago();
                    }}
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
                        <h1 className="titulo-pagina">Modificar Nota Pedido</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Cliente:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCliente(true)}>+</button>
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalBusquedaCliente(true)}><FaSearch/></button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_clientes}
                                value={opciones_clientes.find(op => op.value === notaPedido.cliente) || null}
                                onChange={selectChange}
                                name='cliente'
                                placeholder="Cliente..."
                                isClearable
                                styles={customStyle}
                            />
                        </div>

                        <div className="form-col1">
                            <label>
                                Empleado:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalEmpleado(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_empleados}
                                value={opciones_empleados.find(op => op.value === notaPedido.empleado) || null}
                                onChange={selectChange}
                                name='empleado'
                                placeholder="Empleado..."
                                isClearable
                                styles={customStyle}
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
                                value={opciones_presupuestos.find(op => op.value === notaPedido.presupuesto) || null}
                                onChange={selectChange}
                                name='presupuesto'
                                placeholder="Presupuesto..."
                                isClearable
                                styles={customStyle}
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
                                value={opciones_mediosPago.find(op => op.value === notaPedido.medioPago) || null}
                                onChange={selectChange}
                                name='medioPago'
                                placeholder="Medio de Pago..."
                                isClearable
                                styles={customStyle}
                            />
                        </div>
                    </div>
                            
                            
                    <label className="label-box">
                        <input type="checkbox" checked={habilitado} onChange={handleCheckboxChange} className="checkbox-envio" /> ¿Envío?
                    </label>

                    <div className='form-row'>

                            {habilitado && (
                                <>
                                <div className="form-col1">
                                    <label>
                                        Provincia:
                                        <button type="button" className="btn-plus" onClick={() => setMostrarModalProvincia(true)}>+</button>
                                    </label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_provincias}
                                    value={
                                        opciones_provincias.find(op => op.value === notaPedido.provincia) ||
                                        null
                                    }
                                    onChange={selectChange}
                                    name="provincia"
                                    placeholder="Provincia..."
                                    isClearable
                                    styles={customStyle}
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>
                                        Localidad:
                                        <button type="button" className="btn-plus" onClick={() => setMostrarModalLocalidad(true)}>+</button>
                                    </label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_localidades}
                                    value={
                                        opciones_localidades.find(op => op.value === notaPedido.localidad) ||
                                        null
                                    }
                                    onChange={selectChange}
                                    name="localidad"
                                    placeholder="Localidad..."
                                    isClearable
                                    styles={customStyle}
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>
                                        Barrio:
                                        <button type="button" className="btn-plus" onClick={() => setMostrarModalBarrio(true)}>+</button>
                                    </label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_barrios}
                                    value={
                                        opciones_barrios.find(op => op.value === notaPedido.barrio) || null
                                    }
                                    onChange={selectChange}
                                    name="barrio"
                                    placeholder="Barrio..."
                                    isClearable
                                    styles={customStyle}
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>
                                        Calle:
                                        <button type="button" className="btn-plus" onClick={() => setMostrarModalCalle(true)}>+</button>
                                    </label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_calles}
                                    value={
                                        opciones_calles.find(op => op.value === notaPedido.calle) || null
                                    }
                                    onChange={selectChange}
                                    name="calle"
                                    placeholder="Calle..."
                                    isClearable
                                    styles={customStyle}
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>Altura:</label>
                                    <input
                                    type="number"
                                    onChange={inputChange}
                                    value={notaPedido.altura}
                                    name="altura"
                                    placeholder="Altura"
                                    required
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>Depto. N°:</label>
                                    <input
                                    type="number"
                                    onChange={inputChange}
                                    value={notaPedido.deptoNumero}
                                    name="deptoNumero"
                                    placeholder="Depto. N°"
                                    />
                                </div>

                                <div className="form-col1">
                                    <label>Depto. Letra:</label>
                                    <input
                                    type="text"
                                    onChange={inputChange}
                                    value={notaPedido.deptoLetra}
                                    name="deptoLetra"
                                    placeholder="Depto. Letra"
                                    />
                                </div>
                                </>
                            )}
                    </div>

                    <div className="form-row">
                        <div className="form-col-productos">
                            <label>
                                    Productos:
                                    {/* <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate3(true)}>+</button> */}
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
                                            title='Cantidad'
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


                    <div className="form-row">                                                      
                            <div className="form-secondary">
                                <label>
                                    Fecha de Entrega:
                                </label>
                                <input type="date" onChange={inputChange} value={notaPedido.fechaEntrega} name="fechaEntrega" required />
                            </div>

                            <div className="form-secondary">
                                    <label className="label-box">
                                        <input
                                        type="checkbox"
                                        checked={notaPedido.descuentoBandera}
                                        onChange={handleCheckboxChangeDescuento}
                                        className="checkbox-envio"
                                        />
                                        ¿Descuento?
                                    </label>

                                    {notaPedido.descuentoBandera && (
                                        <input
                                        type="number"
                                        onChange={inputChange}
                                        name='descuento'
                                        value={notaPedido.descuento}
                                        placeholder="% de descuento ..."
                                        className="input-secondary"
                                        />
                                    )}
                                <label htmlFor="precioVenta" className="label-box">
                                    Total:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    value={notaPedido.total}
                                    name="total"
                                    disabled
                                    />
                                    

                                <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={(e) => {
                                        if (!puedeGuardar) {
                                        alert("❌ No se puede guardar una nota de pedido sin al menos un producto con cantidad.");
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

                        .form-col-productos {
                            min-width: 0; /* Importante para que no desborde */
                            display: flex;
                            flex-direction: column;
                            width: 100%;
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
                            min-height: 200px;
                            padding-right: 8px;
                        }

                        .presupuesto-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-wrap: wrap;

                        width: 80%;        /* ← NUEVO */
                        margin: 0 auto;    /* ← Centra el bloque */
                    }


                        .presupuesto-item input[type="number"] {
                            width: 80px;
                        }

                        .form-secondary {
                                display: grid;
                                grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                                gap: 1rem;
                                padding: 1rem;
                                background-color: #1e1e1e;
                                border-radius: 12px;
                                box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                                font-family: 'Segoe UI', sans-serif;
                                color: #f0f0f0;
                                width: 100%;
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

                        .input-secondary {
                            padding: 0.65rem 1rem;
                            font-size: 1rem;
                            border-radius: 8px;
                            border: 1px solid #ccc;
                            background-color: #f9f9f9;
                            color: #333;
                            transition: border-color 0.3s, box-shadow 0.3s;
                        }

                        .submit-btn {
                            background-color: #8B0000;;
                            color: white;
                            padding: 0.65rem 1rem;
                            font-size: 1rem;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: border-color 0.3s, box-shadow 0.3s;
                        }

                        .submit-btn:hover {
                            background-color: #571212ff;
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
                            gap: 0.5rem;
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
                            
                        input[type="date"] {
                            background-color: #2c2c2c;
                            color: white;
                            border: 1px solid #444;
                            border-radius: 10px;
                            padding: 0.6rem 0.8rem;
                            font-size: 1rem;
                            outline: none;
                            transition: all 0.25s ease-in-out;
                            width: 100%;
                            cursor: pointer;
                        }

                        /* Ícono del calendario */
                        input[type="date"]::-webkit-calendar-picker-indicator {
                            filter: invert(1);
                            cursor: pointer;
                            opacity: 0.8;
                        }

                        input[type="date"]:hover {
                            border-color: #666;
                        }

                        /* Placeholder (algunos navegadores) */
                        input[type="date"]::-webkit-datetime-edit {
                            color: #bbb;
                        }

                        /* Cuando hay valor seleccionado */
                        input[type="date"]:valid::-webkit-datetime-edit {
                            color: white;
                        }

                `}
            </style>
        </>
    )
}

export default updateNotaPedido;