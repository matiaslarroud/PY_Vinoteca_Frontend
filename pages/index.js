import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="titulo-pagina">Entusiasmo por el Vino</h1>
      <div>
          <button>
              <Link  className="btn-productos" href="/products/indexProduct">Productos</Link>
          </button>
      </div>
      
        <style>
            {`
                .titulo-pagina {
                      font-size: 3rem;
                      color: white;
                      text-align: center;
                      margin-top: 40px;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                    }

                button {
                  margin-top: 25px;
                  padding: 12px;
                  background-color: #8B0000;
                  color: white;
                  font-size: 1.1rem;
                  border: none;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                }
            `}
        </style>
    </>
  );
}
