import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaEye, FaEdit , FaPrint , FaSearch } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioComprobanteUpdate from './updateComprobantePago'
import FormularioComprobanteCreate from './newComprobantePago'
import BusquedaAvanzadaComprobante from "./busquedaComprobantePago";
import ComprobantePagoView from "./viewComprobantePago";

const { default: Link } = require("next/link")

const indexComprobante = () => {
    const initialStateComprobante = {
        total:0, fecha:'', proveedor:'', medioPago:'' , comprobanteCompra:'', comprobanteID:''
    }

    const router = useRouter();
    const [comprobantes,setComprobantes] = useState([]);
    const [comprobantesCompra, setComprobantesCompra] = useState([]);
    const [ordenesCompra,setOrdenesCompra] = useState([]);
    const [proveedores,setProveedores] = useState([]);  
    const [mediosPago,setMediosPago] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const [mostrarModalBuscar, setMostrarModalBuscar] = useState(null);
    const [mostrarModalView, setMostrarModalView] = useState(null);
    
    const [filtro , setFiltro] = useState(initialStateComprobante);
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const comprobantesFiltrados = comprobantes
    .sort((a, b) => {
      const campo = orden.campo;
      if (!campo) return 0;

        let aVal, bVal;

        if (campo === 'proveedor') {
            aVal = proveedores.find(d => d._id === a.proveedor)?.name || '';
            bVal = proveedores.find(d => d._id === b.proveedor)?.name || '';
        }

        if (campo === 'codigo') {
        aVal = Number(a._id);
        bVal = Number(b._id);
        }

        else {
        aVal = a[campo];
        bVal = b[campo];
        }
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return orden.asc ? -1 : 1;
      if (aVal > bVal) return orden.asc ? 1 : -1;
      return 0;
    });


    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobantePago`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantes(s.data);
                    })
        }
    const fetchData_ComprobantesCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobanteCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setComprobantesCompra(s.data);
                    })
        }
    const fetchData_OrdenesCompra = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/ordenCompra`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setOrdenesCompra(s.data);
                    })
        }

    const fetchData_Proveedores = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setProveedores(s.data);
                    })
        }
        
    const fetchData_MediosPago = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/medioPago`)
                .then((a) => {
                        return a.json()
                })
                    .then ((s) => {
                        setMediosPago(s.data);
                    })
        }
    

    useEffect(() => { 
        fetchData();
        fetchData_Proveedores();
        fetchData_ComprobantesCompra();
        fetchData_OrdenesCompra();
        fetchData_MediosPago();
    }, [] )

    const imprimirComprobante = async (comprobante) => {
        if (!comprobante) {
            console.error("Error con el ID del comprobante de pago al querer imprimirlo.");
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobantePago/imprimir/${comprobante}`
            );

            if (!res.ok) throw new Error("❌ No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("❌ Error al imprimir comprobante de pago:", err);
        }
    };


    const deleteComprobante = async(comprobante) => {
        if(!comprobante) {
            console.log("❌ Error con el ID del comprobante de pago al querer eliminarlo.")
            return
        }
        const confirmar = window.confirm("¿Estás seguro de que quieres eliminar?"); if (!confirmar) return;
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/proveedor/comprobantePago/${comprobante}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                fetchData();
            })
            .catch((err)=>{
                console.log("❌ Error al enviar comprobante de pago para su eliminación. \n Error: ",err);
            })
    }

    return(
        <>
  
            {mostrarModalBuscar && (
            <div className="modal">
                <div className="modal-content">
                <button
                    className="close"
                    onClick={() => {
                    setMostrarModalBuscar(null);
                    }}
                >
                    &times;
                </button>

                <BusquedaAvanzadaComprobante
                    filtro={filtro}
                    exito={(resultados) => {
                    if (resultados.length > 0) {
                        setComprobantes(resultados);
                        setMostrarModalBuscar(false);
                    } else {
                        alert("No se encontraron resultados");
                    }
                    }}
                    onChangeFiltro={(nuevoFiltro) => setFiltro(nuevoFiltro)} 
                />
                </div>
            </div>
            )}
            {mostrarModalCreate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormularioComprobanteCreate 
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
                        <FormularioComprobanteUpdate 
                            comprobantePagoID={mostrarModalUpdate} 
                            exito={()=>{
                                setMostrarModalUpdate(null);
                                fetchData();
                            }}    
                        />
                    </div>
                </div>
            )}

            {mostrarModalView && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalView(null)}>
                            &times;
                        </button>
                        <ComprobantePagoView 
                            comprobantePagoID={mostrarModalView} 
                            exito={()=>{
                                setMostrarModalView(null);
                            }}    
                        />
                    </div>
                </div>
            )}
            <h1 className="titulo-index">Comprobante de Pago</h1>
            
            <div className="botonera">
                <button className="btn-icon" onClick={() => router.back()} title="Volver atrás">
                    <FaArrowLeft />
                </button>
                <button className="btn-icon"title="Volver al menú">
                    <Link href="/" >
                        <FaHome />
                    </Link>
                </button>
                <button className="btn-icon" onClick={() => setMostrarModalCreate(true)} title="Agregar Comprobante de Pago">
                     <FaPlus />
                </button>         
                <button onClick={() => 
                    setMostrarModalBuscar(true)
                    }            
                    className="btn-icon" title="Busqueda avanzada de comprobantes de pago">
                    <FaSearch />
                </button>               
            </div>
            <div className="contenedor-tabla">

                <div className="tabla-scroll">
                    <table id="tablaVinos">
    <thead>
        <tr className="fila">
            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
            <th onClick={() => toggleOrden('proveedor')}>Proveedor ⬍</th>
            <th onClick={() => toggleOrden('comprobanteCompra')}>Comprobante de Compra ⬍</th>
            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
            <th>Acciones</th>
        </tr>
    </thead>

    <tbody>
        {comprobantes.map(({ _id, comprobanteCompra, fecha, total, proveedor }) => {
            const proveedorEncontrado = proveedores.find(p => p._id === proveedor);

            return (
                <tr key={_id}>
                    <td className="columna">{_id}</td>

                    <td className="columna">{proveedorEncontrado?.name}</td>

                    <td className="columna">
                        {comprobanteCompra?._id}
                    </td>

                    <td className="columna">{fecha.split("T")[0]}</td>
                    <td className="columna">${total}</td>

                    <td className="columna">
                        <div className="acciones">
                            <button className="btn-icon" onClick={() => setMostrarModalView(_id)} title="Visualizar">
                                <FaEye />
                            </button>
                            <button className="btn-icon" onClick={() => setMostrarModalUpdate(_id)} title="Modificar">
                                <FaEdit />
                            </button>
                            <button className="btn-icon" onClick={() => imprimirComprobante(_id)} title="Imprimir">
                                <FaPrint />
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

            <style>
                {`
                `}
            </style>
        </>
    )
}

export default indexComprobante;