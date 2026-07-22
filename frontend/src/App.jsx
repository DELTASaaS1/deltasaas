import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard  from './pages/Dashboard';
import Commandes  from './pages/Commandes';
import Stock      from './pages/Stock';
import Livraisons from './pages/Livraisons';
import Paiements  from './pages/Paiements';
import Produits   from './pages/Produits';
import Analytics  from './pages/Analytics';
import Zones      from './pages/Zones';
import Equipe     from './pages/Equipe';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/commandes"  element={<Commandes />} />
          <Route path="/stock"      element={<Stock />} />
          <Route path="/livraisons" element={<Livraisons />} />
          <Route path="/paiements"  element={<Paiements />} />
          <Route path="/produits"   element={<Produits />} />
          <Route path="/analytics"  element={<Analytics />} />
          <Route path="/zones"      element={<Zones />} />
          <Route path="/equipe"     element={<Equipe />} />
          <Route path="*"           element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
