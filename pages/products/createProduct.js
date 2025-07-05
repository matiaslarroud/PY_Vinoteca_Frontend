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
            <div className="form-container">
                <h1 className="titulo-pagina">Cargar un Producto</h1>
                <form id="formProducto">
                    <div className="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={product.name} name="name" placeholder="Ingresa el nombre del producto" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label for="marca">Marca:</label>
                        <input type="text" id="marca" name="marca" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label for="stock">Stock:</label>
                        <input type="number" id="stock" name="stock" min="0" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label for="ubicacion">Ubicación:</label>
                        <input type="text" id="ubicacion" name="ubicacion" required></input>
                    </div>
                    
                    <div className="form-group">
                        <label for="precio">Precio:</label>
                        <input type="number" onChange={inputChange} value={product.price} name="price" placeholder="Ingresa el precio del producto" min="0" step="0.01" required></input>
                    </div>
                    
                    <button type="submit" className="submit-btn" onClick={clickChange}>Cargar Producto</button>
                </form>
            </div>
            <style jsx>
                {`
                    .form-container {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        height: 100%;
                        max-height: 90vh;
                        overflow-y: auto;                        
                        max-width: 500px;
                        border-radius: 12px;
                        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
                        }

                        .form-group {
                        display: flex;
                        flex-direction: column;
                        }

                        .form-group label {
                        margin-bottom: 0.5rem;
                        font-weight: 600;
                        color: #444;
                        }

                        .form-group input,
                        .form-group select,
                        .form-group textarea {
                        padding: 0.75rem;
                        border: 1px solid #ccc;
                        border-radius: 8px;
                        font-size: 1rem;
                        transition: border-color 0.3s ease;
                        }

                        .form-group input:focus,
                        .form-group select:focus,
                        .form-group textarea:focus {
                        outline: none;
                        border-color:rgb(115, 8, 8);
                        }

                        button.submit-btn {
                        padding: 0.75rem 1rem;
                        background-color: #8B0000;
                        color: #fff;
                        border: none;
                        border-radius: 8px;
                        font-size: 1rem;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background-color 0.3s ease;
                        }

                        button.submit-btn:hover {
                        background-color: rgb(115, 8, 8);
                        }
                        .titulo-pagina {
                            font-size: 2rem;
                            color: white;
                            text-align: center;
                            margin-top: 2px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                        }
                `}
            </style>
        </>
    )
}

export default formProducto;