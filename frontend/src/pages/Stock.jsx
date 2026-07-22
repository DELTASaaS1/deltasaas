import { useState, useEffect, useCallback } from 'react';
import { getProduits, getMouvements, ajusterStock } from '../api/client';
import { Badge, Table, SearchBar, StatCard, Modal, Btn, Field, inputStyle } from '../components/ui';

export default function Stock() {
  const [produits, setProduits] = useState([]);
  const [mouvements, setMouvements] = useState([]);
  const [alertes, setAlertes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filtreAlerte, setFiltreAlerte] = useState(false);
  const [selected, setSelected] = useState(null);
  const [modalAjust, setModalAjust] = useState(false);
  const [ajustQte, setAjustQte] = useState('');
  const [ajustRaison, setAjustRaison] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [p, m] = await Promise.all([
        getProduits({ alerte: filtreAlerte ? 'true' : undefined, q: search || undefined }),
        getMouvements(),
      ]);
      setProduits(p.items);
      setAlertes(p.alertes);
      setMouvements(m.items.slice(0, 20));
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, filtreAlerte]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const handleAjustement = async () => {
    if (!ajustQte || !selected) return;
    setSaving(true);
    try {
      const res = await ajusterStock({ produit_id: selected.id, qte: Number(ajustQte), raison: ajustRaison });
      setProduits(prev => prev.map(p => p.id === selected.id ? res.produit : p));
      setMouvements(prev => [res.mouvement, ...prev]);
      setSelected(res.produit);
      setModalAjust(false);
      setAjustQte('');
      setAjustRaison('');
    } finally { setSaving(false); }
  };

  const stockBadge = (stock, seuil) => {
    if (stock <= seuil) return <Badge statut="Critique" />;
    if (stock <= seuil * 2) return <Badge statut="Préparation" />;
    return <Badge statut="Normal" />;
  };

  const COLS = [
    { key: 'nom', label: 'Produit', render: (v, row) => (
      <div>
        <div style={{ fontWeight: 500 }}>{v}</div>
        <div style={{ fontSize: 11, color: '#94A3B8', fontFamily: 'monospace', marginTop: 2 }}>{row.sku}</div>
      </div>
    )},
    { key: 'categorie', label: 'Catégorie', render: v => <span style={{ fontSize: 11, padding: '2px 7px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 6, color: '#475569' }}>{v}</span> },
    { key: 'prix', label: 'Prix', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12 }}>{v.toLocaleString('fr-FR')} XAF</span> },
    { key: 'stock', label: 'Stock', render: (v, row) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: '#E5E7EB', borderRadius: 4, minWidth: 60 }}>
          <div style={{ height: '100%', borderRadius: 4, background: v <= row.seuil_alerte ? '#ff5a5a' : v <= row.seuil_alerte * 2 ? '#ffb830' : '#00e5a0', width: `${Math.min(100, (v / (row.seuil_alerte * 4)) * 100)}%` }} />
        </div>
        <span style={{ fontFamily: 'monospace', fontWeight: 600, minWidth: 24, textAlign: 'right', color: v <= row.seuil_alerte ? '#ff5a5a' : '#0F172A' }}>{v}</span>
      </div>
    )},
    { key: 'stock', label: 'Statut', render: (v, row) => stockBadge(v, row.seuil_alerte) },
    { key: '_actions', label: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
        <Btn style={{ padding: '5px 8px', fontSize: 13 }} onClick={() => { setSelected(row); setModalAjust(true); }}>± Ajuster</Btn>
      </div>
    )},
  ];

  const COLS_MVT = [
    { key: 'produit_nom', label: 'Produit' },
    { key: 'type', label: 'Type', render: v => <Badge statut={v === 'réappro' ? 'Normal' : v === 'vente' ? 'Livrée' : 'Préparation'} /> },
    { key: 'qte', label: 'Variation', render: v => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: v > 0 ? '#00e5a0' : '#ff5a5a' }}>{v > 0 ? '+' : ''}{v}</span> },
    { key: 'stock_apres', label: 'Stock après', render: v => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
    { key: 'raison', label: 'Raison' },
    { key: 'date', label: 'Date', render: v => new Date(v).toLocaleString('fr-FR') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Produits actifs" value={produits.length} change="8 catégories" color="#0F172A" />
        <StatCard label="Alertes stock" value={alertes} change="Réapprovisionnement requis" color="#ff5a5a" changeType="down" />
        <StatCard label="Valeur du stock" value={produits.reduce((s, p) => s + p.stock * p.prix, 0)} change="XAF estimé" color="#4f9eff" />
        <StatCard label="Mouvements (30j)" value={mouvements.length} change="+12%" />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher produit, SKU…" />
        <button
          onClick={() => setFiltreAlerte(v => !v)}
          style={{ padding: '7px 13px', border: `1px solid ${filtreAlerte ? '#ff5a5a44' : '#D1D5DB'}`, borderRadius: 8, background: filtreAlerte ? '#ff5a5a15' : 'transparent', color: filtreAlerte ? '#ff5a5a' : '#475569', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          🔴 {filtreAlerte ? 'Alertes seulement' : 'Toutes les alertes'}
        </button>
      </div>

      {/* Tableau produits */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: '#475569' }}>Inventaire produits</div>
        <Table columns={COLS} data={produits} loading={loading} onRowClick={setSelected} />
      </div>

      {/* Historique mouvements */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10, color: '#475569' }}>Historique des mouvements</div>
        <Table columns={COLS_MVT} data={mouvements} loading={loading} />
      </div>

      {/* Modal ajustement stock */}
      <Modal open={modalAjust} onClose={() => setModalAjust(false)} title={`Ajuster le stock — ${selected?.nom}`}>
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 8, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#475569' }}>Stock actuel</span>
          <span style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: 16 }}>{selected?.stock} unités</span>
        </div>
        <Field label="Variation de stock (ex: +50 ou -10)">
          <input type="number" value={ajustQte} onChange={e => setAjustQte(e.target.value)} placeholder="+50" style={{ ...inputStyle }} />
        </Field>
        <Field label="Raison">
          <input value={ajustRaison} onChange={e => setAjustRaison(e.target.value)} placeholder="Livraison fournisseur, correction inventaire…" style={{ ...inputStyle }} />
        </Field>
        {ajustQte && (
          <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: 8, marginBottom: 14, fontSize: 13 }}>
            Nouveau stock : <strong style={{ fontFamily: 'monospace', color: '#00e5a0' }}>{(selected?.stock || 0) + Number(ajustQte)} unités</strong>
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setModalAjust(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={handleAjustement} disabled={!ajustQte || saving}>
            {saving ? 'Enregistrement…' : '✓ Confirmer l\'ajustement'}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
