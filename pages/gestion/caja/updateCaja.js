const { useState, useEffect } = require("react")
import Select from 'react-select';

import Formulario_MedioPago from '../tablasVarias/medioPago/createMedioPago'

const initialState = {referencia:'',persona:'', total:'', tipo:null, medioPago:''}

const formCaja = ({exito , movimientoID}) => {
    const [movimiento, setMovimiento] = useState(initialState);
    const [mediosPago, setMediosPago] = useState([]);

    const [mostrarMedioPago , setMostrarMedioPago] = useState(false)
    
    const fetchData_MediosPago = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/medioPago`);
        const { data } = await res.json();
        if (data) {
            setMediosPago(data);
        } else {
            console.error("Error al cargar los medios de pago.");
        }
    };
    
    const fetchData_Movimiento = async (id) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/caja/${id}`);
        const { data } = await res.json();
        if (data) {
            setMovimiento(data);
        } else {
            console.error("Error al cargar el movimiento de caja.");
        }
    };
    
    useEffect(()=>{
        fetchData_MediosPago();
        fetchData_Movimiento(movimientoID)
    } , [movimientoID])
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setMovimiento({
            ...movimiento , 
                [name]:value
        })   
    }

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setMovimiento({
            ...movimiento,
            [name]: value,
        });
    };

    const clickChange = async(e) => {
         e.preventDefault();
         await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/caja/${movimientoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    referencia: movimiento.referencia,
                    total: movimiento.total,
                    tipo: movimiento.tipo,
                    medioPago: movimiento.medioPago
                })
            })
            .then((s) => s.json())
                .then((a) => {
                    if(a.ok){
                        setMovimiento(initialState);
                        alert(a.message)                        
                        exito();
                    } else {
                        alert(a.message)
                    }
                })
                .catch((err) => console.error("❌ Error al modificar movimiento:", err))
    }

    const opciones_mediosPago = mediosPago.map(p => ({ value: p._id, label: p.name }));
    const opcionesTipoMovimiento = [
        { value: true, label: "ENTRADA" },
        { value: false, label: "SALIDA" },
    ];


    const customStyle = {
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
    }

    return(
        <>
            {mostrarMedioPago && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => 
                        {
                            setMostrarMedioPago(null)
                        }
                    }>
                        &times;
                    </button>
                    <Formulario_MedioPago
                        exito={() => 
                            {
                                setMostrarMedioPago(false)
                                fetchData_MediosPago()
                            }}
                    />
                </div>
                </div>
            )}
                    
            <div className="form-container">
                <div className="form-row">
                    <h1 className="titulo-pagina">Modificar Movimiento de Caja</h1>
                </div>

                <form className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col">
                            <label htmlFor="nombre">
                                Referencia:
                            </label>
                            <input
                                type="text"
                                onChange={inputChange}
                                value={movimiento.referencia}
                                name="referencia"
                                placeholder="Referencia del movimiento"
                                required
                            />
                        </div>
                         <div className="form-col">
                            <label >
                                Tipo de movimiento:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opcionesTipoMovimiento}
                                value={opcionesTipoMovimiento.find(op => op.value === movimiento.tipo) || null}
                                onChange={selectChange}
                                name='tipo'
                                placeholder="Tipo de movimiento..."
                                isClearable
                                required={true}
                                styles={customStyle}
                            />
                        </div> 
                         <div className="form-col">
                            <label >
                                Medio de Pago:
                                <button type="button" className="btn-plus" onClick={() => setMostrarMedioPago(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_mediosPago}
                                value={opciones_mediosPago.find(op => op.value === movimiento.medioPago) || null}
                                onChange={selectChange}
                                name='medioPago'
                                placeholder="Medio de pago..."
                                isClearable
                                required={true}
                                styles={customStyle}
                            />
                        </div> 
                        
                        <div className="form-col">
                            <label>
                                Total:
                            </label>
                            <input
                                type="number"
                                name="total"
                                placeholder="Total"
                                value={movimiento.total}
                                onChange={inputChange}                                
                            />
                        </div>
                    </div>

                    <div className="form-submit">
                       <button
                            type="submit"
                            className="submit-btn"
                            onClick={(e) => {
                                clickChange(e);
                            }}
                            >
                            Guardar
                        </button>
                    </div>
                </form>

            </div>
            <style jsx>
                {`
                    .checkbox-modern {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        cursor: pointer;
                        user-select: none;
                        position: relative;
                    }

                    .checkbox-modern input[type='checkbox'] {
                        appearance: none;
                        -webkit-appearance: none;
                        width: 22px;
                        height: 22px;
                        border: 2px solid #a30000;
                        border-radius: 6px;
                        background-color: #2c2c2c;
                        cursor: pointer;
                        position: relative;
                        transition: all 0.25s ease;
                    }

                    .checkbox-modern input[type='checkbox']:hover {
                        border-color: #cc0000;
                    }

                    .checkbox-modern input[type='checkbox']:checked {
                        background-color: #a30000;
                        border-color: #a30000;
                    }

                    .checkbox-modern input[type='checkbox']:checked::after {
                        content: '✔';
                        color: white;
                        font-size: 14px;
                        position: absolute;
                        top: 0;
                        left: 4px;
                        font-weight: bold;
                    }

                    .checkbox-modern label {
                        color: #fff;
                        font-size: 1rem;
                        font-weight: 500;
                        cursor: pointer;
                    }

                    .input-date {
                        width: 100%;
                        padding: 0.6rem;
                        border-radius: 6px;
                        border: 1px solid #444;
                        background-color: #1f1f1f;
                        color: #fff;
                        font-size: 1rem;
                        transition: 0.2s;
                    }

                    .input-date:focus {
                        border-color: #a30000;
                        outline: none;
                    }

                    .input-date::-webkit-calendar-picker-indicator {
                        filter: invert(1);
                        cursor: pointer;
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
                        
                    .box-cargar{
                        justify-content: center;
                        align-items: center;
                    }

                    .formulario-presupuesto {
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
                        max-width: 220px;
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

                    .precio-venta {
                        max-width: 100px;
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
                        transform: translateY(-3px);
                    }

                    .form-group-presupuesto {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        height: 160px;
                        overflow-y: auto;
                        padding-right: 8px;
                    }

                    .presupuesto-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-wrap: wrap;
                    }

                    .presupuesto-item input[type="number"] {
                        width: 80px;
                    }

                    .btn-remove {
                        background-color: #651616ff;
                        color: white;
                        border: none;
                        padding: 0.4rem 0.8rem;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .btn-add-producto {
                        background-color: #651616ff;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        align-self: flex-start;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .btn-add-producto:hover {
                        background-color: #571212ff;
                        transform: translateY(-3px);
                    }

                    .form-submit {
                        justify-content: center;
                        text-align: center;
                        margin-top: 1rem;
                    }

                    .submit-btn {
                        background-color: #651616ff;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .submit-btn:hover {
                        background-color: #571212ff;
                        transform: translateY(-3px);
                    }

                    button.submit-btn {
                        padding: 0.75rem 1rem;
                        background-color: #8B0000;
                        color: #fff;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    button.submit-btn:hover {
                        background-color: rgb(115, 8, 8);
                        transform: translateY(-3px);
                    }
                    
                    .titulo-pagina {
                        font-size: 2rem;
                        width: 100%;
                        color: white;
                        text-align: center;
                        margin-top: 2px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
                `}
            </style>
        </>
    )
}

export default formCaja;