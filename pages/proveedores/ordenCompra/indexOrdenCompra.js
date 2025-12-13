import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaPrint , FaSearch ,  FaFileInvoiceDollar , FaEye  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioOrdenCompraUpdate from './updateOrdenCompra'
import FormularioOrdenCompraCreate from './newOrdenCompra'
import BusquedaAvanzadaOrdenCompra from "./busquedaOrdenCompra";
import FormularioComprobanteCompraByCompra from '../comprobanteCompra/createComprobanteCompra'
import FormularioOrdenCompraView from '../ordenCompra/viewOrdenCompra'

const { default: Link } = require("next/link")

const indexOrdenCompra = () => {
    const initialStateOrdenCompra = {
        total:'', fecha:'', fechaEntrega:'', proveedor:'', empleado:'',
        presupuesto:'', medioPago:'', ordenCompraID:''
    }
    const router = useRouter();
    const [presupuestos,setPresupuestos] = useState([]);   
    const [ordenes,setOrdenes] = useState([]);
    const [proveedores,setProveedores] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);
    const [mostrarModalView, setMostrarModalView] = useState(null);
    const [mostrarModalComprobanteCompra, setMostrarModalComprobanteCompra] = useState(null);
    
    const [filtro , setFiltro] = useState(initialStateOrdenCompra);
    const [filtroDetalle , setFiltroDetalle] = useState([]); 

    
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const ordenesFiltrados = ordenes
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'proveedor') {
        aVal = proveedores.find(d => d._id === a.proveedor)?.name || '';
        bVal = proveedores.find(d => d._id === b.proveedor)?.name || '';
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setOrdenes(s.data);
                    })
        }

    const fetchData_Presupuestos = () => {
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
        fetchData_Presupuestos();
        fetchData_Proveedores();
    }, [] )

    const imprimirOrden = async (ordenID) => {
        if (!ordenID) {
            console.error("Error con el ID de la orden de compra al querer imprimirla.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra/imprimir/${ordenID}`
            );

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("Error al imprimir orden de compra:", err);
        }
    };


    const deleteOrden = async(ordenID) => {
        if(!ordenID) {
            console.log("❌ Error con el ID de la orden de compra al querer eliminarla.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra/${ordenID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                if(res.ok) {
                    alert(res.message);
                    fetchData();
                } else {
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar orden de compra para su eliminación. \n Error: ",err);
            })
    }

    return(
        <>
            
  
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

                <BusquedaAvanzadaOrdenCompra
                    filtro={filtro} // ✅ le pasamos el estado actual
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setOrdenes(resultados);
                        setMostrarModalBuscar(false);
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
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormularioOrdenCompraCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}

            {mostrarModalComprobanteCompra && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalComprobanteCompra(null)}>
                            &times;
                        </button>
                        <FormularioComprobanteCompraByCompra 
                            ordenID={mostrarModalComprobanteCompra} 
                            exito={()=>{
                                setMostrarModalComprobanteCompra(null);
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
                        <FormularioOrdenCompraUpdate 
                            ordenID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarModalView && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalView(null)}>
                            &times;
                        </button>
                        <FormularioOrdenCompraView 
                            ordenID={mostrarModalView} 
                            exito={()=>{
                                setMostrarModalView(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            <h1 className="titulo-index">Orden de Compra</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Orden de Compra">
                     <FaPlus />
                </button>           
                <button onClick={() => 
                    setMostrarModalBuscar(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de ordenes de compra">
                    <FaSearch />
                </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('cliente')}>Proveedor ⬍</th>
                            <th onClick={() => toggleOrden('presupuesto')}>Presupuesto ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th onClick={() => toggleOrden('completo')}>Recepción ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                ordenesFiltrados.map(({_id, proveedor , fecha, total , presupuesto , completo , tieneComprobante}) => {
                                    const proveedorEncontrado = proveedores.find((p)=>{return p._id === proveedor})

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{proveedorEncontrado?.name}</td>
                                        <td className="columna">{presupuesto}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">{completo ? 'COMPLETA' : 'PARCIAL'}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon"
                                                    onClick={() => {
                                                        setMostrarModalView(_id);
                                                    }} 
                                                >
                                                    <FaEye />
                                                </button>
                                                <button onClick={() => {if (completo) {
                                                        alert("❌ La entrega esta completa, no se puede cargar mas comprobantes.");
                                                        return;
                                                        }
                                                        setMostrarModalComprobanteCompra(_id)
                                                    }} 
                                                    className="btn-icon" 
                                                    title={completo ? "La entrega esta completa, no se puede cargar mas comprobantes" : "Generar Comprobante de Compra"}
                                                    >
                                                    <FaFileInvoiceDollar />
                                                </button>
                                                <button className="btn-icon"
                                                    onClick={() => {
                                                        if (tieneComprobante) {
                                                        alert("❌ Esta orden de compra ya se encuentra en un comprobante de compra y no se puede modificar.");
                                                        return;
                                                        }
                                                        setMostrarModalUpdate(_id);
                                                    }} 
                                                    title={tieneComprobante ? "Ya existe comprobante de compra, no se puede modificar" : "Modificar"}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => imprimirOrden(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button onClick={() => deleteOrden(_id)}  className="btn-icon" title="Eliminar">
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

export default indexOrdenCompra;