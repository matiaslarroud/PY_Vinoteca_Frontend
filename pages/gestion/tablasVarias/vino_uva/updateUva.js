const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")
const initialState = {name:'',tipoVino:''}                  

const updateUva = ({uvaID,exito}) => {
    const [uva , setUva] = useState(initialState);
    
    const fetchDataUva = async(uvaID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva/${uvaID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreU = s.data.name;
                                const tipoV = s.data.tipo;
                                setUva({name: nombreU , tipoVino:tipoV} )
                            }
                        })
                    .catch((err) => {console.log('No se encontro uva con este id. \n Error: ',err)})
    }
    useEffect(() => {
        if(!uvaID){return}
        fetchDataUva(uvaID);
    } , [uvaID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setUva({
            ...uva , 
                [name]:value
        })   
    }

    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva/${uvaID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: uva.name
                })
            }
        )
            .then((a) => {return a.json()})
                .then((s) => { 
                    if(s.ok) {
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
        <h1 className="titulo-pagina">Modificar Uva</h1>

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
                <button
                    type="submit"
                    className="submit-btn"
                    onClick={clickChange}
                >
                    Guardar
                </button>
            </div>
        </form>
    </div>

    <style jsx>{`
        .form-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 500px;
            background-color: #1f1f1f;
            padding: 22px;
            border-radius: 14px;
            box-shadow: 0 0 22px rgba(0, 0, 0, 0.55);
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
            border-radius: 10px;
            font-size: 1rem;
            background-color: #2a2a2a;
            color: white;
            transition: 0.3s ease;
        }

        .form-group input::placeholder {
            color: #888;
        }

        .form-group input:focus {
            outline: none;
            border-color: #b30000;
            background-color: #333;
            box-shadow: 0 0 6px rgba(179, 0, 0, 0.5);
        }

        .button-area {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 10px;
        }

        button.submit-btn {
            padding: 0.85rem 2rem;
            background-color: #b30000;
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            width: 90%;
            transition: background-color 0.3s ease, transform 0.15s ease;
        }

        button.submit-btn:hover {
            background-color: #8b0000;
        }

        button.submit-btn:active {
            transform: scale(0.96);
        }

        .titulo-pagina {
            font-size: 1.9rem;
            color: white;
            text-align: center;
            margin-bottom: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
        }

        @media (max-width: 480px) {
            .form-container {
                padding: 18px;
            }
            .titulo-pagina {
                font-size: 1.6rem;
            }
            button.submit-btn {
                font-size: 1rem;
                padding: 0.75rem 1.4rem;
            }
        }
    `}</style>
</>


    )
}

export default updateUva;