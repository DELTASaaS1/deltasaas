const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globaux ────────────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173' })); // URL Vite par défaut
app.use(express.json());

// ─── Routes ────────────────────────────────────────────────────────────────
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/commandes', require('./routes/commandes'));
app.use('/api/stock',     require('./routes/stock'));
app.use('/api/livraisons',require('./routes/livraisons'));

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/api/ping', (req, res) => res.json({ ok: true, ts: new Date() }));

// ─── 404 catch-all ─────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route inconnue : ${req.method} ${req.path}` }));

// ─── Démarrage ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Serveur DeltaSaaS démarré sur le port ${PORT}`);
});
