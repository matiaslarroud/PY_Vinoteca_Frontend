import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import FormularioLocalidadUpdate from '../localidad/updateLocalidad'
import FormularioLocalidadCreate from '../localidad/createLocalidad'
import { useRouter } from 'next/router';

const { default: Link } = require("next/link")

const indexLocalidad = () => {
    const router = useRouter();
    const [localidades,setLocalidades] = useState([]);
    const [provincias,setProvincias] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombreProvincia, setFiltroNombreProvincia] = useState('');
    const [filtroNombreLocalidad, setFiltroNombreLocalidad] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const localidadesFiltrados = localidades
    .filter(c => {
        const localidadNombre = c.name.toLowerCase().includes(filtroNombreLocalidad.toLowerCase());
        
        const provinciaNombre = provincias.find(p => p._id === c.provincia)?.name || '';
        const coincideProvincia = provinciaNombre.toLowerCase().includes(filtroNombreProvincia.toLowerCase());

        return localidadNombre && coincideProvincia;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Si el campo a ordenar es localidad, buscamos el nombre de la localidad
        if (campo === 'provincia') {
        aVal = provincias.find(p => p._id === a.provincia)?.name || '';
        bVal = provincias.find(p => p._id === b.provincia)?.name || '';
        }

        if (campo === 'codigo'){
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
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setLocalidades(data);
                    })
                }
    
    const fetchDataProvincias = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setProvincias(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataProvincias();
    }, [])

    const deleteLocalidad = async(localidadID) => {
        if(!localidadID) {
            console.log("❌ Error con el ID de la localidad al querer eliminarla.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad/${localidadID}`,
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
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar localidad para su eliminacion. \n ERROR: ",err);
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
                        <FormularioLocalidadCreate 
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
                        <FormularioLocalidadUpdate 
                            localidadID={mostrarModalUpdate}
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}
                             />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Localidad</h1>
            
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
                        placeholder="Filtrar por provincia..."
                        value={filtroNombreProvincia}
                        onChange={(e) => setFiltroNombreProvincia(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por localidad..."
                        value={filtroNombreLocalidad}
                        onChange={(e) => setFiltroNombreLocalidad(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('provincia')}>Provincia ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                localidadesFiltrados.map(({_id, name , provincia}) => {
                                    const provinciaEncontrada = provincias.find((p)=>{return p._id === provincia});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ provinciaEncontrada?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteLocalidad(_id)} className="btn-icon">
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

export default indexLocalidad;