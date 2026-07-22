import styles from './KpiCard.module.css'

const SPARKLINE_PATHS = {
  green:  "M0,25 Q15,10 30,18 T60,8 T90,12 L100,5",
  blue:   "M0,20 Q20,22 40,12 T70,15 T100,8",
  amber:  "M0,15 Q25,12 50,14 T75,9 T100,5",
  red:    "M0,5 Q30,8 60,22 T100,25",
}

const SPARKLINE_COLORS = {
  green: 'var(--green)',
  blue:  'var(--blue)',
  amber: 'var(--amber)',
  red:   'var(--red)',
}

export default function KpiCard({ icon, value, label, trend, trendUp, color = 'green' }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.icon} ${styles[color]}`}>{icon}</div>
        <div className={`${styles.trend} ${trendUp ? styles.up : styles.down}`}>{trend}</div>
      </div>
      <div className={styles.value}>{value ?? '—'}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.sparkline}>
        <svg viewBox="0 0 100 30" preserveAspectRatio="none">
          <path
            d={SPARKLINE_PATHS[color]}
            fill="none"
            stroke={SPARKLINE_COLORS[color]}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
