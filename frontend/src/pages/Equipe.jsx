import { useState, useEffect, useCallback } from 'react';
import { getLivreurs, createLivreur, updateLivreur, getZones } from '../api/client';
import { StatCard, Modal, Btn, Field, inputStyle } from '../components/ui';

export default function Equipe() {
  const [livreurs, setLivreurs] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNouveau, setModalNouveau] = useState(false);
  const [form, setForm] = useState({ nom: '', tel: '', zone: '' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [l, z] = await Promise.all([getLivreurs(), getZones().catch(() => ({ items: [] }))]);
      setLivreurs(l.items);
      setZones(z.items);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const ouvrirNouveau = () => {
    setErr('');
    setForm({ nom: '', tel: '', zone: zones[0]?.nom || '' });
    setModalNouveau(true);
  };

  const soumettre = async () => {
    setErr('');
    if (!form.nom.trim() || !form.tel.trim()) return setErr('Nom et téléphone sont requis');
    setSaving(true);
    try {
      await createLivreur(form);
      setModalNouveau(false);
      load();
    } catch (e) {
      setErr(e.isBackendDown ? 'Impossible de joindre le backend — vérifie qu\'il tourne sur le port 3000.' : (e.response?.data?.error || 'Erreur lors de la création'));
    } finally {
      setSaving(false);
    }
  };

  const toggleActif = async (l) => {
    try {
      const updated = await updateLivreur(l.id, { actif: !l.actif });
      setLivreurs(prev => prev.map(x => x.id === l.id ? updated : x));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: '3px solid #00e5a0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#94A3B8', fontSize: 13 }}>Chargement de l'équipe…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const actifs = livreurs.filter(l => l.actif).length;
  const noteMoyenne = livreurs.length ? (livreurs.reduce((s, l) => s + l.note, 0) / livreurs.length).toFixed(1) : '—';
  const livraisonsJour = livreurs.reduce((s, l) => s + l.livraisons_jour, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
        <StatCard label="Membres de l'équipe" value={livreurs.length} color="#0F172A" />
        <StatCard label="Livreurs actifs" value={actifs} color="#00e5a0" />
        <StatCard label="Livraisons aujourd'hui" value={livraisonsJour} color="#4f9eff" />
        <StatCard label="Note moyenne" value={`${noteMoyenne}★`} color="#ffb830" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Btn variant="primary" onClick={ouvrirNouveau}>+ Ajouter un livreur</Btn>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
        {livreurs.map(l => (
          <div key={l.id} style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#4f9eff20', color: '#4f9eff', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {l.nom.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{l.nom}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{l.zone}</div>
              </div>
              <button
                onClick={() => toggleActif(l)}
                style={{ marginLeft: 'auto', fontSize: 11, padding: '3px 8px', borderRadius: 20, border: 'none', cursor: 'pointer', background: l.actif ? '#00e5a020' : '#ff5a5a20', color: l.actif ? '#00e5a0' : '#ff5a5a' }}
              >
                {l.actif ? '● Actif' : '○ Inactif'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#475569', marginBottom: 6 }}>
              <span>📞 {l.tel}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #EEF0F2' }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{l.livraisons_jour}</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>livraisons/jour</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#ffb830' }}>{l.note}★</div>
                <div style={{ fontSize: 10, color: '#94A3B8' }}>note moyenne</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalNouveau} onClose={() => setModalNouveau(false)} title="Ajouter un livreur">
        <Field label="Nom complet">
          <input style={inputStyle} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex. Paul Nkomo" />
        </Field>
        <Field label="Téléphone">
          <input style={inputStyle} value={form.tel} onChange={e => setForm(f => ({ ...f, tel: e.target.value }))} placeholder="+237 6XX XXX XXX" />
        </Field>
        <Field label="Zone assignée">
          <select style={inputStyle} value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}>
            <option value="">-- Aucune --</option>
            {zones.map(z => <option key={z.id} value={z.nom}>{z.nom}</option>)}
          </select>
        </Field>
        {err && <div style={{ color: '#ff5a5a', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn onClick={() => setModalNouveau(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={soumettre} disabled={saving}>{saving ? 'Ajout…' : '✓ Ajouter'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
