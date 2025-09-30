import { useEffect, useState } from "react"
import { FaPlus, FaShoppingCart , FaHome, FaArrowLeft, FaTrash, FaEdit , FaPrint } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioPresupuestoUpdate from './updatePresupuesto'
import FormularioPresupuestoCreate from './createPresupuesto'
import CreateNotaPedido from "../notaPedido/createNotaPedido";

const { default: Link } = require("next/link")

const indexPresupuesto = () => {
    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [clientes,setClientes] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroPrecio, setFiltroPrecio] = useState('');   
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const presupuestosFiltrados = presupuestos
    .filter(p => {
      const clienteNombre = clientes.find(d => d._id === p.cliente)?.name || '';
      return (
        clienteNombre.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        (filtroPrecio === '' || p.total.toString().includes(filtroPrecio))
      );
    })
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
        fetchData_Clientes();
    }, [] )

    const deletePresupuesto = async(presupuestoID) => {
        if(!presupuestoID) {
            console.log("Error con el ID del presupuesto al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/${presupuestoID}`,
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
                console.log("Error al enviar presupuesto para su eliminación. \n Error: ",err);
            })
    }

    const imprimirPresupuesto = async (presupuestoID) => {
        if (!presupuestoID) {
            console.error("Error con el ID del presupuesto al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/presupuesto/imprimir/${presupuestoID}`
            );

            if (!res.ok) throw new Error("No se pudo generar el PDF");

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
            console.error("Error al imprimir presupuesto:", err);
        }
    };


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
                        placeholder="Filtrar por precio..."
                        value={filtroPrecio}
                        onChange={(e) => setFiltroPrecio(e.target.value)}
                    />
                </div>

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
                                presupuestosFiltrados.map(({_id,cliente , fecha, total}) => {
                                    const clienteEncontrado = clientes.find((p)=>{return p._id === cliente})

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{clienteEncontrado?.name}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setmostrarPedidoCreate(_id)} className="btn-icon" title="Generar Pedido">
                                                    <FaShoppingCart />
                                                </button>
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
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
                    .columna{
                        text-align: center;
                    }

                    .botonera {
                        display: flex;
                        justify-content: center;
                        gap: 1rem;
                        margin: 2rem auto;
                    }

                    .btn-icon {
                        background-color: #8b0000;
                        color: white;
                        padding: 0.8rem;
                        font-size: 1.2rem;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        width: 3.2rem;
                        height: 3.2rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.3s, transform 0.2s;
                    }
                    
                    .btn-icon:hover {
                    background-color: #a30000;
                    transform: translateY(-3px);
                    }

                    .titulo-pagina {
                        font-size: 3rem;
                        color: white;
                        text-align: center;
                        margin-top: 2rem;
                    }

                    .contenedor-tabla {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 2rem;
                        background-color: #222;
                        border-radius: 12px;
                        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                    }

                    .filtros {
                        display: flex;
                        gap: 1rem;
                        margin-bottom: 1rem;
                        flex-wrap: wrap;
                        justify-content: center;
                    }

                    .filtros input {
                        padding: 10px;
                        font-size: 1rem;
                        border-radius: 6px;
                        border: 1px solid #ccc;
                        min-width: 220px;
                    }

                    .tabla-scroll {
                        overflow-x: auto;
                        max-height: 500px;
                    }

                    table {
                       width: 100%;
                        border-collapse: collapse;
                        background-color: #333;
                        color: white;
                    }

                    th, td {
                        text-align: center;
                        padding: 12px;
                        border-bottom: 1px solid #555;
                    }

                    th {
                        background-color: #111;
                        cursor: pointer;
                    }

                    .acciones {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                    }
                    
                    .modal {
                        position: fixed;
                        inset: 0; /* top: 0; bottom: 0; left: 0; right: 0 */
                        background-color: rgba(0, 0, 0, 0.5);
                        z-index: 1000;

                        display: flex;
                        justify-content: center;
                        align-items: center;

                        padding: 1rem; /* para espacio lateral en pantallas pequeñas */
                        overflow-y: auto;
                    }

                    .modal-content {
                        background-color: #121212;
                        padding: 2rem;
                        border-radius: 10px;
                        width: 100%;
                        max-width: 1200px;
                        max-height: 90vh;
                        overflow-y: auto;
                        position: relative;
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
                `}
            </style>
        </>
    )
}

export default indexPresupuesto;