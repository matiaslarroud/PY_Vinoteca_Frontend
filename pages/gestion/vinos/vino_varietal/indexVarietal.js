import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioVarietalUpdate from './updateVarietal'
import FormularioVarietalCreate from './createVarietal'

const { default: Link } = require("next/link")

const indexVarietal = () => {
    const router = useRouter();
    const [varietalesVino,setVarietalesVino] = useState([]);

    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    
    const [filtroNombreVarietal, setFiltroNombreVarietal] = useState('');
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const varietalesFiltrados = varietalesVino
    .filter(c => {
        const varietalNombre = c.name.toLowerCase().includes(filtroNombreVarietal.toLowerCase());
        
        return varietalNombre;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });
    
    const fetchData = ()=>{
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setVarietalesVino(data);
                    })
                }    

    useEffect(() => {  
        fetchData();
    }, [])

    const deleteVarietal = async(varietalID) => {
        if(!varietalID) {
            console.log("Error con el ID al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal/${varietalID}`,
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
                console.log("Error al eliminar. \n ERROR: ",err);
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
                        <FormularioVarietalCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
                                fetchData()
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
                        <FormularioVarietalUpdate v
                            varietalID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Varietal</h1>
            
            <div className="botonera">
                    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                        <FaArrowLeft />
                    </button>
                    <button className="btn-icon"title="Volver al menú">
                        <Link href="/" >
                            <FaHome />
                        </Link>
                    </button>
                    <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Varietal">
                         <FaPlus />
                    </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por varietal..."
                        value={filtroNombreVarietal}
                        onChange={(e) => setFiltroNombreVarietal(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                       <thead>
                            <tr className="fila">
                                <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                varietalesFiltrados.map(({_id, name, uva }) => {
                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{name}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteVarietal(_id)} className="btn-icon">
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

export default indexVarietal;