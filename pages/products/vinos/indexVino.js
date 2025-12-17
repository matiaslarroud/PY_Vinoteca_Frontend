import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioVinoCreate from './createVino';
import FormularioVinoUpdate from './updateVino';
import FormularioBusquedaAvanzada from './busquedaVino'


const { default: Link } = require("next/link")

const indexVino = () => {
    const initialState = {name:'',stock:0 , stockMinimo:'', proveedor:'' , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'' , varietal:'' , volumen:'' , deposito:''}
    
    const router = useRouter();

    const [vinos,setVinos] = useState([]);
    const [tiposV,setTiposV] = useState([]);
    const [bodegas,setBodegas] = useState([]);

    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarBusqueda, setmostrarBusqueda] = useState(null);
    
    const [filtro , setFiltro] = useState(initialState); 
    const [filtroDetalle , setFiltroDetalle] = useState([]);  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
            campo,
            asc: prev.campo === campo ? !prev.asc : true 
        }));
    };

    const vinosFiltrados = vinos
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
            console.log("❌ Error con el ID del vino al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino/${productID}`,
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
                console.log("❌ Error al envia vino para su eliminación. \n Error: ",err);
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
  
            {mostrarBusqueda && (
            <div className="modal">
                <div className="modal-content">
                <button
                    className="close"
                    onClick={() => {
                    setmostrarBusqueda(null);
                    }}
                >
                    &times;
                </button>

                <FormularioBusquedaAvanzada
                    filtro={filtro} // ✅ le pasamos el estado actual
                    filtroDetalle={filtroDetalle}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setVinos(resultados);
                        setmostrarBusqueda(false);
                    } else {
                        alert("❌ No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
                    onChangeFiltroDetalle={(nuevoFiltroDetalle) => setFiltroDetalle(nuevoFiltroDetalle)}
                />
                </div>
            </div>
            )}
            <h1 className="titulo-index">Vinos</h1>
            
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
                    <button className="btn-icon" onClick={() => setmostrarBusqueda(true)} title="Busqueda avanzada de vino">
                        <FaSearch />
                    </button>            
            </div>

            <div className="contenedor-tabla">
                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('stock')}>Stock ⬍</th>
                            <th onClick={() => toggleOrden('tipo')}>Tipo ⬍</th>
                            <th onClick={() => toggleOrden('bodega')}>Bodega ⬍</th>
                            <th onClick={() => toggleOrden('proveedor')}>Proveedor ⬍</th>
                            <th onClick={() => toggleOrden('precio')}>Precio ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                vinosFiltrados.map(({_id,name , stock , precioCosto, ganancia , bodega , tipo , proveedor}) => {
                                    const bodegaEncontrada = bodegas.find((p)=>{return p._id === bodega})
                                    const tipoEncontrada = tiposV.find((p)=>{return p._id === tipo})

                                    return <tr key={_id}>                                        
                                        <td className="columna">{_id}</td>                     
                                        <td className="columna">{name}</td>                   
                                        <td className="columna">{stock}</td>
                                        <td className="columna">{tipoEncontrada?.name}</td>
                                        <td className="columna">{bodegaEncontrada?.name}</td>                  
                                        <td className="columna">{proveedor}</td>
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