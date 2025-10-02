import { useEffect, useState } from "react"
import { FaPlus, FaShoppingCart , FaHome, FaArrowLeft, FaTrash, FaEdit , FaFileInvoiceDollar, FaFileInvoice } from "react-icons/fa";
import { useRouter } from 'next/router';
import Link from "next/link";
import FormularioClienteUpdate from './updateCliente'
import FormularioClienteCreate from './createCliente'
import CreateNotaPedido from "./notaPedido/createNotaPedido";

export default function indexClientes() {
const router = useRouter();
const [clientes,setClientes] = useState([]);
const [localidades,setLocalidades] = useState([]);    
const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
const [mostrarPedidoCreate, setmostrarPedidoCreate] = useState(null);

const [filtroClienteNombre, setFiltroClienteNombre] = useState('');
const [filtroClienteLocalidad, setFiltroClienteLocalidad] = useState('');  
const [orden, setOrden] = useState({ campo: '', asc: true });

const toggleOrden = (campo) => {
    setOrden((prev) => ({
    campo,
    asc: prev.campo === campo ? !prev.asc : true
    }));
};   

const clientesFiltrados = clientes
  .filter(c => {
    const localidadNombre = localidades.find(loc => loc._id === c.localidad)?.name || '';

    const coincideNombre = c.name.toLowerCase().includes(filtroClienteNombre.toLowerCase());

    const coincideLocalidad = localidadNombre.toLowerCase().includes(filtroClienteLocalidad.toLowerCase());

    return coincideNombre && coincideLocalidad;
  })
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

const deleteCliente = async(clienteID) => {
    if(!clienteID) {
        console.log("Error con el ID del cliente al querer eliminarlo.")
        return
    }
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/cliente/${clienteID}`,
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
            console.log("Error al enviar cliente para su eliminación. \n Error: ",err);
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
        <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Presupuesto">
             <FaPlus />
        </button>               
  </div>

  <div className="contenedor-tabla">
    <div className="filtros">
          <input
              type="text"
              placeholder="Filtrar por cliente..."
              value={filtroClienteNombre}
              onChange={(e) => setFiltroClienteNombre(e.target.value)}
          />
          <input
              type="text"
              placeholder="Filtrar por localidad..."
              value={filtroClienteLocalidad}
              onChange={(e) => setFiltroClienteLocalidad(e.target.value)}
          />
    </div>
    <div className="filtros">
        <button className="submit-btn" onClick={() => router.back()} title="Presupuestos">
            <FaFileInvoice />
            Presupuestos
        </button>
        <button className="submit-btn" onClick={() => router.back()} title="Presupuestos">
            <FaShoppingCart />
            Notas de Pedido
        </button>
        <button className="submit-btn" onClick={() => router.back()} title="Presupuestos">
            <FaFileInvoiceDollar />
            Comprobantes de Venta
        </button>
        <button className="submit-btn" onClick={() => router.back()} title="Presupuestos">
            <FaFileInvoice />
            Remitos
        </button>
    </div>
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
