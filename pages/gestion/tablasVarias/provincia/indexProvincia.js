import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import FormularioProvinciaUpdate from '../provincia/updateProvincia'
import FormularioProvinciaCreate from '../provincia/createProvincia'
import { useRouter } from 'next/router';

const { default: Link } = require("next/link")

const indexProvincia = () => {
    const router = useRouter();
    const [provincias,setProvincias] = useState([]);
    const [paises,setPaises] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombreProvincia, setFiltroNombreProvincia] = useState('');
    const [filtroNombrePais, setFiltroNombrePais] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const provinciasFiltrados = provincias
    .filter(c => {
        const provinciaNombre = c.name.toLowerCase().includes(filtroNombreProvincia.toLowerCase());
        
        const paisNombre = paises.find(p => p._id === c.pais)?.name || '';
        const coincidePais = paisNombre.toLowerCase().includes(filtroNombrePais.toLowerCase());

        return provinciaNombre && coincidePais;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Si el campo a ordenar es localidad, buscamos el nombre de la localidad
        if (campo === 'pais') {
        aVal = paises.find(p => p._id === a.pais)?.name || '';
        bVal = paises.find(p => p._id === b.pais)?.name || '';
        }
        
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
    
    const fetchData = ()=>{fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setProvincias(data);
                    })}
    
    const fetchDataPaises = ()=>{fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setPaises(data);
                    })}

    useEffect(() => {  
        fetchData(),
        fetchDataPaises();
    }, [])

    const deleteProvincia = async(provinciaID) => {
        if(!provinciaID) {
            console.log("❌ Error con el ID de la provincia al querer eliminarla.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia/${provinciaID}`,
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
                console.log("❌ Error al enviar provincia para su eliminacion. \n ERROR: ",err);
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
                        <FormularioProvinciaCreate 
                            exito={()=>{
                                setMostrarModalCreate(false)
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
                        <FormularioProvinciaUpdate 
                            provinciaID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-index">Provincia</h1>
            
            <div className="botonera">
                    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                        <FaArrowLeft />
                    </button>
                    <button className="btn-icon"title="Volver al menú">
                        <Link href="/" >
                            <FaHome />
                        </Link>
                    </button>
                    <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Provincia">
                         <FaPlus />
                    </button>               
              </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por pais..."
                        value={filtroNombrePais}
                        onChange={(e) => setFiltroNombrePais(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por provincia..."
                        value={filtroNombreProvincia}
                        onChange={(e) => setFiltroNombreProvincia(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('pais')}>Pais ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                provinciasFiltrados.map(({_id, name , pais}) => {
                                    const paisEncontrado = paises.find((p)=>{return p._id === pais});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ paisEncontrado?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteProvincia(_id)} className="btn-icon">
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

export default indexProvincia;