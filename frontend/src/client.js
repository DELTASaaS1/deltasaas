import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
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
export const confirmerLivraison = (id, code) => api.patch(`/livraisons/${id}/confirmer`, { code }).then(r => r.data);

export default api;
