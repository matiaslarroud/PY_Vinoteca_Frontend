import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();
  const [clientesOpen, setClientesOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);

  const isActive = (path) => pathname === path;

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li>
            <Link href="/" className={`${styles.menuItem} ${isActive('/') ? styles.active : ''}`}>
              Inicio
            </Link>
          </li>
          <li>
            <button
              onClick={() => setClientesOpen(!clientesOpen)}
              className={`${styles.menuItem} ${styles.dropdownToggle} ${
                pathname.startsWith('/clientes/indexClientes') ? styles.active : ''
              }`}
            >
              Clientes {clientesOpen ? '▲' : '▼'}
            </button>
            {clientesOpen && (
              <ul className={styles.submenu}>
                <li>
                  <Link
                    href="/clientes/indexClientes"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/indexClientes') ? styles.active : ''
                    }`}
                  >
                    Listado
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/presupuesto/indexPresupuesto"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/presupuesto/indexPresupuesto') ? styles.active : ''
                    }`}
                  >
                    Presupuestos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/notaPedido/indexNotaPedido"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/notaPedido/indexNotaPedido') ? styles.active : ''
                    }`}
                  >
                    Notas de Pedido
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/comprobanteVenta/indexComprobanteVenta"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/comprobanteVenta/indexComprobanteVenta') ? styles.active : ''
                    }`}
                  >
                    Comprobantes de Venta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/remito/indexRemito"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/remito/indexRemito') ? styles.active : ''
                    }`}
                  >
                    Remitos
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setProveedoresOpen(!proveedoresOpen)}
              className={`${styles.menuItem} ${styles.dropdownToggle} ${
                pathname.startsWith('/proveedores') ? styles.active : ''
              }`}
            >
              Proveedores {proveedoresOpen ? '▲' : '▼'}
            </button>
            {proveedoresOpen && (
              <ul className={styles.submenu}>
                <li>
                  <Link
                    href="/proveedores/presupuesto"
                    className={`${styles.submenuItem} ${
                      isActive('/proveedores/presupuesto') ? styles.active : ''
                    }`}
                  >
                    Presupuesto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/compras"
                    className={`${styles.submenuItem} ${
                      isActive('/proveedores/compras') ? styles.active : ''
                    }`}
                  >
                    Compras
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <button
              onClick={() => setProductosOpen(!productosOpen)}
              className={`${styles.menuItem} ${styles.dropdownToggle} ${
                pathname.startsWith('/products/indexProducts') ? styles.active : ''
              }`}
            >
              Productos {productosOpen ? '▲' : '▼'}
            </button>
            {productosOpen && (
              <ul className={styles.submenu}>
                <li>
                  <Link
                    href="/products/indexProducts"
                    className={`${styles.submenuItem} ${
                      isActive('/products/indexProducts') ? styles.active : ''
                    }`}
                  >
                    Listado
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/vinos/indexVino"
                    className={`${styles.submenuItem} ${
                      isActive('/products/vinos/indexVino') ? styles.active : ''
                    }`}
                  >
                    Vinos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/picadas/indexPicada"
                    className={`${styles.submenuItem} ${
                      isActive('/products/picadas/indexPicada') ? styles.active : ''
                    }`}
                  >
                    Picadas
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/insumos/indexInsumo"
                    className={`${styles.submenuItem} ${
                      isActive('/products/insumos/indexInsumo') ? styles.active : ''
                    }`}
                  >
                    Insumos
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/ordenProduccion/indexOrdenProduccion"
                    className={`${styles.submenuItem} ${
                      isActive('/products/ordenProduccion/indexOrdenProduccion') ? styles.active : ''
                    }`}
                  >
                    Ordenes de Producción
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link
              href="/gestion/indexGestion"
              className={`${styles.menuItem} ${isActive('/gestion/indexGestion') ? styles.active : ''}`}
            >
              Gestión
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;