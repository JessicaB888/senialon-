import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icon";
import logo from "../../public/branding/senialon-dark.png";
import styles from "./workspace.module.css";

function Navigation() {
  return (
    <nav className={styles.navigation} aria-label="Navegación principal">
      <Link className={styles.activeLink} href="/" aria-current="page">
        <Icon name="runs" />
        Ejecuciones
      </Link>
      <span className={styles.unavailableLink} aria-disabled="true">
        <Icon name="comparison" />
        Comparación temática
      </span>
      <span className={styles.unavailableLink} aria-disabled="true">
        <Icon name="publications" />
        Publicaciones
      </span>
      <p className={styles.navHint}>
        La comparación y las publicaciones se habilitan con una ejecución
        disponible.
      </p>
    </nav>
  );
}

export function Workspace({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <Link className={styles.brand} href="/" aria-label="SENIALON, inicio">
          <Image src={logo} alt="SENIALON" width={184} height={80} priority />
        </Link>
        <Navigation />
        <div className={styles.sidebarFooter}>
          <span>Radar de contenidos</span>
          <strong>YouTube · IA</strong>
          <span>Contexto editorial: LatAm</span>
        </div>
      </aside>
      <div className={styles.content}>
        <header className={styles.topbar}>
          <Link
            className={styles.mobileBrand}
            href="/"
            aria-label="SENIALON, inicio"
          >
            <Image src={logo} alt="SENIALON" width={138} height={60} priority />
          </Link>
          <span className={styles.sectionLabel}>Radar de contenidos</span>
          <span className={styles.workspaceLabel}>Espacio compartido</span>
        </header>
        <details className={styles.mobileNavigation}>
          <summary>
            <Icon name="menu" />
            <span>Menú</span>
            <Icon className={styles.menuChevron} name="chevron" />
          </summary>
          <Navigation />
        </details>
        <main id="contenido" className={styles.main} tabIndex={-1}>
          {children}
        </main>
        <footer className={styles.footer}>
          Las publicaciones aportan señales. La evidencia sostiene el criterio.
        </footer>
      </div>
    </div>
  );
}
