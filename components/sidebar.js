import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pathname = usePathname();
  const [clientesOpen, setClientesOpen] = useState(false);
  const [productosOpen, setProductosOpen] = useState(false);
  const [proveedoresOpen, setProveedoresOpen] = useState(false);
  const [gestionOpen, setGestionOpen] = useState(false);
  const [ubicacionesOpen, setUbicacionesesOpen] = useState(false);
  const [vinosOpen, setVinosOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);

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
                    Presupuesto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/notaPedido/indexNotaPedido"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/notaPedido/indexNotaPedido') ? styles.active : ''
                    }`}
                  >
                    Nota de Pedido
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/comprobanteVenta/indexComprobanteVenta"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/comprobanteVenta/indexComprobanteVenta') ? styles.active : ''
                    }`}
                  >
                    Comprobante de Venta
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/reciboPago/indexReciboPago"
                    className={`${styles.submenuItem} ${
                      isActive("/clientes/reciboPago/indexReciboPago") ? styles.active : ''
                    }`}
                  >
                    Recibo de Pago
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clientes/remito/indexRemito"
                    className={`${styles.submenuItem} ${
                      isActive('/clientes/remito/indexRemito') ? styles.active : ''
                    }`}
                  >
                    Remito
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
                    href="/proveedores/indexProveedor"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/indexProveedor") ? styles.active : ''
                    }`}
                  >
                    Listado
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/presupuestoSolicitud/indexSolicitud"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/presupuestoSolicitud/indexSolicitud") ? styles.active : ''
                    }`}
                  >
                    Solicitud de Presupuesto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/presupuesto/indexPresupuesto"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/presupuesto/indexPresupuesto") ? styles.active : ''
                    }`}
                  >
                    Presupuesto
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/ordenCompra/indexOrdenCompra"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/ordenCompra/indexOrdenCompra") ? styles.active : ''
                    }`}
                  >
                    Orden de Compra
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/comprobanteCompra/indexComprobanteCompra"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/comprobanteCompra/indexComprobanteCompra") ? styles.active : ''
                    }`}
                  >
                    Comprobante de Compra
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/comprobantePago/indexComprobantePago"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/comprobantePago/indexComprobantePago") ? styles.active : ''
                    }`}
                  >
                    Comprobante de Pago
                  </Link>
                </li>
                <li>
                  <Link
                    href="/proveedores/remito/indexRemito"
                    className={`${styles.submenuItem} ${
                      isActive("/proveedores/remito/indexRemito") ? styles.active : ''
                    }`}
                  >
                    Remito
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
                    Vino
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/picadas/indexPicada"
                    className={`${styles.submenuItem} ${
                      isActive('/products/picadas/indexPicada') ? styles.active : ''
                    }`}
                  >
                    Picada
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products/insumos/indexInsumo"
                    className={`${styles.submenuItem} ${
                      isActive('/products/insumos/indexInsumo') ? styles.active : ''
                    }`}
                  >
                    Insumo
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
            <button
              onClick={() => setGestionOpen(!gestionOpen)}
              className={`${styles.menuItem} ${styles.dropdownToggle} ${
                pathname.startsWith('/gestion/indexGestion') ? styles.active : ''
              }`}
            >
              Gestion {gestionOpen ? '▲' : '▼'}
            </button>
            {gestionOpen && (
              <ul className={styles.submenu}>
                <li>
                  <Link href="/gestion/indexGestion" className={`${styles.menuItem} ${isActive('/gestion/indexGestion') ? styles.active : ''}`}>
                    Listado
                  </Link>
                </li>
                {/* UBICACIONES */}
                <li>
                  <button
                    onClick={() => setUbicacionesesOpen(!ubicacionesOpen)}
                    className={`${styles.menuItem} ${styles.dropdownToggle} ${
                      pathname.startsWith('/gestion/ubicaciones/indexUbicaciones') ? styles.active : ''
                    }`}
                  >
                    Gestion Ubicaciones {ubicacionesOpen ? '▲' : '▼'}
                  </button>
                  {ubicacionesOpen && (
                    <ul className={styles.submenu}>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/indexUbicaciones"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/ubicaciones/indexUbicaciones') ? styles.active : ''
                          }`}
                        >
                          Listado
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/pais/indexPais"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/ubicaciones/pais/indexPais') ? styles.active : ''
                          }`}
                        >
                          Pais
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/provincia/indexProvincia"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/ubicaciones/provincia/indexProvincia') ? styles.active : ''
                          }`}
                        >
                          Provincia
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/localidad/indexLocalidad"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/ubicaciones/localidad/indexLocalidad") ? styles.active : ''
                          }`}
                        >
                          Localidad
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/barrio/indexBarrio"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/ubicaciones/barrio/indexBarrio") ? styles.active : ''
                          }`}
                        >
                          Barrio
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/calle/indexCalle"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/ubicaciones/calle/indexCalle") ? styles.active : ''
                          }`}
                        >
                          Calle
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/ubicaciones/deposito/indexDeposito"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/ubicaciones/deposito/indexDeposito") ? styles.active : ''
                          }`}
                        >
                          Deposito
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                {/* VINOS */}
                <li>
                  <button
                    onClick={() => setVinosOpen(!vinosOpen)}
                    className={`${styles.menuItem} ${styles.dropdownToggle} ${
                      pathname.startsWith('/gestion/vinos/indexVinos') ? styles.active : ''
                    }`}
                  >
                    Gestion Vinos {vinosOpen ? '▲' : '▼'}
                  </button>
                  {vinosOpen && (
                    <ul className={styles.submenu}>
                      <li>
                        <Link
                          href="/gestion/vinos/indexVinos"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/vinos/indexVinos') ? styles.active : ''
                          }`}
                        >
                          Listado
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/bodega/indexBodega"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/vinos/bodega/indexBodega') ? styles.active : ''
                          }`}
                        >
                          Bodega
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/bodega_paraje/indexParaje"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/vinos/bodega_paraje/indexParaje') ? styles.active : ''
                          }`}
                        >
                          Paraje
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/vino_crianza/indexCrianza"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/vinos/vino_crianza/indexCrianza") ? styles.active : ''
                          }`}
                        >
                          Crianza
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/vino_tipo/indexVinoTipo"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/vinos/vino_tipo/indexVinoTipo") ? styles.active : ''
                          }`}
                        >
                          Tipo de Vino
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/vino_uva/indexUva"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/vinos/vino_uva/indexUva") ? styles.active : ''
                          }`}
                        >
                          Uva
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/vino_varietal/indexVarietal"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/vinos/vino_varietal/indexVarietal") ? styles.active : ''
                          }`}
                        >
                          Varietal
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/vinos/vino_volumen/indexVolumen"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/vinos/vino_volumen/indexVolumen") ? styles.active : ''
                          }`}
                        >
                          Volumen
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>{/* GENERAL */}
                <li>
                  <button
                    onClick={() => setGeneralOpen(!generalOpen)}
                    className={`${styles.menuItem} ${styles.dropdownToggle} ${
                      pathname.startsWith('/gestion/general/indexGeneral') ? styles.active : ''
                    }`}
                  >
                    Gestion General {generalOpen ? '▲' : '▼'}
                  </button>
                  {generalOpen && (
                    <ul className={styles.submenu}>
                      <li>
                        <Link
                          href="/gestion/general/indexGeneral"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/general/indexGeneral') ? styles.active : ''
                          }`}
                        >
                          Listado
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/general/empleado/indexEmpleado"
                          className={`${styles.submenuItem} ${
                            isActive('/gestion/general/empleado/indexEmpleado') ? styles.active : ''
                          }`}
                        >
                          Empleado
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/general/iva/indexCondicionIva"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/general/iva/indexCondicionIva") ? styles.active : ''
                          }`}
                        >
                          Condicion de Iva
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/general/medioPago/indexMedioPago"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/general/medioPago/indexMedioPago") ? styles.active : ''
                          }`}
                        >
                          Medio Pago
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/general/tipoComprobante/indexTipo"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/general/tipoComprobante/indexTipo") ? styles.active : ''
                          }`}
                        >
                          Tipo de Comprobante
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/gestion/general/transporte/indexTransporte"
                          className={`${styles.submenuItem} ${
                            isActive("/gestion/general/transporte/indexTransporte") ? styles.active : ''
                          }`}
                        >
                          Transporte
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;