import styles from './StatusBar.module.css'

export default function StatusBar({ apiOnline }) {
  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <div className={`${styles.dot} ${apiOnline ? styles.green : styles.red} live-dot`} />
        {apiOnline ? 'API Opérationnelle' : 'API Déconnectée'}
      </div>
      <div className={styles.sep} />
      <div className={styles.item}>
        <div className={`${styles.dot} ${styles.green}`} />
        Base de données : <span className={styles.val}>Connectée</span>
      </div>
      <div className={styles.sep} />
      <div className={styles.item}>
        <div className={`${styles.dot} ${styles.green}`} />
        Passerelle SMS : <span className={styles.val}>Prête</span>
      </div>
      <div className={styles.version}>v1.0.0-pro</div>
    </div>
  )
}
