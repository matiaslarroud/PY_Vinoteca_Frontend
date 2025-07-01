import { useEffect, useState } from "react"

const { default: Link } = require("next/link")

const indexProduct = () => {
    const [vinos,setVinos] = useState([]);
    
    useEffect(() => {  
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`)
                .then((a) => {
                            return a.json()
                })
                    .then (({data}) => {
                        setVinos(data);
                    })
    })

    return(
        <>
            <h1 className="titulo-pagina">Productos</h1>
            <div>
                <button>
                    <Link className="btn-productos" href="/">Volver al menu</Link>
                </button>
                <button>
                    <Link  className="btn-productos" href="formProduct">Cargar producto</Link>
                </button>
            </div>
            <div className="contenedor-tabla">
                <input type="text" id="buscador" placeholder="Buscar vinos..." />

                <div className="tabla-scroll">
                    <table id="tablaVinos">
                        <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                        </tr>
                        </thead>
                        <tbody>
                            {
                                vinos.map(({name , price}) => (
                                    <tr>
                                        <td>{name}</td>
                                        <td>{price}</td>
                                    </tr>
                                ))
                            }                        
                        </tbody>
                    </table>
                </div>
            </div>

            <style>
                {`
                    .titulo-pagina {
                        font-size: 3rem;
                        color: white;
                        text-align: center;
                        margin-top: 40px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    }
                        

                    button {
                        margin-top: 25px;
                        padding: 12px;
                        background-color: #8B0000;
                        color: white;
                        font-size: 1.1rem;
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
                    }

                    th {
                        background-color: #333;
                        color: #fff;
                        position: sticky;
                        top: 0;
                    }
                `}
            </style>
        </>
    )
}

export default indexProduct;