import styles from './OrdersTable.module.css'

const PILL_CLASS = {
  'livré':       'pill-livré',
  'en transit':  'pill-transit',
  'transit':     'pill-transit',
  'préparation': 'pill-préparation',
  'annulé':      'pill-annulé',
}

export default function OrdersTable({ orders = [], loading }) {
  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>Commandes récentes</div>
          <div className={styles.sub}>Flux de transactions en direct</div>
        </div>
        <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: '11px' }}>Voir tout</button>
      </div>
      <div className={styles.body}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Client</th>
              <th>Statut</th>
              <th>Montant</th>
            </tr>
          </thead>
          <tbody>
            {loading || !orders.length ? (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  {loading ? 'Chargement…' : 'En attente de connexion avec le serveur DeltaSaaS...'}
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const pillClass = PILL_CLASS[order.statut?.toLowerCase()] ?? ''
                return (
                  <tr key={order.id}>
                    <td><span className={styles.orderId}>{order.id}</span></td>
                    <td>
                      <div className={styles.customer}>
                        <div className={styles.cAvatar}
                          style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>
                          {order.initiales}
                        </div>
                        {order.client}
                      </div>
                    </td>
                    <td><span className={`status-pill ${pillClass}`}>{order.statut}</span></td>
                    <td><span className={styles.amount}>{order.montant} XAF</span></td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
