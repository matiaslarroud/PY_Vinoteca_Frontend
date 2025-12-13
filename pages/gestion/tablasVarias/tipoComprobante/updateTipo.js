const { useState, useEffect } = require("react")
import Select from 'react-select';     
const { default: Link } = require("next/link")

import FormularioCreateCondicionIva from "../iva/createCondicionIva"

const initialState = {name:'', tipoIva:''}   

const updateTipo = ({tipoComprobanteID, exito}) => {
    const [tipo, setTipo] = useState(initialState);
    const [ivas, setIvas] = useState([]);

    const [mostrarModalCondicionIva , setMostrarModalCondicionIva] = useState(false)
    
    const fetchData = async (tipoComprobanteID) => {
    await  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoComprobante/${tipoComprobanteID}`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                if(s.ok && s.data.name){
                    const nombreM = s.data.name;
                    const tipoIvaM = s.data.condicionIva;
                    setTipo({name: nombreM, tipoIva: tipoIvaM} )
                }
            })
        .catch((err)=>{console.log("No se encontro tipo de comprobante con este id.\nError: ",err)})
    }

    const fetchData_Iva = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/condicioniva`)
        .then((a)=>{
            return a.json();
        })
            .then((s)=>{
                setIvas(s.data);
            })
        .catch((err)=>{console.log("No se encontraron tipos de iva.\nError: ",err)})
    }

    useEffect(()=>{
        if(!tipoComprobanteID){return}
        fetchData(tipoComprobanteID)
        fetchData_Iva();

    }, [tipoComprobanteID])

    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setTipo({
            ...tipo , 
                [name]:value
        })   
    }
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setTipo({
            ...tipo,
            [name]: value,
        });
    };

    const clickChange = (e) => {
        e.preventDefault();
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoComprobante/${tipoComprobanteID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: tipo.name,
                    condicionIva: tipo.tipoIva,
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                setTipo(initialState);
                                alert(data.message)
                                exito();
                            } else {
                              alert(data.message)
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }
    const opciones_tiposIva  = ivas.map(v => ({ value: v._id,label: v.name}))
    return(
    <>

            {mostrarModalCondicionIva && (
                <div className="modal">
                <div className="modal-content">
                    <button className="close" onClick={() => 
                        {
                            setMostrarModalCondicionIva(null)
                        }
                    }>
                        &times;
                    </button>
                    <FormularioCreateCondicionIva
                        exito={() => 
                            {
                                setMostrarModalCondicionIva(false)
                                fetchData_Iva()
                            }}
                    />
                </div>
                </div>
            )}


            
            
            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Tipo de Comprobante</h1>
                <form id="formC">
                <fieldset className="grid-container">
                    <div className="form-group input-centered">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                          type="text"
                          onChange={inputChange}
                          value={tipo.name}
                          name="name"
                          placeholder="Ingresa el nombre del tipo de comprobante"
                          required
                      />
                    </div>
                    <div className="form-group input-centered">
                      <label>
                        Tipo de Iva:
                        <button type="button" className="btn-plus" onClick={() => setMostrarModalCondicionIva(true)}>+</button>
                      </label>
                      <Select
                        className="form-select-react"
                        classNamePrefix="rs"
                        options={opciones_tiposIva}
                        value={opciones_tiposIva.find(op => op.value === tipo.tipoIva) || null}
                        onChange={selectChange}
                        name='tipoIva'
                        placeholder="Tipos de Iva..."
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
    background: #1a1a1a;
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
  }

  .form-group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
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

export default updateTipo;