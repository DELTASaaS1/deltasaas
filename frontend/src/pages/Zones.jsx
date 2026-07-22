import { useState, useEffect, useCallback } from 'react';
import { getCommandes, getLivraisons, getZones, createZone, updateZone, deleteZone } from '../api/client';
import { StatCard, Table, Modal, Btn, Field, inputStyle } from '../components/ui';

export default function Zones() {
  const [zones, setZones] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [livraisons, setLivraisons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNouvelle, setModalNouvelle] = useState(false);
  const [modalEdit, setModalEdit] = useState(null);
  const [form, setForm] = useState({ nom: '', frais_livraison_defaut: 500, delai_moyen_h: 2 });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [z, c, l] = await Promise.all([getZones(), getCommandes({ limit: 500 }), getLivraisons()]);
      setZones(z.items);
      setCommandes(c.items);
      setLivraisons(l.items);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const ouvrirNouvelle = () => {
    setErr('');
    setForm({ nom: '', frais_livraison_defaut: 500, delai_moyen_h: 2 });
    setModalNouvelle(true);
  };

  const soumettreNouvelle = async () => {
    setErr('');
    if (!form.nom.trim()) return setErr('Le nom de la zone est requis');
    setSaving(true);
    try {
      await createZone(form);
      setModalNouvelle(false);
      load();
    } catch (e) {
      setErr(e.isBackendDown ? 'Impossible de joindre le backend — vérifie qu\'il tourne sur le port 3000.' : (e.response?.data?.error || 'Erreur lors de la création'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (z) => {
    try {
      await updateZone(z.id, { actif: !z.actif });
      load();
    } catch (err) { console.error(err); }
  };

  const supprimer = async (z) => {
    if (!confirm(`Supprimer la zone "${z.nom}" ?`)) return;
    try {
      await deleteZone(z.id);
      load();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: '3px solid #00e5a0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#94A3B8', fontSize: 13 }}>Chargement des zones…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  // Stats calculées à partir des commandes/livraisons réelles, jointes aux zones configurées
  const stats = zones.map(z => {
    const cmds = commandes.filter(c => c.zone === z.nom);
    const livs = livraisons.filter(l => l.zone === z.nom);
    const livrees = livs.filter(l => l.statut === 'livré').length;
    return {
      ...z,
      commandes: cmds.length,
      ca: cmds.reduce((s, c) => s + c.montant, 0),
      tauxLivraison: livs.length ? Math.round((livrees / livs.length) * 100) : 0,
    };
  }).sort((a, b) => b.ca - a.ca);

  const totalCA = stats.reduce((s, z) => s + z.ca, 0);

  const COLS = [
    { key: 'nom', label: 'Zone', render: v => <span style={{ fontWeight: 500 }}>{v}</span> },
    { key: 'commandes', label: 'Commandes', align: 'right' },
    { key: 'ca', label: 'CA (XAF)', align: 'right', render: v => <span style={{ fontFamily: 'monospace' }}>{v.toLocaleString('fr-FR')}</span> },
    { key: 'frais_livraison_defaut', label: 'Frais par défaut', align: 'right', render: v => <span style={{ fontFamily: 'monospace', color: '#475569' }}>{v.toLocaleString('fr-FR')} XAF</span> },
    { key: 'delai_moyen_h', label: 'Délai moyen', align: 'right', render: v => <span style={{ color: '#475569' }}>{v}h</span> },
    { key: 'tauxLivraison', label: 'Taux livraison', align: 'right', render: v => <span style={{ fontWeight: 600, color: v >= 90 ? '#00e5a0' : v >= 70 ? '#ffb830' : '#ff5a5a' }}>{v}%</span> },
    {
      key: '_actions', label: '', align: 'right',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => toggleActive(row)} style={{ background: 'none', border: '1px solid #D1D5DB', borderRadius: 6, color: row.actif ? '#00e5a0' : '#94A3B8', cursor: 'pointer', fontSize: 11, padding: '4px 8px' }}>
            {row.actif ? '● Actif' : '○ Inactif'}
          </button>
          <button onClick={() => supprimer(row)} style={{ background: 'none', border: '1px solid #ff5a5a44', borderRadius: 6, color: '#ff5a5a', cursor: 'pointer', fontSize: 12, padding: '4px 8px' }}>✕</button>
        </div>
      )
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <StatCard label="Zones configurées" value={zones.length} color="#0F172A" />
        <StatCard label="CA total" value={totalCA} suffix=" XAF" color="#00e5a0" />
        <StatCard label="Meilleure zone" value={stats[0]?.nom || '—'} color="#4f9eff" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="primary" onClick={ouvrirNouvelle}>+ Nouvelle zone</Btn>
      </div>

      <Table columns={COLS} data={stats} loading={false} />

      <Modal open={modalNouvelle} onClose={() => setModalNouvelle(false)} title="Nouvelle zone de livraison">
        <Field label="Nom de la zone">
          <input style={inputStyle} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex. Nlongkak" />
        </Field>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Frais de livraison par défaut (XAF)">
            <input type="number" style={inputStyle} value={form.frais_livraison_defaut} onChange={e => setForm(f => ({ ...f, frais_livraison_defaut: e.target.value }))} />
          </Field>
          <Field label="Délai moyen (heures)">
            <input type="number" step="0.5" style={inputStyle} value={form.delai_moyen_h} onChange={e => setForm(f => ({ ...f, delai_moyen_h: e.target.value }))} />
          </Field>
        </div>
        {err && <div style={{ color: '#ff5a5a', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn onClick={() => setModalNouvelle(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={soumettreNouvelle} disabled={saving}>{saving ? 'Création…' : '✓ Créer la zone'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
