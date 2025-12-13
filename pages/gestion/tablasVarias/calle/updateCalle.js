const { useState, useEffect } = require("react")
import Select from 'react-select';     

import FormularioCreatBarrio from "../barrio/createBarrio";

const { default: Link } = require("next/link")
const initialState = {name:'', barrio:''}                  

const updateCalle = ({calleID , exito}) => {
    const [calle , setCalle] = useState(initialState);
    const [barrios,setBarrios] = useState([]);

    const [mostrarModalBarrio,setMostrarModalBarrio] = useState(false);
    
    const fetchDataCalle = async(calleID) => {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle/${calleID}`)
                .then((a) => {
                    return a.json();
                 })
                    .then((s) => 
                        {
                            if(s.ok && s.data.name){
                                const nombreC = s.data.name;
                                const barrioC = s.data.barrio;
                                console.log('Calle encontrada exitosamente.');
                                setCalle({name: nombreC, barrio:barrioC} )
                            }
                        })
                    .catch((err) => {console.log('No se encontro calle con este id. \n Error: ',err)})
    }
    const fetchDatBarrios = async()=>{
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/barrio`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBarrios(s.data)
                })
    }  
    useEffect(() => {
        if(!calleID){return}
        fetchDataCalle(calleID);
        fetchDatBarrios();
    } , [calleID]);

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setCalle({
            ...calle , 
                [name]:value
        })   
    }
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setCalle({
            ...calle,
            [name]: value,
        });
    };

    const clickChange = async (e) => {
        e.preventDefault();
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/calle/${calleID}` ,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: calle.name,
                    barrio: calle.barrio
                })
            }
        )
            .then((a) => {return a.json()})
                .then((s) => {
                    if(s.ok){
                        alert(s.message)
                        exito();
                    } else{
                        alert(s.message)
                    }
                })

    }
    
    const opciones_barrios  = barrios.map(v => ({ value: v._id,label: v.name}))

    return(
       <>

            {mostrarModalBarrio && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => 
                        {
                            setMostrarModalBarrio(null)
                        }
                    }>
                        &times;
                    </button>
                    <FormularioCreatBarrio
                        exito={() => 
                            {
                                setMostrarModalBarrio(false)
                                fetchDatBarrios()
                            }}
                    />
                </div>
                </div>
            )}
            
  <div className="form-container">
    <h1 className="titulo-pagina">Modificar Calle</h1>

    <form id="formC">

        <div className="form-group input-centered">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            onChange={inputChange}
            value={calle.name}
            name="name"
            placeholder="Ingresa el nombre de la calle"
            required
          />
        </div>

        

        <div className="form-group input-centered">
                      <label>
                       Barrio: 
                        <button type="button" className="btn-plus" onClick={() => setMostrarModalBarrio(true)}>+</button>
                      </label>
                      <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_barrios}
                        value={opciones_barrios.find(op => op.value === calle.barrio) || null}
                        onChange={selectChange}
                        name='barrio'
                        placeholder="Barrio..."
                        isClearable
                        styles={{
                              container: (base) => ({
                              ...base,
                              width: 220, // ⬅️ ancho fijo total
                              }),
                              control: (base) => ({
                              ...base,
                              minWidth: 220,
                              maxWidth: 220,
                              backgroundColor: '#2c2c2c',
                              color: 'white',
                              border: '1px solid #444',
                              borderRadius: 8,
                              }),
                              singleValue: (base) => ({
                              ...base,
                              color: 'white',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis', // ⬅️ evita que el texto se desborde
                              }),
                              menu: (base) => ({
                              ...base,
                              backgroundColor: '#2c2c2c',
                              color: 'white',
                              }),
                              option: (base, { isFocused }) => ({
                              ...base,
                              backgroundColor: isFocused ? '#444' : '#2c2c2c',
                              color: 'white',
                              }),
                              input: (base) => ({
                              ...base,
                              color: 'white',
                              }),
                        }}
                      />
                    </div>

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
      text-shadow: 2px 2px 6px rgba(0,0,0,0.6);
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
      width: 100%;
      align-items: center;
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

    .form-group input,
    .form-group select {
      width: 300px;
      padding: 0.6rem;
      border-radius: 6px;
      border: 1px solid #ccc;
      font-size: 1rem;
      color: white;
      background-color: #272626;
      transition: border-color 0.2s ease-in-out;
    }

    .form-group input:focus,
    .form-group select:focus {
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

      .form-group input,
      .form-group select {
        width: 100%;
      }
    }

  .btn-plus {
      background-color: transparent;
      color: #651616ff;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
  }

  .btn-plus:hover {
      color: #571212ff;
      transform: translateY(-3px);
  }
  `}</style>
</>

    )
}

export default updateCalle;