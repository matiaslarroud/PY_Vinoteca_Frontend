import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioMedioPagoUpdate from './updateMedioPago'
import FormularioMedioPagoCreate from './createMedioPago'

const { default: Link } = require("next/link")

const indexMedioPago = () => {
    const router = useRouter();
    const [mediosPago,setMediosPago] = useState([]);    
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
    const mediosPagoFiltrados = mediosPago
    .filter(p => {
        const coincideNombre = p.name.toLowerCase().includes(filtroNombre.toLowerCase());
        return coincideNombre
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        // Normalizamos strings para comparación insensible a mayúsculas
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if(campo === 'codigo'){
            aVal=a._id;
            bVal=b._id;
        }
        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });


    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setMediosPago(data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
    }, [] )

    const deleteMedioPago = async(medioPagoID) => {
        if(!medioPagoID) {
            console.log("Error con el ID del medio de pago al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago/${medioPagoID}`,
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
                console.log("Error al enviar medio de pago para su eliminación. \n Error: ",err);
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
                        <FormularioMedioPagoCreate exito={() => 
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
                        <FormularioMedioPagoUpdate 
                            medioPagoID={mostrarModalUpdate} 
                            exito={() => 
                                {
                                    setMostrarModalUpdate(false)
                                    fetchData()
                                }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Medio de Pago</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon" title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Medio de Pago">
                    <FaPlus />
                </button>               
            </div>

            <div className="contenedor-tabla">
            <div className="filtros">
            <input
                type="text"
                placeholder="Filtrar por medio de pago..."
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
                            <th onClick={() => toggleOrden('interes')}>Interes ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                mediosPagoFiltrados.map(({_id,name , interes}) => (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{interes}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteMedioPago(_id)}  className="btn-icon" title="Eliminar">
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

export default indexMedioPago;