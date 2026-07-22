# DeltaSaaS — Guide de mise en place React

## Structure finale du projet

```
deltasaas/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js          ← Point d'entrée (Express + routes)
│       └── routes/
│           ├── dashboard.js   ← GET /api/dashboard/stats
│           ├── commandes.js   ← GET/POST/PATCH /api/commandes
│           ├── stock.js       ← GET/POST /api/stock/produits + mouvements
│           └── livraisons.js  ← GET/PATCH /api/livraisons
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx           ← Point d'entrée React
        ├── App.jsx            ← Routes React Router
        ├── api/
        │   └── client.js      ← Axios centralisé
        ├── components/
        │   ├── Layout.jsx     ← Sidebar + Topbar
        │   └── ui.jsx         ← Badge, Table, Modal, Btn, StatCard…
        └── pages/
            ├── Dashboard.jsx
            ├── Commandes.jsx
            ├── Stock.jsx
            ├── Livraisons.jsx
            └── Paiements.jsx
```

---

## Étapes d'installation

### 1. Backend

```bash
cd backend
npm install          # installe express, cors, nodemon
npm run dev          # démarre avec hot-reload sur le port 3000
```

Vérifier que ça marche :
```
http://localhost:3000/api/ping          → { ok: true }
http://localhost:3000/api/dashboard/stats
http://localhost:3000/api/commandes
```

### 2. Frontend

```bash
cd frontend
npm install          # installe react, react-dom, react-router-dom, axios, vite
npm run dev          # démarre sur http://localhost:5173
```

Ouvre **http://localhost:5173** dans le navigateur → tu vois le dashboard.

---

## Ce que fait chaque fichier

| Fichier | Rôle |
|---------|------|
| `api/client.js` | Client Axios avec baseURL, JWT interceptor, et toutes les fonctions d'appel API |
| `components/Layout.jsx` | Sidebar avec navigation React Router + Topbar sticky |
| `components/ui.jsx` | Composants réutilisables : Badge, StatCard, Table, Tabs, Modal, Btn, Field |
| `pages/Dashboard.jsx` | Appelle `/api/dashboard/stats`, affiche KPIs + graphique SVG |
| `pages/Commandes.jsx` | Appelle `/api/commandes`, filtre/recherche, détail + changement de statut |
| `pages/Stock.jsx` | Appelle `/api/stock/produits` + `/mouvements`, ajustement de stock |
| `pages/Livraisons.jsx` | Appelle `/api/livraisons`, livreurs, confirmation par code |
| `pages/Paiements.jsx` | Affiche paiements MTN/Orange/Espèces avec stats |

---

## Flux de données typique

```
Utilisateur clique "Commandes"
    → React Router charge <Commandes />
    → useEffect appelle getCommandes() dans api/client.js
    → Axios GET http://localhost:3000/api/commandes
    → backend/routes/commandes.js retourne les données
    → React setState → re-render du tableau
```

---

## Connecter une vraie base de données (Prisma)

Dans chaque route backend, remplace les tableaux mock par des requêtes Prisma :

```js
// Au lieu de :
res.json({ items: commandes });

// Avec Prisma :
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const items = await prisma.orders.findMany({
  where: { company_id: req.companyId },
  orderBy: { created_at: 'desc' },
  take: 12,
});
res.json({ items, total: await prisma.orders.count() });
```

---

## Prochaines étapes suggérées

1. **Authentification** — Ajouter `POST /api/auth/login` qui retourne un JWT, stocker dans localStorage, l'intercepteur Axios l'envoie automatiquement
2. **Prisma** — Remplacer les mocks par de vraies requêtes SQL (schéma déjà défini dans `packages/db/prisma/schema.prisma`)
3. **Module Analytics** — Graphiques Recharts avec données réelles
4. **Notifications temps réel** — WebSocket ou SSE pour les alertes stock
5. **PWA** — Ajouter un manifest pour une installation mobile

---

## Commandes utiles

```bash
# Lancer les deux en parallèle (depuis la racine)
cd backend && npm run dev &
cd frontend && npm run dev

# Ou avec un outil comme concurrently :
npm install -g concurrently
concurrently "cd backend && npm run dev" "cd frontend && npm run dev"
```
