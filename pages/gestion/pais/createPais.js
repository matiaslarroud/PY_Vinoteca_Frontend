const { useState } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:''}
const formPais = () => {
    const [pais , setPais] = useState(initialState);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setPais({
            ...pais , 
                [name]:value
        })   
    }

    const clickChange = (e) => {

         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: pais.name,
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((s) => {
                            if(s.ok){
                                console.log(s.message);
                                setPais(initialState);;
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Pais</h1>
                <form id="formProducto">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={pais.name} name="name" placeholder="Ingresa el nombre del pais" required></input>
                    </div>
                    
                    <div className="form-carga-button">
                        <button type="submit" className="submit-btn" onClick={clickChange}>Cargar Pais</button>
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

export default formPais;