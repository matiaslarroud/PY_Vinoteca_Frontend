import { useEffect, useState } from "react"
import { FaPlus, FaHome , FaSearch , FaArrowLeft, FaEye ,FaPrint  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioRemitoCreate from './new_RemitoCliente'
import BusquedaAvanzada from "../remito/busquedaRemitoCliente";
import FormularioRemitoView from './view_RemitoCliente'

const { default: Link } = require("next/link")

const indexRemitoCliente = () => {
    const initialState = {remitoID: '',cliente:'',totalPrecio:0, totalBultos:0, fecha:'', comprobanteVentaID:'', transporteID:'', entregado:''}
    const initialDetalle = { tipoProducto:"", producto:''};
    
    const router = useRouter();
    const [remitos,setRemitos] = useState([]);   
    const [comprobantesVenta,setComprobantesVenta] = useState([]);
    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalView, setMostrarModalView] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    
    const [filtro , setFiltro] = useState(initialState); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };          
    
  const handleCheck = async (_id) => {
    const remito = remitos.find((r) => r._id === _id);

    if (!remito) return;

    if (remito.entregado) {
      alert("❌ Este pedido ya fue entregado y no puede modificarse.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entregado: true }),
      });

      if (!res.ok) {
        alert("❌ Error al marcar como entregado el remito.")
      } else {
        alert("✔️ Remito entregado correctamente.")
      }

      setRemitos((prev) =>
        prev.map((r) =>
          r._id === _id ? { ...r, entregado: true } : r
        )
      );
    } catch (error) {
      console.error(error);
      alert("❌ Hubo un problema al marcar como entregado");
    }
  };

  const remitosFiltrados = remitos
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'comprobanteVenta') {
        aVal = comprobantesVenta.find(d => d._id === a.comprobanteVentaID)?._id || '';
        bVal = comprobantesVenta.find(d => d._id === b.comprobanteVentaID)?._id || '';
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
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setRemitos(s.data);
                    })
        }

    const fetchData_ComprobantesVenta = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/comprobanteVenta`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantesVenta(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_ComprobantesVenta();
    }, [] )

    const imprimirRemito = async (id) => {
        if (!id) {
            console.error("Error con el ID del remito al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/imprimir/${id}`
            );

            if (!res.ok) throw new Error("❌ No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("❌ Error al imprimir remito:", err);
        }
    };

    const deleteRemito = async(remitoID) => {
        if(!remitoID) {
            console.log("Error con el ID del remito al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/${remitoID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                if(res.ok) {
                    alert(res.message)
                    fetchData();
                } else{
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("Error al enviar remito para su eliminación. \n Error: ",err);
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
                        <button className="close" onClick={() => setMostrarModalView(null)}>
                            &times;
                        </button>
                        <FormularioRemitoView 
                            remitoID={mostrarModalView} 
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
                        setRemitos(resultados);
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
            <h1 className="titulo-index">Remitos</h1>
            
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
                    setmostrarBusqueda(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de remito">
                    <FaSearch />
                </button>                 
            </div>
            <div className="contenedor-tabla">
                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('comprobanteVenta')}>Comprobante de Venta ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('totalPrecio')}>Total ⬍</th>
                            <th onClick={() => toggleOrden('entregado')}>Entregado ⬍</th>
                            <th onClick={() => toggleOrden('totalBultos')}>Bultos ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                remitosFiltrados.map(({_id, comprobanteVentaID , fecha, totalPrecio , totalBultos , entregado}) => {

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{comprobanteVentaID}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${totalPrecio}</td>
                                        <td className="columna">
                                            <input
                                                type="checkbox"
                                                className="toggle"
                                                title="Entregado..."
                                                checked={entregado}
                                                onChange={() => handleCheck(_id)}
                                            />
                                        </td>
                                        <td className="columna">{totalBultos}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalView(_id)}  className="btn-icon" title="Visualización">
                                                    <FaEye />
                                                </button>
                                                <button onClick={() => imprimirRemito(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
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

export default indexRemitoCliente;