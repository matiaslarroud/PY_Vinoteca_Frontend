const { useState, useEffect } = require("react")
import Select from "react-select";
const { default: Link } = require("next/link")

import FormularioCreateCondicionIva from "../gestion/tablasVarias/iva/createCondicionIva"
import FormularioCreatePais from "../gestion/tablasVarias/pais/createPais"
import FormularioCreateProvincia from "../gestion/tablasVarias/provincia/createProvincia"
import FormularioCreateLocalidad from "../gestion/tablasVarias/localidad/createLocalidad"
import FormularioCreateBarrio from "../gestion/tablasVarias/barrio/createBarrio"
import FormularioCreateCalle from "../gestion/tablasVarias/calle/createCalle"

const initialState = {
    name:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'', condicionIva:'' , altura:''
}

const updateProveedor = ({proveedorID, exito}) => {
    const [proveedor , setProveedor] = useState(initialState);
    const [paises , setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [localidades , setLocalidades] = useState([]);
    const [barrios , setBarrrios] = useState([]);
    const [calles , setCalles] = useState([]);
    const [condicionesIva , setCondicionesIva] = useState([]);
    
    const fetchData = async (proveedorID) => {
     await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor/${proveedorID}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    
                    const nombreC = s.data.name;
                    const telefonoC = s.data.telefono;
                    const emailC = s.data.email;
                    const cuitC = s.data.cuit;
                    const paisC = Number(s.data.pais);
                    const provinciaC = Number(s.data.provincia);
                    const localidadC = Number(s.data.localidad);
                    const barrioC = Number(s.data.barrio);
                    const calleC = Number(s.data.calle);
                    const alturaC = Number(s.data.altura);
                    const ivaC = Number(s.data.condicionIva);
                    setProveedor({
                        name: nombreC , telefono: telefonoC , 
                        email: emailC , cuit: cuitC , pais: paisC , provincia: provinciaC , localidad: localidadC , 
                        barrio: barrioC , calle: calleC , altura: alturaC , condicionIva: ivaC ,
                    })
                }
                else{
                    console.log(s.message);
                }
            })
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
    const fetchCondicionesIVA = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicioniva`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setCondicionesIva(s.data)
                })
    }

    useEffect(()=>{
        if(!proveedorID){return}
        fetchData(proveedorID)
        fetchPaises();
        fetchProvincias();
        fetchLocalidades();
        fetchBarrios();
        fetchCalles();
        fetchCondicionesIVA();
    }, [proveedorID])

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProveedor({
            ...proveedor , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor/${proveedorID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: proveedor.name,
                    telefono: proveedor.telefono, email: proveedor.email, cuit: proveedor.cuit,
                    pais: Number(proveedor.pais), provincia: Number(proveedor.provincia), localidad: Number(proveedor.localidad),
                    barrio: Number(proveedor.barrio), calle: Number(proveedor.calle), altura: Number(proveedor.altura), condicionIva: Number(proveedor.condicionIva),
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                setProveedor(initialState);
                                alert(data.message);
                                exito();
                            } else {
                                alert(data.message);
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setProveedor({
            ...proveedor,
            [name]: value,
        });
    };

    const [mostrarModalCondicionIva , setMostrarModalCondicionIva] = useState(null)
    const [mostrarModalPais , setMostrarModalPais] = useState(null)
    const [mostrarModalProvincia , setMostrarModalProvincia] = useState(null)
    const [mostrarModalLocalidad , setMostrarModalLocalidad] = useState(null)
    const [mostrarModalBarrio , setMostrarModalBarrio] = useState(null)
    const [mostrarModalCalle , setMostrarModalCalle] = useState(null)

    const opciones_paises = paises.map(v => ({ value: v._id,label: v.name }));
    const opciones_provincias = provincias.filter(a => a.pais === proveedor.pais).map(v => ({ value: v._id,label: v.name }));
    const opciones_localidades = localidades.filter(a => a.provincia === proveedor.provincia).map(v => ({ value: v._id,label: v.name }));
    const opciones_barrios = barrios.filter(a => a.localidad === proveedor.localidad).map(v => ({ value: v._id,label: v.name }));
    const opciones_calles = calles.filter(a => a.barrio === proveedor.barrio).map(v => ({ value: v._id,label: v.name }));
    const opciones_iva = condicionesIva.map(v => ({ value: v._id,label: v.name }));


    return(
        <>

            {mostrarModalCondicionIva && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalCondicionIva(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateCondicionIva
                            exito={() => 
                                {
                                    setMostrarModalCondicionIva(null)
                                    fetchCondicionesIVA()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalPais && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalPais(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreatePais
                            exito={() => 
                                {
                                    setMostrarModalPais(null)
                                    fetchPaises()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalProvincia && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalProvincia(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateProvincia
                            exito={() => 
                                {
                                    setMostrarModalProvincia(null)
                                    fetchProvincias()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalLocalidad && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalLocalidad(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateLocalidad
                            exito={() => 
                                {
                                    setMostrarModalLocalidad(null)
                                    fetchLocalidades()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalBarrio && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalBarrio(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateBarrio
                            exito={() => 
                                {
                                    setMostrarModalBarrio(null)
                                    fetchBarrios()
                                }}
                        />
                    </div>
                </div>
            )}
            
            {mostrarModalCalle && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalCalle(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateCalle
                            exito={() => 
                                {
                                    setMostrarModalCalle(null)
                                    fetchCalles()
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
                                Razon Social:
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="Nombre"
                                value={proveedor.name}
                                onChange={(e) => inputChange(e)}
                                
                            />
                        </div>      
                        <div className="form-col">
                            <label>
                                Telefono:
                            </label>
                            <input
                                type="text"
                                name="telefono"
                                placeholder="Telefono"
                                value={proveedor.telefono}
                                onChange={(e) => inputChange(e)}
                                
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
                                value={proveedor.email}
                                onChange={(e) => inputChange(e)}
                                
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
                                value={proveedor.cuit}
                                onChange={(e) => inputChange(e)}
                                
                            />
                        </div>

                        <div className="form-col">
                            <label>
                                Condicion de Iva:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCondicionIva(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_iva}
                                value={opciones_iva.find(op => op.value === proveedor.condicionIva) || null}
                                onChange={selectChange}
                                name='condicionIva'
                                placeholder="Condicion Iva..."
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
                                Pais:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalPais(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_paises}
                                value={opciones_paises.find(op => op.value === proveedor.pais) || null}
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalProvincia(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_provincias}
                                value={opciones_provincias.find(op => op.value === proveedor.provincia) || null}
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalLocalidad(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_localidades}
                                value={opciones_localidades.find(op => op.value === proveedor.localidad) || null}
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
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalBarrio(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_barrios}
                                value={opciones_barrios.find(op => op.value === proveedor.barrio) || null}
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

                        <div className="form-col">
                            <label>
                                Calle:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCalle(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_calles}
                                value={opciones_calles.find(op => op.value === proveedor.calle) || null}
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
                                value={proveedor.altura}
                                onChange={(e) => inputChange(e)}
                                
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

export default updateProveedor;