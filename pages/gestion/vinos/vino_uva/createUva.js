const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'', tipoVino:''}
const formUva = ({exito}) => {
    const [uva , setUva] = useState(initialState);
    const [tiposVino, setTiposVinos] = useState([])
    
    const fetchTiposVino = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposVinos(s.data);
                })
                .catch((err)=>{console.log(err)})
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setUva({
            ...uva , 
                [name]:value
        })   
    }

    useEffect(()=>{
        fetchTiposVino()
    } , [])

    const clickChange = (e) => {
        e.preventDefault();
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: uva.name,
                    tipoVino: uva.tipoVino
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((s) => {
                            if(s.ok){
                                setUva(initialState);
                                exito();
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Uva</h1>
                <form id="formC">
                    <fieldset className="grid-container">
                    <div className="form-group input-centered">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={uva.name} name="name" placeholder="Ingresa el nombre de la uva" required></input>
                    </div>
                    
                    <div className="form-group input-centered">
                        <label htmlFor="nombre">Tipo de Vino:</label>
                        <select name="tipoVino" onChange={inputChange} value={uva.tipoVino}>
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
                    </fieldset>
                    <div className="button-area">
                        <button type="submit" className="submit-btn" onClick={clickChange}>
                        Cargar Uva
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>
                {`
                    .form-container {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;
                        max-height: 90vh;
                        overflow-y: auto;                        
                        max-width: 500px;
                        border-radius: 12px;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                        }

                        .form-carga-button{
                            text-align: center;
                            margin-top: auto;
                        }

                        .form-group {
                        display: flex;
                        flex-direction: column;
                        heigth:2rem;
                        width: 90%;
                        }

                        .form-group label {
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        color: #444;
                        }

                        .form-group input,
                        .form-group select,
                        .form-group textarea {
                        padding: 0.75rem;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        font-size: 1rem;
                        transition: border-color 0.3s ease;
                        }

                        .form-group input:focus,
                        .form-group select:focus,
                        .form-group textarea:focus {
                        outline: none;
                        border-color:rgb(115, 8, 8);
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
                        }
                        .titulo-pagina {
                            font-size: 2rem;
                            color: white;
                            text-align: center;
                            margin-top: 2px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                        }
                `}
            </style>
        </>
    )
}

export default formUva;