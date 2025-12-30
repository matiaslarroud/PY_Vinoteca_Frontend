"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaSignOutAlt , FaCog, FaBars, FaTimes } from "react-icons/fa";
import styles from "@/styles/navBar.module.css";

export default function Navbar({ usuario }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const isActive = (path) => pathname === path;

  const handleLogout = () => {
    sessionStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  const toggleDropdown = (name) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
    setOpenDropdown(null);
  };

  if (!usuario) return null;

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>🍷 Vinoteca</div>

      <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.menu} ${menuOpen ? styles.active : ""}`}>
        {usuario.rol === "administrador" && (
          <>
              <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={isActive("/") ? styles.active : ""}
                >
                  Inicio
                </Link>

                {/* Clientes */}
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown("clientes")}
                  >
                    Clientes {openDropdown === "clientes" ? "▲" : "▼"}
                  </button>
                  {openDropdown === "clientes" && (
                    <div className={styles.submenu}>
                      <Link href="/clientes/indexClientes" onClick={handleLinkClick} className={isActive("/clientes/indexClientes") ? styles.active : ""}>
                        Listado
                      </Link>
                      <Link href="/clientes/presupuesto/indexPresupuesto" onClick={handleLinkClick} className={isActive("/clientes/presupuesto/indexPresupuesto") ? styles.active : ""}>
                        Presupuesto
                      </Link>
                      <Link href="/clientes/notaPedido/indexNotaPedido" onClick={handleLinkClick} className={isActive("/clientes/notaPedido/indexNotaPedido") ? styles.active : ""}>
                        Nota de Pedido
                      </Link>
                      <Link href="/clientes/comprobanteVenta/indexComprobanteVenta" onClick={handleLinkClick} className={isActive("/clientes/comprobanteVenta/indexComprobanteVenta") ? styles.active : ""}>
                        Comprobante de Venta
                      </Link>
                      <Link href="/clientes/reciboPago/indexReciboPago" onClick={handleLinkClick} className={isActive("/clientes/reciboPago/indexReciboPago") ? styles.active : ""}>
                        Recibo de Pago
                      </Link>
                      <Link href="/clientes/remito/indexRemito" onClick={handleLinkClick} className={isActive("/clientes/remito/indexRemito") ? styles.active : ""}>
                        Remito
                      </Link>
                    </div>
                  )}
                </div>

                {/* Proveedores */}
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown("proveedores")}
                  >
                    Proveedores {openDropdown === "proveedores" ? "▲" : "▼"}
                  </button>
                  {openDropdown === "proveedores" && (
                    <div className={styles.submenu}>
                      <Link href="/proveedores/indexProveedor" onClick={handleLinkClick} className={isActive("/proveedores/indexProveedor") ? styles.active : ""}>
                        Listado
                      </Link>
                      <Link href="/proveedores/presupuestoSolicitud/indexSolicitud" onClick={handleLinkClick}  className={isActive("/proveedores/presupuestoSolicitud/indexSolicitud") ? styles.active : ""}>
                        Solicitud de Presupuesto
                      </Link>
                      <Link href="/proveedores/presupuesto/indexPresupuesto" onClick={handleLinkClick} className={isActive("/proveedores/presupuesto/indexPresupuesto") ? styles.active : ""}>
                        Presupuesto
                      </Link>
                      <Link href="/proveedores/ordenCompra/indexOrdenCompra" onClick={handleLinkClick}  className={isActive("/proveedores/ordenCompra/indexOrdenCompra") ? styles.active : ""}>
                        Orden de Compra
                      </Link>
                      <Link href="/proveedores/comprobanteCompra/indexComprobanteCompra" onClick={handleLinkClick}  className={isActive("") ? styles.active : ""}>
                        Comprobante de Compra
                      </Link>
                      <Link href="/proveedores/comprobantePago/indexComprobantePago" onClick={handleLinkClick} className={isActive("/proveedores/comprobantePago/indexComprobantePago") ? styles.active : ""}>
                        Comprobante de Pago
                      </Link>
                      <Link href="/proveedores/remito/indexRemito" onClick={handleLinkClick} className={isActive("/proveedores/remito/indexRemito") ? styles.active : ""}>
                        Remito
                      </Link>
                    </div>
                  )}
                </div>

                {/* Productos */}
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown("productos")}
                  >
                    Productos {openDropdown === "productos" ? "▲" : "▼"}
                  </button>
                  {openDropdown === "productos" && (
                    <div className={styles.submenu}>
                      <Link href="/products/indexProducts" onClick={handleLinkClick} className={isActive("/products/indexProducts") ? styles.active : ""}>
                        Listado
                      </Link>
                      <Link href="/products/vinos/indexVino" onClick={handleLinkClick} className={isActive("/products/vinos/indexVino") ? styles.active : ""}>
                        Vino
                      </Link>
                      <Link href="/products/picadas/indexPicada" onClick={handleLinkClick} className={isActive("/products/picadas/indexPicada") ? styles.active : ""}>
                        Picada
                      </Link>
                      <Link href="/products/insumos/indexInsumo" onClick={handleLinkClick} className={isActive("/products/insumos/indexInsumo") ? styles.active : ""}>
                        Insumo
                      </Link>
                      <Link href="/products/ordenProduccion/indexOrdenProduccion" onClick={handleLinkClick} className={isActive("/products/ordenProduccion/indexOrdenProduccion") ? styles.active : ""}>
                        Órdenes de Producción
                      </Link>
                    </div>
                  )}
                </div>

                {/* Informes */}
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown("informes")}
                  >
                    Informes {openDropdown === "productos" ? "▲" : "▼"}
                  </button>
                  {openDropdown === "informes" && (
                    <div className={styles.submenu}>
                      <Link
                        href="/gestion/informes/indexInformes"
                        onClick={handleLinkClick}
                        className={isActive("/gestion/informes/indexInformes") ? styles.active : ""}
                      >
                        Listado
                      </Link>
                      <Link
                        href="/gestion/informes/caja/indexCaja"
                        onClick={handleLinkClick}
                        className={isActive("/gestion/informes/caja/indexCaja") ? styles.active : ""}
                      >
                        Movimientos totales
                      </Link>
                      <Link
                        href="/gestion/informes/registroVenta/indexRegistroVenta"
                        onClick={handleLinkClick}
                        className={isActive("/gestion/informes/registroVenta/indexRegistroVenta") ? styles.active : ""}
                      >
                        Registro de ventas
                      </Link>
                      <Link
                        href="/gestion/informes/registroCuentaCorriente/indexCuentaCorriente"
                        onClick={handleLinkClick}
                        className={isActive("/gestion/informes/registroCuentaCorriente/indexCuentaCorriente") ? styles.active : ""}
                      >
                        Registro de cuenta corriente
                      </Link>
                    </div>
                  )}
                </div>

                
              
          </>
        )}

        {usuario.rol === "vendedor" && (
          <>
                <Link
                  href="/"
                  onClick={handleLinkClick}
                  className={isActive("/") ? styles.active : ""}
                >
                  Inicio
                </Link>

                {/* Clientes */}
                <div className={styles.dropdown}>
                  <button
                    className={styles.dropdownToggle}
                    onClick={() => toggleDropdown("clientes")}
                  >
                    Clientes {openDropdown === "clientes" ? "▲" : "▼"}
                  </button>
                  {openDropdown === "clientes" && (
                    <div className={styles.submenu}>
                      <Link href="/clientes/indexClientes" onClick={handleLinkClick} className={isActive("/clientes/indexClientes") ? styles.active : ""}>
                        Listado
                      </Link>
                      <Link href="/clientes/presupuesto/indexPresupuesto" onClick={handleLinkClick} className={isActive("/clientes/presupuesto/indexPresupuesto") ? styles.active : ""}>
                        Presupuesto
                      </Link>
                      <Link href="/clientes/notaPedido/indexNotaPedido" onClick={handleLinkClick} className={isActive("/clientes/notaPedido/indexNotaPedido") ? styles.active : ""}>
                        Nota de Pedido
                      </Link>
                      <Link href="/clientes/comprobanteVenta/indexComprobanteVenta" onClick={handleLinkClick} className={isActive("/clientes/comprobanteVenta/indexComprobanteVenta") ? styles.active : ""}>
                        Comprobante de Venta
                      </Link>
                      <Link href="/clientes/reciboPago/indexReciboPago" onClick={handleLinkClick} className={isActive("/clientes/reciboPago/indexReciboPago") ? styles.active : ""}>
                        Recibo de Pago
                      </Link>
                      <Link href="/clientes/remito/indexRemito" onClick={handleLinkClick} className={isActive("/clientes/remito/indexRemito") ? styles.active : ""}>
                        Remito
                      </Link>
                    </div>
                  )}
                </div>
          </>
        )}
      </nav>
      
      {usuario.rol === "vendedor" && (
        <>
          <div className={styles.userArea}>
            <span>{usuario.nombre}</span>
            <FaSignOutAlt  className={styles.icon} onClick={handleLogout} title="Cerrar sesión" />
          </div>
        </>
      )}
      
      {usuario.rol === "administrador" && (
        <>
          <div className={styles.userArea}>
                <Link href="/gestion/indexGestion" onClick={handleLinkClick}>
                  <FaCog className={styles.icon} />
                </Link>
                <span>{usuario.nombre}</span>
                <FaSignOutAlt  className={styles.icon} onClick={handleLogout} title="Cerrar sesión" />

          </div>
        </>
      )}

      
    </header>
  );
}
