import "@/styles/globals.css";
import "@/styles/tablas.css";
import Layout from "@/components/layout.js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem("usuario");
    if (!usuarioGuardado && router.pathname !== "/login") {
      router.replace("/login");
    } else {
      setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);
      setIsAuthChecked(true);
    }
  }, [router.pathname]);

  if (!isAuthChecked) return null; // evita parpadeo inicial

  // Si está en login, no mostrar el layout
  if (router.pathname === "/login") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout usuario={usuario}>
      <Component {...pageProps} usuario={usuario} />
    </Layout>
  );
}
