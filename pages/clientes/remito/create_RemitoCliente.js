const { useState, useEffect, use } = require("react")
import Select from 'react-select';     

import FormularioCreateTransporte from "../../gestion/transporte/createTransporte"

const { default: Link } = require("next/link")

const initialState = {cliente:'',totalPrecio:0, totalBultos:0, fecha:'', comprobanteVenta:'', transporteID:'', entregado:false}
const initialDetalle = { remitoID:'', tipoProducto:"", producto:'' ,  cantidad: 0 };

const createRemitoCliente = ({exito , comprobanteVentaID}) => {
    const [remito , setRemito] = useState(initialState);
    const [puedeGuardar, setPuedeGuardar] = useState(false);
    const [productos, setProductos] = useState([]);
    const [transporte , setTransporte] = useState([])
    const [detalles, setDetalles] = useState([]);
    const [tipoProductos,setTipoProductos] = useState([]);

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;
        
        const prod = productos.find(p => p._id === nuevosDetalles[index].producto);

        if (prod) {
            if (prod.precioCosto) {
                const ganancia = prod.ganancia;
                const precio = prod.precioCosto + ((prod.precioCosto * ganancia) / 100);

                nuevosDetalles[index].precio = precio;
                nuevosDetalles[index].importe = precio * nuevosDetalles[index].cantidad;
            } else if (prod.precioVenta) {
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
        calcularTotalBultos(nuevosDetalles);
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
                //calcularTotalPrecio(s.data);
                calcularTotalBultos(s.data);
            }
        } catch (err) {
            console.log("Error al cargar vinos.\nError: ", err);
        }
    };

    const fetchData_ComprobantesVenta = async (id) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta/${id}`);
            const s = await res.json();
            if (s.ok) {
                let pedidoData = [];
                let clienteData = '';
                const pedido = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${s.data.notaPedido}`);
                const pedidoJSON = await pedido.json();
                if(pedidoJSON.ok){
                    pedidoData = pedidoJSON.data;
                }
                
                const clienteID = pedidoData.cliente;
                
                const resCliente = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/${clienteID}`);
                const clienteJson = await resCliente.json();
                if (clienteJson.ok) {
                    clienteData = clienteJson.data;
                }
                
                setRemito(prev => ({
                ...prev,
                totalPrecio:s.data.total,
                cliente: { value: clienteData._id, label: clienteData.name },
                comprobanteVenta: { value: comprobanteVentaID, label: comprobanteVentaID },
                // comprobanteVenta: comprobanteVentaID,
            }));

            }
        } catch (err) {
            console.log("Error al cargar comprobante de venta.\nError: ", err);
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

    const clickChange = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    totalPrecio: remito.totalPrecio,
                    totalBultos: remito.totalBultos,
                    comprobanteVentaID: remito.comprobanteVenta.value,
                    transporteID: remito.transporteID,
                    entregado: remito.entregado
                })
            });
            
            const remitoCreado = await res.json();
            if(!remitoCreado.ok) {
                alert(remitoCreado.message)
                return
            }
            const remitoID = remitoCreado.data._id;

            // GUARDAMOS DETALLES
            for (const detalle of detalles) {
                const resDetalle = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remitoDetalle`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        producto: detalle.producto,
                        cantidad: detalle.cantidad,
                        remitoID: remitoID
                })
                
                
                });
                if (!resDetalle.ok) {
                    const errData = await resDetalle.json();
                    alert(errData.message)
                    return
                }
            
                setDetalles(initialDetalle);
                setRemito(initialState);
                alert(remitoCreado.message)
                exito();
            }
        } 
        catch (err) {
            console.log('Error al enviar datos. \n Error: ', err);
        }
    };

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setRemito({ ...remito, [name]: value });

        if (name === 'transporteID' && value) {
            setPuedeGuardar(true);
        }
    };

    useEffect(() => {
        setDetalles([]);
        fetchData_ComprobantesVenta(comprobanteVentaID);
        fetchData_ComprobanteVentaDetalle(comprobanteVentaID);
        fetchData_Productos();
        fetchData_TipoProductos();
        fetchData_Transporte();
    }, [comprobanteVentaID]);
    
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

    const opciones_transporte = transporte.map(v => ({
        value: v._id, label: v.name
    }));
   
    const [mostrarModalTransporteCreate , setMostrarModalTransporteCreate] = useState(false)
   

    return(
        <>
            {mostrarModalTransporteCreate && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalTransporteCreate(false)}>&times;</button>
                    <FormularioCreateTransporte
                    exito={() => {
                        setMostrarModalTransporteCreate(false);
                        fetchData_Transporte();
                    }}
                    />
                </div>
                </div>
            )}

            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Remito</h1>
                <form id="formProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Cliente:
                             </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                value={remito.cliente}
                                onChange={selectChange}
                                name='cliente'
                                placeholder="Cliente..."
                                isClearable
                                isDisabled={true}
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
                                value={remito.comprobanteVenta}
                                onChange={selectChange}
                                name='comprobanteVentaID'
                                placeholder="Comprobante de venta..."
                                isClearable
                                isDisabled={true}
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalTransporteCreate(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_transporte}
                                value={opciones_transporte.find(op => op.value === remito.transporteID) || null}
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
                                            options={opciones_tipoProductos}
                                            value={opciones_tipoProductos.find(op => op.value === d.tipoProducto) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "tipoProducto", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Tipo de Producto..."
                                            isClearable
                                            isDisabled={true}
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
                                            isDisabled={true}
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
                                            max={opciones_productos.find((p) => p.value === d.producto)?.stock || 0}
                                            value={d.cantidad}
                                            disabled={true}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
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
                                    value={remito.totalBultos}
                                    name="totalBultos"
                                    disabled
                                />
                                <label htmlFor="precioVenta" className="label-box">
                                    Total Precio:
                                </label>
                                <input
                                    type="number"
                                    className="input-secondary"
                                    value={remito.totalPrecio}
                                    name="totalPrecio"
                                    disabled
                                />

                                <div className="form-submit">
                                    <button
                                    type="submit"
                                    className="submit-btn"
                                    onClick={(e) => {
                                        if (!puedeGuardar) {
                                        alert("❌ No se puede guardar un remito sin un comprobante de venta asociado.");
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
                    </div>
                </form>
            </div>
            <style jsx>
                {`
                        button.submit-btn {
                            width:100%
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

export default createRemitoCliente;