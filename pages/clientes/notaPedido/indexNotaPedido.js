import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaPrint , FaFileInvoiceDollar } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioNotaPedidoUpdate from './updateNotaPedido'
import FormularioNotaPedidoCreate from './newNotaPedido'
import FormularioComprobanteVentaByNotaPedido from '../comprobanteVenta/create_ComprobanteVenta'

const { default: Link } = require("next/link")

const indexPedido = () => {
    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [pedidos,setPedidos] = useState([]);
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalComprobanteVenta, setMostrarModalComprobanteVenta] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroPresupuesto , setFiltroPresupuesto] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const pedidosFiltrados = pedidos
    .filter(p => {
      const clienteNombre = clientes.find(d => d._id === p.cliente)?.name || '';
      const coincideNombre = clienteNombre.toLowerCase().includes(filtroNombre.toLowerCase())
      
      const presupuestoID = presupuestos.find(d => d._id === p.presupuesto)?._id || '';
      const coincidePresupuesto = presupuestoID.toString().includes(filtroPresupuesto);

      
      return coincideNombre && coincidePresupuesto;
    })
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'cliente') {
        aVal = clientes.find(d => d._id === a.cliente)?.name || '';
        bVal = clientes.find(d => d._id === b.cliente)?.name || '';
        }

        if (campo === 'presupuesto') {
        aVal = presupuestos.find(d => d._id === a.presupuesto)?._id || '';
        bVal = presupuestos.find(d => d._id === b.presupuesto)?._id || '';
        }

        if (campo === 'codigo') {
        aVal = Number(a._id);
        bVal = Number(b._id);
        }

        else {
        aVal = a[campo];
        bVal = b[campo];
        }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });


    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setPedidos(s.data);
                    })
        }

    const fetchData_Presupuestos = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setPresupuestos(s.data);
                    })
        }
    const fetchData_Clientes = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setClientes(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_Presupuestos();
        fetchData_Clientes();
    }, [] )

    const imprimirPedido = async (pedidoID) => {
        if (!pedidoID) {
            console.error("Error con el ID del pedido al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/imprimir/${pedidoID}`
            );

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("Error al imprimir pedido:", err);
        }
    };


    const deletePedido = async(pedidoID) => {
        if(!pedidoID) {
            console.log("Error con el ID del pedido al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${pedidoID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                fetchData();
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar nota de pedido para su eliminación. \n Error: ",err);
            })
    }

    return(
        <>
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormularioNotaPedidoCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}

            {mostrarModalUpdate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalUpdate(null)}>
                            &times;
                        </button>
                        <FormularioNotaPedidoUpdate 
                            notaPedidoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarModalComprobanteVenta && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalComprobanteVenta(null)}>
                            &times;
                        </button>
                        <FormularioComprobanteVentaByNotaPedido 
                            pedidoID={mostrarModalComprobanteVenta} 
                            exito={()=>{
                                setMostrarModalComprobanteVenta(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Nota de Pedido</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Pedido">
                     <FaPlus />
                </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por cliente..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por presupuesto..."
                        value={filtroPresupuesto}
                        onChange={(e) => setFiltroPresupuesto(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('cliente')}>Cliente ⬍</th>
                            <th onClick={() => toggleOrden('presupuesto')}>Presupuesto ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('envio')}>Envio ⬍</th>
                            <th onClick={() => toggleOrden('fechaEntrega')}>Fecha Entrega ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                pedidosFiltrados.map(({_id,facturado, cliente , envio , fechaEntrega , fecha, total , presupuesto}) => {
                                    const clienteEncontrado = clientes.find((p)=>{return p._id === cliente})

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{clienteEncontrado?.name}</td>
                                        <td className="columna">{presupuesto}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">{envio ? "SI" : "NO"}</td>
                                        <td className="columna">{fechaEntrega.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon" title={facturado ? "Ya facturado, no se puede modificar" : "Modificar"}
                                                    onClick={() => {
                                                        if (facturado) {
                                                        alert("Este pedido ya fue facturado y no se puede modificar.");
                                                        return;
                                                        }
                                                        setMostrarModalUpdate(_id);
                                                    }} 
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => imprimirPedido(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button   className="btn-icon" title="Generar comprobante de venta">
                                                    <FaFileInvoiceDollar onClick={() => {
                                                        if (facturado) {
                                                        alert("Este pedido ya fue facturado y no se puede modificar.");
                                                        return;
                                                        }
                                                        setMostrarModalComprobanteVenta(_id);
                                                    }} />
                                                </button>
                                                <button onClick={() => deletePedido(_id)}  className="btn-icon" title="Eliminar">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                            })
                            }                        
                        </tbody>
                    </table>
                </div>
            </div>

            <style>
                {`
                `}
            </style>
        </>
    )
}

export default indexPedido;