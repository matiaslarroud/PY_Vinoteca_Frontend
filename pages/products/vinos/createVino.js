const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'',stock:0 , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'', uva:'' , varietal:'' , volumen:'' , deposito:''}
const formProducto = ({exito}) => {
    const [product , setProduct] = useState(initialState);
    const [bodegas, setBodegas] = useState([]);
    const [parajes, setParajes] = useState([]);
    const [crianzas, setCrianzas] = useState([]);
    const [tiposVino, setTiposVino] = useState([]);
    const [tiposUva, setTiposUva] = useState([]);
    const [varietales, setVarietales] = useState([]);
    const [volumenes, setVolumenes] = useState([]);
    const [depositos, setDepositos] = useState([]);
    
    const fetchBodegas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBodegas(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchParajes = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setParajes(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchCrianzas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/crianza`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setCrianzas(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchTiposVino = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposVino(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchTiposUva = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposUva(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchVarietales = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setVarietales(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchVolumenes = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/volumen`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setVolumenes(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchDepositos = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setDepositos(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    
    useEffect(()=>{
        fetchBodegas(),
        fetchParajes(),
        fetchCrianzas(),
        fetchTiposVino(),
        fetchTiposUva(),
        fetchVarietales(),
        fetchVolumenes(),
        fetchDepositos()
    } , [])
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProduct({
            ...product , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
        e.preventDefault();
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: product.name,
                    precioCosto: product.precioCosto,
                    stock: product.stock,
                    bodega:product.bodega,
                    paraje:product.paraje,
                    crianza:product.crianza,
                    ganancia: product.ganancia,
                    tipo:product.tipo,
                    uva:product.uva,
                    varietal:product.varietal,
                    volumen: product.volumen,
                    deposito: product.deposito
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                console.log(data.message);
                                setProduct(initialState);
                                exito();
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Vino</h1>
                <form id="formC" onSubmit={clickChange}>
                    <fieldset className="grid-container">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={product.name} name="name" placeholder="Ingresa el nombre del producto" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="stock">Stock:</label>
                        <input type="number" onChange={inputChange} value={product.stock} name="stock" placeholder="Ingresa el stock del producto" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="bodega">Bodega:</label>
                        <select name="bodega" onChange={inputChange} value={product.bodega}>
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
                        <label htmlFor="paraje">Paraje:</label>
                        <select name="paraje" onChange={inputChange} value={product.paraje}>
                            <option value=''>Seleccione un paraje...</option>
                            {
                                parajes.filter((p)=> {return p.bodega === product.bodega}).map(({_id,name}) =>
                                {
                                    return(
                                        <option key={_id} value={_id}>
                                            {name}
                                        </option> 
                                    )
                                })
                            }
                        </select>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="crianza">Crianza:</label>
                        <select name="crianza" onChange={inputChange} value={product.crianza}>
                            <option value=''>Seleccione una crianza...</option>
                            {
                                crianzas.map(({_id,name}) => 
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
                        <label htmlFor="tipoV">Tipo de Vino:</label>
                        <select name="tipo" onChange={inputChange} value={product.tipo}>
                            <option value=''>Seleccione un tipo de vino...</option>
                            {
                                tiposVino.map(({_id,name}) => 
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
                        <label htmlFor="uva">Tipo de Uva:</label>
                        <select name="uva" onChange={inputChange} value={product.uva}>
                            <option value=''>Seleccione una uva...</option>
                            {
                                tiposUva.filter((p)=>{return p.tipo === product.tipo}).map(({_id,name}) => 
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
                        <label htmlFor="varietal">Varietal:</label>
                        <select name="varietal" onChange={inputChange} value={product.varietal}>
                            <option value=''>Seleccione un varietal...</option>
                            {
                                varietales.filter((p)=>{return p.uva === product.uva}).map(({_id,name}) => 
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
                        <label htmlFor="volumen">Volumen:</label>
                        <select name="volumen" onChange={inputChange} value={product.volumen}>
                            <option value=''>Seleccione un volumen...</option>
                            {
                                volumenes.map(({_id,name}) => 
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
                        <label htmlFor="deposito">Deposito:</label>
                        <select name="deposito" onChange={inputChange} value={product.deposito}>
                            <option value=''>Seleccione un deposito...</option>
                            {
                                depositos.map(({_id,name}) => 
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
                        <label htmlFor="precioC">Precio Costo:</label>
                        <input type="number" onChange={inputChange} value={product.precioCosto} name="precioCosto" placeholder="Ingresa el precio costo del producto" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="ganancia">% Ganancia:</label>
                        <input type="number" onChange={inputChange} value={product.ganancia} name="ganancia" placeholder="Ingresa la ganancia del producto" required></input>
                    </div>
                    </fieldset>

                    <div className="form-footer">
                        <button type="submit" className="submit-btn" onClick={clickChange}>Cargar Producto</button>
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
                    background-color: #a30000;
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

export default formProducto;