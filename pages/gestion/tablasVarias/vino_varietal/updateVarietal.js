const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")
const initialState = {name:'',tipoUva:''}                  

const updateVarietal = ({varietalID, exito}) => {
    const [varietal , setVarietal] = useState(initialState);
    
    const fetchDataVarietal = async(varietalID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal/${varietalID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreV = s.data.name;
                                const uvaV = s.data.uva;
                                setVarietal({name: nombreV , tipoUva:uvaV} )
                            }
                        })
                    .catch((err) => {console.log('No se encontro varietal con este id. \n Error: ',err)})
    }
    useEffect(() => {
        if(!varietalID){return}
        fetchDataVarietal(varietalID);
    } , [varietalID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setVarietal({
            ...varietal , 
                [name]:value
        })   
    }

    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal/${varietalID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: varietal.name
                })
            }
        )
            .then((a) => {return a.json()})
                .then((s) => { 
                    if (s.ok) {
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
        <h1 className="titulo-pagina">Modificar Varietal</h1>

        <form id="formC">
            <div className="form-group">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    onChange={inputChange}
                    value={varietal.name}
                    name="name"
                    placeholder="Ingresa el nombre del varietal"
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
            background-color: #1f1f1f;
            padding: 20px;
            border-radius: 16px;
            width: 100%;
            max-width: 480px; 
            max-height: 90vh;
            overflow-y: auto;
            overflow-x: hidden;   /* 🔥 evita overflow horizontal */
            box-shadow: 0 0 25px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
            box-sizing: border-box; /* 🔥 evita que padding expanda el ancho */
        }

        .form-group {
            display: flex;
            flex-direction: column;
            width: 100%;   /* 🔥 se adapta sin pasarse del contenedor */
            margin-bottom: 1rem;
        }

        .form-group label {
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #ddd;
        }

        .form-group input {
            padding: 0.75rem;
            border: 1px solid #555;
            border-radius: 10px;
            font-size: 1rem;
            background-color: #2a2a2a;
            color: white;
            transition: all 0.3s ease;
            width: 100%;          /* 🔥 evita overflow */
            box-sizing: border-box;
        }

        .form-group input::placeholder {
            color: #999;
        }

        .form-group input:focus {
            outline: none;
            border-color: #b30000;
            box-shadow: 0 0 6px rgba(179, 0, 0, 0.7);
        }

        .button-area {
            width: 100%;
            text-align: center;
            margin-top: 1.2rem;
        }

        button.submit-btn {
            padding: 0.85rem 1.2rem;
            background-color: #b30000;
            color: #fff;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            width: 100%;   /* 🔥 se ajusta sin romper el layout */
            transition: background-color 0.3s ease, transform 0.1s ease;
            box-sizing: border-box;
        }

        button.submit-btn:hover {
            background-color: #8b0000;
        }

        button.submit-btn:active {
            transform: scale(0.97);
        }

        .titulo-pagina {
            font-size: 1.9rem;
            color: white;
            text-align: center;
            margin-bottom: 15px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-shadow: 2px 2px 6px rgba(0,0,0,0.6);
        }

        @media (max-width: 480px) {
            .form-container {
                padding: 16px;
            }
            .titulo-pagina {
                font-size: 1.6rem;
            }
            button.submit-btn {
                font-size: 1rem;
            }
        }
    `}</style>
</>
    )
}

export default updateVarietal;