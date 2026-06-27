import React, { useState } from "react";
import { FaShoppingCart, FaEdit} from "react-icons/fa";
import styles from "@/styles/LowStockGrid.module.css";
import FormularioUpdateVino from '../pages/products/vinos/updateVino'
import FormularioUpdateInsumo from '../pages/products/insumos/updateInsumo'
import FormularioUpdatePicada from '../pages/products/picadas/updatePicada'
import FormularioSolicitudPresupuestoCreate from '../pages/proveedores/presupuestoSolicitud/createSolicitud'
import FormularioOrdenProduccionCreate from '../pages/products/ordenProduccion/createOrdenProduccion'

export default function LowStockGrid({ products = [], title = "Productos con Stock Bajo" , recargar }) {
  const [mostrarProductoInsumoUpdate ,setMostrarProductoInsumoUpdate] = useState(null)
  const [mostrarProductoVinoUpdate ,setMostrarProductoVinoUpdate] = useState(null)
  const [mostrarProductoPicadaUpdate ,setMostrarProductoPicadaUpdate] = useState(null)
  const [mostrarSolicitudPresupuesto ,setMostrarSolicitudPresupuesto] = useState(null)
  const [mostrarOrdenProduccion ,setMostrarOrdenProduccion] = useState(null)
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

    {mostrarProductoPicadaUpdate && (
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={() => 
              {
                  setMostrarProductoPicadaUpdate(false)
              }
          }>
              &times;
          </button>
          <FormularioUpdatePicada
              picadaID = {mostrarProductoPicadaUpdate}
              exito={() => 
                  {
                      setMostrarProductoPicadaUpdate(false)
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


    {mostrarOrdenProduccion && (
      <div className="modal">
        <div className="modal-content">
          <button className="close" onClick={() => 
              {
                  setMostrarOrdenProduccion(null)
              }
          }>
              &times;
          </button>
          <FormularioOrdenProduccionCreate
              tipo='producto'
              param={mostrarOrdenProduccion}
              exito={() => 
                  {
                      setMostrarOrdenProduccion(false)
                      recargar()
                  }}
          />
        </div>
      </div>
    )}
    <div className={styles.container}>
      <div className={styles.panelHeader}>
        <span className={styles.panelTitulo}>{title}</span>
        <span style={{ color: '#6b7280', fontSize: '0.72rem' }}>{products.length} producto{products.length !== 1 ? 's' : ''}</span>
      </div>

      {products.length === 0 ? (
        <p className={styles.sinDatos}>No hay productos con stock bajo.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Proveedor</th>
                <th>Nombre</th>
                <th>Stock actual</th>
                <th>Stock mínimo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const stockClass = product.stock === 0
                  ? styles.stockCero
                  : styles.stockBajo;
                return (
                  <tr key={product._id}>
                    <td>{product.proveedor}</td>
                    <td style={{ textAlign: 'left', fontWeight: 600, color: '#f3f4f6' }}>{product.name}</td>
                    <td>
                      <span className={`${styles.stockBadge} ${stockClass}`}>{product.stock}</span>
                    </td>
                    <td>{product.stockMinimo}</td>
                    <td>
                      <div className="acciones-wrap">
                        <button
                          onClick={() => {
                            if (product.tipoProducto === 'ProductoInsumo' || product.tipoProducto === 'ProductoVino') {
                              setMostrarSolicitudPresupuesto(product._id);
                            } else if (product.tipoProducto === 'ProductoPicada') {
                              setMostrarOrdenProduccion(product._id);
                            }
                          }}
                          className="btn-accion"
                          title="Pedir"
                        >
                          <FaShoppingCart />
                        </button>
                        <button
                          onClick={() => {
                            if (product.tipoProducto === 'ProductoInsumo') {
                              setMostrarProductoInsumoUpdate(product._id);
                            } else if (product.tipoProducto === 'ProductoVino') {
                              setMostrarProductoVinoUpdate(product._id);
                            } else if (product.tipoProducto === 'ProductoPicada') {
                              setMostrarProductoPicadaUpdate(product._id);
                            }
                          }}
                          className="btn-accion"
                          title="Modificar producto"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>

      <style jsx>{`
        .acciones-wrap {
          display: flex;
          gap: 8px;
          justify-content: center;
          align-items: center;
        }

        .btn-accion {
          background: rgba(255,255,255,0.07);
          color: #d1d5db;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          width: 32px;
          height: 32px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, transform 0.1s;
        }

        .btn-accion:hover {
          background: rgba(255,255,255,0.14);
          color: #fff;
          transform: translateY(-1px);
        }
      `}</style>
  </>
  );  
}
