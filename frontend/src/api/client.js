import axios from 'axios';

// Utilise le proxy Vite (/api -> backend) en dev : baseURL relative,
// donc aucune requête ne quitte jamais l'origine du navigateur → plus de CORS,
// et ça marche peu importe le port sur lequel Vite démarre (5173, 5174…).
// Surchargeable via VITE_API_URL si besoin (ex. build de prod pointant vers une vraie API).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur requête — ajoute le token JWT si présent
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('delta_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Intercepteur réponse — gestion centralisée des erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('delta_token');
      window.location.href = '/login';
    }
    // Marque distinctement "backend injoignable" (réseau/CORS/port) vs une vraie erreur API,
    // pour que les pages puissent afficher un message pertinent au lieu d'un écran vide.
    if (!err.response) {
      err.isBackendDown = true;
    }
    return Promise.reject(err);
  }
);

// ─── Appels Dashboard ──────────────────────────────────────────────────────
export const getDashboardStats = () => api.get('/dashboard/stats').then(r => r.data);

// ─── Appels Commandes ──────────────────────────────────────────────────────
export const getCommandes = (params = {}) => api.get('/commandes', { params }).then(r => r.data);
export const getCommande  = (id) => api.get(`/commandes/${id}`).then(r => r.data);
export const createCommande = (data) => api.post('/commandes', data).then(r => r.data);
export const updateStatut = (id, statut) => api.patch(`/commandes/${id}/statut`, { statut }).then(r => r.data);
export const assignerLivreur = (id, livreur) => api.patch(`/commandes/${id}/livreur`, { livreur }).then(r => r.data);

// ─── Appels Stock ──────────────────────────────────────────────────────────
export const getProduits   = (params = {}) => api.get('/stock/produits', { params }).then(r => r.data);
export const getMouvements = (params = {}) => api.get('/stock/mouvements', { params }).then(r => r.data);
export const ajusterStock  = (data) => api.post('/stock/ajustement', data).then(r => r.data);
export const createProduit = (data) => api.post('/stock/produits', data).then(r => r.data);

// ─── Appels Livraisons ─────────────────────────────────────────────────────
export const getLivraisons = (params = {}) => api.get('/livraisons', { params }).then(r => r.data);
export const getLivreurs   = () => api.get('/livraisons/livreurs').then(r => r.data);
export const createLivreur = (data) => api.post('/livraisons/livreurs', data).then(r => r.data);
export const updateLivreur = (id, data) => api.patch(`/livraisons/livreurs/${id}`, data).then(r => r.data);
export const confirmerLivraison = (id, code) => api.patch(`/livraisons/${id}/confirmer`, { code }).then(r => r.data);

// ─── Appels Zones ──────────────────────────────────────────────────────────
export const getZones   = () => api.get('/zones').then(r => r.data);
export const createZone = (data) => api.post('/zones', data).then(r => r.data);
export const updateZone = (id, data) => api.patch(`/zones/${id}`, data).then(r => r.data);
export const deleteZone = (id) => api.delete(`/zones/${id}`).then(r => r.data);

export default api;
