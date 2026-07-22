import styles from './Topbar.module.css'

export default function Topbar({ onNewOrder }) {
  return (
    <div className={styles.topbar}>
      <div>
        <div className={styles.title}>Vue d'ensemble</div>
        <div className={styles.sub}>Suivi opérationnel en temps réel</div>
      </div>
      <div className={styles.actions}>
        <button className="btn btn-ghost">Export CSV</button>
        <button className="btn btn-primary" onClick={onNewOrder}>+ Nouvelle Commande</button>
        <div className={styles.notifBtn}>
          <span>🔔</span>
          <div className={styles.notifDot} />
        </div>
      </div>
    </div>
  )
}
