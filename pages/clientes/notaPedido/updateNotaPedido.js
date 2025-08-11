const { useState, useEffect } = require("react")
import Select from 'react-select';      
import { FaTrash} from "react-icons/fa";
import FormularioEmpleadoCreate from '../../gestion/general/empleado/createEmpleado'
import FormularioClienteCreate from '../../clientes/createCliente'
import FormularioMedioPagoCreate from '../../gestion/general/medioPago/createMedioPago'    

const { default: Link } = require("next/link")

const initialStateNotaPedido = {
        total:0, fecha:'', fechaEntrega:'', cliente:'', empleado:'',
        envio:false, presupuesto:'', medioPago:'', envioDireccion:'' , 
    }
const initialDetalle = { 
        producto: "", cantidad: 0, precio: 0, subtotal: 0, notaPedido:'' ,
    };

const updateNotaPedido = ({exito,notaPedidoID}) => {
    const [notaPedido , setNotaPedido] = useState(initialStateNotaPedido);
    
    const [clientes,setClientes] = useState([])
    const [presupuestos,setPresupuestos] = useState([])
    const [empleados,setEmpleados] = useState([])
    const [mediosPago,setMediosPago] = useState([])
    const [detalles,setDetalles] = useState([initialDetalle])
    const [productos,setProductos] = useState([]);
    const [habilitado, setHabilitado] = useState(false);
    const [datosCargados, setDatosCargados] = useState(false);

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
                    }
                })
            .catch((err)=>{console.log("Error al cargar vinos.\nError: ",err)})
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
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${notaPedidoID}`)
            .then((a)=>{
                return a.json();
            })
                .then((s)=>{
                    setNotaPedido(s.data)
                    setHabilitado(s.data.envio ?? false);
                })
            .catch((err)=>{console.log("Error al cargar nota de pedido.\nError: ",err)})
    }


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

    // Carga productos primero
    const cargarDatos = async () => {
        await fetchData_Productos();
        await fetchData_NotaPedido(notaPedidoID);
        await fetchData_NotaPedidoDetalle(notaPedidoID);
        await fetchData_Presupuestos();
        await fetchData_Clientes();
        await fetchData_Empleados();
        await fetchData_MediosPago();
        setDatosCargados(true);
    };

        cargarDatos();
    }, [notaPedidoID]);

    useEffect(() => {
        if (datosCargados) {
        ajustarStockTemporal(detalles);
    }
    }, [datosCargados]);

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
            envio: notaPedido.envio
        };

        if (notaPedido.presupuesto) {
            bodyData.presupuesto = notaPedido.presupuesto;
        }


         const resNotaPedido = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${notaPedidoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(bodyData)
            }
        )

        const notaPedidoCreado = await resNotaPedido.json();
        const identificador = notaPedidoCreado.data._id;

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedidoDetalle/${identificador}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar producto para su eliminación. \n Error: ",err);
            })

        // GUARDAMOS DETALLES
        for (const detalle of detalles) {
            const resDetalle = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedidoDetalle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto: detalle.producto,
                    precio: detalle.precio,
                    cantidad: detalle.cantidad,
                    subtotal: detalle.subtotal,
                    notaPedido: notaPedidoID
            })
                });
            if (!resDetalle.ok) throw new Error("Error al guardar un detalle");
    
            const resStock = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/products/stock/${detalle.producto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        cantidadVendida: detalle.cantidad 
                })
            });

            if (!resStock.ok) throw new Error("Error al actualizar stock del producto");
        }
       
        
        setDetalles([initialDetalle]);
        setNotaPedido(initialStateNotaPedido);
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


    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;
        
        const prod = productos.find(p => p._id === nuevosDetalles[index].producto);

        if (prod) {
            if(prod.precioCosto){
                const ganancia = prod.ganancia;
                const precio = prod.precioCosto + ((prod.precioCosto * ganancia) / 100);

                nuevosDetalles[index].precio = precio;
                nuevosDetalles[index].subtotal = precio * nuevosDetalles[index].cantidad;
            }
            if(!prod.precioCosto && prod.precioVenta){
                const precio = prod.precioVenta;

                nuevosDetalles[index].precio = precio;
                nuevosDetalles[index].subtotal = precio * nuevosDetalles[index].cantidad;
            }

        } else {
            nuevosDetalles[index].precio = 0;
            nuevosDetalles[index].subtotal = 0;
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
        setDetalles([...detalles, { ...{producto: "", cantidad: 0, precio: 0, subtotal: 0 } }]);
    };
    
    const calcularTotal = (detalles) => {
        const totalNotaPedido = detalles.reduce((acc, d) => acc + d.subtotal, 0);
        setNotaPedido((prev) => ({ ...prev, total:totalNotaPedido }));
    };

    const [mostrarModalCreate1, setMostrarModalCreate1] = useState(false);
    const [mostrarModalCreate2, setMostrarModalCreate2] = useState(false);
    const [mostrarModalCreate3, setMostrarModalCreate3] = useState(false);

    const opciones_productos = productos.map(v => ({ value: v._id,label: v.name , stock: v.stock }))
    const opciones_empleados = empleados.map(v => ({ value: v._id,label: v.name }));
    const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
    const opciones_mediosPago = mediosPago.map(v => ({ value: v._id,label: v.name }));
    const opciones_presupuestos = presupuestos.filter((s)=>{return s.cliente === notaPedido.cliente })
            .map(v => {
                const cliente = clientes.find(c => c._id === v.cliente);
                return {
                    value: v._id,
                    label: `${v.fecha.split("T")[0]} - $${v.total}`,
                    cliente: v.cliente,
                    total: v.total
                };
            }
        );

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
            {mostrarModalCreate2 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate2(false)}>&times;</button>
                    <FormularioEmpleadoCreate
                    exito={() => {
                        setMostrarModalCreate2(false);
                        fetchData_Empleados();
                    }}
                    />
                </div>
                </div>
            )}

            {mostrarModalCreate3 && (
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
            )}


            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Modificar Nota Pedido</h1>
                    </div>
                </div>

                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Cliente:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate3(true)}>+</button>
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate2(true)}>+</button>
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate1(true)}>+</button>
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
                                    {/* <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate3(true)}>+</button> */}
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
                                            options={opciones_productos}
                                            value={opciones_productos.find(op => op.value === d.producto) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "producto", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Producto..."
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
                                    
                                    <div className='form-col-item1'>
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            min={1}
                                            max={opciones_productos.find((p) => p.value === d.producto)?.stock || 0}
                                            value={d.cantidad ?? 0}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className='form-col-item2'>
                                        <span>Subtotal: ${d.subtotal.toFixed(2)}</span>
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
                                <input type="date" onChange={inputChange} value={formatDateInput(notaPedido.fechaEntrega) ?? ""} name="fechaEntrega" required />
                            </div>
                            
                            <div className="form-secondary">
                                <label className="label-box">
                                    <input
                                    type="checkbox"
                                    checked={habilitado}
                                    value={notaPedido.envio ?? ""}
                                    onChange={handleCheckboxChange}
                                    className="checkbox-envio"
                                    />
                                    ¿Envío?
                                </label>

                                {habilitado && (
                                    <input
                                    type="text"
                                    onChange={inputChange}
                                    name='envioDireccion'
                                    value={notaPedido.envioDireccion ?? ""}
                                    placeholder="Escriba aquí la dirección ..."
                                    className="input-secondary"
                                    />
                                )}
                            </div>
                            <div className="form-secondary">
                                <label htmlFor="precioVenta" className="label-box">
                                    Total:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    value={notaPedido.total ?? 0}
                                    name="total"
                                    disabled
                                    />

                                <div className="form-submit">
                                    <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={(e) => {
                                        if (!puedeGuardar) {
                                        alert("No se puede guardar una nota de pedido sin al menos un producto con cantidad.");
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

export default updateNotaPedido;