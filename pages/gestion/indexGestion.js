import Link from "next/link";
import { useState, useEffect } from "react";
import { FaHome } from "react-icons/fa";

export default function indexGestion() {
  const [dbActual, setDbActual] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ping/switchDb`)
      .then((r) => r.json())
      .then(({ target }) => setDbActual(target))
      .catch(() => setDbActual(null));
  }, []);

  const toggleDb = async () => {
    if (cargando) return;
    const nuevoTarget = dbActual === 'dev' ? 'prod' : 'dev';
    setCargando(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ping/switchDb`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: nuevoTarget }),
      });
      const { target } = await res.json();
      setDbActual(target);
    } catch (err) {
      console.error('Error al cambiar BD:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
  <>
  <h1 className="titulo-index">Gestion</h1>
   <div className="botonera">
    <button className="btn-icon" title="Volver al menú">
        <Link href="/" >
            <FaHome />
        </Link>
    </button>
  </div>
  <div className="menu-grid">
      <Link href="./tablasVarias/indexGeneral" className="boton-acceso">
          <span>Tablas Varias</span>
      </Link>
      <Link href="./deposito/indexDeposito" className="boton-acceso">
          <span>Deposito</span>
      </Link>
      <Link href="./empleado/indexEmpleado" className="boton-acceso">
          <span>Empleado</span>
      </Link>
      <Link href="./transporte/indexTransporte" className="boton-acceso">
          <span>Transporte</span>
      </Link>
      <Link href="./usuario/indexUsuario" className="boton-acceso">
          <span>Usuario</span>
      </Link>
  </div>

  <div className="db-toggle-container">
    <button
      className={`db-toggle ${dbActual}`}
      onClick={toggleDb}
      disabled={cargando || dbActual === null}
      title="Cambiar base de datos"
    >
      {cargando ? '...' : dbActual === 'dev' ? 'BASE DE DATOS DE PRUEBA' : 'BASE DE DATOS DE PRODUCCION'}
    </button>
  </div>

  <style jsx>{`
    .db-toggle-container {
      display: flex;
      justify-content: center;
      margin-top: 24px;
    }
    .db-toggle {
      padding: 8px 24px;
      border: 2px solid;
      border-radius: 20px;
      font-weight: bold;
      font-size: 14px;
      cursor: pointer;
      letter-spacing: 1px;
      transition: background 0.2s, color 0.2s;
    }
    .db-toggle.prod {
      background: #1a472a;
      color: #fff;
      border-color: #1a472a;
    }
    .db-toggle.dev {
      background: #7b2d00;
      color: #fff;
      border-color: #7b2d00;
    }
    .db-toggle:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `}
  </style>
</>
  );
}
