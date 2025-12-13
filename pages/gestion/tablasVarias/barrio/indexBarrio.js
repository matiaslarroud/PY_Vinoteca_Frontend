import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioBarrioUpdate from '../barrio/updateBarrio'
import FormularioBarrioCreate from '../barrio/createBarrio'

const { default: Link } = require("next/link")

const indexBarrio = () => {
    const router = useRouter();
    const [barrios,setBarrios] = useState([]);
    const [localidades,setLocalidades] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombreBarrio, setFiltroNombreBarrio] = useState('');
    const [filtroNombreLocalidad, setFiltroNombreLocalidad] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const barriosFiltrados = barrios
    .filter(c => {
        const barrioNombre = c.name.toLowerCase().includes(filtroNombreBarrio.toLowerCase());
        
        const localidadNombre = localidades.find(p => p._id === c.localidad)?.name || '';
        const coincideLocalidad = localidadNombre.toLowerCase().includes(filtroNombreLocalidad.toLowerCase());

        return barrioNombre && coincideLocalidad;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Si el campo a ordenar es localidad, buscamos el nombre de la localidad
        if (campo === 'localidad') {
        aVal = localidades.find(p => p._id === a.localidad)?.name || '';
        bVal = localidades.find(p => p._id === b.localidad)?.name || '';
        }

        if(campo==="codigo"){
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
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBarrios(data);
                    })
                }
    
    const fetchDataLocalidades = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setLocalidades(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataLocalidades();
    }, [])

    const deleteBarrio = async(barrioID) => {
        if(!barrioID) {
            console.log("❌ Error con el ID del barrio al querer eliminarlo.")
            return
            
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio/${barrioID}`,
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
                    fetchData()
                } else {
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar barrio para su eliminacion. \n ERROR: ",err);
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
                        <FormularioBarrioCreate 
                            exito={()=>{
                                setMostrarModalCreate(false)
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
                        <FormularioBarrioUpdate 
                            barrioID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null)
                                fetchData()
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-index">Barrio</h1>
            
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
                        placeholder="Filtrar por localidad..."
                        value={filtroNombreLocalidad}
                        onChange={(e) => setFiltroNombreLocalidad(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por barrio..."
                        value={filtroNombreBarrio}
                        onChange={(e) => setFiltroNombreBarrio(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('localidad')}>Localidad ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                barriosFiltrados.map(({_id, name , localidad}) => {
                                    const localidadEncontrada = localidades.find((p)=>{return p._id === localidad});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ localidadEncontrada?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteBarrio(_id)} className="btn-icon">
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

export default indexBarrio;