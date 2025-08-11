const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")
const initialState = {name:''}                  

const updateVinoTipo = ({vinoTipoID , exito}) => {
    const [vinoTipo , setVinoTipo] = useState(initialState);
    
    const fetchDataBarrio = async(vinoTipoID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino/${vinoTipoID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreC = s.data.name;
                                setVinoTipo({name: nombreC} )
                            }
                        })
                    .catch((err) => {console.log('No se encontro tipo de vino con este id. \n Error: ',err)})
    }

    useEffect(() => {
        if(!vinoTipoID){return}
        fetchDataBarrio(vinoTipoID);
    } , [vinoTipoID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setVinoTipo({
            ...vinoTipo , 
                [name]:value
        })   
    }

    const clickChange = async (e) => {
        e.preventDefault()
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino/${vinoTipoID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: vinoTipo.name
                })
            }
        )
            .then((a) => {return a.json()})
                .then((s) => { 
                    console.log(s.message) 
                    exito()
                })

    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Tipo de Vino</h1>
                <form id="formC">
                    <fieldset className="grid-container">
                    <div className="form-group input-centered">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={vinoTipo.name} name="name" placeholder="Ingresa el nombre del tipo de vino" required></input>
                    </div>

                    </fieldset>
                    <div className="button-area">
                        <button type="submit" className="submit-btn" onClick={clickChange}>
                        Guardar
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

export default updateVinoTipo;