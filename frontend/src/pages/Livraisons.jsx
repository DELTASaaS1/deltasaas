import { useState, useEffect, useCallback } from 'react';
import { getLivraisons, getLivreurs, confirmerLivraison } from '../api/client';
import { Badge, Table, SearchBar, StatCard, Tabs, Modal, Btn, Field, inputStyle } from '../components/ui';

const TABS = [
  { value: '', label: 'Toutes' },
  { value: 'en_transit', label: 'En transit' },
  { value: 'livré', label: 'Livrées' },
];

export default function Livraisons() {
  const [livraisons, setLivraisons] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalCode, setModalCode] = useState(false);
  const [code, setCode] = useState('');
  const [saving, setSaving] = useState(false);
  const [errCode, setErrCode] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [l, d] = await Promise.all([getLivraisons({ statut: tab || undefined }), getLivreurs()]);
      setLivraisons(l.items);
      setLivreurs(d.items);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const filtered = livraisons.filter(l =>
    !search || l.client.toLowerCase().includes(search.toLowerCase()) || l.commande_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirmer = async () => {
    if (!code || !selected) return;
    setSaving(true); setErrCode('');
    try {
      const updated = await confirmerLivraison(selected.id, code);
      setLivraisons(prev => prev.map(l => l.id === selected.id ? updated : l));
      setSelected(updated);
      setModalCode(false);
      setCode('');
    } catch (err) {
      setErrCode(err.response?.data?.error || 'Code incorrect');
    } finally { setSaving(false); }
  };

  const COLS = [
    { key: 'id', label: 'ID livraison', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#475569' }}>{v}</span> },
    { key: 'commande_id', label: 'Commande', render: v => <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#4f9eff' }}>#{v}</span> },
    { key: 'client', label: 'Client', render: (v) => {
      const ini = v.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      return <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#00e5a020', color: '#00e5a0', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ini}</div>
        {v}
      </div>;
    }},
    { key: 'zone', label: 'Zone', render: v => <span style={{ fontSize: 11, padding: '2px 7px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 6, color: '#475569' }}>{v}</span> },
    { key: 'livreur', label: 'Livreur' },
    { key: 'statut', label: 'Statut', render: v => <Badge statut={v} /> },
    { key: 'montant', label: 'Montant', align: 'right', render: v => <span style={{ fontFamily: 'monospace', fontWeight: 500 }}>{v.toLocaleString('fr-FR')}</span> },
    { key: '_actions', label: '', align: 'right', render: (_, row) => (
      <div style={{ display: 'flex', gap: 5 }} onClick={e => e.stopPropagation()}>
        <Btn style={{ padding: '5px 8px', fontSize: 13 }} onClick={() => setSelected(row)}>👁</Btn>
        {row.statut === 'en_transit' && (
          <Btn variant="primary" style={{ padding: '5px 8px', fontSize: 12 }} onClick={() => { setSelected(row); setModalCode(true); }}>✓ Confirmer</Btn>
        )}
      </div>
    )},
  ];

  const enTransit = livraisons.filter(l => l.statut === 'en_transit').length;
  const livrées   = livraisons.filter(l => l.statut === 'livré').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Total livraisons" value={livraisons.length} color="#0F172A" />
        <StatCard label="En transit" value={enTransit} color="#4f9eff" change="En cours" />
        <StatCard label="Livrées" value={livrées} change="+94.2% taux" color="#00e5a0" />
        <StatCard label="Livreurs actifs" value={livreurs.filter(l => l.actif).length} color="#a78bfa" change={`${livreurs.length} total`} />
      </div>

      {/* Livreurs cards */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#475569', marginBottom: 10 }}>Livreurs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {livreurs.map(d => (
            <div key={d.id} style={{ background: '#FFFFFF', border: `1px solid ${d.actif ? '#00e5a022' : '#E5E7EB'}`, borderRadius: 12, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: d.actif ? '#00e5a020' : '#EEF0F2', color: d.actif ? '#00e5a0' : '#94A3B8', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {d.nom.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{d.nom}</div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{d.zone}</div>
                <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, padding: '1px 6px', borderRadius: 10, background: d.actif ? '#00e5a020' : '#EEF0F2', color: d.actif ? '#00e5a0' : '#94A3B8' }}>
                    {d.actif ? '● Actif' : '○ Inactif'}
                  </span>
                  <span style={{ fontSize: 11, color: '#94A3B8' }}>{d.livraisons_jour} livraisons/j</span>
                  <span style={{ fontSize: 11, color: '#ffb830' }}>★ {d.note}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar + Table */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher livraison, client…" />
        <Btn>📍 Zone</Btn>
        <Btn>👤 Livreur</Btn>
      </div>

      <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <Tabs tabs={TABS} active={tab} onChange={setTab} />
        <Table columns={COLS} data={filtered} loading={loading} onRowClick={setSelected} />
      </div>

      {/* Détail livraison */}
      {selected && (
        <div style={{ background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F8FAFC' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600 }}>Livraison {selected.id}</span>
              <Badge statut={selected.statut} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {selected.statut === 'en_transit' && (
                <Btn variant="primary" onClick={() => setModalCode(true)}>✓ Confirmer avec code</Btn>
              )}
              <Btn onClick={() => setSelected(null)}>✕</Btn>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid #E5E7EB' }}>
            {[
              { title: 'Commande', rows: [{ l: 'N° commande', v: `#${selected.commande_id}`, mono: true }, { l: 'Client', v: selected.client }, { l: 'Adresse', v: selected.adresse }] },
              { title: 'Livraison', rows: [{ l: 'Livreur', v: selected.livreur }, { l: 'Zone', v: selected.zone }, { l: 'Date départ', v: new Date(selected.date).toLocaleString('fr-FR') }] },
              { title: 'Confirmation', rows: [{ l: 'Code', v: selected.code, big: true }, { l: 'Montant', v: `${selected.montant?.toLocaleString('fr-FR')} XAF` }, { l: 'Livré le', v: selected.livré_le ? new Date(selected.livré_le).toLocaleString('fr-FR') : '—' }] },
            ].map((col, ci) => (
              <div key={ci} style={{ padding: '16px 20px', borderRight: ci < 2 ? '1px solid #E5E7EB' : 'none' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 10 }}>{col.title}</div>
                {col.rows.map(r => (
                  <div key={r.l} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginBottom: 2 }}>{r.l}</div>
                    <div style={{ fontSize: r.big ? 22 : 13, fontWeight: r.big ? 600 : 500, fontFamily: r.mono || r.big ? 'monospace' : 'inherit', color: r.big ? '#00e5a0' : '#0F172A', letterSpacing: r.big ? '.15em' : 'normal' }}>{r.v || '—'}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal confirmation code */}
      <Modal open={modalCode} onClose={() => { setModalCode(false); setCode(''); setErrCode(''); }} title="Confirmer la livraison">
        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: 8, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#475569', marginBottom: 4 }}>Le livreur demande au client son code à 4 chiffres</div>
          <div style={{ fontSize: 13 }}>Commande <strong style={{ color: '#4f9eff' }}>#{selected?.commande_id}</strong> · Client : {selected?.client}</div>
        </div>
        <Field label="Code de confirmation (4 chiffres)">
          <input
            value={code} onChange={e => { setCode(e.target.value); setErrCode(''); }}
            maxLength={4} placeholder="0000" type="text"
            style={{ ...inputStyle, fontSize: 24, fontFamily: 'monospace', letterSpacing: '.2em', textAlign: 'center' }}
          />
        </Field>
        {errCode && <div style={{ color: '#ff5a5a', fontSize: 12, marginBottom: 12, padding: '8px 12px', background: '#ff5a5a10', borderRadius: 8 }}>⚠ {errCode}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Btn onClick={() => { setModalCode(false); setCode(''); setErrCode(''); }}>Annuler</Btn>
          <Btn variant="primary" onClick={handleConfirmer} disabled={code.length < 4 || saving}>
            {saving ? 'Vérification…' : '✓ Confirmer la livraison'}
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
