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
    } catch (err) {
      console.log("Backend no disponible aún...");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkBackend();

    // reintenta cada 5 segundos si no está conectado
    const interval = setInterval(() => {
      if (!isConnected) checkBackend();
    }, 5000);

    return () => clearInterval(interval);
  }, [isConnected]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-300 bg-neutral-900">
        <ImSpinner8 className="animate-spin text-5xl mb-4 text-emerald-400" />
        <p className="text-lg">Conectando con el servidor...</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-red-400">
        <FaServer className="text-4xl mb-2" />
        <p>No se pudo establecer conexión con el backend.</p>
        <p className="text-sm text-gray-400 mt-1">El servidor puede estar iniciando, reintentá en unos segundos.</p>
      </div>
    );
  }

  // Si ya está conectado, mostramos la app normalmente
  return <>{children}</>;
}
