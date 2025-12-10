const { useState, useEffect } = require("react")

const { default: Link } = require("next/link")
const initialState = {name:''}                  

const updateVolumen = ({volumenID, exito}) => {
    const [volumen , setVolumen] = useState(initialState);
    
    const fetchDataVolumen = async(volumenID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/volumen/${volumenID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreV = s.data.name;
                                setVolumen({name: nombreV} )
                            }
                        })
                    .catch((err) => {console.log('No se encontro volumen con este id. \n Error: ',err)})
    }

    useEffect(() => {
        if(!volumenID){return}
        fetchDataVolumen(volumenID);
    } , [volumenID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setVolumen({
            ...volumen , 
                [name]:value
        })   
    }

    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/volumen/${volumenID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: volumen.name
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
    <h1 className="titulo-pagina">Modificar Volumen</h1>

    <form id="formC">
      <fieldset className="grid-container">

        <div className="form-group input-centered">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            onChange={inputChange}
            value={volumen.name}
            name="name"
            placeholder="Ingresa el nombre del volumen"
            required
          />
        </div>

      </fieldset>

      <div className="button-area">
        <button type="submit" className="submit-btn" onClick={clickChange}>
          Guardar
        </button>
      </div>
    </form>
  </div>

  <style jsx>{`
    .form-container {
      display: flex;
      flex-direction: column;
      width: fit-content;
      max-height: 90vh;
      padding: 1rem;
      margin: 0 auto;
      overflow-y: auto;
      border-radius: 12px;
      background-color: #1f1f1f;
      box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
      text-align: center;
    }

    .titulo-pagina {
      font-size: 2rem;
      color: white;
      text-align: center;
      margin-bottom: 1rem;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    fieldset.grid-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 0;
      border: none;
      align-items: center;
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      width: 100%;
      align-items: flex-start;
    }

    .form-group label {
      font-weight: 600;
      color: white;
      margin-bottom: 0.4rem;
    }

    .form-group input {
      width: 300px;
      padding: 0.6rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1rem;
      color: white;
      background-color: #272626;
      transition: border-color 0.2s ease-in-out;
    }

    .form-group input:focus {
      border-color: rgb(115, 8, 8);
      outline: none;
    }

    button.submit-btn {
      padding: 0.75rem 2rem;
      background-color: #8b0000;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1.1rem;
      font-weight: bold;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 1rem;
    }

    button.submit-btn:hover {
      background-color: rgb(115, 8, 8);
    }

    @media (max-width: 768px) {
      .form-container {
        width: 95%;
      }

      .form-group input {
        width: 100%;
      }
    }
  `}</style>
</>

    )
}

export default updateVolumen;