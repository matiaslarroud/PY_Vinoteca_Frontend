const { useState, useEffect } = require("react")
const { default: Link } = require("next/link")

import FormularioPaisCreate from '../tablasVarias/pais/createPais'
import FormularioProvinciaCreate from '../tablasVarias//provincia/createProvincia'
import FormularioLocalidadCreate from '../tablasVarias/localidad/createLocalidad'
import FormularioBarrioCreate from '../tablasVarias/barrio/createBarrio'
import FormularioCalleCreate from '../tablasVarias/calle/createCalle'


const initialState = {
    name:'', lastname:'', fechaNacimiento:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'', altura:0, deptoNumero:0, deptoLetra:'',
}

const updateEmpleado = ({empleadoID, exito}) => {
    const [empleado , setEmpleado] = useState(initialState);
    const [paises , setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [localidades , setLocalidades] = useState([]);
    const [barrios , setBarrrios] = useState([]);
    const [calles , setCalles] = useState([]);

    const [mostrarModalCreate1, setMostrarModalCreate1] = useState(false);
    const [mostrarModalCreate2, setMostrarModalCreate2] = useState(false);
    const [mostrarModalCreate3, setMostrarModalCreate3] = useState(false);
    const [mostrarModalCreate4, setMostrarModalCreate4] = useState(false);
    const [mostrarModalCreate5, setMostrarModalCreate5] = useState(false);
    
    const fetchData = (empleadoID) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/empleado/${empleadoID}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    const nombre = s.data.name ? s.data.name : '';
                    const apellido = s.data.lastname ? s.data.lastname : '';
                    const nacimiento = s.data.fechaNacimiento ? s.data.fechaNacimiento.split("T")[0] : '';  
                    const telefono = s.data.telefono ? s.data.telefono : '';
                    const email = s.data.email ? s.data.email : '';
                    const cuit = s.data.cuit ? s.data.cuit : '';
                    const pais = s.data.pais ? Number(s.data.pais) : '';
                    const provincia = s.data.provincia ? Number(s.data.provincia) : '';
                    const localidad = s.data.localidad ? Number(s.data.localidad) : '';
                    const barrio = s.data.barrio ? Number(s.data.barrio) : '';
                    const calle = s.data.calle ? Number(s.data.calle) : '';
                    const altura = s.data.altura ? Number(s.data.altura) : 0;
                    const deptoNumero = s.data.deptoNumero ? s.data.deptoNumero : 0;
                    const deptoLetra = s.data.deptoLetra ? s.data.deptoLetra : '';
                    setEmpleado({
                        name:nombre, lastname:apellido, fechaNacimiento:nacimiento, telefono:telefono, email:email, cuit:cuit,
                        pais:pais, provincia:provincia, localidad:localidad, barrio:barrio, calle:calle, altura:altura, deptoNumero:deptoNumero, deptoLetra:deptoLetra
                    })
                }
            })
        .catch((err)=>{console.log("No se encontro empleado con este id.\nError: ",err)})
    }

const fetchPaises = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setPaises(s.data)
                })
    }
    const fetchProvincias = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/provincia`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProvincias(s.data)
                })
    }
    const fetchLocalidades = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/localidad`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setLocalidades(s.data)
                })
    }
    const fetchBarrios = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBarrrios(s.data)
                })
    }
    const fetchCalles = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setCalles(s.data)
                })
    }

    useEffect(()=>{
        if(!empleadoID){return}
        fetchData(empleadoID)
        fetchPaises();
        fetchProvincias();
        fetchLocalidades();
        fetchBarrios();
        fetchCalles();
    }, [empleadoID])

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setEmpleado({
            ...empleado , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/empleado/${empleadoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: empleado.name, lastname: empleado.lastname, fechaNacimiento: empleado.fechaNacimiento,
                    telefono: empleado.telefono, email: empleado.email, cuit: empleado.cuit,
                    pais: Number(empleado.pais), provincia: Number(empleado.provincia), localidad: Number(empleado.localidad),
                    barrio: Number(empleado.barrio), calle: Number(empleado.calle) , altura: Number(empleado.altura), 
                    deptoNumero: empleado.deptoNumero, deptoLetra: empleado.deptoLetra
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                setEmpleado(initialState);
                                alert(data.message)
                                exito();
                            } else {
                                alert(data.message)
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>

            {mostrarModalCreate1 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate1(false)}>&times;</button>
                    <FormularioPaisCreate
                    exito={() => {
                        setMostrarModalCreate1(false);
                        fetchPaises();
                    }}
                    />
                </div>
            </div>
            )}
        
            {mostrarModalCreate2 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate2(false)}>&times;</button>
                    <FormularioProvinciaCreate
                    exito={() => {
                        setMostrarModalCreate2(false);
                        fetchProvincias();
                    }}
                    />
                </div>
            </div>
            )}
        
            {mostrarModalCreate3 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate3(false)}>&times;</button>
                    <FormularioLocalidadCreate
                    exito={() => {
                        setMostrarModalCreate3(false);
                        fetchLocalidades();
                    }}
                    />
                </div>
            </div>
            )}
        
            {mostrarModalCreate4 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate4(false)}>&times;</button>
                    <FormularioBarrioCreate
                    exito={() => {
                        setMostrarModalCreate4(false);
                        fetchBarrios();
                    }}
                    />
                </div>
            </div>
            )}
        
            {mostrarModalCreate5 && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => setMostrarModalCreate5(false)}>&times;</button>
                    <FormularioCalleCreate
                    exito={() => {
                        setMostrarModalCreate5(false);
                        fetchCalles();
                    }}
                    />
                </div>
            </div>
            )}

            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Empleado</h1>
                <form  id="formC" onSubmit={clickChange}>
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">
                            Nombre:
                        </label>
                        <input type="text" onChange={inputChange} value={empleado.name} name="name" placeholder="Ingresa el nombre del Empleado" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Apellido:</label>
                        <input type="text" onChange={inputChange} value={empleado.lastname} name="lastname" placeholder="Ingresa el apellido del Empleado" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Fecha de Nacimiento:</label>
                        <input type="date" onChange={inputChange} value={empleado.fechaNacimiento} name="fechaNacimiento" placeholder="Ingresa la fecha de nacimiento del Empleado" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Telefono:</label>
                        <input type="text" onChange={inputChange} value={empleado.telefono} name="telefono" placeholder="Ingresa el telefono del Empleado" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Email:</label>
                        <input type="text" onChange={inputChange} value={empleado.email} name="email" placeholder="Ingresa el email del Empleado" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Cuit:</label>
                        <input type="text" onChange={inputChange} value={empleado.cuit} name="cuit" placeholder="Ingresa el cuit del Empleado" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="pais">
                            Pais:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate1(true)}>+</button>
                        </label>
                        
                        <select name="pais" onChange={inputChange} value={empleado.pais}>
                            <option value=''>Seleccione un pais...</option>
                            {
                                paises.map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="provincia">
                            Provincia:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate2(true)}>+</button>
                        </label>
                        <select name="provincia" onChange={inputChange} value={empleado.provincia}>
                            <option value=''>Seleccione una provincia...</option>
                            {
                                provincias.filter((p)=>{return p.pais === Number(empleado.pais)}).map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="localidad">
                            Localidad:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate3(true)}>+</button>
                        </label>
                        <select name="localidad" onChange={inputChange} value={empleado.localidad}>
                            <option value=''>Seleccione una localidad...</option>
                            {
                                localidades.filter((p)=>{return p.provincia === Number(empleado.provincia)}).map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="barrio">
                            Barrio:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate4(true)}>+</button>
                        </label>
                        <select name="barrio" onChange={inputChange} value={empleado.barrio}>
                            <option value=''>Seleccione un barrio...</option>
                            {
                                barrios.filter((p)=>{return p.localidad === Number(empleado.localidad)}).map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="calle">
                            Calle:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate5(true)}>+</button>
                        </label>
                        <select name="calle"  onChange={inputChange} value={empleado.calle}>
                            <option value=''>Seleccione una calle...</option>
                            {
                                calles.filter((p)=>{return p.barrio === Number(empleado.barrio)}).map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>  
                    
                    <div className="form-group">
                        <label>Altura:</label>
                        <input type="number" onChange={inputChange} value={empleado.altura} name="altura" placeholder="Altura" required />
                    </div>
                    <div className="form-group">
                        <label>Depto. N°:</label>
                        <input type="number" onChange={inputChange} value={empleado.deptoNumero} name="deptoNumero" placeholder="Depto. N°" />
                    </div>
                    <div className="form-group">
                        <label>Depto. Letra:</label>
                        <input type="text" onChange={inputChange} value={empleado.deptoLetra} name="deptoLetra" placeholder="Depto. Letra" />
                    </div>       
                    </fieldset>
                    <div className='button-area'>
                        <button type="submit" className="submit-btn" onClick={clickChange}>Guardar</button>
                    </div>
                </form>
            </div>
            <style jsx>
                {`
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
                        max-width: 500px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        position: relative;
                        margin: 2rem auto 0 auto;
                    }



                    .form-container {
                    display: flex;
                    flex-direction: column;
                    width: 100%;
                    max-width: 1200px;
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

                    .button-area {
                        width:100%;
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
                    margin: 2rem auto 0 auto;
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

export default updateEmpleado;