const express = require('express');
const router = express.Router();

let livraisons = [
  { id: 'LIV-001', commande_id: 'ORD-2847', client: 'Moussa Nguema', adresse: 'Rue de la Liberté, Kribi Centre', zone: 'Centre', livreur: 'Paul Nkomo', statut: 'livré', code: '7429', montant: 12500, date: '2025-05-26T09:14:00', livré_le: '2025-05-26T11:30:00' },
  { id: 'LIV-002', commande_id: 'ORD-2846', client: 'Awa Bello', adresse: 'Av. du Bord de Mer, Kribi', zone: 'Plage', livreur: 'Jean Ateba', statut: 'en_transit', code: '3812', montant: 8900, date: '2025-05-26T08:52:00', livré_le: null },
  { id: 'LIV-003', commande_id: 'ORD-2841', client: 'Ibrahim Souley', adresse: 'Bassa Route Nationale', zone: 'Bassa', livreur: 'Jean Ateba', statut: 'en_transit', code: '2267', montant: 9800, date: '2025-05-25T13:05:00', livré_le: null },
  { id: 'LIV-004', commande_id: 'ORD-2844', client: 'Françoise Essomba', adresse: 'Quartier Nouveau, Kribi', zone: 'Centre', livreur: 'Paul Nkomo', statut: 'livré', code: '5521', montant: 6750, date: '2025-05-25T17:42:00', livré_le: '2025-05-25T19:10:00' },
  { id: 'LIV-005', commande_id: 'ORD-2842', client: 'Nadège Fokam', adresse: 'Cité des Palmiers, Kribi', zone: 'Centre', livreur: 'Paul Nkomo', statut: 'livré', code: '9134', montant: 15600, date: '2025-05-25T14:30:00', livré_le: '2025-05-25T16:45:00' },
];

const livreurs = [
  { id: 'D001', nom: 'Paul Nkomo', zone: 'Centre', tel: '+237 677 100 200', actif: true, livraisons_jour: 5, note: 4.8 },
  { id: 'D002', nom: 'Jean Ateba', zone: 'Bassa / Plage', tel: '+237 699 300 400', actif: true, livraisons_jour: 3, note: 4.5 },
  { id: 'D003', nom: 'Marc Essama', zone: 'Port', tel: '+237 655 500 600', actif: false, livraisons_jour: 0, note: 4.2 },
];

// GET /api/livraisons
router.get('/', (req, res) => {
  const { statut, zone, livreur_id } = req.query;
  let data = [...livraisons];
  if (statut) data = data.filter(l => l.statut === statut);
  if (zone) data = data.filter(l => l.zone === zone);
  res.json({ items: data, total: data.length, en_transit: livraisons.filter(l => l.statut === 'en_transit').length });
});

// GET /api/livraisons/livreurs
router.get('/livreurs', (req, res) => {
  res.json({ items: livreurs, total: livreurs.length, actifs: livreurs.filter(l => l.actif).length });
});

// PATCH /api/livraisons/:id/confirmer — confirmer livraison avec code
router.patch('/:id/confirmer', (req, res) => {
  const { code } = req.body;
  const idx = livraisons.findIndex(l => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Livraison introuvable' });
  if (livraisons[idx].code !== code) return res.status(400).json({ error: 'Code de confirmation incorrect' });
  livraisons[idx].statut = 'livré';
  livraisons[idx].livré_le = new Date().toISOString();
  res.json(livraisons[idx]);
});

module.exports = router;
