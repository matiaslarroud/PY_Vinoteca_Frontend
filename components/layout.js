// components/Layout.js
import Sidebar from "./sidebar";
import styles from "./Layout.module.css";

export default function Layout({ children }) {

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={styles.mainWrapper}>
        <main className={styles.content}>{children}</main>
        
      </div>
    </div>
  );
}
