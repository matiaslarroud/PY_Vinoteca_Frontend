const { useState, useEffect } = require("react")
import Select from "react-select";

const { default: Link } = require("next/link")
const initialState = {name:'', bodega:0, pais:0, provincia:0,localidad:0,barrio:0,calle:0, altura:0}

const updateParaje = ({parajeID,exito}) => {
    const [paraje , setParaje] = useState(initialState);
    const [bodegas,setBodegas] = useState([]);
    const [paises,setPaises] = useState([]);
    const [provincias,setProvincias] = useState([]);
    const [localidades,setLocalidades] = useState([]);
    const [barrios,setBarrios] = useState([]);
    const [calles,setCalles] = useState([]);
    
    const fetchDataParaje = async(parajeID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje/${parajeID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreP = s.data.name;
                                const bodegaP = Number(s.data.bodega);
                                const paisP = Number(s.data.pais);
                                const provinciaP = Number(s.data.provincia);
                                const localidadP = Number(s.data.localidad);
                                const barrioP = Number(s.data.barrio);
                                const calleP = Number(s.data.calle);
                                const alturaP = Number(s.data.altura);
                                setParaje({
                                    name: nombreP, 
                                    bodega:bodegaP , 
                                    pais:paisP, 
                                    provincia:provinciaP,
                                    localidad:localidadP,
                                    barrio:barrioP,
                                    calle:calleP,
                                    altura: alturaP
                                } )
                            }
                        })
                    .catch((err) => {console.log('No se encontro paraje con este id. \n Error: ',err)})
    }

    const fetchDataBodegas = async()=>{
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

    useEffect(() => {
        if(!parajeID){return}
        fetchDataParaje(parajeID);
        fetchDataBodegas();
        paisesData();
        provinciasData();
        localidadesData();
        barriosData();
        callesData();
    } , [parajeID]);

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


    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje/${parajeID}` ,
            {
                method: 'PUT',
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
        )
            .then((a) => {return a.json()})
                .then((s) => { 
                    if(s.ok){
                        alert(s.message)
                        exito()
                    } else {
                        alert(s.message)
                    }
                })

    }

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
    <div className="form-container">
        <h1 className="titulo-pagina">Modificar Paraje</h1>

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
                    <label>Bodega:</label>
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
                    <label>Pais:</label>
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
                    <label>Provincia:</label>
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
                    <label>Localidad:</label>
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
                    <label>Barrio:</label>
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
                    <label>Calle:</label>
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
                <button type="submit" className="submit-btn">Guardar</button>
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
    `}</style>
</>
    )
}

export default updateParaje;