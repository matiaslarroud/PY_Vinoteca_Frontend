import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaFileInvoiceDollar, FaFileAlt, FaReceipt, FaTruck  } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioVinoCreate from './createVino';
import FormularioVinoUpdate from './updateVino';


const { default: Link } = require("next/link")

const indexVino = () => {
    const router = useRouter();

    const [vinos,setVinos] = useState([]);
    const [tiposV,setTiposV] = useState([]);
    const [bodegas,setBodegas] = useState([]);

    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);

const [filtroVinoNombre, setfiltroVinoNombre] = useState('');
const [filtroVinoTipo, setfiltroVinoTipo] = useState('');  
const [filtroVinoBodega, setfiltroVinoBodega] = useState('');  
const [orden, setOrden] = useState({ campo: '', asc: true });

const toggleOrden = (campo) => {
  setOrden((prev) => ({
    campo,
    asc: prev.campo === campo ? !prev.asc : true 
  }));
};

const vinosFiltrados = vinos
  .filter(c => {
    const tipoVino = tiposV.find(loc => loc._id === c.tipo)?.name || '';
    const bodegaVino = bodegas.find(loc => loc._id === c.bodega)?.name || '';

    const coincideNombre = c.name.toLowerCase().includes(filtroVinoNombre.toLowerCase());
    const coincideTipo = tipoVino.toLowerCase().includes(filtroVinoTipo.toLowerCase());
    const coincideBodega = bodegaVino.toLowerCase().includes(filtroVinoBodega.toLowerCase());

    return coincideNombre && coincideTipo && coincideBodega;
  })
    .sort((a, b) => {
  const campo = orden.campo;
  if (!campo) return 0;

  let aVal, bVal;
    if (campo === 'codigo') {
        aVal = a._id;
        bVal = b._id;
    } 
  if (campo === 'price') {
    aVal = a.precioCosto + (a.precioCosto * a.ganancia) / 100;
    bVal = b.precioCosto + (b.precioCosto * b.ganancia) / 100;
  } else if (campo === 'bodega') {
    aVal = bodegas.find(loc => loc._id === a.bodega)?.name || '';
    bVal = bodegas.find(loc => loc._id === b.bodega)?.name || '';
  } else if (campo === 'tipo') {
    aVal = tiposV.find(loc => loc._id === a.tipo)?.name || '';
    bVal = tiposV.find(loc => loc._id === b.tipo)?.name || '';
  } else {
    aVal = a[campo];
    bVal = b[campo];
  }

  // Normalización para strings
  if (typeof aVal === 'string') aVal = aVal.toLowerCase();
  if (typeof bVal === 'string') bVal = bVal.toLowerCase();

  // Conversión numérica si aplica
  if (!isNaN(aVal) && !isNaN(bVal)) {
    aVal = Number(aVal);
    bVal = Number(bVal);
  }

  if (aVal < bVal) return orden.asc ? -1 : 1;
  if (aVal > bVal) return orden.asc ? 1 : -1;
  return 0;
});

    
    const fetchData = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino`)
            .then((a) => {
                        return a.json()
                    })
                        .then (({data}) => {
                            setVinos(data);
                        })
    }

    const fetchDataTiposVino = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`)
            .then((a) => {
                                return a.json()
                    })
                        .then (({data}) => {
                            setTiposV(data);
                        })
    }

    const fetchDataBodegas = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
            .then((a) => {
                                return a.json()
                    })
                        .then (({data}) => {
                            setBodegas(data);
                        })
    }
    
    useEffect(() => {  
        fetchData();
        fetchDataTiposVino();
        fetchDataBodegas();
    }, [])

    const deleteProduct = async(productID) => {
        if(!productID) {
            console.log("Error con el ID del vino al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino/${productID}`,
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
                console.log("Error al envia vino para su eliminación. \n Error: ",err);
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
                        <FormularioVinoCreate 
                            exito={()=>{
                                setMostrarModalCreate(false);
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
                        <FormularioVinoUpdate 
                            vinoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null)
                                fetchData()
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Vinos</h1>
            
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
                        placeholder="Filtrar por vino..."
                        value={filtroVinoNombre}
                        onChange={(e) => setfiltroVinoNombre(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por tipo..."
                        value={filtroVinoTipo}
                        onChange={(e) => setfiltroVinoTipo(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por bodega..."
                        value={filtroVinoBodega}
                        onChange={(e) => setfiltroVinoBodega(e.target.value)}
                    />

                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('tipo')}>Tipo ⬍</th>
                            <th onClick={() => toggleOrden('bodega')}>Bodega ⬍</th>
                            <th onClick={() => toggleOrden('price')}>Precio ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                vinosFiltrados.map(({_id,name , precioCosto, ganancia , bodega , tipo}) => {
                                    const bodegaEncontrada = bodegas.find((p)=>{return p._id === bodega})
                                    const tipoEncontrada = tiposV.find((p)=>{return p._id === tipo})

                                    return <tr key={_id}>                                        
                                        <td className="columna">{_id}</td>                     
                                        <td className="columna">{name}</td>
                                        <td className="columna">{tipoEncontrada?.name}</td>
                                        <td className="columna">{bodegaEncontrada?.name}</td>
                                        <td className="columna">{precioCosto+((precioCosto*ganancia)/100)}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteProduct(_id)} className="btn-icon">
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

export default indexVino;