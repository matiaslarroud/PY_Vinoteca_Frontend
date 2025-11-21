

const { useState, useEffect } = require("react")
import { FaTrash } from "react-icons/fa";
import Select from 'react-select';    

const { default: Link } = require("next/link")

const initialState = {name:'',stock:0, stockMinimo:'', proveedor:'' , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'', uva:'' , varietal:'' , volumen:'' , deposito:''}
const initialDetalle = { 
         vino: "", uva: ""
    };
const updateProducto = ({exito,vinoID}) => {
    const [product , setProduct] = useState(initialState);
    const [bodegas, setBodegas] = useState([]);
    const [parajes, setParajes] = useState([]);
    const [detalles,setDetalles] = useState([initialDetalle])
    const [crianzas, setCrianzas] = useState([]);
    const [tiposVino, setTiposVino] = useState([]);
    const [tiposUva, setTiposUva] = useState([]);
    const [varietales, setVarietales] = useState([]);
    const [volumenes, setVolumenes] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [depositos, setDepositos] = useState([]);
    
    const fetchProduct = (vinoID)=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino/${vinoID}`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProduct(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    
    const fetchProveedores = (vinoID)=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProveedores(s.data)
                })
            .catch((err)=>{console.log(err)})
    }

    const fetchProduct_Detalle = (vinoID)=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVinoDetalle/vino/${vinoID}`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setDetalles(s.data)
                })
            .catch((err)=>{console.log(err)})
    }

    const fetchBodegas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBodegas(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchParajes = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega-paraje`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setParajes(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchCrianzas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/crianza`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setCrianzas(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchTiposVino = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/tipoVino`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposVino(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchTiposUva = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/uva`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setTiposUva(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchVarietales = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/varietal`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setVarietales(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchVolumenes = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/volumen`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setVolumenes(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    const fetchDepositos = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/deposito`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setDepositos(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    
    useEffect(() => {
        fetchProduct(vinoID);
        fetchProduct_Detalle(vinoID);
        fetchBodegas();
        fetchParajes();
        fetchCrianzas();
        fetchTiposVino();
        fetchTiposUva();
        fetchVarietales();
        fetchVolumenes();
        fetchDepositos();
        fetchProveedores();
    }, [vinoID]);

    
    const inputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        
        setProduct({
            ...product , 
                [name]:value
        })   
    }
  
    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;
        setDetalles(nuevosDetalles);
    };


    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";

        setProduct({
            ...product,
            [name]: value,
        });
    };
    

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{vino:"" , uva: ""} }]);
    };

    const clickChange = async(e) => {
        e.preventDefault();
        const bodyData = {
            name: product.name,
            precioCosto: product.precioCosto,
            stock: product.stock,
            bodega:product.bodega,
            paraje:product.paraje,
            crianza:product.crianza,
            ganancia: product.ganancia,
            tipo:product.tipo,
            varietal:product.varietal,
            volumen: product.volumen,
            deposito: product.deposito ,
            proveedor:product.proveedor
        };

        if(product.stockMinimo){
            bodyData.stockMinimo=product.stockMinimo;
        }

        const resVino = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino/${vinoID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        })

        const vinoCreado = await resVino.json();
        const id = vinoCreado.data?._id;

        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVinoDetalle/${id}`,
            {
                method:'DELETE',
                headers: {
                    'Content-Type':'application/json',
                }
            }
        ).then((a)=>{return a.json()})
            .then((res)=>{
                console.log(res.message);
            })
            .catch((err)=>{
                console.log("Error al enviar producto para su eliminación. \n Error: ",err);
            })

        // GUARDAMOS DETALLES
        for (const detalle of detalles) {
            const resDetalle = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVinoDetalle`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    uva: detalle.uva,
                    vino: id
            })
            
            
            });
            if (!resDetalle.ok) throw new Error("Error al guardar un detalle");
            
        }
        
        setDetalles([initialDetalle]);
        setProduct(initialState);
        exito();
    }

    
    const opciones_tipoVino = tiposVino.map(v => ({ value: v._id,label: v.name }));
    const opciones_varietales = varietales.map(v => ({ value: v._id,label: v.name }));
    const opciones_volumen = volumenes.map(v => ({ value: v._id,label: v.name }));
    const opciones_uvas = tiposUva.map(v => ({ value: v._id,label: v.name }));
    const opciones_deposito = depositos.map(v => ({ value: v._id,label: v.name }));
    const opciones_crianza = crianzas.map(v => ({ value: v._id,label: v.name }));
    const opciones_bodega = bodegas.map(v => ({ value: v._id,label: v.name }));
    const opciones_paraje = parajes.filter(p => (p.bodega === product.bodega)).map(v => ({ value: v._id,label: v.name }));
    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }));

    return(
        <>
            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Modificar Vino</h1>
                    </div>
                </div>

                <form id="updateProducto" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Nombre:
                            </label>
                            <input type='text' onChange={inputChange}  name='name' value={product.name} placeholder='Escriba aqui el nombre...' required/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Tipo de Vino:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_tipoVino}
                                value={opciones_tipoVino.find(op => op.value === product.tipo) || null}
                                onChange={selectChange}
                                name='tipo'
                                placeholder="Tipo de vino..."
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
                            <label>
                                Proveedor:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_proveedores}
                                value={opciones_proveedores.find(op => op.value === product.proveedor) || null}
                                onChange={selectChange}
                                name='proveedor'
                                placeholder="Proveedor..."
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
                            <label>
                                Varietal:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_varietales}
                                value={opciones_varietales.find(op => op.value === product.varietal) || null}
                                onChange={selectChange}
                                name='varietal'
                                placeholder="Varietal..."
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
                            <label>
                                Crianza:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_crianza}
                                value={opciones_crianza.find(op => op.value === product.crianza) || null}
                                onChange={selectChange}
                                name='crianza'
                                placeholder="Crianza..."
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
                            <label>
                                Volumen:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_volumen}
                                value={opciones_volumen.find(op => op.value === product.volumen) || null}
                                onChange={selectChange}
                                name='volumen'
                                placeholder="Volumen..."
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
                            <label>
                                Bodega:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_bodega}
                                value={opciones_bodega.find(op => op.value === product.bodega) || null}
                                onChange={selectChange}
                                name='bodega'
                                placeholder="Bodega..."
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
                            <label>
                                Paraje:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_paraje}
                                value={opciones_paraje.find(op => op.value === product.paraje) || null}
                                onChange={selectChange}
                                name='paraje'
                                placeholder="Paraje..."
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
                            <label>
                                Deposito:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_deposito}
                                value={opciones_deposito.find(op => op.value === product.deposito) || null}
                                onChange={selectChange}
                                name='deposito'
                                placeholder="Deposito..."
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
                            <label>
                                Precio costo:
                            </label>
                            <input type='number' onChange={inputChange}  name='precioCosto' value={product.precioCosto} placeholder='Escriba aqui el precio costo...' required/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Ganancia:
                            </label>
                            <input type='number' onChange={inputChange}  name='ganancia' value={product.ganancia} placeholder='Escriba aqui la ganancia...' required/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Stock:
                            </label>
                            <input type='number' onChange={inputChange}  name='stock' value={product.stock} placeholder='Escriba aqui el stock...' required/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Stock minimo:
                            </label>
                            <input type='number' onChange={inputChange}  name='stockMinimo' value={product.stockMinimo} placeholder='Escriba aqui el stock minimo...'/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col-productos">
                            <label>
                                    Uvas:<button type="button" className="btn-add-producto" onClick={agregarDetalle}>
                                        + Agregar Uva
                                    </button>
                            </label>
                            <div className="form-group-presupuesto">
                                
                                {detalles.map((d, i) => (
                                <div key={i} className="presupuesto-item">
                                    <div className='form-col-item1'>
                                        <Select
                                            className="form-select-react"
                                            classNamePrefix="rs"
                                            options={opciones_uvas}
                                            value={opciones_uvas.find(op => op.value === d.uva) || null}
                                            onChange={(selectedOption) =>
                                                handleDetalleChange(i, "uva", selectedOption ? selectedOption.value : "")
                                            }
                                            placeholder="Uva..."
                                            isClearable
                                            styles={{
                                                container: (base) => ({
                                                ...base,
                                                width: 250, // ⬅️ ancho fijo total
                                                }),
                                                control: (base) => ({
                                                ...base,
                                                minWidth: 250,
                                                maxWidth: 300,
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

                        <div className="form-submit">
                            <button
                                type="submit"
                                className="submit-btn"
                                onClick={(e) => {
                                    clickChange(e);
                                }}
                                >
                                Guardar
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <style jsx>
                {`
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

                        .titulo-pagina {
                            text-align: center;
                            font-size: 2rem;
                            margin-bottom: 1.5rem;
                            font-weight: bold;
                            color: #f5f5f5;
                        }

                        .formulario-presupuesto {
                            display: flex;
                            flex-direction: column;
                            gap: 2rem;
                        }

                        .form-row {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 1.5rem;
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

                        .precio-venta {
                            max-width: 100px;
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
                            transform: translateY(-3px);
                        }

                        .form-group-presupuesto {
                            display: flex;
                            flex-direction: column;
                            gap: 1rem;
                            height: 160px;
                            overflow-y: auto;
                            padding-right: 8px;
                        }

                        .presupuesto-item {
                            display: flex;
                            align-items: center;
                            gap: 1rem;
                            flex-wrap: wrap;
                        }

                        .presupuesto-item input[type="number"] {
                            width: 80px;
                        }

                        .form-secondary {
                            display: grid;
                            grid-template-columns: repeat(2, 1fr); /* 2 columnas */
                            gap: 16px;
                            margin-top: 12px;
                            }

                            .form-col,
                            .form-group {
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            }
                            
                            .form-col1,
                            .form-group {
                            display: flex;
                            flex-direction: column;
                            width: 250;
                            }

                            .form-col label,
                            .form-group label {
                            margin-bottom: 4px;
                            font-size: 14px;
                            color: #ddd;
                            }

                            .form-group input {
                            background-color: #2c2c2c;
                            border: 1px solid #444;
                            border-radius: 8px;
                            padding: 8px;
                            color: white;
                            width: 100%;
                            }

                            .form-group input:focus {
                            outline: none;
                            border-color: #666;
                            }


                        .btn-remove {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.4rem 0.8rem;
                            border-radius: 8px;
                            cursor: pointer;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .btn-add-producto {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 8px;
                            cursor: pointer;
                            align-self: flex-start;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .btn-add-producto:hover {
                            background-color: #571212ff;
                            transform: translateY(-3px);
                        }

                        .form-submit {
                            justify-content: center;
                            margin-top: 1rem;
                        }

                        .submit-btn {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.8rem 1.5rem;
                            font-size: 1rem;
                            border-radius: 10px;
                            cursor: pointer;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .submit-btn:hover {
                            background-color: #571212ff;
                            transform: translateY(-3px);
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
                            transform: translateY(-3px);
                        }
                        
                        .titulo-pagina {
                            font-size: 2rem;
                            color: white;
                            text-align: center;
                            margin-top: 2px;
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
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
                        
                        .form-secondary {
                            display: flex;
                            flex-direction: column;
                            gap: 0.75rem;
                            padding: 1rem;
                            background-color: #1e1e1e;
                            border-radius: 12px;
                            box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
                            font-family: 'Segoe UI', sans-serif;
                            color: #f0f0f0;
                            max-width: 200px;
                        }

                        .label-box {
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            font-size: 1rem;
                            cursor: pointer;
                        }

                        .checkbox-envio {
                            width: 18px;
                            height: 18px;
                            accent-color: #8B0000; /* color vino para el checkbox */
                        }

                        .input-secondary {
                            padding: 0.65rem 1rem;
                            font-size: 1rem;
                            border-radius: 8px;
                            border: 1px solid #ccc;
                            background-color: #f9f9f9;
                            color: #333;
                            transition: border-color 0.3s, box-shadow 0.3s;
                        }

                        .input-secondary:focus {
                            border-color: #8B0000;
                            box-shadow: 0 0 5px rgba(139, 0, 0, 0.6);
                            outline: none;
                        }

                        .form-col label {
                            display: flex;
                            align-items: center;
                            color: white;
                            font-weight: bold;
                            margin-bottom: 0.5rem;
                        }

                        .form-col input[type="date"] {
                            width: 220px;
                            background-color: #2c2c2c;
                            color: white;
                            border: 1px solid #444;
                            border-radius: 8px;
                            padding: 0.4rem 0.6rem;
                            font-size: 1rem;
                            outline: none;
                        }

                        .form-col input[type="date"]::-webkit-calendar-picker-indicator {
                            filter: invert(1); /* icono blanco en navegadores webkit */
                        }


                `}
            </style>
        </>
    )
}

export default updateProducto;