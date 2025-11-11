import { useEffect, useState } from "react"
import { FaPlus, FaHome , FaEye , FaSearch , FaArrowLeft, FaTrash , FaPrint , FaFileInvoice  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioComprobanteVentaCreate from './new_ComprobanteVenta'
import FormularioCreateRemitoCliente from '../remito/create_RemitoCliente'
import BusquedaAvanzada from "../comprobanteVenta/busquedaComprobanteVenta";
import ViewComprobante from './viewComprobanteVenta'


const { default: Link } = require("next/link")

const indexComprobantesVenta = () => {
    const initialStateComprobanteVenta = {
        comprobanteVentaID:'' , tipoComprobante:'', fecha:'' , descuentoBandera:'' , descuento:0 ,total:0, notaPedido:'', cliente:''
    }

    const router = useRouter();
    const [pedidos,setPedidos] = useState([]);   
    const [comprobantesVenta,setComprobantesVenta] = useState([]);
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalRemito, setMostrarModalRemito] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    const [mostrarComprobante, setMostrarComprobante] = useState(null);
    
    const [filtro , setFiltro] = useState(initialStateComprobanteVenta); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const comprobantesVentaFiltrados = comprobantesVenta
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'cliente') {
        aVal = clientes.find(d => d._id === a.cliente)?.name || '';
        bVal = clientes.find(d => d._id === b.cliente)?.name || '';
        }

        if (campo === 'notaPedido') {
        aVal = pedidos.find(d => d._id === a.notaPedido)?._id || '';
        bVal = pedidos.find(d => d._id === b.notaPedido)?._id || '';
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantesVenta(s.data);
                    })
        }

    const fetchData_pedidos = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/notaPedido`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setPedidos(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_pedidos();
    }, [] )

    useEffect(() => {
        const cargarClientes = async () => {
        const nuevoMapa = {};
        
        // 1️⃣ Obtener los IDs de los pedidos que aparecen en los comprobantes
        const idsPedidos = [...new Set(comprobantesVentaFiltrados.map(cv => cv.notaPedido))];

        // 2️⃣ Buscar esos pedidos dentro del array de pedidos
        const pedidosRelacionados = pedidos.filter(p => idsPedidos.includes(p._id));

        // 3️⃣ Extraer los IDs de clientes desde esos pedidos
        const idsClientes = [...new Set(pedidosRelacionados.map(p => p.cliente))];

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
        if (comprobantesVentaFiltrados.length > 0) {
        cargarClientes();
        }
    }, [comprobantesVentaFiltrados]);

    const imprimirComprobanteVenta = async (id) => {
        if (!id) {
            console.error("Error con el ID del comprobante de venta al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta/imprimir/${id}`
            );

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("Error al imprimir comprobante de venta:", err);
        }
    };

    const deleteComprobanteVenta = async(comprobanteVentaID) => {
        if(!comprobanteVentaID) {
            console.log("Error con el ID del comprobante de venta al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que querés eliminar este recibo?"); if (!confirmar) return;

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta/${comprobanteVentaID}`,
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
                console.log("Error al enviar comprobante de venta para su eliminación. \n Error: ",err);
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
                        <FormularioComprobanteVentaCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}

            {mostrarComprobante && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarComprobante(false)}>
                            &times;
                        </button>
                        <ViewComprobante
                            comprobanteVentaID={mostrarComprobante}
                        />
                    </div>
                </div>
            )}

            {mostrarModalRemito && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalRemito(null)}>
                            &times;
                        </button>
                        <FormularioCreateRemitoCliente 
                            comprobanteVentaID={mostrarModalRemito} 
                            exito={()=>{
                                setMostrarModalRemito(null);
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
                    filtro={filtro} 
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setComprobantesVenta(resultados);
                        setmostrarBusqueda(false);
                    } else {
                        alert("No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} 
                    onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
                />
                </div>
            </div>
            )}
            <h1 className="titulo-pagina">Comprobante de Venta</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Comprobante Venta">
                     <FaPlus />
                </button>        
                <button onClick={() => 
                    setmostrarBusqueda(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de comprobante de venta">
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
                            <th onClick={() => toggleOrden('notaPedido')}>Nota de Pedido ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                comprobantesVentaFiltrados.map(({_id, facturado ,cliente , fecha, total , notaPedido, remitoCreado}) => {
                                    const pedidoEncontrado = pedidos.find((p)=>{return p._id === notaPedido})
                                    // const clienteEncontrado = clientes.find((p)=>{return p._id === pedidoEncontrado?.cliente})
                                    const clienteEncontrado = clientes[pedidoEncontrado?.cliente];    
                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{clienteEncontrado?.name}</td>
                                        <td className="columna">{notaPedido}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon" title={"Visualizar"}
                                                    onClick={() => {
                                                        
                                                        setMostrarComprobante(_id);
                                                    }} 
                                                >
                                                    <FaEye />
                                                </button>
                                                <button className="btn-icon" 
                                                    title={remitoCreado ? "El remito ya fue creado" : "Generar Remito"}
                                                    onClick={() => {
                                                        if (remitoCreado) {
                                                            alert("El remito ya fue creado anteriormente.");
                                                            return;
                                                        }
                                                        setMostrarModalRemito(_id);
                                                    }}
                                                >
                                                    <FaFileInvoice  />
                                                </button>
                                                    <button onClick={() => imprimirComprobanteVenta(_id)}  className="btn-icon" title="Imprimir">
                                                        <FaPrint />
                                                    </button>
                                                {/* <button onClick={() => deleteComprobanteVenta(_id)}  className="btn-icon" title="Eliminar">
                                                    <FaTrash />
                                                </button> */}
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

export default indexComprobantesVenta;