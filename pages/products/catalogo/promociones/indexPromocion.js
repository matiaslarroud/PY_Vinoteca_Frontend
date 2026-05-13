import { useEffect, useState } from "react"
import { FaPlus, FaShoppingCart , FaHome, FaTrash , FaArrowLeft, FaEye, FaEdit , FaPrint , FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormlarioPromocionUpdate from './updatePromocion'
import FormularioPromocionCreate from './newPromocion'
import BusquedaAvanzadaPromocion from "./busquedaPromocion";
import PromocionView from "./viewPromocion";

const { default: Link } = require("next/link")

const indexPromocion = () => {
    const router = useRouter();
    const [promociones,setPromociones] = useState([]); 
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);
    const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);
    const [mostrarModalView, setMostrarModalView] = useState(null);

    const initialStatePresupuesto = {total:'', producto:'', cantidad:'', medioPago:''}
        
    const [filtro , setFiltro] = useState(initialStatePresupuesto);
    const [filtroDetalle , setFiltroDetalle] = useState([]);  

    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const promocionesFiltradas = promociones
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/oferta`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setPromociones(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
    }, [] )

    const deletePromocion = async(promocionID) => {
        if(!promocionID) {
            console.log("❌ Error con el ID de la promocion al querer eliminarla.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/promocion/${promocionID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                if(res.ok){
                    alert(res.message);
                    fetchData();
                } else {
                    alert(res.message);
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar promocion para su eliminación. \n Error: ",err);
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
                        <FormularioPromocionCreate 
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

                <BusquedaAvanzadaPromocion
                    filtro={filtro} // ✅ le pasamos el estado actual
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setPromociones(resultados);
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

            {mostrarModalUpdate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalUpdate(null)}>
                            &times;
                        </button>
                        <FormlarioPromocionUpdate 
                            promocionID={mostrarModalUpdate} 
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
                        <PromocionView 
                            promocionID={mostrarModalView} 
                            exito={()=>{
                                setMostrarModalView(null);
                            }}    
                        />
                    </div>
                </div>
            )}

            <h1 className="titulo-index">Ofertas</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Promocion">
                     <FaPlus />
                </button>                 
                <button onClick={() => 
                    setMostrarModalBuscar(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de promociones">
                    <FaSearch />
                </button>        
            </div>
            <div className="contenedor-tabla">

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                promocionesFiltradas.map(({_id, name , total}) => {

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalView(_id)} className="btn-icon" title="Visualizar">
                                                    <FaEye />
                                                </button>
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deletePromocion(_id)}  className="btn-icon" title="Eliminar">
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

export default indexPromocion;