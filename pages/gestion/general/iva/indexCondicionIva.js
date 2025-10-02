import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioIvaUpdate from './updateCondicionIva'
import FormularioIvaCreate from './createCondicionIva'
const { default: Link } = require("next/link")

const indexCondicionIva = () => {
    const router = useRouter();
    const [condicionesIva,setCondicionesIva] = useState([]);    
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
    const condicionesIvaFiltradas = condicionesIva
    .filter(p => {
        const coincideNombre = p.name.toLowerCase().includes(filtroNombre.toLowerCase());
        return coincideNombre
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (campo === 'codigo'){
            aVal = a._id;
            bVal = b._id;
        }

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });


    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicioniva`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setCondicionesIva(data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
    }, [] )

    const deleteCondicionIva = async(condicionIvaID) => {
        if(!condicionIvaID) {
            console.log("Error con el ID de la condicion de iva al querer eliminarla.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicioniva/${condicionIvaID}`,
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
                console.log("Error al enviar condicion de iva para su eliminación. \n Error: ",err);
            })
    }

    return(
        <>
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                                {
                                    setMostrarModalCreate(false)
                                    fetchData()
                                }
                            }>
                            &times;
                        </button>
                        <FormularioIvaCreate exito={() => 
                                {
                                    setMostrarModalCreate(false)
                                    fetchData()
                                }} />
                    </div>
                </div>
            )}

            {mostrarModalUpdate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalUpdate(null)
                                fetchData()
                            }
                        }>
                            &times;
                        </button>
                        <FormularioIvaUpdate 
                            condicionIvaID={mostrarModalUpdate} 
                            exito={() => 
                                {
                                    setMostrarModalUpdate(false)
                                    fetchData()
                                }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Condicion de IVA</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()}>
                    <FaArrowLeft/>
                </button>
                <button className="btn-icon">
                    <Link href="/">
                        <FaHome/>
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)}>
                        <FaPlus  />
                    </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por condicion..."
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
                                condicionesIvaFiltradas.map(({_id,name}) => (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteCondicionIva(_id)} className="btn-icon">
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

export default indexCondicionIva;