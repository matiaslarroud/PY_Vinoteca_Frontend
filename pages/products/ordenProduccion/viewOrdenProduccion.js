const { useState, useEffect } = require("react")
import Select from 'react-select';
import { FaTrash} from "react-icons/fa";
import FormularioTipoVinoCreate from '../../gestion/tablasVarias/vino_tipo/createVinoTipo'
import FormularioDepositoCreate from '../../gestion/deposito/createDeposito'


const initialState = {fechaElaboracion:'' , fechaEntrega:'' , empleado:''}
const initialStateDetalle = {ordenProduccion:'',picada:'', cantidad:0}

const viewOrden = ({exito , ordenID}) => {
    const [ordenProduccion , setOrdenProducion] = useState(initialState);
    const [empleados, setEmpleados] = useState([]);
    const [picadas, setPicadas] = useState([]);
    const [detalles, setDetalles] = useState([initialStateDetalle]);

    const detallesValidos = detalles.filter(d => d.picada && d.cantidad > 0);
    const puedeGuardar = detallesValidos.length > 0;

    const fetch_Picadas = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setPicadas(s.data)
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_Empleados = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/empleado`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setEmpleados(s.data)
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_OrdenProduccion = async (ordenID) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion/${ordenID}`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    const empleado = s.data.empleado;
                    const fechaElaboracion = s.data.fechaElaboracion.split("T")[0];
                    const fechaEntrega = s.data.fechaEntrega.split("T")[0];
                    setOrdenProducion({
                        empleado:empleado,
                        fechaElaboracion:fechaElaboracion,
                        fechaEntrega:fechaEntrega
                    })
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_OrdenProduccionDetalle = async (ordenID) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccionDetalle/ordenProduccion/${ordenID}`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setDetalles(s.data)
                })
            .catch((err)=>{console.log(err)});
    }
    
    useEffect(()=>{
        setDetalles([]);
        fetch_OrdenProduccion(ordenID);
        fetch_OrdenProduccionDetalle(ordenID);
        fetch_Picadas();
        fetch_Empleados();
    } , [ordenID])
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setOrdenProducion({
            ...ordenProduccion , 
                [name]:value
        })   
    }

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        if (name === "picada") {
            if (value) {
                // Actualizamos la picada seleccionada
                setOrdenProducion({
                    ...ordenProduccion,
                    picada: value
                });

                // Traemos los detalles de esa picada
                fetch_DetallesPicada(value);
            } else {
                // Si se deselecciona, vaciamos
                setOrdenProducion({
                    ...ordenProduccion,
                    picada: ""
                });
                setDetalles([]);
            }
        } else {
            setOrdenProducion({
                ...ordenProduccion,
                [name]: value
            });
        }
    };

    const clickChange = async(e) => {
         e.preventDefault();
         const resOrdenProduccion = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccion/${ordenID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    fechaElaboracion: ordenProduccion.fechaElaboracion ,
                    fechaEntrega: ordenProduccion.fechaEntrega,
                    empleado: ordenProduccion.empleado,
                })
            }
        )

        const ordenCreada = await resOrdenProduccion.json();
        const identificador = ordenCreada.data._id;

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccionDetalle/${identificador}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar detalle para su eliminación. \n Error: ",err);
            })

        // GUARDAMOS DETALLES
        for (const detalle of detalles) {
            const resDetalle = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/ordenProduccionDetalle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    cantidad: detalle.cantidad,
                    picada: detalle.picada,
                    ordenProduccion: identificador
            })
                });
            
            if (!resDetalle.ok) throw new Error("Error al guardar un detalle");
        }
        setDetalles([initialStateDetalle]);
        setOrdenProducion(initialState);
        exito();
    }

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;
        
        setDetalles(nuevosDetalles);
    };

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{ordenProduccion:'',picada:'', cantidad:0} }]);
    };

    const [mostrarModalCreate1, setMostrarModalCreate1] = useState(false);
    const [mostrarModalCreate2, setMostrarModalCreate2] = useState(false);

    const opciones_empleados = empleados.map(v => ({ value: v._id,label: v.name }));
    const opciones_picadas = picadas.map(v => ({ value: v._id,label: v.name , stock:v.stock }));

    return(
        <>
            {mostrarModalCreate1 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate1(false)}>&times;</button>
                    <FormularioTipoVinoCreate
                    exito={() => {
                        setMostrarModalCreate1(false);
                        fetch_tiposVino();
                    }}
                    />
                </div>
                </div>
            )}

            {mostrarModalCreate2 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate2(false)}>&times;</button>
                    <FormularioDepositoCreate
                    exito={() => {
                        setMostrarModalCreate2(false);
                        fetch_Depositos();
                    }}
                    />
                </div>
                </div>
            )}

            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Visualización de Orden de Produccion</h1>
                    </div>
                </div>

                <form id="updatePicada" className="formulario-picada">
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Fecha de Elaboración:
                            </label>
                            <input type="date" onChange={inputChange} value={ordenProduccion.fechaElaboracion} name="fechaElaboracion" required disabled/>
                        </div>
                        <div className="form-col">
                            <label>
                                Fecha de Entrega:
                            </label>
                            <input type="date" onChange={inputChange} value={ordenProduccion.fechaEntrega} name="fechaEntrega" required  disabled/>
                        </div>
                        <div className="form-col">
                            <label>
                                Empleado:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_empleados}
                                value={opciones_empleados.find(op => op.value === ordenProduccion.empleado) || null}
                                onChange={selectChange}
                                name='empleado'
                                placeholder="Empleado..."
                                isClearable
                                isDisabled={true}
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: 220, // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 220,
                                    maxWidth: 220,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    border: '1px solid #444',
                                    borderRadius: 8,
                                    }),
                                    singleValue: (base) => ({
                                    ...base,
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis', // ⬅️ evita que el texto se desborde
                                    }),
                                    menu: (base) => ({
                                    ...base,
                                    backgroundColor: '#2c2c2c',
                                    color: 'white',
                                    }),
                                    option: (base, { isFocused }) => ({
                                    ...base,
                                    backgroundColor: isFocused ? '#444' : '#2c2c2c',
                                    color: 'white',
                                    }),
                                    input: (base) => ({
                                    ...base,
                                    color: 'white',
                                    }),
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-col-productos">
                            <label>
                                    Picadas:
                            </label>
                         <div className="form-group-insumos">
                                
                                {detalles.map((d, i) => (
                                <div key={i} className="insumo-item">
                                    <div className='form-col-item1'>
                                        {/* Picada */}
                                        <div className="form-col">
                                            <Select
                                                className="form-select-react"
                                                classNamePrefix="rs"
                                                options={opciones_picadas}
                                                value={opciones_picadas.find(op => op.value === d.picada) || null}
                                                onChange={(selectedOption) =>
                                                    handleDetalleChange(i, "picada", selectedOption ? selectedOption.value : "")
                                                }
                                                name='picada'
                                                placeholder="Picada..."
                                                isClearable
                                                isDisabled={true}
                                                styles={{
                                                    container: (base) => ({
                                                    ...base,
                                                    width: 220, // ⬅️ ancho fijo total
                                                    }),
                                                    control: (base) => ({
                                                    ...base,
                                                    minWidth: 220,
                                                    maxWidth: 220,
                                                    backgroundColor: '#2c2c2c',
                                                    color: 'white',
                                                    border: '1px solid #444',
                                                    borderRadius: 8,
                                                    }),
                                                    singleValue: (base) => ({
                                                    ...base,
                                                    color: 'white',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis', // ⬅️ evita que el texto se desborde
                                                    }),
                                                    menu: (base) => ({
                                                    ...base,
                                                    backgroundColor: '#2c2c2c',
                                                    color: 'white',
                                                    }),
                                                    option: (base, { isFocused }) => ({
                                                    ...base,
                                                    backgroundColor: isFocused ? '#444' : '#2c2c2c',
                                                    color: 'white',
                                                    }),
                                                    input: (base) => ({
                                                    ...base,
                                                    color: 'white',
                                                    }),
                                                }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className='form-col-item1'>
                                        <input
                                            type="number"
                                            placeholder="Cantidad"
                                            min={1}
                                            max={opciones_picadas.find((p) => p.value === Number(d.picada))?.stock || 0}
                                            value={d.cantidad}
                                            onChange={(e) => handleDetalleChange(i, "cantidad", e.target.value)}
                                            required
                                            disabled
                                        />
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    

                    
                </form>

            </div>
            <style jsx>
                {`
                    .box-cargar{
                        justify-content: center;
                        align-items: center;
                    }

                    .form-container {
                        background-color: #1f1f1f;
                        color: #fff;
                        padding: 2rem;
                        border-radius: 16px;
                        width: 100%;
                        height: 100%;
                        margin: 0 auto;
                        box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
                    }

                    .precio-venta {
                        max-width: 100px;
                    }

                    .titulo-pagina {
                        text-align: center;
                        font-size: 2rem;
                        margin-bottom: 1.5rem;
                        font-weight: bold;
                        color: #f5f5f5;
                    }

                    .formulario-picada {
                        display: flex;
                        flex-direction: column;
                        gap: 2rem;
                    }

                    .form-row {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 1.5rem;
                    }

                    .form-col {
                        flex: 1;
                        min-width: 250px;
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-productos {
                        flex: 8;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item1 {
                        flex: 3;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item2 {
                        flex: 2;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-precioVenta {
                        flex: 2;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                    }

                    label {
                        font-weight: 500;
                        margin-bottom: 0.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    }

                    input[type="text"],
                    input[type="number"] {
                        background-color: #2c2c2c;
                        color: white;
                        border: 1px solid #444;
                        border-radius: 8px;
                        padding: 0.6rem;
                        font-size: 1rem;
                        outline: none;
                        transition: border-color 0.2s ease-in-out;
                    }

                    input:focus {
                        border-color: #571212ff;
                    }

                    .precio-venta {
                        flex-direction: column;
                        align-items: flex-end;
                        justify-content: flex-start;
                        flex: 1;
                    }

                    .btn-plus {
                        background-color: transparent;
                        color: #651616ff;
                        border: none;
                        font-size: 1.2rem;
                        cursor: pointer;
                    }

                    .btn-plus:hover {
                        color: #571212ff;
                    }

                    .form-group-insumos {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        height: 160px;
                        overflow-y: auto;
                        padding-right: 8px;
                    }

                    .insumo-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-wrap: wrap;
                    }

                    .insumo-item input[type="number"] {
                        width: 120px;
                    }

                    .btn-add-insumo {
                        background-color: #a30000;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        align-self: flex-start;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .btn-add-insumo:hover {
                        background-color: #8b0000;
                        transform: translateY(-3px);
                    }

                    .form-submit {
                        justify-content: center;
                        margin-top: 1rem;
                    }

                    .submit-btn {
                        background-color: #a30000;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .submit-btn:hover {
                        background-color: #8b0000;
                        transform: translateY(-3px);
                    }
                        
                    .modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5); /* oscurece fondo */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }

                    .modal-content {
                        background-color: #121212;
                        padding: 40px;
                        border-radius: 12px;
                        width: 90%;
                        height:80%;
                        max-width: 500px;
                        max-height: 800px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        position: relative;
                        margin: 20px;
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

                    .btn-icon {
                        background-color: #8b0000;
                        color: white;
                        padding: 0.8rem;
                        font-size: 1.2rem;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        width: 2.5rem;
                        height: 2.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.3s, transform 0.2s;
                    }
                    
                    .btn-icon:hover {
                        background-color: #a30000;
                        transform: translateY(-3px);
                    }
                `}
            </style>
        </>
    )
}

export default viewOrden;