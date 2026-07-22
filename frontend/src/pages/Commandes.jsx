import { useState, useEffect, useCallback } from 'react';
import { getCommandes, updateStatut, assignerLivreur, createCommande, getProduits, getZones } from '../api/client';
import { Badge, Table, SearchBar, Tabs, Modal, Btn, StatCard, Field, inputStyle } from '../components/ui';

const TABS = [
  { value: '', label: 'Toutes', count: 348 },
  { value: 'Confirmée', label: 'Confirmées', count: 28 },
  { value: 'Préparation', label: 'Préparation', count: 7 },
  { value: 'Transit', label: 'En transit', count: 12 },
  { value: 'Livrée', label: 'Livrées', count: 289 },
  { value: 'Annulée', label: 'Annulées', count: 12 },
];

const LIVREURS = ['Paul Nkomo', 'Jean Ateba', 'Marc Essama'];
const MODES_PAIEMENT = ['MTN MoMo', 'Orange Money', 'Espèces'];

export default function Commandes() {
  const [commandes, setCommandes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalLivreur, setModalLivreur] = useState(false);
  const [livreurChoix, setLivreurChoix] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Nouvelle commande ──
  const [modalNouvelle, setModalNouvelle] = useState(false);
  const [produits, setProduits] = useState([]);
  const [zones, setZones] = useState([]);
  const [form, setForm] = useState({ client_nom: '', client_tel: '', adresse: '', zone: '', paiement: MODES_PAIEMENT[0], frais_livraison: 500 });
  const [articles, setArticles] = useState([]);
  const [produitChoix, setProduitChoix] = useState('');
  const [qteChoix, setQteChoix] = useState(1);
  const [errNouvelle, setErrNouvelle] = useState('');
  const [savingNouvelle, setSavingNouvelle] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCommandes({ statut: tab || undefined, q: search || undefined });
      setCommandes(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [tab, search]);

  useEffect(() => {
    const t = setTimeout(load, 300); // debounce recherche
    return () => clearTimeout(t);
  }, [load]);

  // Changer statut directement
  const handleStatut = async (id, newStatut) => {
    setSaving(true);
    try {
      const updated = await updateStatut(id, newStatut);
      setCommandes(prev => prev.map(c => c.id === id ? { ...c, statut: updated.statut } : c));
      if (selected?.id === id) setSelected(updated);
    } finally {
      setSaving(false);
    }
  };

  // Assigner livreur
  const handleAssigner = async () => {
    if (!livreurChoix || !selected) return;
    setSaving(true);
    try {
      const updated = await assignerLivreur(selected.id, livreurChoix);
      setCommandes(prev => prev.map(c => c.id === selected.id ? updated : c));
      setSelected(updated);
      setModalLivreur(false);
    } finally {
      setSaving(false);
    }
  };

  // ── Ouvrir modal nouvelle commande : charge le catalogue produits ──
  const ouvrirNouvelle = async () => {
    setErrNouvelle('');
    setForm({ client_nom: '', client_tel: '', adresse: '', zone: '', paiement: MODES_PAIEMENT[0], frais_livraison: 500 });
    setArticles([]);
    setModalNouvelle(true);
    try {
      const [p, z] = await Promise.all([getProduits(), getZones()]);
      setProduits(p.items);
      if (p.items.length) setProduitChoix(p.items[0].sku);
      setZones(z.items);
      if (z.items.length) setForm(f => ({ ...f, zone: z.items[0].nom }));
    } catch (err) {
      console.error(err);
    }
  };

  const ajouterArticle = () => {
    const p = produits.find(p => p.sku === produitChoix);
    if (!p || qteChoix < 1) return;
    setArticles(prev => {
      const existant = prev.find(a => a.sku === p.sku);
      if (existant) return prev.map(a => a.sku === p.sku ? { ...a, qte: a.qte + Number(qteChoix) } : a);
      return [...prev, { nom: p.nom, sku: p.sku, qte: Number(qteChoix), prix: p.prix }];
    });
    setQteChoix(1);
  };

  const retirerArticle = (sku) => setArticles(prev => prev.filter(a => a.sku !== sku));

  const totalNouvelle = articles.reduce((s, a) => s + a.qte * a.prix, 0) + Number(form.frais_livraison || 0);

  const soumettreNouvelle = async () => {
    setErrNouvelle('');
    if (!form.client_nom.trim()) return setErrNouvelle('Le nom du client est requis');
    if (!articles.length) return setErrNouvelle('Ajoutez au moins un article');
    setSavingNouvelle(true);
    try {
      await createCommande({ ...form, frais_livraison: Number(form.frais_livraison), articles });
      setModalNouvelle(false);
      load();
    } catch (err) {
      setErrNouvelle(err.response?.data?.error || 'Erreur lors de la création. Vérifiez que le backend tourne.');
    } finally {
      setSavingNouvelle(false);
    }
  };

  // Colonnes tableau
  const COLS = [
    { key: 'id', label: 'N° commande', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>#{v}</span> },
    {
      key: 'client_nom', label: 'Client',
      render: (v) => {
        const initials = v.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#4f9eff20', color: '#4f9eff', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{initials}</div>
            {v}
          </div>
        );
      }
    },
    { key: 'statut', label: 'Statut', render: v => <Badge statut={v} /> },
    { key: 'zone', label: 'Zone', render: v => <span style={{ fontSize: 11, padding: '2px 7px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 6, color: '#475569' }}>{v}</span> },
    { key: 'paiement', label: 'Paiement', render: v => <span style={{ fontSize: 11, padding: '2px 7px', background: '#F8FAFC', border: '1px solid #D1D5DB', borderRadius: 6, color: '#475569' }}>{v === 'Orange Money' ? 'OM' : v === 'MTN MoMo' ? 'MTN' : 'ESP'}</span> },
    { key: 'montant', label: 'Montant', align: 'right', render: v => <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{v.toLocaleString('fr-FR')}</span> },
    {
      key: '_actions', label: '', align: 'right',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
          <Btn variant="ghost" style={{ padding: '5px 8px', fontSize: 13 }} onClick={() => setSelected(row)}>👁</Btn>
          <Btn variant="ghost" style={{ padding: '5px 8px', fontSize: 13 }} onClick={() => { setSelected(row); setModalLivreur(true); }}>🚚</Btn>
        </div>
      )
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Total commandes" value={348} change="+23% ce mois" color="#0F172A" />
        <StatCard label="En cours" value={47} change="12 en transit" color="#4f9eff" changeType="neutral" />
        <StatCard label="CA total (XAF)" value={2847500} change="+18.4%" />
        <StatCard label="Valeur moyenne" value={8182} suffix=" XAF" change="+4.1%" />
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher commande, client, téléphone…" />
        <Btn>📍 Zone</Btn>
        <Btn>💳 Paiement</Btn>
        <Btn>📅 Période</Btn>
        <Btn variant="primary" onClick={ouvrirNouvelle}>+ Nouvelle commande</Btn>
      </div>

      {/* Tabs + Tableau */}
      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <Table columns={COLS} data={commandes} loading={loading} onRowClick={setSelected} />
        <div style={{ padding: '12px 16px', borderTop: '1px solid #EEF0F2', background: '#F8FAFC', fontSize: 12, color: '#94A3B8' }}>
          {total} commande{total > 1 ? 's' : ''} au total
        </div>
      </div>

      {/* Panneau détail */}
      {selected && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: 12, overflow: 'hidden' }}>
          {/* En-tête */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>Commande #{selected.id}</span>
              <Badge statut={selected.statut} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selected.statut === 'Confirmée' && <Btn onClick={() => handleStatut(selected.id, 'Préparation')} disabled={saving}>▶ Démarrer préparation</Btn>}
              {selected.statut === 'Préparation' && <Btn onClick={() => { setModalLivreur(true); }} variant="blue">🚚 Assigner livreur</Btn>}
              {selected.statut === 'Transit' && <Btn onClick={() => handleStatut(selected.id, 'Livrée')} variant="primary" disabled={saving}>✓ Marquer livré</Btn>}
              {!['Annulée', 'Livrée'].includes(selected.statut) && <Btn variant="danger" onClick={() => handleStatut(selected.id, 'Annulée')} disabled={saving}>✕ Annuler</Btn>}
              <Btn onClick={() => setSelected(null)}>✕</Btn>
            </div>
          </div>

          {/* Timeline */}
          <Timeline statut={selected.statut} date={selected.date} />

          {/* Infos 3 colonnes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #E5E7EB' }}>
            <DetailCol title="Client">
              <DetailRow label="Nom" value={selected.client_nom} />
              <DetailRow label="Téléphone" value={selected.client_tel} />
              <DetailRow label="Adresse" value={selected.adresse} />
              <DetailRow label="Zone" value={`Zone ${selected.zone} · ${selected.frais_livraison?.toLocaleString('fr-FR')} XAF`} />
            </DetailCol>
            <DetailCol title="Paiement" border>
              <DetailRow label="Mode" value={selected.paiement} />
              <DetailRow label="Référence" value={selected.ref_paiement} mono />
              <DetailRow label="Statut" value={<Badge statut="Livrée" />} />
            </DetailCol>
            <DetailCol title="Livraison" border>
              <DetailRow label="Date" value={new Date(selected.date).toLocaleString('fr-FR')} />
              <DetailRow label="Livreur" value={selected.livreur || '—'} />
              {selected.code_confirmation && (
                <div>
                  <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 3, marginTop: 10 }}>Code confirmation</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 22, fontWeight: 600, color: '#00e5a0', letterSpacing: '.15em' }}>{selected.code_confirmation}</div>
                </div>
              )}
            </DetailCol>
          </div>

          {/* Articles */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Produit', 'SKU', 'Qté', 'Prix unit.', 'Total'].map((h, i) => (
                  <th key={h} style={{ padding: '9px 18px', fontSize: 11, fontWeight: 500, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: i === 4 ? 'right' : 'left', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selected.articles?.map((a, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #EEF0F2' }}>
                  <td style={{ padding: '10px 18px' }}>{a.nom}</td>
                  <td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: 11, color: '#94A3B8' }}>{a.sku}</td>
                  <td style={{ padding: '10px 18px' }}>{a.qte}</td>
                  <td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: 12 }}>{a.prix.toLocaleString('fr-FR')} XAF</td>
                  <td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: 12, textAlign: 'right' }}>{(a.qte * a.prix).toLocaleString('fr-FR')} XAF</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr><td colSpan={4} style={{ padding: '10px 18px', fontSize: 12, color: '#94A3B8' }}>Frais de livraison</td><td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: 12, textAlign: 'right', color: '#475569' }}>{selected.frais_livraison?.toLocaleString('fr-FR')} XAF</td></tr>
              <tr><td colSpan={4} style={{ padding: '10px 18px', fontWeight: 600 }}>Total commande</td><td style={{ padding: '10px 18px', fontFamily: 'monospace', fontSize: 14, fontWeight: 600, textAlign: 'right', color: '#00e5a0' }}>{selected.montant?.toLocaleString('fr-FR')} XAF</td></tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Modal assigner livreur */}
      <Modal open={modalLivreur} onClose={() => setModalLivreur(false)} title="Assigner un livreur">
        <Field label="Choisir le livreur">
          <select value={livreurChoix} onChange={e => setLivreurChoix(e.target.value)} style={{ ...inputStyle }}>
            <option value="">-- Sélectionner --</option>
            {LIVREURS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
        <div style={{ display: 'flex', gap: 8, marginTop: 20, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setModalLivreur(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={handleAssigner} disabled={!livreurChoix || saving}>
            {saving ? 'Enregistrement…' : '✓ Confirmer'}
          </Btn>
        </div>
      </Modal>

      {/* Modal nouvelle commande */}
      <Modal open={modalNouvelle} onClose={() => setModalNouvelle(false)} title="Nouvelle commande">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nom du client">
            <input style={inputStyle} value={form.client_nom} onChange={e => setForm(f => ({ ...f, client_nom: e.target.value }))} placeholder="Ex. Awa Bello" />
          </Field>
          <Field label="Téléphone">
            <input style={inputStyle} value={form.client_tel} onChange={e => setForm(f => ({ ...f, client_tel: e.target.value }))} placeholder="+237 6XX XXX XXX" />
          </Field>
        </div>
        <Field label="Adresse">
          <input style={inputStyle} value={form.adresse} onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))} placeholder="Rue, quartier…" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Zone">
            <select style={inputStyle} value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}>
              {zones.map(z => <option key={z.id} value={z.nom}>{z.nom}</option>)}
            </select>
          </Field>
          <Field label="Paiement">
            <select style={inputStyle} value={form.paiement} onChange={e => setForm(f => ({ ...f, paiement: e.target.value }))}>
              {MODES_PAIEMENT.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Frais livraison (XAF)">
            <input type="number" style={inputStyle} value={form.frais_livraison} onChange={e => setForm(f => ({ ...f, frais_livraison: e.target.value }))} />
          </Field>
        </div>

        <div style={{ marginTop: 6, marginBottom: 10, fontSize: 11, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em' }}>Articles</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
          <div style={{ flex: 1 }}>
            <select style={inputStyle} value={produitChoix} onChange={e => setProduitChoix(e.target.value)}>
              {produits.map(p => <option key={p.sku} value={p.sku}>{p.nom} — {p.prix.toLocaleString('fr-FR')} XAF (stock {p.stock})</option>)}
            </select>
          </div>
          <input type="number" min={1} style={{ ...inputStyle, width: 70 }} value={qteChoix} onChange={e => setQteChoix(e.target.value)} />
          <Btn onClick={ajouterArticle} disabled={!produitChoix}>+ Ajouter</Btn>
        </div>

        {articles.length > 0 && (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginBottom: 12 }}>
            <tbody>
              {articles.map(a => (
                <tr key={a.sku} style={{ borderBottom: '1px solid #EEF0F2' }}>
                  <td style={{ padding: '6px 4px' }}>{a.nom}</td>
                  <td style={{ padding: '6px 4px', color: '#475569' }}>x{a.qte}</td>
                  <td style={{ padding: '6px 4px', fontFamily: 'monospace', textAlign: 'right' }}>{(a.qte * a.prix).toLocaleString('fr-FR')} XAF</td>
                  <td style={{ padding: '6px 4px', textAlign: 'right' }}>
                    <button onClick={() => retirerArticle(a.sku)} style={{ background: 'none', border: 'none', color: '#ff5a5a', cursor: 'pointer', fontSize: 13 }}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderTop: '1px solid #E5E7EB', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: '#475569' }}>Total commande</span>
          <span style={{ fontSize: 16, fontWeight: 600, color: '#00e5a0', fontFamily: 'monospace' }}>{totalNouvelle.toLocaleString('fr-FR')} XAF</span>
        </div>

        {errNouvelle && <div style={{ color: '#ff5a5a', fontSize: 12, marginBottom: 8 }}>{errNouvelle}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={() => setModalNouvelle(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={soumettreNouvelle} disabled={savingNouvelle}>
            {savingNouvelle ? 'Création…' : '✓ Créer la commande'}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

// ── Sous-composants ──────────────────────────────────────────────────────
function Timeline({ statut }) {
  const steps = ['Confirmée', 'Préparation', 'Transit', 'Livrée'];
  const idx = steps.findIndex(s => s === statut);
  return (
    <div style={{ display: 'flex', padding: '14px 20px', borderBottom: '1px solid #E5E7EB' }}>
      {steps.map((s, i) => (
        <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {i < steps.length - 1 && <div style={{ position: 'absolute', top: 11, left: '50%', width: '100%', height: 1, background: i < idx ? '#00e5a044' : '#E5E7EB' }} />}
          <div style={{ width: 22, height: 22, borderRadius: '50%', border: '1px solid', background: i < idx ? '#00e5a020' : i === idx ? '#4f9eff20' : '#F8FAFC', borderColor: i < idx ? '#00e5a044' : i === idx ? '#4f9eff44' : '#D1D5DB', color: i < idx ? '#00e5a0' : i === idx ? '#4f9eff' : '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, zIndex: 1, position: 'relative' }}>
            {i < idx ? '✓' : i === idx ? '●' : '○'}
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>{s}</div>
        </div>
      ))}
    </div>
  );
}

function DetailCol({ title, children, border }) {
  return (
    <div style={{ padding: '14px 20px', borderRight: border ? '1px solid #E5E7EB' : 'none' }}>
      <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function DetailRow({ label, value, mono }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 500, fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</div>
    </div>
  );
}
