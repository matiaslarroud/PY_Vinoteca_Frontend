import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaFileInvoiceDollar, FaFileAlt, FaReceipt, FaTruck  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioParajeUpdate from './updateParaje'
import FormularioParajeCreate from './createParaje'

const { default: Link } = require("next/link")

const indexParaje = () => {
    const router = useRouter();
    const [bodegas,setBodegas] = useState([]);
    const [parajes,setParajes] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroParajeNombre, setFiltroParajeNombre] = useState('');
    const [filtroBodegaNombre, setFiltroBodegaNombre] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
    setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
    }));
    };

    const parajesFiltrados = parajes
    .filter(c => {
        const bodega = bodegas.find(loc => loc._id === c.bodega)?.name || '';
        
        const parajeNombre = c.name.toLowerCase().includes(filtroParajeNombre.toLowerCase());
        const coincideBodega = bodega.toLowerCase().includes(filtroBodegaNombre.toLowerCase());
        
        return parajeNombre && coincideBodega;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Si el campo es localidad, obtenemos el nombre para ordenar
        if (campo === 'bodega') {
        aVal = bodegas.find(loc => loc._id === a.bodega)?.name || '';
        bVal = bodegas.find(loc => loc._id === b.bodega)?.name || '';
        }

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });


const fetchData = ()=>{
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setParajes(data);
                    })
                }
    
    const fetchDataBodegas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBodegas(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataBodegas();
    }, [])

    const deleteParaje = async(parajeID) => {
        if(!parajeID) {
            console.log("Error con el ID del paraje al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje/${parajeID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                fetchData()
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar paraje para su eliminacion. \n ERROR: ",err);
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
                        <FormularioParajeCreate 
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
                        <FormularioParajeUpdate 
                            parajeID={mostrarModalUpdate}
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }} 
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Paraje</h1>
            
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
                        placeholder="Filtrar por paraje..."
                        value={filtroParajeNombre}
                        onChange={(e) => setFiltroParajeNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por bodega..."
                        value={filtroBodegaNombre}
                        onChange={(e) => setFiltroBodegaNombre(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                            <tr className="fila">
                                <th onClick={() => toggleOrden('name')}>Paraje ⬍</th>
                                <th onClick={() => toggleOrden('bodega')}>Bodega ⬍</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parajesFiltrados.map(({_id, name , bodega}) => {
                                    const bodegaEncontrada = bodegas.find((p)=>{return p._id === bodega});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ bodegaEncontrada?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteParaje(_id)} className="btn-icon">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>)
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
        .menu-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
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
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000; /* Asegura que esté por encima de todo */
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem;
          overflow-y: auto;
        }

        .modal-content {
            background-color: #121212;
            padding: 2rem;
            border-radius: 10px;
            width: 100%;
            max-width: 900px;
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
        .boton-acceso {
          background-color: #1f1f1f;
          color: #f1f1f1;
          border: 1px solid #444;
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .boton-acceso:hover {
          background-color: #333;
          transform: scale(1.03);
          cursor: pointer;
          border-color: #888;
        }
        .icono-menu {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #f1f1f1;
        }

  `}
  </style>

        </>
    )
}

export default indexParaje;