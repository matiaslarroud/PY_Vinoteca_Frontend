const { useState, useEffect } = require("react")
import Select from 'react-select';   
import { FaTrash} from "react-icons/fa";  

const { default: Link } = require("next/link")

const initialState = {name:'',stock:0, stockMinimo:'' , precioVenta:0 , deposito:''}
const initialStateDetalle = {picada:'',insumo:'', cantidad:0}

const buscarPicada = ({ exito, filtro, onChangeFiltro }) => {
    const [depositos, setDepositos] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [detalles, setDetalles] = useState([initialStateDetalle]);
        
        const [filtros, setFiltros] = useState(filtro || {});
    
        // Sincroniza con los cambios del padre
        useEffect(() => {
            setFiltros(filtro || {});
        }, [filtro]);
    
         const inputChange = (e) => {
            const { name, value } = e.target;
            const nuevosFiltros = { ...filtros, [name]: value };
            setFiltros(nuevosFiltros);
            onChangeFiltro(nuevosFiltros); 
        };
    
        const borrarFiltros = () => {
            setFiltros(initialState);
            onChangeFiltro(initialState);
        };
    
    
    const fetch_Depositos = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setDepositos(s.data)
                })
            .catch((err)=>{console.log(err)});
    }

    const fetch_Insumos = async () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productInsumo`)
            .then ((a)=>{return a.json()})
                .then ((s)=>{
                    setInsumos(s.data)
                })
            .catch((err)=>{console.log(err)});
    }
    
    useEffect(()=>{
        fetch_Depositos(),
        fetch_Insumos()
    } , [])

     const handleBuscar = async (e) => {
        e.preventDefault();
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productPicada/buscar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtros),
        });
        const data = await res.json();
        if (data.ok) {exito(data.data)};
    }; 

    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = field === "cantidad" ? parseFloat(value) : value;
        
        const prod = insumos.find(p => p._id === nuevosDetalles[index].insumo);
        
        setDetalles(nuevosDetalles);
    };


    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{picada:'',insumo:'', cantidad:0} }]);
    };
    
    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setFiltros({
            ...filtros,
            [name]: value,
        });
    };

    const opciones_insumos = insumos.map(v => ({ value: v._id,label: v.name }))
    const opciones_depositos = depositos.map(v => ({ value: v._id,label: v.name }))

    return(
        <>
            <div className="form-container">
                <h1 className="titulo-pagina">Busqueda avanzada de picada</h1>

                <form id="updatePicada" className="formulario-picada" onSubmit={handleBuscar}>
                    <div className="form-row">
                        <div className="form-col">
                        <label htmlFor="nombre">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            onChange={inputChange}
                            value={filtros.name}
                            name="name"
                            placeholder="Nombre del producto"
                        />
                        </div>

                        <div className="form-col">
                            <label htmlFor="stock">
                                Stock:
                            </label>
                            <input
                                type="number"
                                onChange={inputChange}
                                value={filtros.stock}
                                name="stock"
                                placeholder="Cantidad en stock"
                            />
                        </div>

                        <div className="form-col">
                            <label htmlFor="stockMinimo">
                                Stock minimo:
                            </label>
                            <input
                                type="number"
                                onChange={inputChange}
                                value={filtros.stockMinimo}
                                name="stockMinimo"
                                placeholder="Cantidad en stock minima"
                            />
                        </div>

                        <div className="form-col">
                            <label>
                                Depósito:
                                <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate2(true)}>+</button>
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_depositos}
                                value={opciones_depositos.find(op => op.value === filtros.deposito) || null}
                                onChange={selectChange}
                                name='deposito'
                                placeholder="Depósito..."
                                isClearable
                                styles={{
                                    container: (base) => ({
                                    ...base,
                                    width: 200, // ⬅️ ancho fijo total
                                    }),
                                    control: (base) => ({
                                    ...base,
                                    minWidth: 200,
                                    maxWidth: 200,
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
                        <div className="form-col-productos">
                            <label>
                                    Insumos:
                                    <button type="button" className="btn-plus" onClick={() => setMostrarModalCreate3(true)}>+</button>
                                    <button type="button" className="btn-add-insumo" onClick={agregarDetalle}>
                                        + Agregar Insumo
                                    </button>
                            </label>
                         <div className="form-group-insumos">
                                
                                {detalles.map((d, i) => (
                                <div key={i} className="insumo-item">
                                    <div className='form-col-item1'>
                                        <Select
                                            className="form-select-react"
                                            classNamePrefix="rs"
                                            options={opciones_insumos}
                                            value={opciones_insumos.find(op => op.value === d.insumo) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "insumo", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Insumo..."
                                            isClearable
                                            styles={{
                                                container: (base) => ({
                                                ...base,
                                                width: 200, // ⬅️ ancho fijo total
                                                }),
                                                control: (base) => ({
                                                ...base,
                                                minWidth: 200,
                                                maxWidth: 200,
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

                                    <div className='form-col-item2'>
                                        <button
                                            type="button"
                                            className="btn-icon"
                                            onClick={() => {
                                                const productos = detalles.filter((_, index) => index !== i);
                                                setDetalles(productos);
                                            }}
                                            >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                                ))}
                            </div>
                        </div>
                        
                    </div>

                    <div className="form-submit">
                        <button type="submit" className="submit-btn">Buscar</button>
                        <button
                        type="button"
                        className="submit-btn"
                        style={{ backgroundColor: "#444", marginLeft: "1rem" }}
                        onClick={borrarFiltros}
                        >
                        Borrar filtros
                        </button>
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
                    }

                    .form-col {
                        flex: 1;
                        max-width:200px;
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-productos {
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item1 {
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }
                        
                    .form-col-item2 {
                        min-width: 0; /* Importante para que no desborde */
                        display: flex;
                        flex-direction: column;
                    }

                    .form-col-precioVenta {
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

                    .form-group-insumos {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                        height: 160px;
                        overflow-y: auto;
                        padding-right: 8px;
                    }

                    .insumo-item {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        flex-wrap: wrap;
                    }

                    .insumo-item input[type="number"] {
                        width: 120px;
                    }

                    .btn-add-insumo {
                        background-color: #a30000;
                        color: white;
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 8px;
                        cursor: pointer;
                        align-self: flex-start;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .btn-add-insumo:hover {
                        background-color: #8b0000;
                        transform: translateY(-3px);
                    }

                    .form-submit {
                        justify-content: center;
                        margin-top: 1rem;
                    }

                    .submit-btn {
                        background-color: #a30000;
                        color: white;
                        border: none;
                        padding: 0.8rem 1.5rem;
                        font-size: 1rem;
                        border-radius: 10px;
                        cursor: pointer;
                        transition: background-color 0.2s ease-in-out;
                    }

                    .submit-btn:hover {
                        background-color: #8b0000;
                        transform: translateY(-3px);
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
                        width: 90%;
                        height:80%;
                        max-width: 500px;
                        max-height: 800px;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                        position: relative;
                        margin: 20px;
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

export default buscarPicada;