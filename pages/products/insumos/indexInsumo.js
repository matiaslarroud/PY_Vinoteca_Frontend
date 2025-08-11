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

    let aVal, bVal;

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
          .box {
            height: 100%;
            width: 100%;
          }

          .titulo-pagina {
            font-size: 3rem;
            color: white;
            text-align: center;
            margin-top: 2rem;
          }

          .botonera {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 2rem auto;
          }

          .btn-icon {
            background-color: #8b0000;
            color: white;
            padding: 0.8rem;
            font-size: 1.2rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            width: 3.2rem;
            height: 3.2rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, transform 0.2s;
          }

          .btn-icon:hover {
            background-color: #a30000;
            transform: translateY(-3px);
          }

          .contenedor-tabla {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            background-color: #222;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }

          .filtros {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
            justify-content: center;
          }

          .filtros input {
            padding: 10px;
            font-size: 1rem;
            border-radius: 6px;
            border: 1px solid #ccc;
            min-width: 220px;
          }

          .tabla-scroll {
            overflow-x: auto;
            max-height: 500px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            background-color: #333;
            color: white;
          }

          th, td {
            text-align: center;
            padding: 12px;
            border-bottom: 1px solid #555;
          }

          th {
            background-color: #111;
            cursor: pointer;
          }

          .acciones {
            display: flex;
            justify-content: center;
            gap: 10px;
          }

          .modal {
            position: fixed;
            inset: 0; /* top: 0; bottom: 0; left: 0; right: 0 */
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1rem; /* para espacio lateral en pantallas pequeñas */
            overflow-y: auto;
          }

          .modal-content {
            background-color: #121212;
            padding: 2rem;
            border-radius: 10px;
            width: 100%;
            max-width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
          }

          .close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 1.5rem;
            background: transparent;
            border: none;
            cursor: pointer;
          }
        `}</style>

        </>
    )
}

export default indexInsumo;