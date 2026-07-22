import { useState } from 'react'
import styles from './AssistantPanel.module.css'

export default function AssistantPanel() {
  const [prompt, setPrompt] = useState('')

  function handleSend() {
    if (!prompt.trim()) return
    alert(`Assistant DeltaIntelligence :\nCommande reçue : "${prompt}"`)
    setPrompt('')
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <div>
          <div className={styles.title}>Assistant DeltaIntelligence</div>
          <div className={styles.sub}>Commandes vocales ou textuelles</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.tip}>
          💡 <strong>Raccourcis rapides :</strong> Cliquez sur n'importe quel élément ou graphique du tableau de bord pour demander une analyse automatisée ou générer un rapport instantané.
        </div>
        <div className={styles.spacer} />
        <div className={styles.inputZone}>
          <input
            className={styles.input}
            placeholder="Ex: Assigner le livreur Bello à la commande #ORD-2845..."
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleSend}>
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}
