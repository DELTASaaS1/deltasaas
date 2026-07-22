const express = require('express');
const router = express.Router();

// GET /api/dashboard/stats
// Retourne toutes les métriques de la page d'accueil
router.get('/stats', async (req, res) => {
  try {
    // TODO: remplacer par de vraies requêtes SQL/Prisma sur req.db
    // Exemple avec Prisma :
    // const [totalCommandes, totalCA, livraisonsEnCours, alertesStock] = await Promise.all([
    //   prisma.orders.count({ where: { company_id: req.companyId } }),
    //   prisma.orders.aggregate({ _sum: { total_amount: true }, where: { company_id: req.companyId, payment_status: 'paid' } }),
    //   prisma.deliveries.count({ where: { status: 'in_transit', order: { company_id: req.companyId } } }),
    //   prisma.products.count({ where: { company_id: req.companyId, stock_quantity: { lte: prisma.products.fields.stock_alert_threshold } } }),
    // ]);

    res.json({
      totalCommandes: 348,
      totalCA: 2847500,
      tauxLivraison: 94.2,
      alertesStock: 3,
      commandesEnCours: 47,
      valeurMoyenne: 8182,
      tendances: {
        commandes: +23.1,
        ca: +18.4,
        livraison: +9.7,
      },
      // Données pour le graphique (7 derniers jours)
      graphique: [
        { jour: '19/05', ca: 280000, commandes: 28 },
        { jour: '20/05', ca: 310000, commandes: 34 },
        { jour: '21/05', ca: 295000, commandes: 30 },
        { jour: '22/05', ca: 420000, commandes: 48 },
        { jour: '23/05', ca: 390000, commandes: 42 },
        { jour: '24/05', ca: 510000, commandes: 56 },
        { jour: '25/05', ca: 480000, commandes: 52 },
        { jour: '26/05', ca: 162500, commandes: 18 },
      ],
      paiements: [
        { mode: 'MTN MoMo', pct: 58, montant: 1651550 },
        { mode: 'Orange Money', pct: 28, montant: 797300 },
        { mode: 'Espèces', pct: 14, montant: 398650 },
      ],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
