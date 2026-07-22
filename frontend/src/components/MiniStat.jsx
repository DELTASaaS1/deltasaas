import styles from './MiniStat.module.css'

export default function MiniStat({ value, label, color }) {
  return (
    <div className={styles.card}>
      <div className={styles.value} style={color ? { color: `var(--${color})` } : {}}>
        {value}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
