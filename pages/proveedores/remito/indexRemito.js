import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash , FaEye , FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioRemitoCreate from './new_RemitoProveedor'
import FormularioRemitoView from './view_RemitoProveedor'
import FormularioRemitoBusqueda from './busqueda_RemitoProveedor'


const { default: Link } = require("next/link")

const indexRemito = () => {
    
    const initialState = {remitoID:'',proveedor:'',totalPrecio:0, totalBultos:0 , comprobanteCompra:'', transporte:''}
    const router = useRouter();
    const [remitos,setRemitos] = useState([]);   
    const [comprobantesCompra,setComprobantesCompra] = useState([]);
    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalView, setMostrarModalView] = useState(null);
    const [mostrarModalBusqueda, setMostrarModalBusqueda] = useState(null);
    
    const [filtro , setFiltro] = useState(initialState);
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };

  const remitosFiltrados = remitos
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'comprobanteCompra') {
        aVal = comprobantesCompra.find(d => d._id === a.comprobanteCompra)?._id || '';
        bVal = comprobantesCompra.find(d => d._id === b.comprobanteCompra)?._id || '';
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/remito`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setRemitos(s.data);
                    })
        }

    const fetchData_ComprobantesCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobanteCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantesCompra(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_ComprobantesCompra();
    }, [] )

    const deleteRemito = async(remitoID) => {
        if(!remitoID) {
            console.log("❌ Error con el ID del remito al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/remito/${remitoID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                if(res.ok){
                    alert(res.message)
                    fetchData()
                } else {
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar remito para su eliminación. \n Error: ",err);
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
                        <FormularioRemitoCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
        
            {mostrarModalView && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalView(false)}>
                            &times;
                        </button>
                        <FormularioRemitoView 
                            remitoID={mostrarModalView}
                            exito={()=>{
                                setMostrarModalView(false);
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
                        <FormularioRemitoUpdate 
                            remitoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
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

                    <FormularioRemitoBusqueda
                        filtro={filtro} // ✅ le pasamos el estado actual
                        filtroDetalle={filtroDetalle}
                        exito={(resultados) => {
                        if (resultados.length > 0) {
                            setRemitos(resultados);
                            setMostrarModalBusqueda(false);
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

            <h1 className="titulo-index">Remito</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Remito">
                     <FaPlus />
                </button>               
                <button onClick={() => 
                    setMostrarModalBusqueda(true)
                    }            
                        className="btn-icon" title="Busqueda avanzada de remitos">
                    <FaSearch />
                </button>              
            </div>
            <div className="contenedor-tabla">
                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('comprobanteVenta')}>Comprobante de Compra ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('totalPrecio')}>Total ⬍</th>
                            <th onClick={() => toggleOrden('totalBultos')}>Bultos ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                remitosFiltrados.map(({_id, comprobanteCompra , fecha, totalPrecio , totalBultos}) => {

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{comprobanteCompra}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${totalPrecio}</td>
                                        <td className="columna">{totalBultos}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalView(_id)}  className="btn-icon" title="Visualizar">
                                                    <FaEye />
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
                    input[type="checkbox"].toggle {
                        appearance: none;
                        -webkit-appearance: none;
                        width: 50px;
                        height: 26px;
                        background: #444;
                        border-radius: 50px;
                        position: relative;
                        cursor: pointer;
                        transition: background 0.3s ease;
                        outline: none;
                        border: 2px solid #666;
                    }

                    input[type="checkbox"].toggle::before {
                        content: "";
                        position: absolute;
                        width: 20px;
                        height: 20px;
                        top: 2px;
                        left: 2px;
                        background: #707070ff;
                        border-radius: 50%;
                        transition: transform 0.3s ease;
                    }

                    input[type="checkbox"].toggle:checked {
                        background: #8b0000; /* verde moderno */
                        border-color: #000000ff;
                    }
                `}
            </style>
        </>
    )
}

export default indexRemito;