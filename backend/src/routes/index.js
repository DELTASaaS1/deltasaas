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


// ─── Montage des nouveaux modules ──────────────────────────────────────────
router.use('/dashboard',  dashboardRoutes);
router.use('/commandes',  commandesRoutes);
router.use('/stock',      stockRoutes);
router.use('/livraisons', livraisonsRoutes);

module.exports = router;