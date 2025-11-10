import { useEffect, useState } from "react"
import { FaPlus, FaHome , FaSearch , FaArrowLeft, FaTrash, FaEdit , FaPrint , FaFileInvoiceDollar } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioReciboUpdate from './updateReciboPago'
import FormularioReciboCreate from './newReciboPago'
import BusquedaAvanzada from "../reciboPago/busquedaReciboPago";

const { default: Link } = require("next/link")

const indexPedido = () => {
    const initialStateRecibo = {
        total:0, fecha:'', clienteID:'', medioPagoID:''
    }

    const router = useRouter();
    const [recibos,setRecibos] = useState([]);
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    
    const [filtro , setFiltro] = useState(initialStateRecibo); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const recibosFiltrados = recibos
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'cliente') {
        aVal = clientes.find(d => d._id === a.cliente)?.name || '';
        bVal = clientes.find(d => d._id === b.cliente)?.name || '';
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/reciboPago`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setRecibos(s.data);
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
    }, [] )

    useEffect(() => {
        const cargarClientes = async () => {
        const nuevoMapa = {};
        
        const idsClientes = [...new Set(recibosFiltrados.map(p => p.clienteID))];
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
        if (recibosFiltrados.length > 0) {
        cargarClientes();
        }
    }, [recibosFiltrados]);

    const imprimirRecibo = async (recibo) => {
        if (!recibo) {
            console.error("Error con el ID del pedido al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/reciboPago/imprimir/${recibo}`
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


    const deleteRecibo = async(recibo) => {
        if(!recibo) {
            console.log("Error con el ID del recibo al querer eliminarlo.")
            return
        }

        const confirmar = window.confirm("¿Estás seguro de que querés eliminar este recibo?");
        if (!confirmar) return;
        
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/reciboPago/${recibo}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                fetchData();
            })
            .catch((err)=>{
                console.log("Error al enviar recibo de pago para su eliminación. \n Error: ",err);
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
                        <FormularioReciboCreate 
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
                        <FormularioReciboUpdate 
                            reciboPagoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
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
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setRecibos(resultados);
                        setmostrarBusqueda(false);
                    } else {
                        alert("No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} 
                />
                </div>
            </div>
            )}


            <h1 className="titulo-pagina">Recibos de Pago</h1>
            
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
                    className="btn-icon" title="Busqueda avanzada de recibos de pago">
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
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                recibosFiltrados.map(({_id, clienteID , fecha, total }) => {
                                    const clienteEncontrado = clientes[clienteID];

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{clienteEncontrado?.name}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon" title="Modificar"
                                                    onClick={() => {
                                                       setMostrarModalUpdate(_id);
                                                    }} 
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => imprimirRecibo(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button onClick={() => deleteRecibo(_id)}  className="btn-icon" title="Eliminar">
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