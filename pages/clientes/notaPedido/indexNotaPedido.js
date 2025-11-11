import { useEffect, useState } from "react"
import { FaPlus, FaHome , FaEye , FaSearch  , FaArrowLeft, FaTrash, FaEdit , FaPrint , FaFileInvoiceDollar } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioNotaPedidoUpdate from './updateNotaPedido'
import FormularioNotaPedidoCreate from './newNotaPedido'
import FormularioComprobanteVentaByNotaPedido from '../comprobanteVenta/create_ComprobanteVenta'
import ViewPedido from './viewNotaPedido'
import BusquedaAvanzada from "../notaPedido/busquedaNotaPedido";

const { default: Link } = require("next/link")

const indexPedido = () => {
    const initialStateNotaPedido = {
        total:'', fecha:'', fechaEntrega:'', cliente:'', empleado:'',
        notaPedidoID:'', envio:'' , presupuesto:'', medioPago:'',
        provincia:0 , localidad:0 , barrio:0, calle:0,altura:0,deptoNumero:0,deptoLetra:0
    }

    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [pedidos,setPedidos] = useState([]);
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalComprobanteVenta, setMostrarModalComprobanteVenta] = useState(null);
    const [viewPedido, setViewPedido] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    
    const [filtro , setFiltro] = useState(initialStateNotaPedido); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const pedidosFiltrados = pedidos
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
    

    useEffect(() => { 
        fetchData();
        fetchData_Presupuestos();
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


    const deletePedido = async (pedidoID) => {
        if (!pedidoID) {
            console.error("Error con el ID del pedido al querer eliminarlo.");
            return;
        }

        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido/${pedidoID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                alert(data.message || "No se pudo eliminar la nota de pedido.");
                console.warn("Error al eliminar nota de pedido:", data);
                return;
            }

            alert(data.message || "Nota de pedido eliminada correctamente.");
            fetchData(); // recarga la lista
            console.log(data.message);

        } catch (err) {
            console.error("Error al enviar nota de pedido para su eliminación:", err);
            alert("Ocurrió un error al intentar eliminar la nota de pedido.");
        }
    };


    useEffect(() => {
        const cargarClientes = async () => {
        const nuevoMapa = {};
        
        const idsClientes = [...new Set(pedidosFiltrados.map(p => p.cliente))];
        await Promise.all(
            idsClientes.map(async (id) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/${id}`);
                const data = await res.json();
                if (!data.ok || !data.data) {
                nuevoMapa[id] = { name: "Cliente eliminado" };
                return;
                }
                nuevoMapa[id] = data.data;
            } catch (err) {
                console.error("Error cargando cliente:", id, err);
                nuevoMapa[id] = { name: "Error al cargar cliente" };
            }
            })
        );
        setClientes(nuevoMapa);
        };
        if (pedidosFiltrados.length > 0) {
        cargarClientes();
        }
    }, [pedidosFiltrados]);

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

            {viewPedido && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setViewPedido(null)}>
                            &times;
                        </button>
                        <ViewPedido 
                            notaPedidoID={viewPedido} 
                            exito={()=>{
                                setViewPedido(null);
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
  
            {mostrarBusqueda && (
            <div className="modal">
                <div className="modal-content">
                <button
                    className="close"
                    onClick={() => {
                    setmostrarBusqueda(null);
                    }}
                >
                    &times;
                </button>

                <BusquedaAvanzada
                    filtro={filtro} // ✅ le pasamos el estado actual
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setPedidos(resultados);
                        setmostrarBusqueda(false);
                    } else {
                        alert("No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
                    onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
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
                <button onClick={() => 
                    setmostrarBusqueda(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de nota de pedido">
                    <FaSearch />
                </button>                  
            </div>
            <div className="contenedor-tabla">
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
                                    const clienteEncontrado = clientes[cliente];

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
                                                <button className="btn-icon" title={"Visualizar"}
                                                    onClick={() => {
                                                        
                                                        setViewPedido(_id);
                                                    }} 
                                                >
                                                    <FaEye />
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
                                                <button onClick={() => imprimirPedido(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
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