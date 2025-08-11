const { useState, useEffect } = require("react")
const { default: Link } = require("next/link")


const initialState = {
    name:'', lastname:'', fechaNacimiento:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'', condicionIva:'', cuentaCorriente:false
}

const updateProveedor = ({proveedorID, exito}) => {
    const [proveedor , setProveedor] = useState(initialState);
    const [paises , setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [localidades , setLocalidades] = useState([]);
    const [barrios , setBarrrios] = useState([]);
    const [calles , setCalles] = useState([]);
    const [condicionesIva , setCondicionesIva] = useState([]);
    
    const fetchData = (proveedor) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor/${proveedorID}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok){
                    const nombreC = s.data.name;
                    const apellidoC = s.data.lastname;
                    const nacimientoC = s.data.fechaNacimiento.split("T")[0];
                    const telefonoC = s.data.telefono;
                    const emailC = s.data.email;
                    const cuitC = s.data.cuit;
                    const paisC = s.data.pais;
                    const provinciaC = s.data.provincia;
                    const localidadC = s.data.localidad;
                    const barrioC = s.data.barrio;
                    const calleC = s.data.calle;
                    const ivaC = s.data.condicionIva;

                    setProveedor({
                        name: nombreC , lastname: apellidoC , fechaNacimiento: nacimientoC , telefono: telefonoC , 
                        email: emailC , cuit: cuitC , pais: paisC , provincia: provinciaC , localidad: localidadC , 
                        barrio: barrioC , calle: calleC , condicionIva: ivaC ,
                    })
                }
            })
        .catch((err)=>{console.log("No se encontro Proveedor con este id.\nError: ",err)})
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
                    name: proveedor.name, lastname: proveedor.lastname, fechaNacimiento: proveedor.fechaNacimiento,
                    telefono: proveedor.telefono, email: proveedor.email, cuit: proveedor.cuit,
                    pais: proveedor.pais, provincia: proveedor.provincia, localidad: proveedor.localidad,
                    barrio: proveedor.barrio, calle: proveedor.calle, condicionIva: proveedor.condicionIva,
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                setProveedor(initialState);
                                exito();
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Proveedor</h1>
                <form id="formC" onSubmit={clickChange}>
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={proveedor.name} name="name" placeholder="Ingresa el nombre del Proveedor" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Apellido:</label>
                        <input type="text" onChange={inputChange} value={proveedor.lastname} name="lastname" placeholder="Ingresa el apellido del Proveedor" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Fecha de Nacimiento:</label>
                        <input type="date" onChange={inputChange} value={proveedor.fechaNacimiento} name="fechaNacimiento" placeholder="Ingresa la fecha de nacimiento del Proveedor" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Telefono:</label>
                        <input type="text" onChange={inputChange} value={proveedor.telefono} name="telefono" placeholder="Ingresa el telefono del Proveedor" required></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="nombre">Email:</label>
                        <input type="text" onChange={inputChange} value={proveedor.email} name="email" placeholder="Ingresa el email del Proveedor" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Cuit:</label>
                        <input type="text" onChange={inputChange} value={proveedor.cuit} name="cuit" placeholder="Ingresa el cuit del Proveedor" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="nombre">Pais:</label>
                        
                        <select name="pais" onChange={inputChange} value={proveedor.pais}>
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
                        <label htmlFor="nombre">Provincia:</label>
                        <select name="provincia" onChange={inputChange} value={proveedor.provincia}>
                            <option value=''>Seleccione una provincia...</option>
                            {
                                provincias.filter((p)=>{return p.pais === proveedor.pais}).map(({_id, name})=>{
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
                        <label htmlFor="nombre">Localidad:</label>
                        <select name="localidad" onChange={inputChange} value={proveedor.localidad}>
                            <option value=''>Seleccione una localidad...</option>
                            {
                                localidades.filter((p)=>{return p.provincia === proveedor.provincia}).map(({_id, name})=>{
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
                        <label htmlFor="nombre">Barrio:</label>
                        <select name="barrio" onChange={inputChange} value={proveedor.barrio}>
                            <option value=''>Seleccione un barrio...</option>
                            {
                                barrios.filter((p)=>{return p.localidad === proveedor.localidad}).map(({_id, name})=>{
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
                        <label htmlFor="nombre">Calle:</label>
                        <select name="calle"  onChange={inputChange} value={proveedor.calle}>
                            <option value=''>Seleccione una calle...</option>
                            {
                                calles.filter((p)=>{return p.barrio === proveedor.barrio}).map(({_id, name})=>{
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
                        <label htmlFor="nombre">Condicion IVA:</label>
                        <select name="condicionIva"  onChange={inputChange} value={proveedor.condicionIva}>
                            <option value=''>Seleccione una condicion de  iva...</option>
                            {
                                condicionesIva.map(({_id, name})=>{
                                    return (
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>         
                    </fieldset>
                    <div className="form-footer">
                        <button type="submit" className="submit-btn">Guardar</button>
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

export default updateProveedor;