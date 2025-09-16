const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'', bodega:0, pais:0, provincia:0,localidad:0,barrio:0,calle:0, altura:0}
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
                                exito();
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Paraje</h1>
                <form id="formC" onSubmit={clickChange}>
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={paraje.name} name="name" placeholder="Ingresa el nombre del paraje" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Bodega:</label>
                        <select name="bodega" onChange={inputChange} value={paraje.bodega}>
                            <option value=''>Seleccione una bodega...</option>
                            {
                                bodegas.map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Pais:</label>
                        <select name="pais" onChange={inputChange} value={paraje.pais}>
                            <option value=''>Seleccione un pais...</option>
                            {
                                paises.map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Provincia:</label>
                        <select name="provincia" onChange={inputChange} value={paraje.provincia}>
                            <option value=''>Seleccione una provincia...</option>
                            {
                                provincias.filter((p)=>{return p.pais === Number(paraje.pais)}).map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Localidad:</label>
                        <select name="localidad" onChange={inputChange} value={paraje.localidad}>
                            <option value=''>Seleccione una localidad...</option>
                            {
                                localidades.filter((p)=>{return p.provincia === Number(paraje.provincia)}).map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Barrio:</label>
                        <select name="barrio" onChange={inputChange} value={paraje.barrio}>
                            <option value=''>Seleccione un barrio...</option>
                            {
                                barrios.filter((p)=>{return p.localidad === Number(paraje.localidad)}).map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Calle:</label>
                        <select name="calle" onChange={inputChange} value={paraje.calle}>
                            <option value=''>Seleccione una calle...</option>
                            {
                                calles.filter((p)=>{return p.barrio === Number(paraje.barrio)}).map(({_id,name}) => 
                                    (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>                                        
                                    )
                                )
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Altura:</label>
                        <input type="Number" onChange={inputChange} value={paraje.altura} name="altura" placeholder="Ingresa la altura del domicilio del paraje" required></input>
                    </div>
                    </fieldset>
                    <div className="form-footer">
                        <button type="submit" className="submit-btn">Cargar Paraje</button>
                    </div>
                </form>
            </div>
            <style jsx>
                {`
                    .form-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 900px;
                    max-height: 90vh;
                    padding: 1rem;
                    overflow-y: auto;
                    border-radius: 12px;
                    background: #1a1a1a;
                    box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
                    }

                    .titulo-pagina {
                    font-size: 2rem;
                    color: white;
                    text-align: center;
                    margin-bottom: 1rem;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    text-shadow: 2px 2px 6px rgba(0,0,0,0.6);
                    }

                    .grid-container {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    }

                    .form-group {
                    display: flex;
                    flex-direction: column;
                    }

                    .form-group label {
                    font-weight: 600;
                    color: white;
                    margin-bottom: 0.4rem;
                    }

                    .form-group input,
                    .form-group select {
                    padding: 0.6rem;
                    border-radius: 6px;
                    border: 1px solid #ccc;
                    font-size: 1rem;
                    color: white;
                    background-color: #272626ff;
                    transition: border-color 0.2s ease-in-out;
                    }

                    .form-group input:focus,
                    .form-group select:focus {
                    border-color: rgb(115, 8, 8);
                    outline: none;
                    }

                    .checkbox-group {
                    display: flex;
                    align-items: center;
                    margin-top: 1.5rem;
                    }

                    .checkbox-group label {
                    color: #eee;
                    font-weight: 500;
                    }

                    .form-footer {
                    margin-top: 2rem;
                    text-align: center;
                    }

                    button.submit-btn {
                    padding: 0.75rem 2rem;
                    background-color: #8B0000;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                    }

                    button.submit-btn:hover {
                    background-color: rgb(115, 8, 8);
                    }

                    @media (max-width: 768px) {
                    .grid-container {
                        grid-template-columns: 1fr;
                    }

                `}
            </style>
        </>
    )
}

export default formParaje;