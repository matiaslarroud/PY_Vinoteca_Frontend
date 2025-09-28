// components/RightSidebar.js
import Link from 'next/link';
import styles from './Clientes_RightSidebar.module.css';
import { FaFileAlt, FaShoppingCart, FaReceipt, FaTruck } from 'react-icons/fa';

const RightSidebar = () => {
  const cards = [
    { title: 'Presupuestos', icon: <FaFileAlt />, path: './presupuesto/indexPresupuesto' },
    { title: 'Notas de Pedido', icon: <FaShoppingCart />, path: './notaPedido/indexNotaPedido' },
    { title: 'Comprobantes de Venta', icon: <FaReceipt />, path: './comprobanteVenta/indexComprobanteVenta' },
    { title: 'Remitos', icon: <FaTruck />, path: './remito/indexRemito' },
  ];

  return (
    <aside className={styles.rightSidebar}>
      <div className={styles.cardContainer}>
        {cards.map((card, index) => (
          <Link href={card.path} key={index} className={styles.card}>
            <div className={styles.cardIcon}>{card.icon}</div>
            <span className={styles.cardTitle}>{card.title}</span>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default RightSidebar;