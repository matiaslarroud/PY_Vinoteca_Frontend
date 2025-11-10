import Navbar from "./navBar";
import styles from "@/styles/Layout.module.css";

export default function Layout({ children, usuario }) {
  return (
    <div className={styles.container}>
      <div className={styles.mainWrapper}>
        <Navbar usuario={usuario} />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
