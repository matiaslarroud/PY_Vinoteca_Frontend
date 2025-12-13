const { useState, useEffect } = require("react")
import Select from "react-select";

import Formulario_Pais from '../pais/createPais'
import Formulario_Provincia from '../provincia/createProvincia'
import Formulario_Localidad from '../localidad/createLocalidad'
import Formulario_Barrio from '../barrio/createBarrio'
import Formulario_Calle from '../calle/createCalle'
import Formulario_Bodega from '../bodega/createBodega'

const { default: Link } = require("next/link")

const initialState = {name:'', bodega:0, pais:0, provincia:0,localidad:0,barrio:0,calle:0}
const formParaje = ({exito}) => {
    const [paraje , setParaje] = useState(initialState);
    const [bodegas,setBodegas] = useState([]);
    const [paises,setPaises] = useState([]);
    const [provincias,setProvincias] = useState([]);
    const [localidades,setLocalidades] = useState([]);
    const [barrios,setBarrios] = useState([]);
    const [calles,setCalles] = useState([]);

    const bodegasData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBodegas(s.data)
                })
        }
    const paisesData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setPaises(s.data)
                })
        }
    const provinciasData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProvincias(s.data)
                })
        }
    const localidadesData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setLocalidades(s.data)
                })
        }
    const barriosData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBarrios(s.data)
                })
        }
    const callesData = async() => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setCalles(s.data)
                })
        }

    useEffect( () => {
        bodegasData();
        paisesData();
        provinciasData();
        localidadesData();
        barriosData();
        callesData();
    } , []);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setParaje({
            ...paraje , 
                [name]:value
        })   
    } 
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setParaje({
            ...paraje,
            [name]: value,
        });
    };

    const clickChange = (e) => {
        e.preventDefault();
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: paraje.name,
                    bodega: Number(paraje.bodega),
                    pais: Number(paraje.pais),
                    provincia: Number(paraje.provincia),
                    localidad: Number(paraje.localidad),
                    barrio: Number(paraje.barrio),
                    calle: Number(paraje.calle),
                    altura: Number(paraje.altura)
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((s) => {
                            if(s.ok){
                                setParaje(initialState);
                                alert(s.message)
                                exito();
                            } else{
                                alert(s.message)
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }

    const [mostrarPais , setMostrarPais] = useState(false)
    const [mostrarProvincia , setMostrarProvincia] = useState(false)
    const [mostrarLocalidad , setMostrarLocalidad] = useState(false)
    const [mostrarBarrio , setMostrarBarrio] = useState(false)
    const [mostrarCalle , setMostrarCalle] = useState(false)
    const [mostrarBodega , setMostrarBodega] = useState(false)

    const opciones_paises = paises.map(v => ({ value: v._id,label: v.name }));
    const opciones_provincias = provincias.filter(a => a.pais === paraje.pais).map(v => ({ value: v._id,label: v.name }));
    const opciones_localidades = localidades.filter(a => a.provincia === paraje.provincia).map(v => ({ value: v._id,label: v.name }));
    const opciones_barrios = barrios.filter(a => a.localidad === paraje.localidad).map(v => ({ value: v._id,label: v.name }));
    const opciones_calles = calles.filter(a => a.barrio === paraje.barrio).map(v => ({ value: v._id,label: v.name }));

    const customStylesSelect = {
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
    };


    return(
       <>
                            {mostrarPais && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarPais(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Pais
                                        exito={() => 
                                            {
                                                setMostrarPais(false)
                                                paisesData();
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                            {mostrarProvincia && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarProvincia(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Provincia
                                        exito={() => 
                                            {
                                                setMostrarProvincia(false)
                                                provinciasData()
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                
                            {mostrarLocalidad && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarLocalidad(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Localidad
                                        exito={() => 
                                            {
                                                setMostrarLocalidad(false)
                                                localidadesData()
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                
                            {mostrarBarrio && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarBarrio(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Barrio
                                        exito={() => 
                                            {
                                                setMostrarBarrio(false)
                                                barriosData()
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                
                            {mostrarCalle && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarCalle(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Calle
                                        exito={() => 
                                            {
                                                setMostrarCalle(false)
                                                callesData()
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                
                            {mostrarBodega && (
                                <div className="modal">
                                <div className="modal-content">
                                    <button className="close" onClick={() => 
                                        {
                                            setMostrarBodega(false)
                                        }
                                    }>
                                        &times;
                                    </button>
                                    <Formulario_Bodega
                                        exito={() => 
                                            {
                                                setMostrarBodega(false)
                                                bodegasData()
                                            }}
                                    />
                                </div>
                                </div>
                            )}
                
                            
                    
            
    <div className="form-container">
        <h1 className="titulo-pagina">Cargar Paraje</h1>

        <form id="formC" onSubmit={clickChange} className="formulario">

            <div className="form-row">
                {/* NOMBRE */}
                <div className="form-col">
                    <label>Nombre:</label>
                    <input
                        type="text"
                        onChange={inputChange}
                        value={paraje.name}
                        name="name"
                        placeholder="Ingresa el nombre del paraje"
                        required
                    />
                </div>

                {/* BODEGA */}
                <div className="form-col">
                    <label>
                        Bodega:
                        <button type="button" className="btn-plus" onClick={() => setMostrarBodega(true)}>+</button>
                    </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={bodegas.map(b => ({ value: b._id, label: b.name }))}
                        value={
                            bodegas
                                .map(b => ({ value: b._id, label: b.name }))
                                .find(op => op.value === paraje.bodega) || null
                        }
                        onChange={selectChange}
                        name='bodega'
                        placeholder="Bodega..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>
            </div>

            <div className="form-row">

                {/* PAIS */}
                <div className="form-col">
                    <label>
                        Pais:
                        <button type="button" className="btn-plus" onClick={() => setMostrarPais(true)}>+</button>
                        </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_paises}
                        value={opciones_paises.find(op => op.value === paraje.pais) || null}
                        onChange={selectChange}
                        name='pais'
                        placeholder="País..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>

                {/* PROVINCIA */}
                <div className="form-col">
                    <label>
                        Provincia:
                        <button type="button" className="btn-plus" onClick={() => setMostrarProvincia(true)}>+</button>
                        </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_provincias}
                        value={opciones_provincias.find(op => op.value === paraje.provincia) || null}
                        onChange={selectChange}
                        name='provincia'
                        placeholder="Provincia..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>

                {/* LOCALIDAD */}
                <div className="form-col">
                    <label>
                        Localidad:
                        <button type="button" className="btn-plus" onClick={() => setMostrarLocalidad(true)}>+</button>
                        </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_localidades}
                        value={opciones_localidades.find(op => op.value === paraje.localidad) || null}
                        onChange={selectChange}
                        name='localidad'
                        placeholder="Localidad..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>
            </div>

            <div className="form-row">
                {/* BARRIO */}
                <div className="form-col">
                    <label>
                        Barrio:
                        <button type="button" className="btn-plus" onClick={() => setMostrarBarrio(true)}>+</button>
                        </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_barrios}
                        value={opciones_barrios.find(op => op.value === paraje.barrio) || null}
                        onChange={selectChange}
                        name='barrio'
                        placeholder="Barrio..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>

                {/* CALLE */}
                <div className="form-col">
                    <label>
                        Calle:
                        <button type="button" className="btn-plus" onClick={() => setMostrarCalle(true)}>+</button>
                        </label>
                    <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_calles}
                        value={opciones_calles.find(op => op.value === paraje.calle) || null}
                        onChange={selectChange}
                        name='calle'
                        placeholder="Calle..."
                        isClearable
                        required
                        styles={customStylesSelect}
                    />
                </div>

                {/* ALTURA */}
                <div className="form-col">
                    <label>Altura:</label>
                    <input
                        type="number"
                        name="altura"
                        placeholder="Altura"
                        value={paraje.altura}
                        onChange={inputChange}
                        required
                    />
                </div>
            </div>

            <div className="form-submit">
                <button type="submit" className="submit-btn">Cargar</button>
            </div>

        </form>
    </div>

    {/* ----------- ESTILOS UNIFICADOS ----------- */}
    <style jsx>{`
        .form-container {
            background-color: #1f1f1f;
            color: #fff;
            padding: 2rem;
            border-radius: 16px;
            width: 100%;
            max-width: 900px;
            margin: 0 auto;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
        }

        .titulo-pagina {
            font-size: 2rem;
            text-align: center;
            margin-bottom: 1.5rem;
            color: #fff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .formulario {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
        }

        .form-col {
            flex: 1;
            min-width: 220px;
            display: flex;
            flex-direction: column;
        }

        label {
            font-weight: 500;
            margin-bottom: 0.5rem;
            color: #fff;
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

        input[type="text"]:focus,
        input[type="number"]:focus {
            border-color: #a30000;
        }

        .form-select-react {
            min-width: 100%;
        }

        .form-submit {
            text-align: center;
            margin-top: 1rem;
        }

        .submit-btn {
            background-color: #8B0000;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 10px;
            cursor: pointer;
            transition: 0.3s;
            font-weight: 600;
        }

        .submit-btn:hover {
            background-color: #a30000;
            transform: translateY(-3px);
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
    `}</style>
</>



    )
}

export default formParaje;