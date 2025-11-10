import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import FormularioCalleUpdate from '../calle/updateCalle'
import FormularioCalleCreate from '../calle/createCalle'
import { useRouter } from 'next/router';

const { default: Link } = require("next/link")

const indexCalle = () => {
    const router = useRouter();
    const [barrios,setBarrios] = useState([]);
    const [calles,setCalles] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombreBarrio, setFiltroNombreBarrio] = useState('');
    const [filtroNombreCalle, setFiltroNombreCalle] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const callesFiltrados = calles
    .filter(c => {
        const calleNombre = c.name.toLowerCase().includes(filtroNombreCalle.toLowerCase());
        
        const barrioNombre = barrios.find(p => p._id === c.barrio)?.name || '';
        const coincideBarrio = barrioNombre.toLowerCase().includes(filtroNombreBarrio.toLowerCase());

        return calleNombre && coincideBarrio;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Si el campo a ordenar es localidad, buscamos el nombre de la localidad
        if (campo === 'barrio') {
        aVal = barrios.find(p => p._id === a.barrio)?.name || '';
        bVal = barrios.find(p => p._id === b.barrio)?.name || '';
        }

        if ( campo === "codigo"){
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
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setCalles(data);
                    })
                }
    
    const fetchDataBarrios = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBarrios(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataBarrios();
    }, [])

    const deleteCalle = async(calleID) => {
        if(!calleID) {
            console.log("Error con el ID de la calle al querer eliminarla.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle/${calleID}`,
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
                console.log("Error al enviar calle para su eliminacion. \n ERROR: ",err);
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
                        <FormularioCalleCreate 
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
                        <FormularioCalleUpdate 
                            calleID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Calle</h1>
            
            <div className="botonera">
                    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                        <FaArrowLeft />
                    </button>
                    <button className="btn-icon"title="Volver al menú">
                        <Link href="/" >
                            <FaHome />
                        </Link>
                    </button>
                    <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Localidad">
                         <FaPlus />
                    </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por barrio..."
                        value={filtroNombreBarrio}
                        onChange={(e) => setFiltroNombreBarrio(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por calle..."
                        value={filtroNombreCalle}
                        onChange={(e) => setFiltroNombreCalle(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('barrio')}>Barrio ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                callesFiltrados.map(({_id, name , barrio}) => {
                                    const barrioEncontrado = barrios.find((p)=>{return p._id === barrio});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ barrioEncontrado?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteCalle(_id)} className="btn-icon">
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

export default indexCalle;