const { useState } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'', pais:'', provincia:'', localidad:'', barrio:'', calle:''}
const createBodega = () => {
    const [bodega , setBodega] = useState(initialState);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setBodega({
            ...bodega , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
         e.preventDefault();

         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: bodega.name,
                    pais: bodega.pais,
                    provincia: bodega.provincia,
                    localidad: bodega.localidad,
                    barrio: bodega.barrio,
                    calle: bodega.calle,
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                console.log('Bodega creada exitosamente.');
                                setBodega(initialState);;
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar Bodega</h1>
                <form id="formC">
                    <div className="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={bodega.name} name="name" placeholder="Ingresa el nombre de la bodega" required></input>
                    </div>
                    <div className="form-group">
                        <label for="nombre">Pais:</label>
                        <input type="text" onChange={inputChange} value={bodega.pais} name="pais" placeholder="Ingresa el pais de la bodega" required></input>
                    </div>
                    <div className="form-group">
                        <label for="nombre">Provincia:</label>
                        <input type="text" onChange={inputChange} value={bodega.provincia} name="provincia" placeholder="Ingresa el nombre de la provincia" required></input>
                    </div>
                    <div className="form-group">
                        <label for="nombre">Localidad:</label>
                        <input type="text" onChange={inputChange} value={bodega.localidad} name="localidad" placeholder="Ingresa el nombre de la localidad" required></input>
                    </div>
                    <div className="form-group">
                        <label for="nombre">Barrio:</label>
                        <input type="text" onChange={inputChange} value={bodega.barrio} name="barrio" placeholder="Ingresa el nombre del barrio" required></input>
                    </div>
                    <div className="form-group">
                        <label for="nombre">Calle:</label>
                        <input type="text" onChange={inputChange} value={bodega.calle} name="calle" placeholder="Ingresa el nombre de la calle" required></input>
                    </div>
                    
                    <button type="submit" className="submit-btn" onClick={clickChange}>Cargar Bodega</button>
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

                        .form-group {
                        display: flex;
                        flex-direction: column;
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

export default createBodega;