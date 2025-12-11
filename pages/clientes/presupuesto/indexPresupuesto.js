import { useEffect, useState } from "react"
import { FaPlus, FaEye , FaShoppingCart , FaHome, FaArrowLeft, FaTrash, FaEdit , FaSearch , FaPrint } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioPresupuestoUpdate from './updatePresupuesto'
import FormularioPresupuestoCreate from './newPresupuesto'
import CreateNotaPedido from "../notaPedido/createNotaPedido";
import BusquedaAvanzada from "../presupuesto/busquedaPresupuesto";
import ViewPresupuesto from "../presupuesto/viewPresupuesto";

const { default: Link } = require("next/link")

const indexPresupuesto = () => {
    const initialState = {presupuestoID:'' , total:'', cliente:'', empleado:''}                             

    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    const [mostrarView, setmostrarView] = useState(null);
    
    const [filtro , setFiltro] = useState(initialState); 
    const [filtroDetalle , setFiltroDetalle] = useState([]); 
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const presupuestosFiltrados = presupuestos
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

      let aVal = campo === 'cliente'
        ? (clientes.find(d => d._id === a.cliente)?.name || '')
        : a[campo];
      let bVal = campo === 'cliente'
        ? (clientes.find(d => d._id === b.cliente)?.name || '')
        : b[campo];

    if (campo === 'codigo') {
        aVal = Number(a._id);
        bVal = Number(b._id);
    }

      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });

    const fetchData = () => {
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
    }, [] )

    

    const deletePresupuesto = async (presupuestoID) => {
        if (!presupuestoID) {
            console.error("❌ Error con el ID del presupuesto al querer eliminarlo.");
            return;
        }

        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?");
        if (!confirmar) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/${presupuestoID}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                alert(data.message);
                return;
            }

            alert(data.message);
            fetchData();

        } catch (err) {
            alert("❌ Ocurrió un error al intentar eliminar el presupuesto. \nERROR:",err);
        }
    };


    const imprimirPresupuesto = async (presupuestoID) => {
        if (!presupuestoID) {
            console.error("Error con el ID del presupuesto al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/imprimir/${presupuestoID}`
            );

            if (!res.ok) {
                alert("❌ No se pudo generar el PDF")
                return
            };

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

            // 🔹 Si querés que directamente abra el diálogo de impresión:
            // const win = window.open(url, "_blank");
            // win.print();

        } catch (err) {
            console.error("❌ Error al imprimir presupuesto:", err);
        }
    };

    useEffect(() => {
        // esta función va a traer los clientes para cada presupuesto
        const cargarClientes = async () => {
        const nuevoMapa = {};
        
        // obtener los IDs únicos de cliente en los presupuestos
        const idsClientes = [...new Set(presupuestosFiltrados.map(p => p.cliente))];
        // buscar cada cliente por su ID
        await Promise.all(
            idsClientes.map(async (id) => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/${id}`);
                const data = await res.json();
                // si no existe el cliente (por ejemplo fue eliminado)
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
        if (presupuestosFiltrados.length > 0) {
        cargarClientes();
        }
    }, [presupuestosFiltrados]);

    return(
        <>
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormularioPresupuestoCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
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
                        setPresupuestos(resultados);
                        setmostrarBusqueda(false);
                    } else {
                        alert("❌ No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
                    onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
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
                        <FormularioPresupuestoUpdate 
                            presupuestoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarView && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setmostrarView(null)}>
                            &times;
                        </button>
                        <ViewPresupuesto 
                            presupuestoID={mostrarView} 
                            exito={()=>{
                                setmostrarView(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarPedidoCreate && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => 
                        {
                            setmostrarPedidoCreate(null)
                            fetchData()
                        }
                    }>
                        &times;
                    </button>
                    <CreateNotaPedido 
                        param={mostrarPedidoCreate}
                        tipo="presupuesto"
                        exito={() => 
                            {
                                setmostrarPedidoCreate(false)
                                fetchData()
                            }}
                    />
                </div>
                </div>
            )}

            <h1 className="titulo-pagina">Presupuesto</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Presupuesto">
                     <FaPlus />
                </button>         
                <button onClick={() => 
                    setmostrarBusqueda(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de presupuesto">
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
                                
                                presupuestosFiltrados.map(({_id,cliente , fecha, total , tieneNotaPedido}) => {
                                    const clienteEncontrado = clientes[cliente];

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{clienteEncontrado?.name}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => {
                                                    setmostrarView(_id)
                                                    }} 
                                                    className="btn-icon" title="Visualizar">
                                                    <FaEye />
                                                </button>
                                                <button onClick={() => setmostrarPedidoCreate(_id)} className="btn-icon" title="Generar Pedido">
                                                    <FaShoppingCart />
                                                </button>
                                                <button onClick={() => {
                                                    if(tieneNotaPedido){
                                                        alert("❌ Este presupuesto ya esta en una Nota de Pedido y no puede modificarse")
                                                        return
                                                    }
                                                    setMostrarModalUpdate(_id)
                                                    }} 
                                                    className="btn-icon" title="Modificar">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => imprimirPresupuesto(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button onClick={() => deletePresupuesto(_id)}  className="btn-icon" title="Eliminar">
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

export default indexPresupuesto;