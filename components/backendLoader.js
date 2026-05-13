import { useEffect, useState } from "react";
import { FaServer } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";

export default function BackendLoader({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const checkBackend = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/ping`, { cache: "no-store" });
      if (res.ok) {
        setIsConnected(true);
      } else {
        throw new Error("Error en backend");
      }
    } catch {
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(() => {
      if (!isConnected) checkBackend();
    }, 5000);
    return () => clearInterval(interval);
  }, [isConnected]);

  if (isLoading) {
    return (
      <div style={styles.container}>
        <ImSpinner8 style={{ ...styles.icon, color: "#20c997", animation: "spin 1s linear infinite" }} />
        <p style={styles.text}>Conectando con el servidor...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div style={styles.container}>
        <FaServer style={{ ...styles.icon, color: "#dc3545" }} />
        <p style={{ ...styles.text, color: "#dc3545" }}>No se pudo establecer conexión con el backend.</p>
        <p style={{ color: "#6c757d", fontSize: "0.9rem", marginTop: "0.5rem" }}>
          El servidor puede estar iniciando, reintentá en unos segundos.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#dee2e6",
  },
  icon: {
    fontSize: "3rem",
    marginBottom: "1rem",
  },
  text: {
    fontSize: "1.1rem",
    color: "#dee2e6",
  },
};
