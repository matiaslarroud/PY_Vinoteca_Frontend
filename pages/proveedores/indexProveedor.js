import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaCartArrowDown , FaShoppingCart , FaSearch , FaRegFileAlt  } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from "next/link";
import FormularioProveedorUpdate from './updateProveedor'
import FormularioProveedorCreate from './createProveedor'
import BusquedaAvanzadaProveeedores from "./busquedaProveedor";
import FormularioSolicitudPresupuesto from "./presupuestoSolicitud/createSolicitud";
import FormularioPresupuesto from "./presupuesto/createPresupuesto";

export default function indexProveedor() {
const router = useRouter();
const [proveedores,setProveedores] = useState([]);    
const [localidades, setlocalidades] = useState([]);
const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);
const [mostrarModalSolicitudPresupuesto, setMostrarModalSolicitudPresupuesto] = useState(null);
const [mostrarModalPresupuesto, setMostrarModalPresupuesto] = useState(null);

const initialState = {
    name:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'' , altura:'', condicionIva:''
}
  const [filtro , setFiltro] = useState(initialState);
 
const [orden, setOrden] = useState({ campo: '', asc: true });

const toggleOrden = (campo) => {
  setOrden((prev) => ({
    campo,
    asc: prev.campo === campo ? !prev.asc : true
  }));
};

const proveedoresFiltrados = proveedores
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    // Si el campo es localidad, obtenemos el nombre para ordenar
    if (campo === 'localidad') {
      aVal = localidades.find(loc => loc._id === a.localidad)?.name || '';
      bVal = localidades.find(loc => loc._id === b.localidad)?.name || '';
    }

    if (campo === 'codigo') {
        aVal = a._id;
        bVal = b._id;
    }

    if (typeof aVal === 'string') aVal = aVal.toLowerCase();
    if (typeof bVal === 'string') bVal = bVal.toLowerCase();

    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });


const fetchData_Localidades = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
    .then((a)=>{return a.json()})
      .then((s)=>{setlocalidades(s.data)})
}

const fetchData = async () => {
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
    .then((a) => {
      return a.json()
    })
    .then (({data}) => {
        setProveedores(data);
    })
  }

useEffect(() => { 
    fetchData();
    fetchData_Localidades();
}, [] )

const deleteProveedor = async(proveedorID) => {
    if(!proveedorID) {
        console.log("❌ Error con el ID del proveedor al querer eliminarlo.")
        return
    }

    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
    
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor/${proveedorID}`,
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
            fetchData()
          } else {
            alert(res.message)
          }
        })
        .catch((err)=>{
            console.log("❌ Error al enviar proveedor para su eliminación. \n Error: ",err);
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
        <FormularioProveedorCreate 
          exito={() => {
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
        <FormularioProveedorUpdate 
            proveedorID={mostrarModalUpdate} 
            exito={() => 
                {
                    setMostrarModalUpdate(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}
  
  {mostrarModalBuscar && (
  <div className="modal">
    <div className="modal-content">
      <button
        className="close"
        onClick={() => {
          setMostrarModalBuscar(null);
          fetchData();
        }}
      >
        &times;
      </button>

      <BusquedaAvanzadaProveeedores
        filtro={filtro} // ✅ le pasamos el estado actual
        exito={(resultados) => {
          if (resultados && resultados.length > 0) {
            setProveedores(resultados);
            setMostrarModalBuscar(false);
          } else {
            alert("❌ No se encontraron resultados");
          }
        }}
        onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
      />
    </div>
  </div>
)}

  {mostrarModalSolicitudPresupuesto && (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => 
            {
                setMostrarModalSolicitudPresupuesto(null)
                fetchData()
            }
        }>
            &times;
        </button>
        <FormularioSolicitudPresupuesto 
            param={mostrarModalSolicitudPresupuesto} 
            tipo='proveedor'
            exito={() => 
                {
                    setMostrarModalSolicitudPresupuesto(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}

  {mostrarModalPresupuesto && (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => 
            {
                setMostrarModalPresupuesto(null)
                fetchData()
            }
        }>
            &times;
        </button>
        <FormularioPresupuesto 
            param={mostrarModalPresupuesto} 
            tipo='proveedor'
            exito={() => 
                {
                    setMostrarModalPresupuesto(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}

  <h1 className="titulo-index">Proveedores</h1>
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
        <button onClick={() => 
              setMostrarModalBuscar(true)
            }            
            className="btn-icon" title="Busqueda avanzada de proveedor">
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
                  <th onClick={() => toggleOrden('localidad')}>Localidad ⬍</th>
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                proveedoresFiltrados.map(({_id,name,localidad }) => {
                  const localidadEncontrada = localidades.find((p)=>{return p._id === localidad})

                  return <tr key={_id}>
                      <td className="columna">{_id}</td>
                      <td className="columna">{name}</td>
                      <td className="columna">{localidadEncontrada?.name}</td>
                      <td className="columna">
                          <div className="acciones">                                 
                              <button onClick={() => setMostrarModalSolicitudPresupuesto(_id)} className="btn-icon" title="Generar Solicitud Presupuesto">
                                  <FaRegFileAlt />
                              </button>                     
                              <button onClick={() => setMostrarModalPresupuesto(_id)} className="btn-icon" title="Generar Presupuesto">
                                  <FaCartArrowDown />
                              </button>  
                              <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon">
                                  <FaEdit />
                              </button>
                              <button onClick={() => deleteProveedor(_id)} className="btn-icon">
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
  );
}
