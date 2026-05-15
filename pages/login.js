import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setError("Error al conectar con el servidor (respuesta inválida)");
        return;
      }

      if (data.ok) {
        localStorage.setItem("authToken", data.token);
        sessionStorage.setItem("usuario", JSON.stringify(data.usuario));
        router.push("/");
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch {
      setError("Error al conectar con el servidor");
    }
  };

  return (
    <div className="login-container">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="login-error">{error}</p>}
        <button type="submit">Ingresar</button>
      </form>

      <style jsx>{`
        .login-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: #1e1e1e;
          color: white;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 300px;
        }
        input {
          padding: 10px;
          border-radius: 8px;
          border: none;
          font-size: 1rem;
        }
        .login-error {
          color: #ff6b6b;
          font-size: 0.9rem;
          margin: 0;
        }
        button {
          padding: 10px;
          background-color: #a30000;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1rem;
          cursor: pointer;
        }
        button:hover {
          background-color: #c70000;
        }
      `}</style>
    </div>
  );
}
