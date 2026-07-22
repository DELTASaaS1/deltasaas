const express = require('express');
const router = express.Router();

let produits = [
  { id: 'P001', nom: 'Huile de palme 5L', sku: 'HP-5L-001', categorie: 'Alimentaire', prix: 5000, stock: 3, seuil_alerte: 10, actif: true },
  { id: 'P002', nom: 'Riz parfumé 25kg', sku: 'RIZ-25K-002', categorie: 'Alimentaire', prix: 8400, stock: 24, seuil_alerte: 5, actif: true },
  { id: 'P003', nom: 'Farine de manioc 1kg', sku: 'FAR-1K-004', categorie: 'Alimentaire', prix: 1150, stock: 8, seuil_alerte: 15, actif: true },
  { id: 'P004', nom: 'Poisson fumé 500g', sku: 'POI-500-005', categorie: 'Alimentaire', prix: 800, stock: 4, seuil_alerte: 10, actif: true },
  { id: 'P005', nom: 'Sucre en poudre 2kg', sku: 'SUC-2K-003', categorie: 'Alimentaire', prix: 2000, stock: 31, seuil_alerte: 8, actif: true },
  { id: 'P006', nom: 'Savon de Marseille 400g', sku: 'SAV-400-006', categorie: 'Hygiène', prix: 350, stock: 60, seuil_alerte: 20, actif: true },
  { id: 'P007', nom: 'Lait en poudre 400g', sku: 'LAI-400-007', categorie: 'Alimentaire', prix: 2800, stock: 18, seuil_alerte: 5, actif: true },
  { id: 'P008', nom: 'Bougie longue durée x10', sku: 'BOU-X10-008', categorie: 'Maison', prix: 600, stock: 45, seuil_alerte: 10, actif: true },
];

let mouvements = [
  { id: 'M001', produit_id: 'P001', produit_nom: 'Huile de palme 5L', type: 'vente', qte: -2, stock_apres: 3, raison: 'Commande ORD-2847', date: '2025-05-26T09:14:00' },
  { id: 'M002', produit_id: 'P002', produit_nom: 'Riz parfumé 25kg', type: 'vente', qte: -1, stock_apres: 24, raison: 'Commande ORD-2846', date: '2025-05-26T08:52:00' },
  { id: 'M003', produit_id: 'P001', produit_nom: 'Huile de palme 5L', type: 'réappro', qte: +50, stock_apres: 53, raison: 'Livraison fournisseur', date: '2025-05-24T10:00:00' },
  { id: 'M004', produit_id: 'P003', produit_nom: 'Farine de manioc 1kg', type: 'vente', qte: -5, stock_apres: 8, raison: 'Commande ORD-2844', date: '2025-05-25T17:42:00' },
  { id: 'M005', produit_id: 'P004', produit_nom: 'Poisson fumé 500g', type: 'vente', qte: -4, stock_apres: 4, raison: 'Commande ORD-2843', date: '2025-05-25T16:15:00' },
  { id: 'M006', produit_id: 'P005', produit_nom: 'Sucre en poudre 2kg', type: 'ajustement', qte: -2, stock_apres: 31, raison: 'Correction inventaire', date: '2025-05-23T09:00:00' },
];

// GET /api/stock/produits — liste produits avec filtre alerte
router.get('/produits', (req, res) => {
  const { alerte, categorie, q } = req.query;
  let data = [...produits];
  if (alerte === 'true') data = data.filter(p => p.stock <= p.seuil_alerte);
  if (categorie) data = data.filter(p => p.categorie === categorie);
  if (q) data = data.filter(p => p.nom.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase()));
  res.json({ items: data, total: data.length, alertes: produits.filter(p => p.stock <= p.seuil_alerte).length });
});

// GET /api/stock/mouvements — historique
router.get('/mouvements', (req, res) => {
  const { produit_id } = req.query;
  let data = produit_id ? mouvements.filter(m => m.produit_id === produit_id) : mouvements;
  res.json({ items: data.sort((a, b) => new Date(b.date) - new Date(a.date)), total: data.length });
});

// POST /api/stock/ajustement — ajuster le stock manuellement
router.post('/ajustement', (req, res) => {
  const { produit_id, qte, raison } = req.body;
  const idx = produits.findIndex(p => p.id === produit_id);
  if (idx === -1) return res.status(404).json({ error: 'Produit introuvable' });
  produits[idx].stock += Number(qte);
  const mouvement = {
    id: `M${Date.now()}`,
    produit_id,
    produit_nom: produits[idx].nom,
    type: qte > 0 ? 'réappro' : 'ajustement',
    qte: Number(qte),
    stock_apres: produits[idx].stock,
    raison: raison || 'Ajustement manuel',
    date: new Date().toISOString(),
  };
  mouvements.unshift(mouvement);
  res.json({ produit: produits[idx], mouvement });
});

// POST /api/stock/produits — créer un produit
router.post('/produits', (req, res) => {
  const { nom, sku, categorie, prix, stock, seuil_alerte } = req.body;
  if (!nom || !sku) return res.status(400).json({ error: 'nom et sku requis' });
  const nouveau = { id: `P${Date.now()}`, nom, sku, categorie: categorie || 'Divers', prix: Number(prix) || 0, stock: Number(stock) || 0, seuil_alerte: Number(seuil_alerte) || 5, actif: true };
  produits.push(nouveau);
  res.status(201).json(nouveau);
});

module.exports = router;
