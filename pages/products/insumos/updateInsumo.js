const { useState, useEffect } = require("react")
import Select from 'react-select';     

import FormularioCreateProveedor from "../../proveedores/createProveedor"
import FormularioCreateDeposito from "../../gestion/deposito/createDeposito"

const { default: Link } = require("next/link")

const initialState = {name:'',stock:0 , stockMinimo:'', precioCosto:0 , ganancia:0 , deposito:'' , proveedor:''}

const updateProducto = ({exito , insumoID}) => {
    const [product , setProduct] = useState(initialState);
    const [depositos, setDepositos] = useState([]);
    const [proveedores, setProveedores] = useState([]);   
    const [imagenes, setImagenes] = useState([]);
    const [imagenesActuales, setImagenesActuales] = useState([]);

    const fetch_Depositos = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setDepositos(s.data)
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_Insumo = async (insumoID) => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo/${insumoID}`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    
                    const nameI= s.data.name; 
                    const precioCostoI  = s.data.precioCosto ;
                    const stockI = s.data.stock ;
                    const stockMinimoI = s.data.stockMinimo ;
                    const gananciaI = s.data.ganancia ;
                    const depositoI = s.data.deposito ;
                    const proveedorI = s.data.proveedor;
                    
                    setProduct({
                        name: nameI,
                        precioCosto: precioCostoI,
                        stock: stockI,
                        stockMinimo: stockMinimoI,
                        ganancia: gananciaI,
                        deposito: depositoI,
                        proveedor: proveedorI
                    })
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_Proveedores = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setProveedores(s.data)
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_Imagenes = async (param) => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/producto/${param}`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setImagenesActuales(s.data || [])
                })
            .catch((err)=>{console.log(err)});
    }
    
    useEffect(()=>{
        if(!insumoID){return}
        fetch_Depositos();
        fetch_Proveedores();
        fetch_Insumo(insumoID);
        fetch_Imagenes(insumoID)
    } , [insumoID])
    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProduct({
            ...product , 
                [name]:value
        })   
    }

    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setProduct({
            ...product,
            [name]: value,
        });
    };

    const uploadImagenes = async (productoID) => {
        try {
            const formData = new FormData();

            imagenes.forEach((img) => {
                formData.append("fotos", img); // varias fotos, un solo request
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/${productoID}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.ok) {
                alert(data.message)
                return;
            }

        } catch (err) {
            console.log("❌ Error subiendo imágenes:", err);
        }
    };

    const eliminarImagen = async (fotoID) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productFoto/${fotoID}`, {
                method: "DELETE"
            });

            const data = await res.json();

            if (data.ok) {
                setImagenesActuales(prev => prev.filter(img => img._id !== fotoID));
            } else {
                alert(data.message)
                return
            }
        } catch (err) {
            console.log("❌ Error:", err);
        }
    };


    const clickChange = (e) => {
        e.preventDefault();
        const bodyData = {
            name: product.name , 
            precioCosto: product.precioCosto , 
            stock: product.stock , 
            ganancia: product.ganancia , 
            deposito: product.deposito , 
            proveedor: product.proveedor
        }

        if(product.stockMinimo){
            bodyData.stockMinimo = product.stockMinimo
        }

         fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo/${insumoID}`,
            {
                method: 'PUT',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(bodyData)
            }
         ).then((a) => {
                        return a.json();
                    })
                    .then((s) => {
                            if(!s.ok){
                                alert(s.message)
                                return
                            }
                            if(s.ok){
                                const productoID = s.data._id;

                                if (imagenes.length > 0) {
                                    uploadImagenes(productoID);
                                }
                                setProduct(initialState);
                                setImagenes([]);
                                alert(s.message)
                                exito();
                            }
                        })
                .catch((err) => {console.log('❌ Error al enviar datos. \n Error: ',err)})
    }

    const [mostrarModalProveedor,setMostrarModalProveedor] = useState(false)
    const [mostrarModalDeposito,setMostrarModalDeposito] = useState(false)

    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }))
    const opciones_depositos = depositos.map(v => ({ value: v._id,label: v.name }))

    return(
        <>

            {mostrarModalProveedor && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalProveedor(false)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateProveedor
                            exito={() => 
                                {
                                    setMostrarModalProveedor(false)
                                    fetch_Proveedores()
                                }}
                        />
                    </div>
                </div>
            )}

            {mostrarModalDeposito && (
                <div className="modal">
                    <div className="modal-content">
                        <button className="close" onClick={() => 
                            {
                                setMostrarModalDeposito(null)
                            }
                        }>
                            &times;
                        </button>
                        <FormularioCreateDeposito
                            exito={() => 
                                {
                                    setMostrarModalDeposito(false)
                                    fetch_Depositos()
                                }}
                        />
                    </div>
                </div>
            )}
            
            <div className="form-container">
                <h1 className="titulo-pagina">Modificar Insumo</h1>
                
                <form className="formulario-picada">
                
                 <div className="form-row">
                    <div className="form-col">
                        <label htmlFor="nombre">Nombre:</label>
                        <input type="text" onChange={inputChange} value={product.name} name="name" placeholder="Ingresa el nombre del insumo" required></input>
                    </div>
                    
                    <div className="form-col1">
                        <label htmlFor="deposito">
                            Proveedor:<button type="button" className="btn-plus" onClick={() => setMostrarModalProveedor(true)}>+</button>
                        </label>
                        <Select
                            className="form-select-react" // Clase contenedora, podés usarla para aplicar un margen por ejemplo
                            classNamePrefix="rs"
                            options={opciones_proveedores}
                            value={opciones_proveedores.find(op => op.value === product.proveedor) || null}
                            onChange={selectChange}
                            name='proveedor'
                            placeholder="Seleccione un proveedor..."
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
                    <div className="form-col1">
                        <label htmlFor="deposito">
                            Deposito:
                            <button type="button" className="btn-plus" onClick={() => setMostrarModalDeposito(true)}>+</button>
                        </label>
                        <Select
                            className="form-select-react" // Clase contenedora, podés usarla para aplicar un margen por ejemplo
                            classNamePrefix="rs"
                            options={opciones_depositos}
                            value={opciones_depositos.find(op => op.value === product.deposito) || null}
                            onChange={selectChange}
                            name='deposito'
                            placeholder="Seleccione un deposito..."
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
                 </div>
                 <div className="form-row">
                    <div className="form-col">
                        <label htmlFor="stock">Stock:</label>
                        <input type="number" onChange={inputChange} value={product.stock} name="stock" placeholder="Ingresa el stock del insumo" required></input>
                    </div>             
                    <div className="form-col">
                        <label htmlFor="stock">Stock minimo:</label>
                        <input type="number" onChange={inputChange} value={product.stockMinimo} name="stockMinimo" placeholder="Ingresa el stock minimo del insumo"></input>
                    </div>          
                    <div className="form-col">
                        <label htmlFor="precioC">Precio costo:</label>
                        <input type="number" onChange={inputChange} value={product.precioCosto} name="precioCosto" placeholder="Ingresa el precio costo del insumo" required></input>
                    </div>
                    
                    <div className="form-col">
                        <label htmlFor="ganancia">% Ganancia:</label>
                        <input type="number" onChange={inputChange} value={product.ganancia} name="ganancia" placeholder="Ingresa la ganancia del insumo" required></input>
                    </div>
                 </div>

                 <div className="form-row">
                    <div className="form-col">
                        <label>Fotos del producto:</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => setImagenes([...e.target.files])}
                        />
                    </div>
                </div>
                 <div className="form-row">
                    <div className="imagenes-actuales-container">
                        <h3>Imágenes actuales:</h3>
                        {imagenesActuales.length === 0 && (
                            <p>No hay imágenes cargadas.</p>
                        )}

                        <div className="imagenes-grid">
                            {imagenesActuales.map((img) => (
                                <div key={img._id} className="imagen-card">
                                    <img src={img.imagenURL} alt="Foto del producto" />

                                    <button
                                        type="button"
                                        className="btn-eliminar"
                                        onClick={(e) => {
                                            e.stopPropagation();   // evita cierre del modal
                                            eliminarImagen(img._id);
                                        }}
                                    >
                                        ✕
                                    </button>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 
                 <div className="form-row">
                    <div className="form-carga-button">
                        <button type="submit" className="submit-btn" onClick={clickChange}>Guardar</button>
                    </div>
                </div> 

                </form>
            </div>
             <style jsx>
                {`
                        
                    .box-cargar{
                        justify-content: center;
                        align-items: center;
                    }

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

                    .precio-venta {
                        max-width: 100px;
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
                        max-width:200px;
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-productos {
                        flex: 8;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item1 {
                        flex: 3;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item2 {
                        flex: 2;
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-precioVenta {
                        flex: 2;
                        min-width: 0;
                        display: flex;
                        flex-direction: column;
                    }

                    label {
                        font-weight: 500;
                        margin-bottom: 0.5rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
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

                    .precio-venta {
                        flex-direction: column;
                        align-items: flex-end;
                        justify-content: flex-start;
                        flex: 1;
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
                    }

                    .form-group {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        height: 50x;
                        overflow-y: auto;
                        padding-right: 8px;
                    }

                    .form-group input[type="number"] {
                        max-width: 80px;
                    }


                    .btn-add-insumo {
                        background-color: #571212ff;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        align-self: flex-start;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .btn-add-insumo:hover {
                        background-color: #571212ff;
                        transform: translateY(-3px);
                    }

                    .form-submit {
                        justify-content: center;
                        margin-top: 1rem;
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

                    .close {
                        position: absolute;
                        top: 1rem;
                        right: 1.5rem;
                        font-size: 1.5rem;
                        background: transparent;
                        border: none;
                        cursor: pointer;
                    }

                    .btn-icon {
                        background-color: #8b0000;
                        color: white;
                        padding: 0.8rem;
                        font-size: 1.2rem;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        width: 2.5rem;
                        height: 2.5rem;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        transition: background-color 0.3s, transform 0.2s;
                    }
                    
                    .btn-icon:hover {
                        background-color: #a30000;
                        transform: translateY(-3px);
                    }
                `}
            </style>
        </>
    )
}

export default updateProducto;