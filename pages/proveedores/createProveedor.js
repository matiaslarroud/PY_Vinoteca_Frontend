const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = {
    name:'', telefono:'', email:'', cuit:'',
    pais:'', provincia:'', localidad:'', barrio:'', calle:'' , altura:'', condicionIva:''
}
const createProveedor = ({exito}) => {
    const [proveedor , setProveedor] = useState(initialState);
    const [paises , setPaises] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [localidades , setLocalidades] = useState([]);
    const [barrios , setBarrrios] = useState([]);
    const [calles , setCalles] = useState([]);
    const [condicionesIva , setCondicionesIva] = useState([]);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProveedor({
            ...proveedor , 
                [name]:value
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
        fetchPaises();
        fetchProvincias();
        fetchLocalidades();
        fetchBarrios();
        fetchCalles();
        fetchCondicionesIVA();
    },[])

    const clickChange = (e) => {
        e.preventDefault();
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`,
            {
                method: 'POST',
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
                                console.log('Proveedor creado exitosamente.');
                                setProveedor(initialState);
                                exito();
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Proveedor</h1>
                <form id="formC" onSubmit={clickChange}>
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">Razon Social:</label>
                        <input type="text" onChange={inputChange} value={proveedor.name} name="name" placeholder="Ingresa el nombre del Proveedor" required></input>
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
                                provincias.filter((p)=>{return p.pais === Number(proveedor.pais)}).map(({_id, name})=>{
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
                                localidades.filter((p)=>{return p.provincia === Number(proveedor.provincia)}).map(({_id, name})=>{
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
                                barrios.filter((p)=>{return p.localidad === Number(proveedor.localidad)}).map(({_id, name})=>{
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
                                calles.filter((p)=>{return p.barrio === Number(proveedor.barrio)}).map(({_id, name})=>{
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
                        <label htmlFor="nombre">Altura:</label>
                        <input type="number" onChange={inputChange} value={proveedor.altura} name="altura" placeholder="Ingresa la altura del domicilio del Proveedor" required></input>
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
                        <button type="submit" className="submit-btn">Cargar Proveedor</button>
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

export default createProveedor;