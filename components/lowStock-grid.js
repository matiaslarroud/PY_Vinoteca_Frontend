import React from "react";
import styles from "./LowStockGrid.module.css";

export default function LowStockGrid({ products = [], title = "Productos con Stock Bajo" }) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>

      {products.length === 0 ? (
        <p>No hay productos con stock bajo.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Stock Actual</th>
              <th>Stock Mínimo</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{product.stock}</td>
                <td>{product.stockMinimo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
