import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioBodegaUpdate from './updateBodega'
import FormularioBodegaCreate from './createBodega'

const { default: Link } = require("next/link")

const indexBodega = () => {
    const router = useRouter();
    const [bodegas,setBodegas] = useState([]);    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    
    const [filtroNombreBodega, setFiltroNombreBodega] = useState('');
    const [filtroFamiliaBodega, setFiltroFamiliaBodega] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const bodegasFiltradas = bodegas
    .filter(c => {
        const bodegaNombre = c.name.toLowerCase().includes(filtroNombreBodega.toLowerCase());
        
        const familiaBodega = c.familia.toLowerCase().includes(filtroFamiliaBodega.toLowerCase());

        return bodegaNombre && familiaBodega;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        if(campo === 'codigo'){
            aVal=a._id;
            bVal=b._id;
        }

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });
    
    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBodegas(data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
    }, [] )

    const deleteBodega = async(bodegaID) => {
        if(!bodegaID) {
            console.log("Error con el ID de la bodega al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega/${bodegaID}`,
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
                console.log("Error al enviar bodega para su eliminación. \n Error: ",err);
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
                        <FormularioBodegaCreate 
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
                        <FormularioBodegaUpdate 
                            bodegaID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null)
                                fetchData()
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Bodega</h1>
            
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
                        placeholder="Filtrar por bodega..."
                        value={filtroNombreBodega}
                        onChange={(e) => setFiltroNombreBodega(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por familia..."
                        value={filtroFamiliaBodega}
                        onChange={(e) => setFiltroFamiliaBodega(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('familia')}>Familia ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                bodegasFiltradas.map(({_id,name , familia}) => (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{familia}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteBodega(_id)} className="btn-icon">
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

export default indexBodega;