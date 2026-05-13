import "@/styles/globals.css";
import "@/styles/tablas.css";
import Layout from "@/components/layout.js";
import BackendLoader from "../components/backendLoader";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// Inyecta el token JWT en todas las peticiones al backend sin tocar cada página
function patchFetch(backendUrl) {
  if (typeof window === "undefined") return;
  const originalFetch = window._originalFetch || window.fetch;
  window._originalFetch = originalFetch;

  window.fetch = function (url, options = {}) {
    const token = localStorage.getItem("authToken");
    if (token && typeof url === "string" && url.startsWith(backendUrl)) {
      options = {
        ...options,
        headers: {
          Authorization: `Bearer ${token}`,
          ...options.headers,
        },
      };
    }
    return originalFetch(url, options);
  };
}

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    patchFetch(process.env.NEXT_PUBLIC_BACKEND_URL);

    const usuarioGuardado = sessionStorage.getItem("usuario");
    const token = localStorage.getItem("authToken");

    if ((!usuarioGuardado || !token) && router.pathname !== "/login") {
      router.replace("/login");
    } else {
      setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);
      setIsAuthChecked(true);
    }
  }, [router.pathname]);

  if (!isAuthChecked) return null;

  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  return (
    <BackendLoader>
      <Layout usuario={usuario}>
        <Component {...pageProps} usuario={usuario} />
      </Layout>
    </BackendLoader>
  );
}
