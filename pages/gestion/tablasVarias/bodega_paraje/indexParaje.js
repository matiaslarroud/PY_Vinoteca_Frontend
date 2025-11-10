import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaFileInvoiceDollar, FaFileAlt, FaReceipt, FaTruck  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioParajeUpdate from './updateParaje'
import FormularioParajeCreate from './createParaje'

const { default: Link } = require("next/link")

const indexParaje = () => {
    const router = useRouter();
    const [bodegas,setBodegas] = useState([]);
    const [parajes,setParajes] = useState([]);
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroParajeNombre, setFiltroParajeNombre] = useState('');
    const [filtroBodegaNombre, setFiltroBodegaNombre] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
    setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
    }));
    };

    const parajesFiltrados = parajes
    .filter(c => {
        const bodega = bodegas.find(loc => loc._id === c.bodega)?.name || '';
        
        const parajeNombre = c.name.toLowerCase().includes(filtroParajeNombre.toLowerCase());
        const coincideBodega = bodega.toLowerCase().includes(filtroBodegaNombre.toLowerCase());
        
        return parajeNombre && coincideBodega;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        if(campo==='codigo'){
            aVal=a._id;
            bVal=b._id;
        }

        // Si el campo es localidad, obtenemos el nombre para ordenar
        if (campo === 'bodega') {
        aVal = bodegas.find(loc => loc._id === a.bodega)?.name || '';
        bVal = bodegas.find(loc => loc._id === b.bodega)?.name || '';
        }

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });


const fetchData = ()=>{
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setParajes(data);
                    })
                }
    
    const fetchDataBodegas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBodegas(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataBodegas();
    }, [])

    const deleteParaje = async(parajeID) => {
        if(!parajeID) {
            console.log("Error con el ID del paraje al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje/${parajeID}`,
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
                console.log("Error al enviar paraje para su eliminacion. \n ERROR: ",err);
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
                        <FormularioParajeCreate 
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
                        <FormularioParajeUpdate 
                            parajeID={mostrarModalUpdate}
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }} 
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Paraje</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Presupuesto">
                    <FaPlus />
                </button>               
        </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por paraje..."
                        value={filtroParajeNombre}
                        onChange={(e) => setFiltroParajeNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por bodega..."
                        value={filtroBodegaNombre}
                        onChange={(e) => setFiltroBodegaNombre(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                            <tr className="fila">
                                <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                                <th onClick={() => toggleOrden('name')}>Paraje ⬍</th>
                                <th onClick={() => toggleOrden('bodega')}>Bodega ⬍</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                parajesFiltrados.map(({_id, name , bodega}) => {
                                    const bodegaEncontrada = bodegas.find((p)=>{return p._id === bodega});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ bodegaEncontrada?.name }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteParaje(_id)} className="btn-icon">
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

export default indexParaje;