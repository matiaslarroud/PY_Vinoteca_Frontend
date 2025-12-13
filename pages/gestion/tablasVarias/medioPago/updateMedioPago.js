const { useState, useEffect } = require("react")
const { default: Link } = require("next/link")


const initialState = {name:''}   

const updateMedioPago = ({medioPagoID, exito}) => {
    const [medioPago, setMedioPago] = useState(initialState);
    
    const fetchData = (medioPagoID) => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago/${medioPagoID}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok && s.data.name){
                    const nombreM = s.data.name;
                    const interesM = s.data.interes;
                    setMedioPago({name: nombreM, interes:interesM} )
                }
            })
        .catch((err)=>{console.log("No se encontro medio de pago con este id.\nError: ",err)})
    }
    useEffect(()=>{
        if(!medioPagoID){return}
        fetchData(medioPagoID)
    }, [medioPagoID])

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setMedioPago({
            ...medioPago , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/mediopago/${medioPagoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: medioPago.name,
                    interes: medioPago.interes,
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                setMedioPago(initialState);
                                alert(data.message)
                                exito();
                            } else {
                              alert(data.message)
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }

    return(
       <>
    <div className="form-container">
        <div className="form-row">
            <div className="form-col">
                <h1 className="titulo-pagina">Modificar Medio de Pago</h1>
            </div>
        </div>

        <form className="formulario-picada">
            <div className="form-row">
                <div className="form-col">
                    <label htmlFor="name">Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        value={medioPago.name}
                        onChange={inputChange}
                        placeholder="Ingresa el nombre del medio de pago"
                        required
                    />
                </div>

                <div className="form-col">
                    <label htmlFor="interes">Interés:</label>
                    <input
                        type="number"
                        name="interes"
                        value={medioPago.interes}
                        onChange={inputChange}
                        placeholder="Ingresa el interés"
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-carga-button">
                    <button type="submit" className="submit-btn" onClick={clickChange}>
                        Guardar
                    </button>
                </div>
            </div>
        </form>
    </div>

    <style jsx>{`
        .form-container {
            background-color: #1f1f1f;
            color: #fff;
            padding: 2rem;
            border-radius: 16px;
            width: 100%;
            height: 100%;
            margin: 0 auto;
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
        }

        .titulo-pagina {
            text-align: center;
            font-size: 2rem;
            margin-bottom: 1.5rem;
            font-weight: bold;
            color: #f5f5f5;
        }

        .formulario-picada {
            display: flex;
            flex-direction: column;
            gap: 2rem;
        }

        .form-row {
            display: flex;
            flex-wrap: wrap;
            gap: 1.5rem;
            justify-content: center;
        }

        .form-col {
            flex: 1;
            min-width: 250px;
            display: flex;
            flex-direction: column;
        }

        label {
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        input[type="text"],
        input[type="number"] {
            background-color: #2c2c2c;
            color: white;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 0.6rem;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.2s ease-in-out;
        }

        input:focus {
            border-color: #571212ff;
        }

        .submit-btn {
            background-color: #8b0000;
            color: white;
            border: none;
            padding: 0.8rem 1.5rem;
            font-size: 1rem;
            border-radius: 10px;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }

        .submit-btn:hover {
            background-color: #a30000;
            transform: translateY(-3px);
        }

        .form-carga-button {
            display: flex;
            justify-content: center;
            width: 100%;
        }

        @media (max-width: 768px) {
            .form-col {
                min-width: 100%;
            }
        }
    `}</style>
</>

    )
}

export default updateMedioPago;