const { useState, useEffect } = require("react")
import Select from "react-select";
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
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setEmpleado({
            ...empleado,
            [name]: value,
        });
    };

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

    const opciones_paises = paises.map(v => ({ value: v._id,label: v.name }));
    const opciones_provincias = provincias.filter(a => a.pais === empleado.pais).map(v => ({ value: v._id,label: v.name }));
    const opciones_localidades = localidades.filter(a => a.provincia === empleado.provincia).map(v => ({ value: v._id,label: v.name }));
    const opciones_barrios = barrios.filter(a => a.localidad === empleado.localidad).map(v => ({ value: v._id,label: v.name }));
    const opciones_calles = calles.filter(a => a.barrio === empleado.barrio).map(v => ({ value: v._id,label: v.name }));

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
                <h1 className="titulo-pagina">Modificar Proveedor</h1>
                <form id="formProducto" className="formulario-presupuesto"  onSubmit={clickChange}>
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Nombre:
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Nombre"
                                value={empleado.name}
                                onChange={inputChange}
                                
                            />
                        </div>      
                        <div className="form-col">
                            <label>
                                Apellido:
                            </label>
                            <input
                                name="lastname"
                                type="text"
                                placeholder="Apellido"
                                value={empleado.lastname}
                                onChange={inputChange}
                                
                            />
                        </div>        
                        <div className="form-col">
                            <label>
                                Fecha de Nacimiento:
                            </label>
                            <input
                                name="fechaNacimiento"
                                type="date"
                                placeholder="Fecha de Nacimiento"
                                value={empleado.fechaNacimiento}
                                onChange={inputChange}
                                
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Telefono:
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                placeholder="Telefono"
                                value={empleado.telefono}
                                onChange={inputChange}
                                
                            />
                        </div>
                        <div className="form-col">
                            <label>
                                E-Mail:
                            </label>
                            <input
                                type="text"
                                name="email"
                                placeholder="E-Mail"
                                value={empleado.email}
                                onChange={inputChange}
                                
                            />
                        </div>   
                        
                        <div className="form-col">
                            <label>
                                Cuit:
                            </label>
                            <input
                                type="text"
                                name="cuit"
                                placeholder="Cuit"
                                value={empleado.cuit}
                                onChange={inputChange}
                                
                            />
                        </div>            
                    </div>
                    <div className="form-row">
                        <div className="form-col">
                            <label>
                                Pais:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_paises}
                                value={opciones_paises.find(op => op.value === empleado.pais) || null}
                                onChange={selectChange}
                                name='pais'
                                placeholder="Pais..."
                                isClearable
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

                        <div className="form-col">
                            <label>
                                Provincia:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_provincias}
                                value={opciones_provincias.find(op => op.value === empleado.provincia) || null}
                                onChange={selectChange}
                                name='provincia'
                                placeholder="Provincia..."
                                isClearable
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

                        <div className="form-col">
                            <label>
                                Localidad:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_localidades}
                                value={opciones_localidades.find(op => op.value === empleado.localidad) || null}
                                onChange={selectChange}
                                name='localidad'
                                placeholder="Localidad..."
                                isClearable
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

                        <div className="form-col">
                            <label>
                                Barrio:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_barrios}
                                value={opciones_barrios.find(op => op.value === empleado.barrio) || null}
                                onChange={selectChange}
                                name='barrio'
                                placeholder="Barrio..."
                                isClearable
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
                        <div className="form-col">
                            <label>
                                Calle:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_calles}
                                value={opciones_calles.find(op => op.value === empleado.calle) || null}
                                onChange={selectChange}
                                name='calle'
                                placeholder="Calle..."                                
                                isClearable
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
                        
                        <div className="form-col">
                            <label>
                                Altura:
                            </label>
                            <input
                                type="number"
                                name="altura"
                                placeholder="Altura"
                                value={empleado.altura}
                                onChange={(e) => inputChange(e)}
                                
                            />
                        </div>
                        
                        <div className="form-col">
                            <label>
                                Depto. N°:
                            </label>
                            <input
                                type="number"
                                name="deptoNumero"
                                placeholder="Depto. N°"
                                value={empleado.deptoNumero}
                                onChange={inputChange}                                
                            />
                        </div>
                        
                        <div className="form-col">
                            <label>
                                Depto. Letra:
                            </label>
                            <input
                                type="text"
                                name="deptoLetra"
                                placeholder="Depto. Letra"
                                value={empleado.deptoLetra}
                                onChange={inputChange}                                
                            />
                        </div>
                    </div>
                    <div className="form-submit">
                        <button type="submit" className="submit-btn">Guardar</button>
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

export default updateEmpleado;