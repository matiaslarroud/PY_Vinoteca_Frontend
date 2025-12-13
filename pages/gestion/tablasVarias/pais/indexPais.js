import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import FormCreatePais from './createPais.js'
import FormUpdatePais from './updatePais.js'
import { useRouter } from 'next/router';
const { default: Link } = require("next/link")

const indexPais = () => {
    const [paises,setPaises] = useState([]);    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

const [filtroNombre, setFiltroNombre] = useState('');
const [orden, setOrden] = useState({ campo: '', asc: true });

const toggleOrden = (campo) => {
    setOrden((prev) => ({
    campo,
    asc: prev.campo === campo ? !prev.asc : true
    }));
};   

const paisesFiltrados = paises
  .filter(c => {
    const coincideNombre = c.name.toLowerCase().includes(filtroNombre.toLowerCase());

    return coincideNombre;
  })
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    if(campo === "codigo"){
        aVal = a._id;
        bVal = b._id;
    }
    
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
});
const router = useRouter();
    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setPaises(data);
                    })
        }
    
    useEffect(() => {  
        fetchData();
    }, [])

    const deletePais = async(paisID) => {
        if(!paisID) {
            console.log("❌ Error con el ID del producto al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais/${paisID}`,
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
                    fetchData();
                } else {
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar DELETE para pais. \n ERROR: ",err);
            })
    }

    return(
        <>
            {mostrarModalCreate &&(
                
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormCreatePais 
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
                        <FormUpdatePais 
                            idPais={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData()
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-index">Pais</h1>
            
              <div className="botonera">
                    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                        <FaArrowLeft />
                    </button>
                    <button className="btn-icon"title="Volver al menú">
                        <Link href="/" >
                            <FaHome />
                        </Link>
                    </button>
                    <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Pais">
                         <FaPlus />
                    </button>               
              </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por pais..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
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
                                paisesFiltrados.map(({_id,name}) => (
                                    <tr key={_id} className="fila">
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deletePais(_id)} className="btn-icon">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
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

export default indexPais;