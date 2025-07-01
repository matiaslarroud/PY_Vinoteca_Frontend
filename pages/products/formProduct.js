const { useState } = require("react")

const { default: Link } = require("next/link")

const initialState = {name:'' , price:0}
const formProducto = () => {
    const [product , setProduct] = useState(initialState);
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProduct({
            ...product , 
                [name]:value
        })   
    }

    const clickChange = (e) => {
         e.preventDefault();

         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: product.name,
                    price: product.price
                })
            }
         ).then((a) => {
                        return a.json()
                    })
                    .then((data) => {
                            if(data.ok){
                                console.log('Producto creado exitosamente.');
                                setProduct(initialState);;
                            }
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <h1 className="titulo-pagina">Cargar un Producto</h1>
            <div>
                <button>
                    <Link className="btn-productos" href="/">Volver al menu</Link>
                </button>
            </div>
            <div className="form-container">
                <form id="formProducto">
                    <label for="nombre">Nombre:</label>
                    <input type="text" onChange={inputChange} value={product.name} name="name" placeholder="Ingresa el nombre del producto" required></input>

                    <label for="marca">Marca:</label>
                    <input type="text" id="marca" name="marca" required></input>

                    <label for="stock">Stock:</label>
                    <input type="number" id="stock" name="stock" min="0" required></input>

                    <label for="ubicacion">Ubicación:</label>
                    <input type="text" id="ubicacion" name="ubicacion" required></input>

                    <label for="precio">Precio:</label>
                    <input type="number" onChange={inputChange} value={product.price} name="price" placeholder="Ingresa el precio del producto" min="0" step="0.01" required></input>

                    <button type="submit" onClick={clickChange}>Cargar Producto</button>
                </form>
            </div>
            <style jsx>
                {`
                    .titulo-pagina {
                        font-size: 3rem;
                        color: white;
                        text-align: center;
                        margin-top: 40px;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    }

                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #121212;
                        color: white;
                        margin: 0;
                        padding: 20px;
                    }

                    .form-container {
                        max-width: 500px;
                        margin: 0 auto;
                        background-color: #1e1e1e;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(255, 255, 255, 0.05);
                    }

                    h1 {
                        text-align: center;
                        margin-bottom: 25px;
                        font-size: 2rem;
                    }

                    form {
                        display: flex;
                        flex-direction: column;
                    }

                    label {
                        margin-top: 15px;
                        font-weight: bold;
                    }

                    input {
                        padding: 10px;
                        border: none;
                        border-radius: 5px;
                        margin-top: 5px;
                        font-size: 1rem;
                        background-color: #2a2a2a;
                        color: white;
                    }

                    input:focus {
                        outline: none;
                        border: 1px solid #8B0000;
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

                    button:hover {
                        background-color: #a30000;
                    }
                `}
            </style>
        </>
    )
}

export default formProducto;