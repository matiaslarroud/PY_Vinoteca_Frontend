const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")

const initialState = { name: '' }
const formVinoTipo = ({ exito }) => {
    const [vinoTipo, setVinoTipo] = useState(initialState);


    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;

        setVinoTipo({
            ...vinoTipo,
            [name]: value
        })
    }

    const clickChange = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: vinoTipo.name,
                })
            }
        ).then((a) => {
            return a.json()
        })
            .then((s) => {
                if (s.ok) {
                    setVinoTipo(initialState);
                    alert(s.message)
                    exito()
                } else {
                    alert(s.message)
                }
            })
            .catch((err) => { console.log('❌ Error al enviar datos. \n Error: ', err) })
    }

    return (
        <>
    <div className="form-container">
        <h1 className="titulo-pagina">Cargar Tipo de Vino</h1>

        <form id="formC">
            <div className="form-group input-centered">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    onChange={inputChange}
                    value={vinoTipo.name}
                    name="name"
                    placeholder="Ingresa el nombre del tipo de vino"
                    required
                />
            </div>

            <div className="button-area">
                <button
                    type="submit"
                    className="submit-btn"
                    onClick={clickChange}
                >
                    Cargar
                </button>
            </div>
        </form>
    </div>

    <style jsx>{`
        .form-container {
            background-color: #1f1f1f;
            padding: 25px;
            border-radius: 16px;
            width: 95%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 0 25px rgba(0,0,0,0.6);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            width: 90%;
            margin-bottom: 1rem;
        }

        .form-group label {
            margin-bottom: 0.5rem;
            font-weight: 600;
            color: #ddd;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 0.75rem;
            border: 1px solid #555;
            border-radius: 10px;
            font-size: 1rem;
            background-color: #2a2a2a;
            color: white;
            transition: all 0.3s ease;
        }

        .form-group input::placeholder {
            color: #999;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #b30000;
            box-shadow: 0 0 6px rgba(179, 0, 0, 0.7);
        }

        .button-area {
            width: 100%;
            text-align: center;
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
            width: 90%;
            transition: background-color 0.3s ease, transform 0.1s ease;
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
                padding: 18px;
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

export default formVinoTipo;