import { useEffect, useState } from "react"
import { FaPlus, FaHome, FaArrowLeft, FaTrash, FaEdit , FaPrint , FaFileInvoiceDollar } from "react-icons/fa";
import { useRouter } from 'next/router';
import FormularioComprobanteUpdate from './updateComprobantePago'
import FormularioComprobanteCreate from './newComprobantePago'

const { default: Link } = require("next/link")

const indexComprobante = () => {
    const router = useRouter();
    const [comprobantes,setComprobantes] = useState([]);
    const [comprobantesCompra, setComprobantesCompra] = useState([]);
    const [ordenesCompra,setOrdenesCompra] = useState([]);
    const [proveedores,setProveedores] = useState([]);  
    const [mediosPago,setMediosPago] = useState([]);  
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroComprobante , setFiltroComprobante] = useState('');  
    const [orden, setOrden] = useState({ campo: '', asc: true });

    const toggleOrden = (campo) => {
        setOrden((prev) => ({
        campo,
        asc: prev.campo === campo ? !prev.asc : true
        }));
    };                

  const comprobantesFiltrados = comprobantes
    .filter(p => {
      const comprobanteCompra = comprobantesCompra.find(a => a._id === p.comprobanteCompra);
      const ordenCompra = ordenesCompra.find(s => s._id === comprobanteCompra.ordenCompra);
      const proveedorNombre = proveedores.find(d => d._id === ordenCompra.proveedor)?.name || '';
      const coincideNombre = proveedorNombre.toLowerCase().includes(filtroNombre.toLowerCase())
      
      const coincideComprobante = comprobantes.toString().includes(filtroComprobante);

      
      return coincideNombre && coincideComprobante;
    })
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

            if (!res.ok) throw new Error("No se pudo generar el PDF");

            // 📌 Convertir respuesta en blob (PDF)
            const blob = await res.blob();

            // Crear una URL temporal para el PDF
            const url = URL.createObjectURL(blob);

            // Abrir en una nueva pestaña
            window.open(url, "_blank");

        } catch (err) {
            console.error("Error al imprimir comprobante de pago:", err);
        }
    };


    const deleteComprobante = async(comprobante) => {
        if(!comprobante) {
            console.log("Error con el ID del comprobante de pago al querer eliminarlo.")
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
                console.log("Error al enviar comprobante de pago para su eliminación. \n Error: ",err);
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
            <h1 className="titulo-pagina">Comprobante de Pago</h1>
            
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
            </div>
            <div className="contenedor-tabla">
                <div className="filtros">
                    <input
                        type="text"
                        placeholder="Filtrar por proveedor..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                </div>

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th onClick={() => toggleOrden('codigo')}>Codigo ⬍</th>
                            <th onClick={() => toggleOrden('cliente')}>Proveedor ⬍</th>
                            <th onClick={() => toggleOrden('fecha')}>Fecha ⬍</th>
                            <th onClick={() => toggleOrden('total')}>Total ⬍</th>
                            <th>Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                comprobantesFiltrados.map(({_id, comprobanteCompra , fecha, total }) => {                                    
                                    const comprobanteEncontrado = comprobantesCompra.find(a => a._id === comprobanteCompra);
                                    const ordenCompra = ordenesCompra.find(s => s._id === comprobanteEncontrado.ordenCompra);
                                    const proveedorEncontrado = proveedores.find(d => d._id === ordenCompra.proveedor)

                                    return <tr key={_id}>
                                        <td className="columna">{_id}</td>
                                        <td className="columna">{proveedorEncontrado?.name}</td>
                                        <td className="columna">{fecha.split("T")[0]}</td>
                                        <td className="columna">${total}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button className="btn-icon" title="Modificar"
                                                    onClick={() => {
                                                       setMostrarModalUpdate(_id);
                                                    }} 
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => imprimirComprobante(_id)}  className="btn-icon" title="Imprimir">
                                                    <FaPrint />
                                                </button>
                                                <button onClick={() => deleteComprobante(_id)}  className="btn-icon" title="Eliminar">
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

export default indexComprobante;