import { useEffect, useState } from "react"
import { FaPlus, FaHome } from "react-icons/fa";
import FormCreatePais from './createPais.js'
import FormUpdatePais from './updatePais.js'
const { default: Link } = require("next/link")

const indexPais = () => {
    const [paises,setPaises] = useState([]);    
    const [mostrarModalCreate, setMostrarModalCreate] = useState(false);
    const [mostrarModalUpdate, setMostrarModalUpdate] = useState(null);
    const fetchData = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setPaises(data);
                    })
        }
    
    useEffect(() => {  
        fetchData();
    }, [])

    const deletePais = async(paisID) => {
        if(!paisID) {
            console.log("Error con el ID del producto al querer eliminarlo.")
            return
        }
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/pais/${paisID}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                fetchData();
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar DELETE para pais. \n ERROR: ",err);
            })
    }

    return(
        <>
            {mostrarModalCreate &&(
                
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalCreate(false)}>
                            &times;
                        </button>
                        <FormCreatePais />
                    </div>
                </div>
            )}

            {mostrarModalUpdate && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => setMostrarModalUpdate(null)}>
                            &times;
                        </button>
                        <FormUpdatePais idPais={mostrarModalUpdate} />
                    </div>
                </div>
            )}
            <h1 className="titulo-pagina">Pais</h1>
            
            <div className="botonera">
                <div className="btn-accion">
                    <button>
                        <Link href="/">
                            <FaHome className="icono" />
                            Volver al Menú
                        </Link>
                    </button>
                </div>
                <div className="btn-accion">
                    <button onClick={() => setMostrarModalCreate(true)}>
                        <FaPlus  className="icono" />
                        Agregar Pais
                    </button>
                </div>                
            </div>
            <div className="contenedor-tabla">
                <input type="text" id="buscador" placeholder="Buscar pais..." />

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr className="fila">
                            <th className="columna">Nombre</th>
                            <th className="columna">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                paises.map(({_id,name}) => (
                                    <tr key={_id} className="fila">
                                        <td className="columna">{name}</td>
                                        <td className="columna">
                                            <div className="acciones">
                                                <button onClick={() => setMostrarModalUpdate(_id)} className="btn-productos">
                                                    Modificar
                                                </button>
                                                <button onClick={() => deletePais(_id)} className="btn-productos">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }                        
                        </tbody>
                    </table>
                </div>
            </div>

            <style>
                {`
                    .columna{
                        text-align: center;
                    }

                    .acciones {
                        display: flex;
                        gap: 10px;
                        justify-content: center;
                        margin-top: 10px;
                    }

                    .botonera {
                        display: flex;
                        gap: 20px;
                        flex-wrap: wrap;
                        margin-top: 40px;
                        align-items: center;
                        justify-content: center;
                        padding: 30px;
                    }

                    .btn-accion {
                        display: flex;
                        align-items: center;                        
                        justify-content: center;
                        gap: 10px;
                        background-color: #8B0000;
                        color: white;
                        font-size: 20px;
                        border: none;
                        border-radius: 10px;
                        cursor: pointer;
                        text-decoration: none;
                        font-weight: 500;
                        transition: background-color 0.3s ease, transform 0.2s ease;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                    }

                        .btn-accion:hover {
                        background-color: #a30000;
                        transform: translateY(-3px);
                    }

                        .icono {
                        font-size: 1.2rem;
                    }

                    .titulo-pagina {
                        font-size: 3rem;
                        color: white;
                        text-align: center;
                        margin-top: 40px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    }
                        

                    button {
                        background-color: #8B0000;
                        color: white;
                        font-size: 1.1rem;
                        margin: 1rem;
                        width: 10rem;
                        height: 3rem;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                    }

                    .contenedor-tabla {
                        max-width: 1000px;
                        margin: 0 auto;
                        background-color: white;
                    }

                    #buscador {
                        width: 100%;
                        padding: 10px;
                        margin-bottom: 15px;
                        font-size: 1rem;
                        border-radius: 5px;
                        border: none;
                        box-shadow: 0 0 5px rgba(255,255,255,0.1);
                    }

                    .tabla-scroll {
                        overflow-x: auto;
                        max-height: 400px;
                        border: 1px solid #444;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        min-width: 600px;
                    }

                    th, td {
                        padding: 12px;
                        border-bottom: 1px solid #555;
                        text-align: left;
                        color: black;
                        font-size: 1,5rem;
                    }

                    th {
                        background-color: #333;
                        color: #fff;
                        position: sticky;
                        top: 0;
                    }

                    .fila{
                        height:50px;
                    }
                    .modal {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5); /* oscurece fondo */
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        z-index: 1000;
                    }

                    .modal-content {
                        background-color: #121212;
                        padding: 40px;
                        border-radius: 12px;
                        width: auto;
                        height:auto;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        position: relative;
                        margin: 20px;
                    }

                    .close {
                        position: absolute;
                        top: 8px;
                        right: 12px;
                        font-size: 28px;
                        background:rgb(34, 33, 33);;
                        border: none;
                        cursor: pointer;
                        color: black;
                        width: 1rem;
                        height: 2rem;
                    }
                `}
            </style>
        </>
    )
}

export default indexPais;