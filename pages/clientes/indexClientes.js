import { useEffect, useState } from "react"
import { FaPlus, FaShoppingCart , FaHome, FaCartArrowDown, FaArrowLeft, FaTrash, FaEdit , FaFileInvoiceDollar, FaFileInvoice , FaSearch  , FaReceipt } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from "next/link";
import FormularioClienteUpdate from './updateCliente'
import FormularioClienteCreate from './createCliente'
import CreateNotaPedido from "./notaPedido/createNotaPedido";
import CreatePresupuesto from "./presupuesto/createPresupuesto";
import BusquedaAvanzadaClientes from "./busquedaCliente";

export default function indexClientes() {
  const router = useRouter();
  const [clientes,setClientes] = useState([]);
  const [localidades,setLocalidades] = useState([]);    
  const [mostrarModalCreate, setMostrarModalCreate] = useState(null);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
  const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);
  const [mostrarPresupuestoCreate, setmostrarPresupuestoCreate] = useState(null);
  const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);
  const [orden, setOrden] = useState({ campo: '', asc: true });

const initialState = {
    name:'', lastname:'', fechaNacimiento:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'', condicionIva:'', cuentaCorriente:'',
    altura:0, deptoNumero:0, deptoLetra:''
}
  const [filtro , setFiltro] = useState(initialState);

const toggleOrden = (campo) => {
    setOrden((prev) => ({
    campo,
    asc: prev.campo === campo ? !prev.asc : true
    }));
};  


const clientesFiltrados = clientes
  .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal = a[campo];
    let bVal = b[campo];

    // Si el campo a ordenar es localidad, buscamos el nombre de la localidad
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


const fetchData = () => {
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente`)
    .then((a) => {
      return a.json()
    })
    .then (({data}) => {
        setClientes(data);
    })
  }

const fetchData_Localidades = () => {
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
    .then((a) => {
      return a.json()
    })
    .then (({data}) => {
        setLocalidades(data);
    })
  }

useEffect(() => { 
    fetchData();
    fetchData_Localidades();
}, [] )

const deleteCliente = async (clienteID) => {
  if (!clienteID) {
    console.error("Error con el ID del cliente al querer eliminarlo.");
    return;
  }

  const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?");
  if (!confirmar) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/${clienteID}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      alert(data.message || "No se pudo eliminar el cliente.");
      console.warn("Error al eliminar cliente:", data);
      return;
    }

    alert(data.message || "Cliente eliminado correctamente.");
    fetchData(); // recarga la lista
    console.log(data.message);

  } catch (err) {
    console.error("Error al enviar cliente para su eliminación:", err);
    alert("Ocurrió un error al intentar eliminar el cliente.");
  }
};



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
        <FormularioClienteCreate exito={() => 
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
        <FormularioClienteUpdate 
            clienteID={mostrarModalUpdate} 
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

      <BusquedaAvanzadaClientes
        filtro={filtro} // ✅ le pasamos el estado actual
        exito={(resultados) => {
          if (resultados && resultados.length > 0) {
            setClientes(resultados);
            setMostrarModalBuscar(false);
          } else {
            alert("No se encontraron resultados");
          }
        }}
        onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} // ✅ manejamos los cambios desde el hijo
      />
    </div>
  </div>
)}

  {mostrarPedidoCreate && (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => 
            {
                setmostrarPedidoCreate(null)
                fetchData()
            }
        }>
            &times;
        </button>
        <CreateNotaPedido 
            param={mostrarPedidoCreate}
            tipo="cliente"
            exito={() => 
                {
                    setmostrarPedidoCreate(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}

  {mostrarPresupuestoCreate && (
    <div className="modal">
      <div className="modal-content">
        <button className="close" onClick={() => 
            {
                setmostrarPresupuestoCreate(null)
                fetchData()
            }
        }>
            &times;
        </button>
        <CreatePresupuesto 
            param={mostrarPresupuestoCreate}
            tipo="cliente"
            exito={() => 
                {
                    setmostrarPresupuestoCreate(false)
                    fetchData()
                }}
        />
      </div>
    </div>
  )}

  <h1 className="titulo-pagina">Clientes</h1>
  <div className="botonera">
        <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
        </button>
        <button className="btn-icon"title="Volver al menú">
            <Link href="/" >
                <FaHome />
            </Link>
        </button>
        <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Cliente">
             <FaPlus />
        </button>    
        <button onClick={() => 
              setMostrarModalBuscar(true)
            }            
            className="btn-icon" title="Busqueda avanzada de cliente">
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
                  <th onClick={() => toggleOrden('cuentaCorriente')}>Cuenta Corriente ⬍</th>
                  <th onClick={() => toggleOrden('localidad')}>Localidad ⬍</th>
                  <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {
                clientesFiltrados.map(({_id,name , cuentaCorriente, localidad}) => {
                  const localidadEncontrada = localidades.find((p)=>{return p._id === localidad })
                  return <tr key={_id}>
                      <td className="columna">{_id}</td>
                      <td className="columna">{name}</td>
                      <td className="columna">{cuentaCorriente ? "SI" : "NO"}</td>
                      <td className="columna">{localidadEncontrada?.name}</td>
                      <td className="columna">
                        <div className="acciones">
                          <button onClick={() => setmostrarPresupuestoCreate(_id)} className="btn-icon" title="Generar Presupuesto">
                              <FaCartArrowDown />
                          </button>
                          <button onClick={() => setmostrarPedidoCreate(_id)} className="btn-icon" title="Generar Pedido">
                              <FaShoppingCart />
                          </button>
                          <button onClick={() => setMostrarModalUpdate(_id)} className="btn-icon" title="Modificar">
                              <FaEdit />
                          </button>
                          <button onClick={() => deleteCliente(_id)}  className="btn-icon" title="Eliminar">
                              <FaTrash />
                          </button>
                        </div>
                      </td>
                  </tr>
                  }  
                )
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
