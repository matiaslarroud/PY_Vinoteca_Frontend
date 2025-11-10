const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")
const initialState = {name:'', paisID:'', provinciaID:'', localidadID:'', barrioID:'', calleID:'', altura:'', deptoNum:'', deptoLetra:''}                  

const updateDeposito = ({depositoID , exito}) => {
    const [deposito , setDeposito] = useState(initialState);
    const [paises,setPaises] = useState([]);
    const [provincias,setProvincias] = useState([]);
    const [localidades,setLocalidades] = useState([]);
    const [barrios,setBarrios] = useState([]);
    const [calles,setCalles] = useState([]);  
    
    const fetchDataDeposito = async(depositoID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito/${depositoID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreP = s.data.name;
                                const paisP = Number(s.data.pais);
                                const provinciaP = Number(s.data.provincia);                                
                                const localidadP = Number(s.data.localidad);
                                const barrioP = Number(s.data.barrio);
                                const calleP = Number(s.data.calle);
                                const alturaP = Number(s.data.altura);
                                const deptoNumP = s.data.deptoNumero;
                                const deptoLetraP = s.data.deptoLetra;

                                setDeposito(
                                {
                                    name: nombreP, 
                                    paisID:paisP, 
                                    provinciaID:provinciaP, 
                                    localidadID:localidadP, 
                                    barrioID:barrioP, 
                                    calleID:calleP, 
                                    altura:alturaP, 
                                    deptoNum:deptoNumP, 
                                    deptoLetra:deptoLetraP
                                } )
                            }
                        })
                    .catch((err) => {console.log('No se encontro deposito con este id. \n Error: ',err)})
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
        if(!depositoID){return}
        fetchDataDeposito(depositoID);
        paisesData();
        provinciasData();
        localidadesData();
        barriosData();
        callesData();
    } , [depositoID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setDeposito({
            ...deposito , 
                [name]:value
        })   
    }

    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito/${depositoID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: deposito.name,
                    pais: Number(deposito.paisID),
                    provincia: Number(deposito.provinciaID),
                    localidad: Number(deposito.localidadID),
                    barrio: Number(deposito.barrioID),
                    calle: Number(deposito.calleID),
                    altura: Number(deposito.altura),
                    deptoNumero: deposito.deptoNum,
                    deptoLetra: deposito.deptoLetra,
                })
            }
        )
            .then((a) => {return a.json()})
                .then((s) => { 
                    console.log(s.message) 
                    exito();
                })

    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Deposito</h1>
                <form id="formC">
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={deposito.name} name="name" placeholder="Ingresa el nombre del deposito" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Paises:</label>
                        <select name="paisID" onChange={inputChange} value={deposito.paisID}>
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
                        <select name="provinciaID" onChange={inputChange} value={deposito.provinciaID}>
                            <option value=''>Seleccione una provincia...</option>
                            {
                                provincias.filter((p)=>{return p.pais === deposito.paisID}).map(({_id,name}) => 
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
                        <select name="localidadID" onChange={inputChange} value={deposito.localidadID}>
                            <option value=''>Seleccione una localidad...</option>
                            {
                                localidades.filter((p)=>{return p.provincia === deposito.provinciaID}).map(({_id,name}) => 
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
                        <select name="barrioID" onChange={inputChange} value={deposito.barrioID}>
                            <option value=''>Seleccione un barrio...</option>
                            {
                                barrios.filter((p)=>{return p.localidad === deposito.localidadID}).map(({_id,name}) => 
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
                        <select name="calleID" onChange={inputChange} value={deposito.calleID}>
                            <option value=''>Seleccione una calle...</option>
                            {
                                calles.filter((p)=>{return p.barrio === deposito.barrioID}).map(({_id,name}) => 
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
                        <input type="text" onChange={inputChange} value={deposito.altura} name="altura" placeholder="Ingresa la altura del departamento" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Departamento N°:</label>
                        <input type="text" onChange={inputChange} value={deposito.deptoNum} name="deptoNum" placeholder="Ingresa el numero del departamento" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Departamento Letra:</label>
                        <input type="text" onChange={inputChange} value={deposito.deptoLetra} name="deptoLetra" placeholder="Ingresa la letra del departamento" required></input>
                    </div>
                    </fieldset>
                    
                    <div className="form-footer">
                        <button type="submit" onClick={clickChange} className="submit-btn">Guardar</button>
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

export default updateDeposito;