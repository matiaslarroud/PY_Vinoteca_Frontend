const { useState } = require("react")


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

         console.log(product)

         fetch('http://localhost:5000/api/v1/products',
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({
                    name: product.name,
                    price: product.price
                })
            }
         ).then((a) => {
                        console.log(a)
                        return a.json()
                    })
                    .then((data) => {
                            console.log(data)
                            setProduct(initialState)
                        })
                .catch((err) => {console.log('Error al enviar datos. \n Error: ',err)})
    }

    return(
        <>
            <h1>Agregar Producto</h1>
            <form>
                    <input onChange={inputChange} value={product.name} name="name" placeholder="Ingresa el nombre del producto"></input>
                    <input onChange={inputChange} value={product.price} name="price" placeholder="Ingresa el precio del producto"></input>
                    <button onClick={clickChange}>Crear</button>
            </form>
            <style jsx>
                {`
                    form {
                        display: flex;
                        max-width: 100%;
                        flex-direction: column;
                        text-align: center;
                    }

                    h1 {
                        text-align: center;
                    }
                    
                    input {
                        max-width: 30rem;
                    }

                    button {
                        max-width: 30rem;
                    }
                `}
            </style>
        </>
    )
}

export default formProducto;