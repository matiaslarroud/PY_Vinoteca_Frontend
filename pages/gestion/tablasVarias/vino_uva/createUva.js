const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'', tipoVino:''}
const formUva = ({exito}) => {
    const [uva , setUva] = useState(initialState);
    

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setUva({
            ...uva , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
        e.preventDefault();
         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: uva.name
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((s) => {
                            if(s.ok){
                                setUva(initialState);
                                alert(s.message)
                                exito();
                            } else {
                                alert(s.message)
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }

    return(
       <>
    <div className="form-container">
        <h1 className="titulo-pagina">Cargar Uva</h1>

        <form id="formC">
            <div className="form-group input-centered">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    onChange={inputChange}
                    value={uva.name}
                    name="name"
                    placeholder="Ingresa el nombre de la uva"
                    required
                />
            </div>

            <div className="button-area">
                <button type="submit" className="submit-btn" onClick={clickChange}>
                    Cargar
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
                max-width: 500px;
                background-color: #1f1f1f;
                padding: 20px;
                border-radius: 14px;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
                max-height: 90vh;
                overflow-y: auto;
            }

            .form-group {
                display: flex;
                flex-direction: column;
                width: 100%;
                margin-bottom: 18px;
            }

            .form-group label {
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #ddd;
                font-size: 1rem;
            }

            .form-group input {
                padding: 0.75rem;
                border: 1px solid #555;
                border-radius: 8px;
                font-size: 1rem;
                background-color: #2a2a2a;
                color: white;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus {
                outline: none;
                border-color: rgb(155, 20, 20);
                background-color: #333;
            }

            .button-area {
                width: 100%;
                display: flex;
                justify-content: center;
            }

            button.submit-btn {
                padding: 0.8rem 2rem;
                background-color: #8b0000;
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
                margin-bottom: 15px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            }

            @media (max-width: 480px) {
                .form-container {
                    padding: 15px;
                }
                .titulo-pagina {
                    font-size: 1.6rem;
                }
            }
        `}
    </style>
</>


    )
}

export default formUva;