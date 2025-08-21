const { useState , useEffect } = require("react")
import Select from 'react-select';        
import FormularioClienteCreate from '../createCliente'
const { default: Link } = require("next/link")

const initialStateComprobanteVenta = {
    tipoComprobante:'', fecha:'' , descuentoBandera:false , descuento:0 ,total:0, notaPedido:'', cliente:''
}
const initialDetalle = { 
    producto: "", cantidad: 0, precio: 0, subtotal: 0, notaPedido:'' 
};


const createComprobanteVenta = ({exito}) => {
    const [comprobanteVenta , setComprobanteVenta] = useState(initialStateComprobanteVenta);
    const [detalles , setDetalles] = useState([initialDetalle]);
    const [notaPedidos , setNotaPedidos] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [puedeGuardar, setPuedeGuardar] = useState(false);
    const [productos, setProductos] = useState([]);
    const [tiposComprobante, setTiposComprobante] = useState([]);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setComprobanteVenta({
            ...comprobanteVenta , 
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

        setComprobanteVenta({
            ...comprobanteVenta,
            [name]: value,
        });

        if (name === 'presupuesto' && value) {
            agregarDetalleNotaPedido(value);
        }
        if (name === 'notaPedido' && value) {
            setPuedeGuardar(true);
            fetchData_NotaPedidoDetalle(value)
        };
    }

    const agregarDetalleNotaPedido = async (comprobanteID) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVentaDetalle/ComprobanteVenta/${comprobanteID}`);
        const s = await res.json();

        if (s.ok) {
            setDetalles(s.data);
            calcularTotal(s.data);
        } else {
            console.error('Error al cargar detalles del comprobante de venta:', s.message);
        }
            } catch (error) {
                console.error('Error de red al cargar detalles del comprobante de venta:', error);
            }
    };

    
    const calcularTotal = (detalles) => {
        const totalPedido = Array.isArray(detalles) && detalles.length > 0
            ? detalles.reduce((acc, d) => acc + (d.subtotal || 0), 0)
                : 0;
        setComprobanteVenta((prev) => ({ ...prev, total:totalPedido }));
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
                    calcularTotal(s.data);
                }
            })
            .catch((err) => console.log("Error al cargar vinos.\nError: ", err));
        };

    const fetchData_Clientes = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setClientes(s.data)
                })
    }

    const fetchData_TipoComprobante = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoComprobante`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposComprobante(s.data)
                })
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

    const fetchData_NotaPedido = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    const pedidosNoFacturados = s.data.filter(pedido => pedido.facturado === false);
                    setNotaPedidos(pedidosNoFacturados);
                }
            })
        .catch((err)=>{console.log("Error al cargar pedidos.\nError: ",err)})
    }

    const handleCheckboxChange = (e) => {
        setComprobanteVenta({
            ...comprobanteVenta,
            descuentoBandera: e.target.checked,
        });
    };

    const clickChange = async(e) => {
        e.preventDefault();
        const bodyData = {
            tipoComprobante: comprobanteVenta.tipoComprobante,
            descuento: comprobanteVenta.descuento,
            total: comprobanteVenta.total,  
        };

        if (comprobanteVenta.notaPedido) {
            bodyData.notaPedido = comprobanteVenta.notaPedido;
        }

        const resNotaComprobanteVenta = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })

        const comprobanteVentaCreado = await resNotaComprobanteVenta.json();
        const comprobanteVentaID = comprobanteVentaCreado.data._id;

        // GUARDAMOS DETALLES
        for (const detalle of detalles) {
            const resDetalle = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVentaDetalle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    producto: detalle.producto,
                    precio: detalle.precio,
                    cantidad: detalle.cantidad,
                    subtotal: detalle.subtotal,
                    comprobanteVenta: comprobanteVentaID
            })
            
            
            });
            if (!resDetalle.ok) throw new Error("Error al guardar un detalle");
        
            setDetalles([initialDetalle]);
            setComprobanteVenta(initialStateComprobanteVenta);
            exito();
        }
    }

    const [mostrarModalCreate1, setMostrarModalCreate1] = useState(false);
    const [mostrarModalCreate3, setMostrarModalCreate3] = useState(false);

    const opciones_productos = productos.map(v => ({ value: v._id,label: v.name , stock: v.stock }))
    const opciones_clientes = clientes.map(v => ({ value: v._id,label: v.name }));
    const opciones_notasPedido = notaPedidos.filter((s)=>{return s.cliente === comprobanteVenta.cliente })
        .map(v => {
            return {
                value: v._id,
                label: `${v.fecha.split("T")[0]} - $${v.total}`,
                total: v.total
            };
        }
    );
    const opciones_tiposComprobante = tiposComprobante
    .filter(tc => {
        const cliente = clientes.find(c => c._id === comprobanteVenta.cliente);
        if (!cliente) return false; // Si no existe cliente, no mostrar ningún comprobante

        return tc.condicionIva === cliente.condicionIva;
    })
    .map(tc => ({
        value: tc._id,
        label: tc.name
    }));


    useEffect(()=>{
        setDetalles([]);
        fetchData_Clientes();
        fetchData_NotaPedido();
        fetchData_Productos();
        fetchData_TipoComprobante();
    }, [])
        
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
                        <h1 className="titulo-pagina">Cargar Comprobante de Venta</h1>
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
                                value={opciones_clientes.find(op => op.value === comprobanteVenta.cliente) || null}
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
                                Nota de Pedido:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_notasPedido}
                                value={opciones_notasPedido.find(op => op.value === comprobanteVenta.notaPedido) || null}
                                onChange={selectChange}
                                name='notaPedido'
                                placeholder="Nota de Pedido..."
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
                                Tipo de Comprobante:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_tiposComprobante}
                                value={opciones_tiposComprobante.find(op => op.value === comprobanteVenta.tipoComprobante) || null}
                                onChange={selectChange}
                                name='tipoComprobante'
                                placeholder="Tipo de comprobante..."
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
                                            isDisabled={true}
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
                                            value={d.cantidad}
                                            disabled={true}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className='form-col-item2'>
                                        <span>Subtotal: ${d.subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div> 


                        <div className="form-col-precioVenta">
                            
                            
                            <div className="form-secondary">
                                <label className="label-box">
                                    <input
                                    type="checkbox"
                                    checked={comprobanteVenta.descuentoBandera}
                                    onChange={handleCheckboxChange}
                                    className="checkbox-envio"
                                    />
                                    ¿Descuento?
                                </label>

                                {comprobanteVenta.descuentoBandera && (
                                    <input
                                    type="number"
                                    onChange={inputChange}
                                    name='descuento'
                                    value={comprobanteVenta.descuento}
                                    placeholder="Escriba aquí el descuento ..."
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
                                    value={comprobanteVenta.total}
                                    name="total"
                                    disabled
                                    />

                                <div className="form-submit">
                                    <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={(e) => {
                                        if (!puedeGuardar) {
                                        alert("No se puede guardar un comprobante de venta sin una nota de pedido.");
                                        e.preventDefault();
                                        return;
                                        }
                                        clickChange(e);
                                    }}
                                    >
                                    Cargar Comprobante
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

export default createComprobanteVenta;