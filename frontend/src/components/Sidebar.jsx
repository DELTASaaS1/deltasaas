import styles from './Sidebar.module.css'

export default function Sidebar({ orderCount = 0 }) {
  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoMark}>
          <div className={styles.logoIcon}>
            <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="#0d0f14" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 9l3 3 5-6M14 5l-2 2" />
            </svg>
          </div>
          <div>
            <div className={styles.logoName}>DeltaSaaS</div>
            <div className={styles.logoSub}>Logistique · Afrique</div>
          </div>
        </div>
      </div>

      {/* Tenant */}
      <div className={styles.tenantSelector}>
        <div className={`${styles.tenantDot} live-dot`} />
        <div className={styles.tenantInfo}>
          <div className={styles.tenantName}>Boutique Ange — Kribi</div>
          <div className={styles.tenantPlan}>Plan Pro · Actif</div>
        </div>
        <span className={styles.tenantArrow}>▼</span>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        <div className={styles.navSection}>Principal</div>
        <div className={`${styles.navItem} ${styles.active}`}>Vue d'ensemble</div>
        <div className={styles.navItem}>
          Commandes
          <span className={styles.navBadge}>{orderCount}</span>
        </div>
        <div className={styles.navItem}>Expéditions</div>
        <div className={styles.navItem}>
          Stocks <span className={`${styles.navBadge} ${styles.green}`}>Alerte</span>
        </div>

        <div className={styles.navSection}>Gestion</div>
        <div className={styles.navItem}>Livreurs</div>
        <div className={styles.navItem}>Zones</div>
        <div className={styles.navItem}>Rapports</div>

        <div className={styles.navSection}>Configuration</div>
        <div className={styles.navItem}>Paramètres API</div>
      </nav>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>AS</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>Awalou Sadou</div>
            <div className={styles.userRole}>Administrateur</div>
          </div>
          <span className={styles.settingsIcon}>⚙</span>
        </div>
      </div>
    </aside>
  )
}
