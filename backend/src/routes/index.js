const express = require('express');
const router = express.Router();

// ─── Sous-routeurs nouveaux modules ────────────────────────────────────────
const dashboardRoutes  = require('./dashboard');
const commandesRoutes  = require('./commandes');
const stockRoutes      = require('./stock');
const livraisonsRoutes = require('./livraisons');

// ─── Anciennes données existantes ──────────────────────────────────────────
let commandesRecentes = [
  { id: "#ORD-2847", client: "M. Nguema",  initiales: "MN", statut: "livré",       montant: "12 500" },
  { id: "#ORD-2846", client: "A. Bello",   initiales: "AB", statut: "transit",     montant: "8 900"  },
  { id: "#ORD-2845", client: "C. Kamga",   initiales: "CK", statut: "préparation", montant: "24 100" },
  { id: "#ORD-2844", client: "F. Essomba", initiales: "FE", statut: "livré",       montant: "6 750"  }
];

let chiffreAffaires = 2847500;
let totalCommandes  = 348;

// ─── Health check ──────────────────────────────────────────────────────────
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// ─── Ancienne route dashboard (conservée pour compatibilité) ───────────────
router.get('/dashboard/stats', (req, res) => {
  res.status(200).json({
    kpis: {
      ca_mensuel:     chiffreAffaires.toLocaleString('fr-FR'),
      commandes_mois: totalCommandes,
      taux_livraison: "94.2%",
      alertes_stock:  3
    },
    commandes_recentes: commandesRecentes
  });
});

router.post('/dashboard/commandes', (req, res) => {
  const { client, montant } = req.body;
  if (!client || !montant) {
    return res.status(400).json({ error: "Le nom du client et le montant sont obligatoires." });
  }
  const nouvelId  = `#ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const initiales = client.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const nouvelleCommande = {
    id: nouvelId, client, initiales: initiales || "CL",
    statut: "préparation", montant: parseInt(montant).toLocaleString('fr-FR')
  };
  commandesRecentes.unshift(nouvelleCommande);
  chiffreAffaires += parseInt(montant);
  totalCommandes  += 1;
  res.status(201).json({ message: "Commande ajoutée avec succès !", commande: nouvelleCommande });
});

// ─── Montage des nouveaux modules ──────────────────────────────────────────
router.use('/dashboard',  dashboardRoutes);
router.use('/commandes',  commandesRoutes);
router.use('/stock',      stockRoutes);
router.use('/livraisons', livraisonsRoutes);

module.exports = router;