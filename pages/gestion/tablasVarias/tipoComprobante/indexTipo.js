import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioTipoComprobanteUpdate from './updateTipo'
import FormularioTipoComprobanteCreate from './createTipo'
const { default: Link } = require("next/link")

const indexTipo = () => {
    const router = useRouter();
    const [tiposComprobantes,setTiposComprobantes] = useState([]);    
    const [tiposIva,setTiposIva] = useState([]);    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCondicion , setFiltroCondicion] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });
    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                
    const tiposComprobantesFiltrados = tiposComprobantes
    .filter(p => {
        const clienteCondicion = tiposIva.find(d => d._id === p.condicionIva)?.name || '';
        const coincideNombreCondicion = clienteCondicion.toLowerCase().includes(filtroCondicion.toLowerCase())

        const coincideNombre = p.name.toLowerCase().includes(filtroNombre.toLowerCase());

        return coincideNombre && coincideNombreCondicion;
    })
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'condicionIva') {
        aVal = tiposIva.find(d => d._id === a.condicionIva)?.name || '';
        bVal = tiposIva.find(d => d._id === b.condicionIva)?.name || '';
        }

        if ( campo === 'codigo'){
            aVal = a._id;
            bVal = b._id;
        }

        else {
        aVal = a[campo];
        bVal = b[campo];
        }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });


    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoComprobante`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setTiposComprobantes(data);
                    })
        }


    const fetchData_Iva = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicioniva`)
                .then((a) => {
                    return a.json()
                })
                    .then (({data}) => {
                        setTiposIva(data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_Iva();
    }, [] )

    const deleteTipoComprobante = async(id) => {
        if(!id) {
            console.log("❌ Error con el ID del tipo de comprobante al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoComprobante/${id}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                if(res.ok) {
                    alert(res.message)
                    fetchData();
                } else {
                    alert(res.message)
                }
            })
            .catch((err)=>{
                console.log("❌ Error al enviar tipo de comprobante para su eliminación. \n Error: ",err);
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
                        <FormularioTipoComprobanteCreate exito={() => 
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
                        <FormularioTipoComprobanteUpdate 
                            tipoComprobanteID={mostrarModalUpdate} 
                            exito={() => 
                                {
                                    setMostrarModalUpdate(false)
                                    fetchData()
                                }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-index">Tipo de Comprobante</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()}>
                    <FaArrowLeft/>
                </button>
                <button className="btn-icon">
                    <Link href="/">
                        <FaHome/>
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar tipo de comprobante">
                        <FaPlus  />
                    </button>               
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por nombre..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por condicion iva..."
                        value={filtroCondicion}
                        onChange={(e) => setFiltroCondicion(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('condicionIva')}>Condicion de Iva ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                tiposComprobantesFiltrados.map(({_id,name, condicionIva}) => {
                                    const ivaEncontrado = tiposIva.find((p)=>{return p._id === condicionIva})
                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ivaEncontrado?.name}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteTipoComprobante(_id)} className="btn-icon">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
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

export default indexTipo;