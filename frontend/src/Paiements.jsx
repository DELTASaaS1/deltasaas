import { useState } from 'react';
import { Badge, StatCard, Table, SearchBar, Tabs } from '../components/ui';

const MOCK_PAIEMENTS = [
  { id: 'PAY-9921', commande_id: 'ORD-2847', client: 'Moussa Nguema', mode: 'MTN MoMo', reference: 'MTN-2024-88291', montant: 12500, statut: 'Confirmé', date: '2025-05-26T09:14:00' },
  { id: 'PAY-9920', commande_id: 'ORD-2846', client: 'Awa Bello', mode: 'Orange Money', reference: 'OM-2024-77103', montant: 8900, statut: 'Confirmé', date: '2025-05-26T08:52:00' },
  { id: 'PAY-9919', commande_id: 'ORD-2845', client: 'Charles Kamga', mode: 'MTN MoMo', reference: 'MTN-2024-88190', montant: 24100, statut: 'En attente', date: '2025-05-26T08:30:00' },
  { id: 'PAY-9918', commande_id: 'ORD-2844', client: 'Françoise Essomba', mode: 'Espèces', reference: 'ESPÈCES', montant: 6750, statut: 'Confirmé', date: '2025-05-25T17:42:00' },
  { id: 'PAY-9917', commande_id: 'ORD-2843', client: 'Jacques Tchambi', mode: 'MTN MoMo', reference: 'MTN-2024-87901', montant: 3200, statut: 'Remboursé', date: '2025-05-25T16:15:00' },
  { id: 'PAY-9916', commande_id: 'ORD-2842', client: 'Nadège Fokam', mode: 'Orange Money', reference: 'OM-2024-76980', montant: 15600, statut: 'Confirmé', date: '2025-05-25T14:30:00' },
  { id: 'PAY-9915', commande_id: 'ORD-2841', client: 'Ibrahim Souley', mode: 'MTN MoMo', reference: 'MTN-2024-87800', montant: 9800, statut: 'Confirmé', date: '2025-05-25T13:05:00' },
  { id: 'PAY-9914', commande_id: 'ORD-2840', client: 'Brigitte Moah', mode: 'Orange Money', reference: 'OM-2024-76750', montant: 4500, statut: 'Confirmé', date: '2025-05-25T11:20:00' },
];

const TABS = [
  { value: '', label: 'Tous' },
  { value: 'Confirmé', label: 'Confirmés' },
  { value: 'En attente', label: 'En attente' },
  { value: 'Remboursé', label: 'Remboursés' },
];

const MODE_COLORS = { 'MTN MoMo': '#ffb830', 'Orange Money': '#ff7f50', Espèces: '#4f9eff' };
const MODE_LABELS = { 'MTN MoMo': 'MTN', 'Orange Money': 'OM', Espèces: 'ESP' };

export default function Paiements() {
  const [tab, setTab] = useState('');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PAIEMENTS.filter(p => {
    const matchTab = !tab || p.statut === tab;
    const matchSearch = !search || p.client.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const total = filtered.reduce((s, p) => s + (p.statut === 'Confirmé' ? p.montant : 0), 0);
  const enAttente = MOCK_PAIEMENTS.filter(p => p.statut === 'En attente').reduce((s, p) => s + p.montant, 0);

  const COLS = [
    { key: 'id', label: 'Référence', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#8b92a8' }}>{v}</span> },
    { key: 'commande_id', label: 'Commande', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4f9eff' }}>#{v}</span> },
    { key: 'client', label: 'Client' },
    {
      key: 'mode', label: 'Mode',
      render: v => (
        <span style={{ padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: `${MODE_COLORS[v]}22`, color: MODE_COLORS[v], border: `1px solid ${MODE_COLORS[v]}44` }}>
          {MODE_LABELS[v] || v}
        </span>
      )
    },
    { key: 'reference', label: 'Réf. opérateur', render: v => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#555e78' }}>{v}</span> },
    { key: 'montant', label: 'Montant', align: 'right', render: v => <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{v.toLocaleString('fr-FR')} XAF</span> },
    {
      key: 'statut', label: 'Statut',
      render: v => {
        const map = { Confirmé: 'Livrée', 'En attente': 'Préparation', Remboursé: 'Annulée' };
        return <Badge statut={map[v] || v} />;
      }
    },
    { key: 'date', label: 'Date', render: v => <span style={{ fontSize: 12, color: '#555e78' }}>{new Date(v).toLocaleString('fr-FR')}</span> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Volume encaissé (XAF)" value={2847500} change="+18.4% ce mois" color="#00e5a0" />
        <StatCard label="En attente" value={enAttente} change="À percevoir" color="#ffb830" changeType="neutral" />
        <StatCard label="Transactions" value={MOCK_PAIEMENTS.length} color="#4f9eff" />
        <StatCard label="Remboursements" value={1} change="3 200 XAF" color="#ff5a5a" changeType="down" />
      </div>

      {/* Répartition par mode */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {[
          { mode: 'MTN Mobile Money', pct: 58, montant: 1651550, icon: '📱' },
          { mode: 'Orange Money', pct: 28, montant: 797300, icon: '🟠' },
          { mode: 'Espèces', pct: 14, montant: 398650, icon: '💵' },
        ].map((p, i) => {
          const color = Object.values(MODE_COLORS)[i];
          return (
            <div key={i} style={{ background: '#12151c', border: `1px solid ${color}22`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{p.mode}</div>
                  <div style={{ fontSize: 11, color: '#555e78' }}>{p.pct}% des transactions</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 16, fontWeight: 700, color }}>{p.pct}%</span>
              </div>
              <div style={{ height: 5, background: '#1e2330', borderRadius: 4, marginBottom: 8 }}>
                <div style={{ height: '100%', width: `${p.pct}%`, background: color, borderRadius: 4 }} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, fontFamily: 'monospace', color }}>{p.montant.toLocaleString('fr-FR')} XAF</div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher paiement, client, référence…" />
      </div>

      {/* Tableau */}
      <div style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12, overflow: 'hidden' }}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <Table columns={COLS} data={filtered} />
        <div style={{ padding: '12px 16px', borderTop: '1px solid #ffffff0a', background: '#181c26', display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555e78' }}>
          <span>{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</span>
          <span>Total affiché : <strong style={{ color: '#00e5a0', fontFamily: 'monospace' }}>{total.toLocaleString('fr-FR')} XAF</strong></span>
        </div>
      </div>
    </div>
  );
}
