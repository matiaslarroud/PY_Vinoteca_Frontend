import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash ,FaPrint  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioRemitoCreate from './new_RemitoCliente'


const { default: Link } = require("next/link")

const indexRemitoCliente = () => {
    const router = useRouter();
    const [remitos,setRemitos] = useState([]);   
    const [comprobantesVenta,setComprobantesVenta] = useState([]);
    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroComprobanteVenta , setFiltroComprobanteVenta] = useState('');  
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
      alert("⚠️ Este pedido ya fue entregado y no puede modificarse.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/${_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entregado: true }),
      });

      if (!res.ok) throw new Error("Error al actualizar el remito");

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
    .filter(p => {
      
      const comprobanteVentaID = comprobantesVenta.find(d => d._id === p.comprobanteVentaID)?._id || '';
      const coincideComprobanteVenta = comprobanteVentaID.toString().includes(filtroComprobanteVenta);
      return coincideComprobanteVenta;
    })
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

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("Error al imprimir remito:", err);
        }
    };

    const deleteRemito = async(remitoID) => {
        if(!remitoID) {
            console.log("Error con el ID del remito al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cliente/remito/${remitoID}`,
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

            {mostrarModalUpdate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalUpdate(null)}>
                            &times;
                        </button>
                        <FormularioComprobanteVentaUpdate 
                            omprobanteVentaID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Remitos</h1>
            
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
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por comprobante de venta..."
                        value={filtroComprobanteVenta}
                        onChange={(e) => setFiltroComprobanteVenta(e.target.value)}
                    />
                </div>

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
                                                <button onClick={() => imprimirRemito(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button onClick={() => deleteRemito(_id)}  className="btn-icon" title="Eliminar">
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

                    input[type="checkbox"].toggle:checked::before {
                        
                    }

                `}
            </style>
        </>
    )
}

export default indexRemitoCliente;