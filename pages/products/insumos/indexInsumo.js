import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioInsumoCreate from './createInsumo';
import FormularioInsumoUpdate from './updateInsumo';


const { default: Link } = require("next/link")

const indexInsumo = () => {
    const router = useRouter();

    const [insumos,setInsumos] = useState([]);
    const [depositos,setDepositos] = useState([]);

    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroDeposito, setFiltroDeposito] = useState('');
    const [orden, setOrden] = useState({ campo: '', asc: true });
    const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const insumosFiltrados = insumos
    .filter(p => {
      const depositoNombre = depositos.find(d => d._id === p.deposito)?.name || '';
      const coincideDeposito = depositoNombre.toLowerCase().includes(filtroDeposito.toLowerCase()) 
      
      const coincideNombre = p.name.toLowerCase().includes(filtroNombre.toLowerCase()) 

      return coincideDeposito && coincideNombre;
    })
    .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];
    if (campo === 'codigo') {
      aVal = a._id;
      bVal = b._id;
    }

    if (campo === 'deposito') {
      aVal = depositos.find(d => d._id === a.deposito)?.name || '';
      bVal = depositos.find(d => d._id === b.deposito)?.name || '';
    } else {
      aVal = a[campo];
      bVal = b[campo];
    }

    // Si es string, pasamos a minúscula para ordenar insensible a mayúsculas
    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();


    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });

    const fetchData = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo`)
            .then((a) => {
                        return a.json()
                    })
                        .then (({data}) => {
                            setInsumos(data);
                        })
    }

    const fetch_Depositos = async() => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
            .then((a) => {
                        return a.json()
                    })
                        .then (({data}) => {
                            setDepositos(data);
                        })
    }
    
    useEffect(() => {  
        fetchData();
        fetch_Depositos()
    }, [])

    const deleteProduct = async(productID) => {
        if(!productID) {
            console.log("Error con el ID de la insumo al querer eliminarla.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo/${productID}`,
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
                console.log("Error al enviar insumo para su eliminación. \n Error: ",err);
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
                        <FormularioInsumoCreate 
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
                        <FormularioInsumoUpdate 
                            insumoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null)
                                fetchData()
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Insumos</h1>
            
            <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon"title="Volver al menú">
              <Link href="/" >
                  <FaHome />
              </Link>
          </button>
          <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Insumo">
            <FaPlus />
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
                    placeholder="Filtrar por depósito..."
                    value={filtroDeposito}
                    onChange={(e) => setFiltroDeposito(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaInsumos">
                        <thead>
                            <tr>
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('deposito')}>Depósito ⬍</th>
                            <th onClick={() => toggleOrden('stock')}>Stock ⬍</th>
                            <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                insumosFiltrados.map(({ _id, name , deposito , stock}) => {
                                    const depositoEncontrado = depositos.find((p)=>{return p._id === deposito});
                                    
                                    return <tr key={_id}>                                        
                                        <td className="columna">{_id}</td>                                      
                                        <td className="columna">{name}</td>
                                        <td className="columna">{depositoEncontrado?.name}</td>
                                        <td className="columna">{stock}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                              <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                                                <FaEdit />
                                              </button>
                                              <button onClick={() => deleteProduct(_id)} className="btn-icon" title="Eliminar">
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

            <style jsx>{`
        `}</style>

        </>
    )
}

export default indexInsumo;