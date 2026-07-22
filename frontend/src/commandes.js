const express = require('express');
const router = express.Router();

// Données mock — à remplacer par Prisma/SQL
const STATUTS = ['Confirmée', 'Préparation', 'Transit', 'Livrée', 'Annulée'];

let commandes = [
  { id: 'ORD-2847', client_nom: 'Moussa Nguema', client_tel: '+237 677 001 234', statut: 'Livrée', zone: 'Centre', paiement: 'MTN MoMo', montant: 12500, date: '2025-05-26T09:14:00', adresse: 'Rue de la Liberté, Kribi Centre', ref_paiement: 'MTN-2024-88291', livreur: 'Paul Nkomo', code_confirmation: '7429', frais_livraison: 500, articles: [{ nom: 'Huile de palme 5L', sku: 'HP-5L-001', qte: 2, prix: 5000 }, { nom: 'Sucre 2kg', sku: 'SUC-2K-003', qte: 1, prix: 2000 }] },
  { id: 'ORD-2846', client_nom: 'Awa Bello', client_tel: '+237 699 334 521', statut: 'Transit', zone: 'Plage', paiement: 'Orange Money', montant: 8900, date: '2025-05-26T08:52:00', adresse: 'Av. du Bord de Mer, Kribi', ref_paiement: 'OM-2024-77103', livreur: 'Jean Ateba', code_confirmation: '3812', frais_livraison: 500, articles: [{ nom: 'Riz parfumé 25kg', sku: 'RIZ-25K-002', qte: 1, prix: 8400 }] },
  { id: 'ORD-2845', client_nom: 'Charles Kamga', client_tel: '+237 655 788 902', statut: 'Préparation', zone: 'Bassa', paiement: 'MTN MoMo', montant: 24100, date: '2025-05-26T08:30:00', adresse: 'Quartier Bassa, Rue 12', ref_paiement: 'MTN-2024-88190', livreur: null, code_confirmation: null, frais_livraison: 800, articles: [{ nom: 'Riz parfumé 25kg', sku: 'RIZ-25K-002', qte: 2, prix: 8400 }, { nom: 'Huile de palme 5L', sku: 'HP-5L-001', qte: 1, prix: 5000 }, { nom: 'Farine de manioc 1kg', sku: 'FAR-1K-004', qte: 2, prix: 1150 }] },
  { id: 'ORD-2844', client_nom: 'Françoise Essomba', client_tel: '+237 677 445 008', statut: 'Livrée', zone: 'Centre', paiement: 'Espèces', montant: 6750, date: '2025-05-25T17:42:00', adresse: 'Quartier Nouveau, Kribi', ref_paiement: 'ESPÈCES', livreur: 'Paul Nkomo', code_confirmation: '5521', frais_livraison: 500, articles: [{ nom: 'Farine de manioc 1kg', sku: 'FAR-1K-004', qte: 5, prix: 1150 }, { nom: 'Sucre 2kg', sku: 'SUC-2K-003', qte: 1, prix: 2000 }] },
  { id: 'ORD-2843', client_nom: 'Jacques Tchambi', client_tel: '+237 695 221 774', statut: 'Annulée', zone: 'Port', paiement: 'MTN MoMo', montant: 3200, date: '2025-05-25T16:15:00', adresse: 'Zone Portuaire, Kribi', ref_paiement: 'MTN-2024-87901', livreur: null, code_confirmation: null, frais_livraison: 600, articles: [{ nom: 'Poisson fumé 500g', sku: 'POI-500-005', qte: 4, prix: 800 }] },
  { id: 'ORD-2842', client_nom: 'Nadège Fokam', client_tel: '+237 677 990 123', statut: 'Livrée', zone: 'Centre', paiement: 'Orange Money', montant: 15600, date: '2025-05-25T14:30:00', adresse: 'Cité des Palmiers, Kribi', ref_paiement: 'OM-2024-76980', livreur: 'Paul Nkomo', code_confirmation: '9134', frais_livraison: 500, articles: [{ nom: 'Huile de palme 5L', sku: 'HP-5L-001', qte: 3, prix: 5000 }] },
  { id: 'ORD-2841', client_nom: 'Ibrahim Souley', client_tel: '+237 699 001 447', statut: 'Transit', zone: 'Bassa', paiement: 'MTN MoMo', montant: 9800, date: '2025-05-25T13:05:00', adresse: 'Bassa Route Nationale', ref_paiement: 'MTN-2024-87800', livreur: 'Jean Ateba', code_confirmation: '2267', frais_livraison: 800, articles: [{ nom: 'Riz parfumé 25kg', sku: 'RIZ-25K-002', qte: 1, prix: 8400 }, { nom: 'Poisson fumé 500g', sku: 'POI-500-005', qte: 1, prix: 800 }] },
  { id: 'ORD-2840', client_nom: 'Brigitte Moah', client_tel: '+237 677 554 321', statut: 'Livrée', zone: 'Centre', paiement: 'Orange Money', montant: 4500, date: '2025-05-25T11:20:00', adresse: "Rue de l'Hôtel, Kribi", ref_paiement: 'OM-2024-76750', livreur: 'Paul Nkomo', code_confirmation: '8803', frais_livraison: 500, articles: [{ nom: 'Farine de manioc 1kg', sku: 'FAR-1K-004', qte: 2, prix: 1150 }, { nom: 'Sucre 2kg', sku: 'SUC-2K-003', qte: 1, prix: 2000 }] },
  { id: 'ORD-2839', client_nom: 'Didier Nanga', client_tel: '+237 655 112 008', statut: 'Confirmée', zone: 'Plage', paiement: 'MTN MoMo', montant: 11200, date: '2025-05-25T10:44:00', adresse: 'Résidence Balnéaire, Kribi', ref_paiement: 'MTN-2024-87600', livreur: null, code_confirmation: null, frais_livraison: 500, articles: [{ nom: 'Huile de palme 5L', sku: 'HP-5L-001', qte: 2, prix: 5000 }] },
  { id: 'ORD-2838', client_nom: 'Sylvie Atanga', client_tel: '+237 699 774 009', statut: 'Confirmée', zone: 'Port', paiement: 'Espèces', montant: 5600, date: '2025-05-25T06:10:00', adresse: 'Rue du Port, Kribi', ref_paiement: 'ESPÈCES', livreur: null, code_confirmation: null, frais_livraison: 600, articles: [{ nom: 'Poisson fumé 500g', sku: 'POI-500-005', qte: 6, prix: 800 }] },
];

// GET /api/commandes — liste avec filtres
router.get('/', (req, res) => {
  const { statut, zone, q, page = 1, limit = 12 } = req.query;
  let data = [...commandes];

  if (statut && statut !== 'Toutes') data = data.filter(c => c.statut === statut);
  if (zone) data = data.filter(c => c.zone === zone);
  if (q) {
    const term = q.toLowerCase();
    data = data.filter(c =>
      c.id.toLowerCase().includes(term) ||
      c.client_nom.toLowerCase().includes(term) ||
      c.client_tel.includes(term)
    );
  }

  const total = data.length;
  const start = (page - 1) * limit;
  const items = data.slice(start, start + Number(limit));

  res.json({ items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) });
});

// GET /api/commandes/:id — détail d'une commande
router.get('/:id', (req, res) => {
  const cmd = commandes.find(c => c.id === req.params.id);
  if (!cmd) return res.status(404).json({ error: 'Commande introuvable' });
  res.json(cmd);
});

// POST /api/commandes — créer une commande
router.post('/', (req, res) => {
  const { client_nom, client_tel, adresse, zone, paiement, articles, frais_livraison } = req.body;
  if (!client_nom || !articles?.length) {
    return res.status(400).json({ error: 'client_nom et articles sont requis' });
  }
  const montant = articles.reduce((s, a) => s + a.qte * a.prix, 0) + (frais_livraison || 0);
  const num = `ORD-${2848 + commandes.length}`;
  const nouvelle = {
    id: num, client_nom, client_tel, adresse, zone, paiement,
    montant, frais_livraison: frais_livraison || 500,
    statut: 'Confirmée', livreur: null, code_confirmation: null,
    ref_paiement: paiement === 'MTN MoMo' ? `MTN-2024-${Math.floor(Math.random()*99999)}` : `OM-2024-${Math.floor(Math.random()*99999)}`,
    date: new Date().toISOString(), articles,
  };
  commandes.unshift(nouvelle);
  res.status(201).json(nouvelle);
});

// PATCH /api/commandes/:id/statut — changer le statut
router.patch('/:id/statut', (req, res) => {
  const { statut } = req.body;
  if (!STATUTS.includes(statut)) return res.status(400).json({ error: 'Statut invalide' });
  const idx = commandes.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Commande introuvable' });
  commandes[idx].statut = statut;
  // Générer code de confirmation si livraison
  if (statut === 'Livrée' && !commandes[idx].code_confirmation) {
    commandes[idx].code_confirmation = String(Math.floor(1000 + Math.random() * 9000));
  }
  res.json(commandes[idx]);
});

// PATCH /api/commandes/:id/livreur — assigner un livreur
router.patch('/:id/livreur', (req, res) => {
  const { livreur } = req.body;
  const idx = commandes.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Commande introuvable' });
  commandes[idx].livreur = livreur;
  commandes[idx].statut = 'Transit';
  res.json(commandes[idx]);
});

module.exports = router;
