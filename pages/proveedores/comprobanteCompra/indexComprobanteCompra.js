import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaReceipt, FaEdit , FaSearch , FaFileInvoice , FaEye } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioComprobanteCompraUpdate from './updateComprobanteCompra'
import FormularioComprobanteCompraCreate from './newComprobanteCompra'
import FormularioBusquedaComprobante from './busquedaComprobanteCompra'
import FormularioComprobantePagoCreate from '../comprobantePago/createComprobantePago'
import FormularioRemitoCreate from '../remito/create_RemitoProveedor'
import FormularioComprobanteView from '../comprobanteCompra/viewComprobanteCompra'

const { default: Link } = require("next/link")

const indexComprobanteCompra = () => {
const initialStateComprobanteCompra = {
        total:'', fecha:'', ordenCompra:'', proveedor: ''
    }
    const router = useRouter();
    const [comprobantes,setComprobantes] = useState([]);   
    const [ordenes,setOrdenes] = useState([]);
    const [proveedores,setProveedores] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(null);
    const [mostrarModalComprobantePago, setMostrarModalComprobantePago] = useState(null);
    const [mostrarModalRemito, setMostrarModalRemito] = useState(null);
    const [mostrarModalComprobanteView, setMostrarModalComprobanteView] = useState(null);
        
    const [filtro , setFiltro] = useState(initialStateComprobanteCompra);
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const comprobantesFiltrados = comprobantes
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'proveedor') {
        aVal = proveedores.find(d => d._id === a.proveedor)?.name || '';
        bVal = proveedores.find(d => d._id === b.proveedor)?.name || '';
        }

        if (campo === 'ordenCompra') {
        aVal = ordenes.find(d => d._id === a.ordenCompra)?._id || '';
        bVal = ordenes.find(d => d._id === b.ordenCompra)?._id || '';
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


    const fetchData_OrdenCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setOrdenes(s.data);
                    })
        }

    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobanteCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantes(s.data);
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
        fetchData_OrdenCompra();
        fetchData_Proveedores();
    }, [] )

    return(
        <>
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormularioComprobanteCompraCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalRemito && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalRemito(false)}>
                            &times;
                        </button>
                        <FormularioRemitoCreate 
                            exito={()=>{
                                setMostrarModalRemito(false);
                                fetchData();
                            }}
                            tipo="comprobanteCompra"
                            param={mostrarModalRemito}
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
                        <FormularioComprobanteCompraUpdate 
                            comprobanteCompraID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarModalComprobanteView && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalComprobanteView(null)}>
                            &times;
                        </button>
                        <FormularioComprobanteView 
                            comprobanteCompraID={mostrarModalComprobanteView} 
                            exito={()=>{
                                setMostrarModalComprobanteView(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarModalBusqueda && (
                <div className="modal">
                    <div className="modal-content">
                    <button
                        className="close"
                        onClick={() => {
                        setMostrarModalBusqueda(null);
                        }}
                    >
                        &times;
                    </button>

                    <FormularioBusquedaComprobante
                        filtro={filtro} // ✅ le pasamos el estado actual
                        filtroDetalle={filtroDetalle}
                        exito={(resultados) => {
                        if (resultados.length > 0) {
                            setComprobantes(resultados);
                            setMostrarModalBusqueda(false);
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

            {mostrarModalComprobantePago && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalComprobantePago(null)}>
                            &times;
                        </button>
                        <FormularioComprobantePagoCreate 
                            comprobanteCompraID={mostrarModalComprobantePago} 
                            exito={()=>{
                                setMostrarModalComprobantePago(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            <h1 className="titulo-index">Comprobante de Compra</h1>
            
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
                    setMostrarModalBusqueda(true)
                    }            
                        className="btn-icon" title="Busqueda avanzada de comprobantes de compra">
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
                            <th onClick={() => toggleOrden('presupuesto')}>Orden de Compra ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                comprobantesFiltrados.map(({_id , fecha, total , ordenCompra , tieneRemito}) => {
                                    const proveedor = ordenes.find((p)=>{return p._id === ordenCompra})?.proveedor;
                                    const proveedorEncontrado = proveedores.find((p)=>{return p._id === proveedor});

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{proveedorEncontrado?.name}</td>
                                        <td className="columna">{ordenCompra}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon" title="Visualizar"
                                                    onClick={() => {
                                                        setMostrarModalComprobanteView(_id);
                                                    }} 
                                                >
                                                    <FaEye />
                                                </button>
                                                <button className="btn-icon"
                                                    title={tieneRemito ? "Ya existe un remito de este comprobante, no se puede generar uno nuevo." : "Generar remito"}
                                                    onClick={() => {
                                                        if (tieneRemito) {
                                                        alert("❌ Este comprobante de compra ya se encuentra en un remito y no se puede generar uno nuevo.");
                                                        return;
                                                        }
                                                        setMostrarModalRemito(_id);
                                                    }} 
                                                >
                                                    <FaFileInvoice />
                                                </button>
                                                <button className="btn-icon" title="Generar comprobante de pago"
                                                    onClick={() => {
                                                        setMostrarModalComprobantePago(_id);
                                                    }} 
                                                >
                                                    < FaReceipt/>
                                                </button>
                                                <button className="btn-icon"
                                                    title={tieneRemito ? "Ya existe un remito de este comprobante, no se puede modificar." : "Modificar"}
                                                    onClick={() => {
                                                        if (tieneRemito) {
                                                        alert("❌ Este comprobante de compra ya se encuentra en un remito y no se puede modificar.");
                                                        return;
                                                        }
                                                        setMostrarModalUpdate(_id);
                                                    }} 
                                                >
                                                    <FaEdit />
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

export default indexComprobanteCompra;