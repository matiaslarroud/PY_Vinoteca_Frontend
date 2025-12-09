import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from "next/link";
import FormularioUsuarioUpdate from './updateUsuario'
import FormularioUsuarioCreate from './newUsuario'

export default function indexUsuario() {
const router = useRouter();
const [usuarios,setUsuarios] = useState([]);    
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
const usuariosFiltrados = usuarios
  .filter(p => {
    const coincideNombre = p.name.toLowerCase().includes(filtroNombre.toLowerCase());
    return coincideNombre
  })
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    if(campo === 'codigo'){
      aVal = a._id;
      bVal = b._id;
    }

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });



const fetchData = () => {
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario`)
    .then((a) => {
      return a.json()
    })
    .then (({data}) => {
        setUsuarios(data);
    })
  }

useEffect(() => { 
    fetchData();
}, [] )

const deleteUsuario = async(usuarioID) => {
    if(!usuarioID) {
        console.log("❌ Error con el ID del usuario al querer eliminarlo.")
        return
    }
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario/${usuarioID}`,
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
            console.log("❌ Error al enviar usuario para su eliminación. \n Error: ",err);
        })
}


  return (
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
        <FormularioUsuarioCreate exito={() => 
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
        <FormularioUsuarioUpdate 
            usuarioID={mostrarModalUpdate} 
            exito={() => 
                {
                    setMostrarModalUpdate(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}


  <h1 className="titulo-pagina">Usuarios</h1>
  <div className="botonera">
    <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
        <FaArrowLeft />
    </button>
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>
    <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Usuario">
         <FaPlus />
    </button>               
  </div>

  <div className="contenedor-tabla">
    <div className="filtros">
      <input
        type="text"
        placeholder="Filtrar por usuario..."
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
                <th onClick={() => toggleOrden('rol')}>Rol ⬍</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                usuarios.map(({_id,name,rol}) => (
                  <tr key={_id}>
                      <td className="columna">{_id}</td>
                      <td className="columna">{name}</td>
                      <td className="columna">{rol}</td>
                      <td className="columna">
                        <div className="acciones">
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                              <FaEdit />
                          </button>
                          <button onClick={() => deleteUsuario(_id)}  className="btn-icon" title="Eliminar">
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
)}
