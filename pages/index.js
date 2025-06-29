import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <h1>Hola mundo</h1>
      </div>
      <Link href="/products/createProduct">Cargar producto</Link>
    </>  
  );
}
