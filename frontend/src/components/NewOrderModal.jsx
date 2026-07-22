import { useState } from 'react'
import styles from './NewOrderModal.module.css'

export default function NewOrderModal({ onClose, onSubmit }) {
  const [client,  setClient]  = useState('')
  const [montant, setMontant] = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!client.trim())         return setError('Le nom du client est requis.')
    if (!montant || isNaN(montant)) return setError('Montant invalide.')
    setError('')
    setLoading(true)
    try {
      await onSubmit(client.trim(), montant)
      onClose()
    } catch (e) {
      setError(e.message || 'Erreur lors de la création.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Nouvelle Commande</div>
          <button className={styles.close} onClick={onClose}>✕</button>
        </div>
        <div className={styles.body}>
          <label className={styles.label}>
            Nom complet du client
            <input
              className={styles.input}
              placeholder="Ex: Amadou Diallo"
              value={client}
              onChange={e => setClient(e.target.value)}
            />
          </label>
          <label className={styles.label}>
            Montant (XAF)
            <input
              className={styles.input}
              placeholder="Ex: 25000"
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
            />
          </label>
          {error && <div className={styles.error}>{error}</div>}
        </div>
        <div className={styles.footer}>
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Envoi...' : 'Créer la commande'}
          </button>
        </div>
      </div>
    </div>
  )
}
