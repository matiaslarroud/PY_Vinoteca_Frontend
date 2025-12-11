import { useState } from "react";
import Select from "react-select";

const initialState = {
  name: "",
  password: "",
  password2: "",
  rol: "",
};

const CreateUsuario = ({ exito }) => {
  const [usuario, setUsuario] = useState(initialState);

  const roles = [
    { value: "vendedor", label: "Vendedor" },
    { value: "administrador", label: "Administrador" },
    { value: "cliente", label: "Cliente" },
  ];

  const inputChange = (e) => {
    const { name, value } = e.target;
    setUsuario({
      ...usuario,
      [name]: value,
    });
  };

  const selectChange = (selected) => {
    setUsuario({
      ...usuario,
      rol: selected ? selected.value : "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (usuario.password !== usuario.password2) {
      alert("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: usuario.name,
          password: usuario.password,
          rol: usuario.rol,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setUsuario(initialState);
        alert(data.message)
        exito();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("❌ Error al enviar datos:", err);
    }
  };

  return (
    <>
      <div className="form-container">
        <h1 className="titulo-pagina">Cargar Usuario</h1>
        <form id="formC" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de usuario:</label>
            <input
              type="text"
              onChange={inputChange}
              value={usuario.name}
              name="name"
              placeholder="Ingresa el nombre del usuario"
              required
            />
          </div>

          <div className="form-group">
            <label>Escriba la contraseña:</label>
            <input
              type="password"
              onChange={inputChange}
              value={usuario.password}
              name="password"
              placeholder="Ingresa la contraseña del usuario"
              required
            />
          </div>

          <div className="form-group">
            <label>Repita la contraseña:</label>
            <input
              type="password"
              onChange={inputChange}
              value={usuario.password2}
              name="password2"
              placeholder="Repita la contraseña del usuario"
              required
            />
          </div>

          <div className="form-col">
            <label>Rol:</label>
            <Select
              className="form-select-react"
              classNamePrefix="rs"
              options={roles}
              value={roles.find((op) => op.value === usuario.rol) || null}
              onChange={selectChange}
              placeholder="Rol de usuario..."
              isClearable
              styles={{
                container: (base) => ({
                  ...base,
                  width: 220,
                }),
                control: (base) => ({
                  ...base,
                  backgroundColor: "#2c2c2c",
                  color: "white",
                  border: "1px solid #444",
                  borderRadius: 8,
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "white",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#2c2c2c",
                  color: "white",
                }),
                option: (base, { isFocused }) => ({
                  ...base,
                  backgroundColor: isFocused ? "#444" : "#2c2c2c",
                  color: "white",
                }),
                input: (base) => ({
                  ...base,
                  color: "white",
                }),
              }}
            />
          </div>

          <div className="button-area">
            <button type="submit" className="submit-btn">
              Cargar
            </button>
          </div>
        </form>
      </div>

    <style jsx>{`
      .form-container {
        display: flex;
        flex-direction: column;
        width: fit-content;
        max-height: 90vh;
        padding: 1rem;
        margin: 0 auto;
        overflow-y: auto;
        border-radius: 12px;
        background-color: #1f1f1f;
        box-shadow: 0 0 25px rgba(0, 0, 0, 0.3);
        text-align: center;
      }

      .titulo-pagina {
        font-size: 2rem;
        color: white;
        text-align: center;
        margin-bottom: 1rem;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.6);
      }

      form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }

      fieldset.grid-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 0;
        border: none;
        align-items: center;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
      }

      .form-group label {
        font-weight: 600;
        color: white;
        margin-bottom: 0.4rem;
      }

      .form-group input,
      .form-group select {
        width: 300px;
        padding: 0.6rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        font-size: 1rem;
        color: white;
        background-color: #272626;
        transition: border-color 0.2s ease-in-out;
      }

      button.submit-btn {
        padding: 0.75rem 2rem;
        background-color: #8b0000;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s ease;
        margin-top: 1rem;
      }

      button.submit-btn:hover {
        background-color: rgb(115, 8, 8);
      }

      @media (max-width: 768px) {
        .form-container {
          width: 95%;
        }

        .form-group input,
        .form-group select {
          width: 100%;
        }
      }
    `}</style>

      
    </>
  );
};

export default CreateUsuario;
