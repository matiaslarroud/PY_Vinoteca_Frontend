const { useState, useEffect } = require("react")
import Select from 'react-select';          
import { FaTrash} from "react-icons/fa";

const { default: Link } = require("next/link")

const initialStateNotaPedido = {
        total:'', fecha:'', fechaEntrega:'', cliente:'', empleado:'',
        notaPedidoID:'' , envio:"" , presupuesto:'', medioPago:'',
        provincia:0 , localidad:0 , barrio:0, calle:0,altura:0,deptoNumero:0,deptoLetra:0
    }
const initialDetalle = { 
         tipoProducto: "", producto: "" 
    };

const busquedaNotaPedido = ({ exito, filtro, onChangeFiltro , filtroDetalle , onChangeFiltroDetalle }) => {
    const [clientes,setClientes] = useState([])
    const [presupuestos,setPresupuestos] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [mediosPago,setMediosPago] = useState([])
    const [detalles,setDetalles] = useState([])
    const [productos,setProductos] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);
    const [habilitado, setHabilitado] = useState(false);
    const [provincias,setProvincias] = useState([])
    const [localidades,setLocalidades] = useState([])
    const [barrios,setBarrios] = useState([])
    const [calles,setCalles] = useState([])
        
    const [filtros, setFiltros] = useState(filtro);
    
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
            setDetalles(filtroDetalle)
    }, [filtro,filtroDetalle]);
        
        const borrarFiltros = () => {
                setFiltros(initialStateNotaPedido);
                onChangeFiltro(initialStateNotaPedido);
                setDetalles([])
                onChangeFiltroDetalle([]);
        };

    const fetchData_Presupuestos = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto`)
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
    
    const fetchData_Clientes = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setClientes(s.data)
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
        fetchData_Clientes();
        fetchData_Empleados();
        fetchData_Presupuestos();
        fetchData_MediosPago();
        fetchData_Productos();
        fetchData_TipoProductos();
        fetchData_Provincias();
        fetchData_Localidades();
        fetchData_Barrios();
        fetchData_Calles();
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

    const handleCheckboxChange = (e) => {
        setHabilitado(e.target.checked);

        setFiltros({
            ...filtros,
            envio: e.target.checked,
        });
    };

    const inputChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
        onChangeFiltroDetalle(detalles); 
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

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/buscar`, {
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
        onChangeFiltroDetalle(detalles); 

        if (name === 'presupuesto' && value) {
            agregarDetallePresupuesto(value);
        }
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{tipoProducto:"",producto: ""} }]);
    }; 
    
    const agregarDetallePresupuesto = async (presupuestoID) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuestoDetalle/presupuesto/${presupuestoID}`);
        const s = await res.json();

        if (s.ok) {
            setDetalles(s.data);
        } else {
            console.error('Error al cargar detalles del presupuesto:', s.message);
        }
    } catch (error) {
        console.error('Error de red al cargar detalles del presupuesto:', error);
    }
};

    
    const calcularTotal = (detalles) => {
        const totalPedido = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.importe || 0), 0)
                : 0;
        setNotaPedido((prev) => ({ ...prev, total:totalPedido }));
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
    const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));
    const opciones_presupuestos = presupuestos.filter((s)=>{return s.cliente === filtros.cliente })
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
        .filter((s)=>{return s.provincia === Number(filtros.provincia)})
        .map(v => ({ value: v._id,label: v.name }));
    const opciones_barrios = barrios
        .filter((s)=>{return s.localidad === Number(filtros.localidad)})
        .map(v => ({ value: v._id,label: v.name }));
    const opciones_calles = calles
        .filter((s)=>{return s.barrio === Number(filtros.barrio)})
        .map(v => ({ value: v._id,label: v.name }));

    return(
        <>
            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Busqueda Avanzada de Nota Pedido</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Nota de Pedido N° :
                            </label>
                            <input
                                type="number"
                                className="input-secondary"
                                value={filtros.notaPedidoID}
                                name="notaPedidoID"
                                onChange={inputChange}
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
                                
                            <label className="label-box">
                                <input
                                type="checkbox"
                                checked={habilitado}
                                onChange={handleCheckboxChange}
                                className="checkbox-envio"
                                />
                                ¿Envío?
                            </label>

                            {habilitado && (
                                <>
                                <div className="form-col">
                                    <label>Provincia:</label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_provincias}
                                    value={
                                        opciones_provincias.find(op => op.value === filtros.provincia) ||
                                        null
                                    }
                                    onChange={selectChange}
                                    name="provincia"
                                    placeholder="Provincia..."
                                    isClearable
                                    styles={{
                                        container: base => ({
                                        ...base,
                                        width: "100%", // ⬅️ ocupa todo el ancho
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
                                    }}
                                    />
                                </div>

                                <div className="form-col">
                                    <label>Localidad:</label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_localidades}
                                    value={
                                        opciones_localidades.find(op => op.value === filtros.localidad) ||
                                        null
                                    }
                                    onChange={selectChange}
                                    name="localidad"
                                    placeholder="Localidad..."
                                    isClearable
                                    styles={{
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
                                    }}
                                    />
                                </div>

                                <div className="form-col">
                                    <label>Barrio:</label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_barrios}
                                    value={
                                        opciones_barrios.find(op => op.value === filtros.barrio) || null
                                    }
                                    onChange={selectChange}
                                    name="barrio"
                                    placeholder="Barrio..."
                                    isClearable
                                    styles={{
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
                                    }}
                                    />
                                </div>

                                <div className="form-col">
                                    <label>Calle:</label>
                                    <Select
                                    className="form-select-react"
                                    classNamePrefix="rs"
                                    options={opciones_calles}
                                    value={
                                        opciones_calles.find(op => op.value === filtros.calle) || null
                                    }
                                    onChange={selectChange}
                                    name="calle"
                                    placeholder="Calle..."
                                    isClearable
                                    styles={{
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
                                    }}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Altura:</label>
                                    <input
                                    type="number"
                                    onChange={inputChange}
                                    value={filtros.altura}
                                    name="altura"
                                    placeholder="Altura"
                                    required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Depto. N°:</label>
                                    <input
                                    type="number"
                                    onChange={inputChange}
                                    value={filtros.deptoNumero}
                                    name="deptoNumero"
                                    placeholder="Depto. N°"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Depto. Letra:</label>
                                    <input
                                    type="text"
                                    onChange={inputChange}
                                    value={filtros.deptoLetra}
                                    name="deptoLetra"
                                    placeholder="Depto. Letra"
                                    />
                                </div>
                                </>
                            )}
                            </div>
                            <div className="form-secondary">
                                <label htmlFor="precioVenta" className="label-box">
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

                        .form-submit {
                            justify-content: center;
                            text-align: center;
                            margin-top: 1rem;
                        }
                        
                        .btn-icon:hover {
                            background-color: #a30000;
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


                `}
            </style>
        </>
    )
}

export default busquedaNotaPedido;