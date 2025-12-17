const { useState, useEffect } = require("react")
import { FaTrash } from "react-icons/fa";
import Select from 'react-select';    

const { default: Link } = require("next/link")

const initialState = {vinoID:'',name:'',stock:0 , stockMinimo:'', proveedor:'' , bodega:'' , paraje:'' , crianza : '' , precioCosto:0 , ganancia:0 , tipo:'' , varietal:'' , volumen:'' , deposito:''}
const initialDetalle = { 
         vino: "", uva: ""
    };
const formfiltroso = ({ exito, filtro, onChangeFiltro , filtroDetalle , onChangeFiltroDetalle }) => {
    
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
        
    const [filtros, setFiltros] = useState(filtro);
    
    // Sincroniza con los cambios del padre
    useEffect(() => {
            setFiltros(filtro);
            setDetalles(filtroDetalle)
    }, [filtro,filtroDetalle]);
        
    const borrarFiltros = () => {
            setFiltros(initialState);
            onChangeFiltro(initialDetalle);
            setDetalles([])
            onChangeFiltroDetalle([]);
    };
    
    const fetchBodegas = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/bodega`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setBodegas(s.data)
                })
            .catch((err)=>{console.log(err)})
    }
    
    const fetchProveedores = ()=>{
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/gestion/proveedor`)
            .then((a)=>{return a.json()})
                .then((s)=>{
                    setProveedores(s.data)
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
        fetchBodegas();
        fetchParajes();
        fetchCrianzas();
        fetchTiposVino();
        fetchTiposUva();
        fetchVarietales();
        fetchVolumenes();
        fetchDepositos();
        fetchProveedores();
    }, []); 
    
    const inputChange = (e) => {
        const { name, value } = e.target;
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
        onChangeFiltroDetalle(detalles); 
    };
  
    const handleDetalleChange = (index, field, value) => {
        const nuevosDetalles = [...detalles];
        nuevosDetalles[index][field] = value;

        setDetalles(nuevosDetalles);
        onChangeFiltroDetalle(nuevosDetalles)
    };


    const selectChange = (selectedOption, actionMeta) => {
        const name = actionMeta.name;
        const value = selectedOption ? selectedOption.value : "";
        
        const nuevosFiltros = { ...filtros, [name]: value };
        setFiltros(nuevosFiltros);
        onChangeFiltro(nuevosFiltros); 
        onChangeFiltroDetalle(detalles);
    };
    

    const agregarDetalle = () => {
        setDetalles([...detalles, { ...{vino:"" , uva: ""} }]);
    };

    const handleBuscar = async (e) => {
        e.preventDefault();

        // Armamos el cuerpo a enviar
        const body = {
            ...filtros,
            detalles: detalles.map(d => ({
                uva: d.uva,
            }))
        };

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/productVino/buscar`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        if (data.ok){
            exito(data.data);
        } else {
            exito({})
        }
    };
    
    const opciones_tipoVino = tiposVino.map(v => ({ value: v._id,label: v.name }));
    const opciones_varietales = varietales.map(v => ({ value: v._id,label: v.name }));
    const opciones_volumen = volumenes.map(v => ({ value: v._id,label: v.name }));
    const opciones_uvas = tiposUva.map(v => ({ value: v._id,label: v.name }));
    const opciones_deposito = depositos.map(v => ({ value: v._id,label: v.name }));
    const opciones_crianza = crianzas.map(v => ({ value: v._id,label: v.name }));
    const opciones_bodega = bodegas.map(v => ({ value: v._id,label: v.name }));
    const opciones_paraje = parajes.map(v => ({ value: v._id,label: v.name }));
    const opciones_proveedores = proveedores.map(v => ({ value: v._id,label: v.name }));

    return(
        <>
            <div className="form-container">
                <div className="form-row">
                    <div className="form-col">
                        <h1 className="titulo-pagina">Busqueda avanzada de Vino</h1>
                    </div>
                </div>

                <form id="formfiltroso" className="formulario-presupuesto">
                    <div className="form-row">
                        <div className="form-col1">
                            <label>
                                Vino N°:
                            </label>
                            <input type='text' onChange={inputChange}  name='vinoID' value={filtros.vinoID} placeholder='Escriba aqui el id...' />
                        </div>
                        <div className="form-col1">
                            <label>
                                Nombre:
                            </label>
                            <input type='text' onChange={inputChange}  name='name' value={filtros.name} placeholder='Escriba aqui el nombre...' />
                        </div>
                        <div className="form-col1">
                            <label>
                                Tipo de Vino:
                            </label>
                            <Select
                                className="form-select-react"
                                classNamePrefix="rs"
                                options={opciones_tipoVino}
                                value={opciones_tipoVino.find(op => op.value === filtros.tipo) || null}
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
                                value={opciones_proveedores.find(op => op.value === filtros.proveedor) || null}
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
                                value={opciones_varietales.find(op => op.value === filtros.varietal) || null}
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
                                value={opciones_crianza.find(op => op.value === filtros.crianza) || null}
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
                                value={opciones_volumen.find(op => op.value === filtros.volumen) || null}
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
                                value={opciones_bodega.find(op => op.value === filtros.bodega) || null}
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
                                value={opciones_paraje.find(op => op.value === filtros.paraje) || null}
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
                                value={opciones_deposito.find(op => op.value === filtros.deposito) || null}
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
                            <input type='number' onChange={inputChange}  name='precioCosto' value={filtros.precioCosto} placeholder='Escriba aqui el precio costo...'/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Ganancia:
                            </label>
                            <input type='number' onChange={inputChange}  name='ganancia' value={filtros.ganancia} placeholder='Escriba aqui la ganancia...'/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Stock:
                            </label>
                            <input type='number' onChange={inputChange}  name='stock' value={filtros.stock} placeholder='Escriba aqui el stock...'/>
                        </div>
                        <div className="form-col1">
                            <label>
                                Stock minimo:
                            </label>
                            <input type='number' onChange={inputChange}  name='stockMinimo' value={filtros.stockMinimo} placeholder='Escriba aqui el stock minimo...'/>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-col-filtrosos">
                            <label>
                                    Uvas:
                            </label>
                            <label>
                                <button type="button" className="btn-add-filtroso" onClick={agregarDetalle}>
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
                                                const filtrosos = detalles.filter((_, index) => index !== i);
                                                setDetalles(filtrosos);
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
                </form> 

                <div className="form-submit">
                    <button type="submit" className="submit-btn" onClick={handleBuscar}>Buscar</button>
                    <button
                    type="button"
                    className="submit-btn"
                    style={{ backgroundColor: "#444", marginLeft: "1rem" }}
                    onClick={borrarFiltros}
                    >
                    Borrar filtros
                    </button>
                </div> 
            </div>
            <style jsx>
                {`
                        .imagenes-actuales-container {
                            margin-top: 20px;
                        }

                        .imagenes-grid {
                            display: flex;
                            flex-wrap: wrap;
                            gap: 10px;
                        }

                        .imagen-card {
                            width: 90px;
                            height: 90px;
                            background: #1e1e1e;
                            border-radius: 6px;
                            padding: 4px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            position: relative;
                            transition: transform 0.15s ease-in-out;
                        }

                        .imagen-card:hover {
                            transform: scale(1.1);
                        }

                        .imagen-card img {
                            width: 80px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 4px;
                        }

                        /* Botón eliminar pequeño */
                        .btn-eliminar {
                            position: absolute;
                            top: -5px;
                            right: -5px;
                            background: #e74c3c;
                            border: none;
                            color: white;
                            font-size: 10px;
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            cursor: pointer;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            transition: 0.15s ease-in-out;
                        }

                        .btn-eliminar:hover {
                            background: #c0392b;
                        }


                        .preview-img {
                            width: 100%;
                            height: 100%;
                            object-fit: cover;
                            border-radius: 6px;
                            border: 1px solid #444;
                        }

                        .btn-eliminar-img {
                            position: absolute;
                            top: 5px;
                            right: 5px;
                            background: rgba(255, 0, 0, 0.8);
                            color: white;
                            border: none;
                            padding: 3px 6px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 12px;
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

                        

                        .form-col-filtrosos {
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

                        .btn-add-filtroso {
                            background-color: #651616ff;
                            color: white;
                            border: none;
                            padding: 0.5rem 1rem;
                            border-radius: 8px;
                            cursor: pointer;
                            align-self: flex-start;
                            transition: background-color 0.2s ease-in-out;
                        }

                        .btn-add-filtroso:hover {
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

export default formfiltroso;