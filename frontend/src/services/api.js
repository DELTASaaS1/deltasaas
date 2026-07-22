const BASE = '/api/v1'

export async function checkHealth() {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) throw new Error('API indisponible')
}

export async function getDashboardStats() {
  const res = await fetch(`${BASE}/dashboard/stats`)
  if (!res.ok) throw new Error('Stats indisponibles')
  return res.json()
}

export async function createCommande(client, montant) {
  const res = await fetch(`${BASE}/dashboard/commandes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client, montant: Number(montant) })
  })
  if (!res.ok) throw new Error('Création de commande échouée')
  return res.json()
}
