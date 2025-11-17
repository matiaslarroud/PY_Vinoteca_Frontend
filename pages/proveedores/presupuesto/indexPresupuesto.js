import { useEffect, useState } from "react"
import { FaPlus, FaShoppingCart , FaHome, FaArrowLeft, FaTrash, FaEdit , FaPrint , FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioPresupuestoUpdate from './updatePresupuesto'
import FormularioPresupuestoCreate from './newPresupuesto'
import CreateNotaPedido from "../ordenCompra/createOrdenCompra";
import BusquedaAvanzadaPresupuesto from "./busquedaPresupuesto";

const { default: Link } = require("next/link")

const indexPresupuesto = () => {
    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [proveedores,setProveedores] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);
    const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);

    const initialStatePresupuesto = {total:'', proveedor:'', solicitudPresupuesto:'', empleado:'', medioPago:''}
        
    const [filtro , setFiltro] = useState(initialStatePresupuesto);
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

      let aVal = campo === 'proveedor'
        ? (proveedores.find(d => d._id === a.proveedor)?.name || '')
        : a[campo];
      let bVal = campo === 'proveedor'
        ? (proveedores.find(d => d._id === b.proveedor)?.name || '')
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/presupuesto`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setPresupuestos(s.data);
                    })
        }
    const fetchData_Proveedores = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setProveedores(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_Proveedores();
    }, [] )

    const deletePresupuesto = async(presupuestoID) => {
        if(!presupuestoID) {
            console.log("Error con el ID del presupuesto al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/presupuesto/${presupuestoID}`,
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
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/presupuesto/imprimir/${presupuestoID}`
            );

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

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
            
  
            {mostrarModalBuscar && (
            <div className="modal">
                <div className="modal-content">
                <button
                    className="close"
                    onClick={() => {
                    setMostrarModalBuscar(null);
                    }}
                >
                    &times;
                </button>

                <BusquedaAvanzadaPresupuesto
                    filtro={filtro} // ✅ le pasamos el estado actual
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setPresupuestos(resultados);
                        setMostrarModalBuscar(false);
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
                <button onClick={() => 
                    setMostrarModalBuscar(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de presupuestos">
                    <FaSearch />
                </button>        
            </div>
            <div className="contenedor-tabla">

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('proveedor')}>Proveedor ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                presupuestosFiltrados.map(({_id,proveedor , fecha, total}) => {
                                    const proveedorEncontrado = proveedores.find((p)=>{return p._id === proveedor})

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{proveedorEncontrado?.name}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setmostrarPedidoCreate(_id)} className="btn-icon" title="Generar Orden de Compra">
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
                `}
            </style>
        </>
    )
}

export default indexPresupuesto;