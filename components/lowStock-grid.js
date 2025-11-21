import React, { useState } from "react";
import { FaShoppingCart, FaEdit} from "react-icons/fa";
import styles from "@/styles/LowStockGrid.module.css";
import FormularioUpdateVino from '../pages/products/vinos/updateVino'
import FormularioUpdateInsumo from '../pages/products/insumos/updateInsumo'
import FormularioSolicitudPresupuestoCreate from '../pages/proveedores/presupuestoSolicitud/createSolicitud'

export default function LowStockGrid({ products = [], title = "Productos con Stock Bajo" , recargar }) {
  const [mostrarProductoInsumoUpdate ,setMostrarProductoInsumoUpdate] = useState(null)
  const [mostrarProductoVinoUpdate ,setMostrarProductoVinoUpdate] = useState(null)
  const [mostrarSolicitudPresupuesto ,setMostrarSolicitudPresupuesto] = useState(null)
  return (
    <>

    {mostrarProductoInsumoUpdate && (
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={() => 
              {
                  setMostrarProductoInsumoUpdate(null)
              }
          }>
              &times;
          </button>
          <FormularioUpdateInsumo
              insumoID={mostrarProductoInsumoUpdate}
              exito={() => 
                  {
                      setMostrarProductoInsumoUpdate(false)
                      recargar()
                  }}
          />
        </div>
      </div>
    )}

    {mostrarProductoVinoUpdate && (
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={() => 
              {
                  setMostrarProductoVinoUpdate(false)
              }
          }>
              &times;
          </button>
          <FormularioUpdateVino
              vinoID = {mostrarProductoVinoUpdate}
              exito={() => 
                  {
                      setMostrarProductoVinoUpdate(false)
                      recargar()
                  }}
          />
        </div>
      </div>
    )}

    {mostrarSolicitudPresupuesto && (
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={() => 
              {
                  setMostrarSolicitudPresupuesto(null)
              }
          }>
              &times;
          </button>
          <FormularioSolicitudPresupuestoCreate
              tipo='producto'
              param={mostrarSolicitudPresupuesto}
              exito={() => 
                  {
                      setMostrarSolicitudPresupuesto(false)
                      recargar()
                  }}
          />
        </div>
      </div>
    )}

    <div className={styles.container}>
      <h2>{title}</h2>

      {products.length === 0 ? (
        <p>No hay productos con stock bajo.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr className="fila">
              <th>Proveedor</th>
              <th>Nombre</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td className="columna">{product.proveedor}</td>
                <td className="columna">{product.name}</td>
                <td className="columna">{product.stock}</td>
                <td className="columna">{product.stockMinimo}</td>
                <td className="acciones">
                  <button onClick={() => setMostrarSolicitudPresupuesto(product._id)} className="btn-icon2" title="Pedir">
                      <FaShoppingCart />
                  </button>
                  <button onClick={() => {
                        if(product.tipoProducto === 'ProductoInsumo'){
                          setMostrarProductoInsumoUpdate(product._id)
                        } else if (product.tipoProducto === 'ProductoVino'){
                          setMostrarProductoVinoUpdate(product._id)
                        }
                      }
                    } 
                    className="btn-icon2" 
                    title="Modificar producto"
                  >
                      <FaEdit />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>

      <style jsx>{`
        

        .btn-icon2 {
            background-color: #575757ff;
            color: white;
            padding: 0.8rem;
            font-size: 1.2rem;
            border-radius: 50%;
            border: none;
            cursor: pointer;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s, transform 0.2s;
        }
          
        .btn-icon2:hover {
          background-color: #424141ff;
          transform: translateY(-3px);
        }
      `}</style>
  </>
  );  
}
