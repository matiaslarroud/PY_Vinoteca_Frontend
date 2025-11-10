import { useEffect, useState } from "react";
import { FaPlus, FaHome, FaArrowLeft , FaSearch, FaTrash, FaEdit } from "react-icons/fa";
import { useRouter } from "next/router";
import FormularioPicadaCreate from "./createPicada";
import FormularioPicadaUpdate from "./updatePicada";
import BusquedaAvanzadaPicadas from "./busquedaPicada";

const { default: Link } = require("next/link");

const indexPicada = () => {
  const router = useRouter();

  const [picadas, setPicadas] = useState([]);
  const [insumos , setinsumos] = useState([]);
  const [depositos, setDepositos] = useState([]);
  const initialState = {name:'',stock:0, stockMinimo:'' , precioVenta:0 , deposito:''}
  const initialStateDetalle = {picada:'',insumo:'', cantidad:0}
    const [filtro , setFiltro] = useState(initialState);

  const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
  const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
  const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroDeposito, setFiltroDeposito] = useState('');
  const [filtroPrecio, setFiltroPrecio] = useState('');
  const [orden, setOrden] = useState({ campo: '', asc: true });

  const fetchData = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada`);
    const { data } = await res.json();
    setPicadas(data);
  };

  const fetch_Insumos = async () => {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo`)
          .then ((a)=>{return a.json()})
              .then ((s)=>{
                  setinsumos(s.data)
              })
          .catch((err)=>{console.log(err)});
  }

  const fetchData_Depositos = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`);
    const { data } = await res.json();
    setDepositos(data);
  };

  useEffect(() => {
    fetchData();
    fetchData_Depositos();
    fetch_Insumos();
  }, []);

  const deleteProduct = async (productID) => {
    if (!productID) return;
    const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada/${productID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then(() => fetchData())
      .catch((err) => console.error("Error al eliminar Picada:", err));
  };

  const toggleOrden = (campo) => {
    setOrden((prev) => ({
      campo,
      asc: prev.campo === campo ? !prev.asc : true
    }));
  };

  const picadasFiltradas = picadas
    .filter(p => {
      const depositoNombre = depositos.find(d => d._id === p.deposito)?.name || '';
      return (
        p.name.toLowerCase().includes(filtroNombre.toLowerCase()) &&
        depositoNombre.toLowerCase().includes(filtroDeposito.toLowerCase()) &&
        (filtroPrecio === '' || p.precioVenta.toString().includes(filtroPrecio))
      );
    })
    .sort((a, b) => {
    const campo = orden.campo;
    if (!campo) return 0;

    let aVal, bVal;
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

    // Si el campo es precioVenta, convertimos a número para ordenar numéricamente
    if (campo === 'precioVenta') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (aVal < bVal) return orden.asc ? -1 : 1;
    if (aVal > bVal) return orden.asc ? 1 : -1;
    return 0;
  });


  return (
      <>
        <div className="box">
        {mostrarModalCreate && (
          <div className="modal">
            <div className="modal-content">
              <button className="close" onClick={() => setMostrarModalCreate(false)}>&times;</button>
              <FormularioPicadaCreate
                exito={() => {
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
              <button className="close" onClick={() => setMostrarModalUpdate(null)}>&times;</button>
              <FormularioPicadaUpdate
                picadaID={mostrarModalUpdate}
                exito={() => {
                  setMostrarModalUpdate(null);
                  fetchData();
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
            <BusquedaAvanzadaPicadas
                filtro={filtro} // ✅ le pasamos el estado actual
                exito={(resultados) => {
                if (resultados && resultados.length > 0) {
                    setPicadas(resultados);
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

        <h1 className="titulo-pagina">Picadas</h1>

        <div className="botonera">
          <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
            <FaArrowLeft />
          </button>
          <button className="btn-icon"title="Volver al menú">
              <Link href="/" >
                  <FaHome />
              </Link>
          </button>
          <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Picada">
            <FaPlus />
          </button>
        </div>

        <div className="contenedor-tabla">
          <div className="filtros">
            <button onClick={() => 
                    setMostrarModalBuscar(true)
                }            
                className="btn-icon" title="Busqueda avanzada de picada">
                <FaSearch />
            </button>  
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
            <input
              type="text"
              placeholder="Filtrar por precio..."
              value={filtroPrecio}
              onChange={(e) => setFiltroPrecio(e.target.value)}
            />
          </div>

          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                  <th onClick={() => toggleOrden('name')}>Nombre ⬍</th>
                  <th onClick={() => toggleOrden('deposito')}>Depósito ⬍</th>
                  <th onClick={() => toggleOrden('precioVenta')}>Precio ⬍</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {picadasFiltradas.map(({ _id, name, deposito, precioVenta }) => {
                  const depositoEncontrado = depositos.find((p) => p._id === deposito);
                  return (
                    <tr key={_id}>
                      <td>{_id}</td>
                      <td>{name}</td>
                      <td>{depositoEncontrado?.name}</td>
                      <td>${precioVenta}</td>
                      <td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <style jsx>{`
        `}</style>
      </div>
    </>
  );
};

export default indexPicada;
