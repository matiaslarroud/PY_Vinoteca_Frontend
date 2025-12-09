const { useState, useEffect } = require("react")
import Select from 'react-select';
import { FaTrash} from "react-icons/fa";

const initialState = {name:'',telefono:'', email:'', cuit:'', pais:'', provincia:'', localidad:'', barrio:'', calle:'', condicionIva:''}

const updateTransporte = ({exito , transporteID}) => {
    const [transporte, setTransporte] = useState(initialState);
    const [paises, setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [localidades, setLocalidades] = useState([]);
    const [barrios, setBarrios] = useState([]); 
    const [calles, setCalles] = useState([]);
    const [condicionesIva, setCondicionesIva] = useState([]);
    
    const fetchData_Paises = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`);
        const { data } = await res.json();
        if (data) {
            setPaises(data);
        } else {
            console.error("Error al cargar los países");
        }
    };
    
    const fetchData_Transporte = async (param) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte/${param}`);
        const { data } = await res.json();
        if (data) {
            setTransporte(data);
        } else {
            console.error("Error al cargar los datos del transporte");
        }
    };

    const fetchData_Provincias = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`);
        const { data } = await res.json();
        if (data) {
            setProvincias(data);
        } else {
            console.error("Error al cargar las provincias");   
    }
    };
    
    const fetchData_Localidades = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`);
        const { data } = await res.json();  
        if (data) {
            setLocalidades(data);
        } else {
            console.error("Error al cargar las localidades");
        }
    };

    const fetchData_Barrios = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`);
        const { data } = await res.json();  
        if (data) {
            setBarrios(data);
        } else {
            console.error("Error al cargar los barrios");
        }
    };

    const fetchData_Calles = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`);
        const { data } = await res.json();
        if (data) {
            setCalles(data);
        } else {
            console.error("Error al cargar las calles");    
        }
    };

    const fetchData_CondicionesIva = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicionIva`);
        const { data } = await res.json();
        if (data) {
            setCondicionesIva(data);
        }
        else {
            console.error("Error al cargar las condiciones de IVA");
        }  
    };

    
    useEffect(()=>{
        fetchData_Transporte(transporteID);
        fetchData_Paises();
        fetchData_Provincias();
        fetchData_Localidades();
        fetchData_Barrios();
        fetchData_Calles();
        fetchData_CondicionesIva();
    } , [transporteID])
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setTransporte({
            ...transporte , 
                [name]:value
        })   
    }

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setTransporte({
            ...transporte,
            [name]: value,
        });
    };

    const clickChange = async(e) => {
         e.preventDefault();
         await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/transporte/${transporteID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: transporte.name,
                    telefono: transporte.telefono,
                    email: transporte.email,
                    cuit: transporte.cuit,
                    pais: transporte.pais,
                    provincia: transporte.provincia,
                    localidad: transporte.localidad,
                    barrio: transporte.barrio,
                    calle: transporte.calle,
                    condicionIva: transporte.condicionIva
                })
            }
        ) 
        .then((a) => a.json())
            .then((s)=>{
                if(s.ok){
                    alert(s.message)
                    exito()
                } else {
                    alert(s.message)
                }
            })
            .catch((err) => console.error("❌ Error al actualizar transporte:", err))
    }

    const opciones_paises = paises.map(p => ({ value: p._id, label: p.name }));
    const opciones_provincias = provincias.filter(a =>(a.pais === transporte.pais)).map(p => ({ value: p._id, label: p.name }));
    const opciones_localidades = localidades.filter(a => (a.provincia === transporte.provincia)).map(p => ({ value: p._id, label: p.name }));
    const opciones_barrios = barrios.filter(a => (a.localidad === transporte.localidad)).map(p => ({ value: p._id, label: p.name }));
    const opciones_calles = calles.filter(a => (a.barrio === transporte.barrio)).map(p => ({ value: p._id, label: p.name }));
    const opciones_condicionesIva = condicionesIva.map(p => ({ value: p._id, label: p.name }));

    return(
        <>
            

            <div className="form-container">
                <div className="form-row">
                    <h1 className="titulo-pagina">Cargar Transporte</h1>
                </div>

                <form id="updatePicada" className="formulario-picada">
                    <div className="form-row">
                        <div className="form-col">
                            <label htmlFor="nombre">
                                Nombre:
                            </label>
                            <input
                                type="text"
                                onChange={inputChange}
                                value={transporte.name}
                                name="name"
                                placeholder="Nombre del transporte"
                                required
                            />
                        </div>
                        <div className="form-col">
                            <label htmlFor="nombre">
                                Cuit:
                            </label>
                            <input
                                type="text"
                                maxlength="11" 
                                pattern="[0-9]{11}" 
                                onChange={inputChange}
                                value={transporte.cuit}
                                name="cuit"
                                placeholder="Cuit del transporte"
                                required
                            />
                        </div>
                         <div className="form-col">
                            <label >
                                Condicion de IVA:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_condicionesIva}
                                value={opciones_condicionesIva.find(op => op.value === transporte.condicionIva) || null}
                                onChange={selectChange}
                                name='condicionIva'
                                placeholder="Condicion de iva..."
                                isClearable
                                required={true}
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col">
                            <label htmlFor="nombre">
                                Telefono:
                            </label>
                            <input
                                type="text"
                                pattern="[0-9]{10}" 
                                maxlength="10"
                                onChange={inputChange}
                                value={transporte.telefono}
                                name="telefono"
                                placeholder="Telefono del transporte"
                                required
                            />
                        </div>
                        <div className="form-col">
                            <label htmlFor="nombre">
                                E-mail:
                            </label>
                            <input
                                type="text"
                                onChange={inputChange}
                                value={transporte.email}
                                name="email"
                                placeholder="E-mail del transporte"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-row">  
                        <div className="form-col">
                            <label >
                                Pais
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_paises}
                                value={opciones_paises.find(op => op.value === transporte.pais) || null}
                                onChange={selectChange}
                                name='pais'
                                placeholder="Pais..."
                                isClearable
                                required={true}
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col">
                            <label >
                                Provincia
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_provincias}
                                value={opciones_provincias.find(op => op.value === transporte.provincia) || null}
                                onChange={selectChange}
                                name='provincia'
                                placeholder="Provincia..."
                                required={true}
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col">
                            <label >
                                Localidad
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_localidades}
                                value={opciones_localidades.find(op => op.value === transporte.localidad) || null}
                                onChange={selectChange}
                                name='localidad'
                                placeholder="Localidad..."
                                required={true}
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col">
                            <label >
                                Barrio
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_barrios}
                                value={opciones_barrios.find(op => op.value === transporte.barrio) || null}
                                onChange={selectChange}
                                name='barrio'
                                placeholder="Barrio..."
                                required={true}
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col">
                            <label >
                                Calle
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_calles}
                                value={opciones_calles.find(op => op.value === transporte.calle) || null}
                                onChange={selectChange}
                                name='calle'
                                placeholder="Calle..."
                                required={true}
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: '100%', // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 100,
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
                        <div className="form-col-precioVenta">
                            <div className="box-cargar" >
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
                        width: 100%;
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
                        min-width: 100px;
                        max-width: 200px; 
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
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

export default updateTransporte;