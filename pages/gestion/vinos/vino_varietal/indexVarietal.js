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

        if(campo === 'codigo'){
            aVal = a._id;
            bVal = b._id;
        }

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
                                <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                                <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                varietalesFiltrados.map(({_id, name, uva }) => {
                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
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
                `}
            </style>
        </>
    )
}

export default indexVarietal;