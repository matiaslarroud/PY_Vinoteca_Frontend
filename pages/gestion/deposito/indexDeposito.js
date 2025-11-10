import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import FormularioDepositoUpdate from './updateDeposito'
import FormularioDepositoCreate from './createDeposito'
import { useRouter } from 'next/router';

const { default: Link } = require("next/link")

const indexDeposito = () => {
    const router = useRouter();
    const [depositos,setDepositos] = useState([]);
    const [barrios,setBarrios] = useState([]);
    const [localidades,setLocalidades] = useState([]);
    const [calles,setCalles] = useState([]);

    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombreDeposito, setFiltroNombreDeposito] = useState('');
    const [filtroNombreLocalidad, setFiltroNombreLocalidad] = useState('');  
    const [filtroNombreBarrio, setFiltroNombreBarrio] = useState(''); 
    const [filtroNombreCalle, setFiltroNombreCalle] = useState(''); 
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };   

    const depositosFiltrados = depositos
    .filter(c => {
        const depositoNombre = c.name.toLowerCase().includes(filtroNombreDeposito.toLowerCase());
        
        const localidadNombre = localidades.find(p => p._id === c.localidad)?.name || '';
        const coincideLocalidad = localidadNombre.toLowerCase().includes(filtroNombreLocalidad.toLowerCase());
        
        const barrioNombre = barrios.find(p => p._id === c.barrio)?.name || '';
        const coincideBarrio = barrioNombre.toLowerCase().includes(filtroNombreBarrio.toLowerCase());
        
        const calleNombre = calles.find(p => p._id === c.calle)?.name || '';
        const coincideCalle = calleNombre.toLowerCase().includes(filtroNombreCalle.toLowerCase());

        return depositoNombre && coincideLocalidad && coincideBarrio && coincideCalle;
    })
    .sort((a, b) => {
        const campo = orden.campo;
        if (!campo) return 0;

        let aVal = a[campo];
        let bVal = b[campo];

        if (campo === 'codigo'){
            aVal=a._id;
            bVal=b._id;
        }
        
        if (campo === 'localidad') {
        aVal = localidades.find(p => p._id === a.localidad)?.name || '';
        bVal = localidades.find(p => p._id === b.localidad)?.name || '';
        }
        
        if (campo === 'barrio') {
        aVal = barrios.find(p => p._id === a.barrio)?.name || '';
        bVal = barrios.find(p => p._id === b.barrio)?.name || '';
        }
        
        if (campo === 'calle') {
        aVal = calles.find(p => p._id === a.calle)?.name || '';
        bVal = calles.find(p => p._id === b.calle)?.name || '';
        }

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return orden.asc ? -1 : 1;
        if (aVal > bVal) return orden.asc ? 1 : -1;
        return 0;
    });
    
    const fetchData = ()=>{
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setDepositos(data);
                    })
                }
    
    const fetchDataLocalidades = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setLocalidades(data);
                    })
                }
    
    const fetchDataBarrios = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setBarrios(data);
                    })
                }
    
    const fetchDataCalles = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setCalles(data);
                    })
                }

    useEffect(() => {  
        fetchData(),
        fetchDataLocalidades();
        fetchDataCalles();
        fetchDataBarrios();
    }, [])

    const deleteDeposito = async(depositoID) => {
        if(!depositoID) {
            console.log("Error con el ID del deposito al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito/${depositoID}`,
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
                console.log("Error al enviar deposito para su eliminacion. \n ERROR: ",err);
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
                        <FormularioDepositoCreate 
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
                        <FormularioDepositoUpdate 
                            depositoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Deposito</h1>
            
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
                        placeholder="Filtrar por deposito..."
                        value={filtroNombreDeposito}
                        onChange={(e) => setFiltroNombreDeposito(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por localidad..."
                        value={filtroNombreLocalidad}
                        onChange={(e) => setFiltroNombreLocalidad(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por barrio..."
                        value={filtroNombreBarrio}
                        onChange={(e) => setFiltroNombreBarrio(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filtrar por calle..."
                        value={filtroNombreCalle}
                        onChange={(e) => setFiltroNombreCalle(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                            <th onClick={() => toggleOrden('localidad')}>Localidad ⬍</th>
                            <th onClick={() => toggleOrden('barrio')}>Barrio ⬍</th>
                            <th onClick={() => toggleOrden('calle')}>Calle ⬍</th>
                            <th onClick={() => toggleOrden('altura')}>Altura ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                depositosFiltrados.map(({_id, name , localidad, barrio ,calle, altura}) => {
                                    const localidadEncontrada = localidades.find((p)=>{return p._id === localidad});
                                    const barrioEncontrado = barrios.find((p)=>{return p._id === barrio});
                                    const calleEncontrada = calles.find((p)=>{return p._id === calle});

                                    return (
                                    <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{name}</td>
                                        <td className="columna">{ localidadEncontrada?.name }</td>
                                        <td className="columna">{ barrioEncontrado?.name }</td>
                                        <td className="columna">{ calleEncontrada?.name }</td>
                                        <td className="columna">{ altura }</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => deleteDeposito(_id)} className="btn-icon">
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

export default indexDeposito;