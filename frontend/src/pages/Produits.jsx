import { useState, useEffect, useCallback } from 'react';
import { getProduits, createProduit } from '../api/client';
import { Table, SearchBar, StatCard, Modal, Btn, Field, inputStyle } from '../components/ui';

const CATEGORIES = ['Alimentaire', 'Hygiène', 'Maison', 'Divers'];

export default function Produits() {
  const [produits, setProduits] = useState([]);
  const [total, setTotal] = useState(0);
  const [alertes, setAlertes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categorie, setCategorie] = useState('');
  const [modalNouveau, setModalNouveau] = useState(false);
  const [form, setForm] = useState({ nom: '', sku: '', categorie: CATEGORIES[0], prix: '', stock: '', seuil_alerte: 5 });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProduits({ q: search || undefined, categorie: categorie || undefined });
      setProduits(data.items);
      setTotal(data.total);
      setAlertes(data.alertes);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [search, categorie]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const ouvrirNouveau = () => {
    setErr('');
    setForm({ nom: '', sku: '', categorie: CATEGORIES[0], prix: '', stock: '', seuil_alerte: 5 });
    setModalNouveau(true);
  };

  const soumettre = async () => {
    setErr('');
    if (!form.nom.trim() || !form.sku.trim()) return setErr('Nom et SKU sont requis');
    setSaving(true);
    try {
      await createProduit(form);
      setModalNouveau(false);
      load();
    } catch (e) {
      setErr(e.response?.data?.error || 'Erreur lors de la création. Vérifiez que le backend tourne.');
    } finally {
      setSaving(false);
    }
  };

  const valeurStock = produits.reduce((s, p) => s + p.prix * p.stock, 0);

  const COLS = [
    { key: 'nom', label: 'Produit' },
    { key: 'sku', label: 'SKU', render: v => <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#475569' }}>{v}</span> },
    { key: 'categorie', label: 'Catégorie', render: v => <span style={{ fontSize: 11, padding: '2px 7px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 6, color: '#475569' }}>{v}</span> },
    { key: 'prix', label: 'Prix unit.', align: 'right', render: v => <span style={{ fontFamily: 'monospace' }}>{v.toLocaleString('fr-FR')} XAF</span> },
    {
      key: 'stock', label: 'Stock', align: 'right',
      render: (v, row) => <span style={{ fontFamily: 'monospace', fontWeight: 500, color: v <= row.seuil_alerte ? '#ff5a5a' : '#0F172A' }}>{v}</span>
    },
    { key: 'seuil_alerte', label: 'Seuil alerte', align: 'right', render: v => <span style={{ color: '#94A3B8' }}>{v}</span> },
    { key: 'actif', label: 'Statut', render: v => <span style={{ fontSize: 11, color: v ? '#00e5a0' : '#ff5a5a' }}>{v ? '● Actif' : '○ Inactif'}</span> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        <StatCard label="Produits au catalogue" value={total} color="#0F172A" />
        <StatCard label="Alertes stock faible" value={alertes} color="#ff5a5a" changeType="down" change={alertes > 0 ? 'Réapprovisionnement requis' : 'Aucune alerte'} />
        <StatCard label="Valeur totale du stock" value={valeurStock} suffix=" XAF" color="#00e5a0" />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Rechercher un produit, un SKU…" />
        <select style={{ ...inputStyle, width: 160 }} value={categorie} onChange={e => setCategorie(e.target.value)}>
          <option value="">Toutes catégories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Btn variant="primary" onClick={ouvrirNouveau}>+ Nouveau produit</Btn>
      </div>

      <Table columns={COLS} data={produits} loading={loading} />

      <Modal open={modalNouveau} onClose={() => setModalNouveau(false)} title="Nouveau produit">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nom du produit">
            <input style={inputStyle} value={form.nom} onChange={e => setForm(f => ({ ...f, nom: e.target.value }))} placeholder="Ex. Huile de palme 5L" />
          </Field>
          <Field label="SKU">
            <input style={inputStyle} value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="Ex. HP-5L-001" />
          </Field>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label="Catégorie">
            <select style={inputStyle} value={form.categorie} onChange={e => setForm(f => ({ ...f, categorie: e.target.value }))}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Prix (XAF)">
            <input type="number" style={inputStyle} value={form.prix} onChange={e => setForm(f => ({ ...f, prix: e.target.value }))} />
          </Field>
          <Field label="Stock initial">
            <input type="number" style={inputStyle} value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} />
          </Field>
        </div>
        <Field label="Seuil d'alerte">
          <input type="number" style={inputStyle} value={form.seuil_alerte} onChange={e => setForm(f => ({ ...f, seuil_alerte: e.target.value }))} />
        </Field>
        {err && <div style={{ color: '#ff5a5a', fontSize: 12, marginBottom: 8 }}>{err}</div>}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 8 }}>
          <Btn onClick={() => setModalNouveau(false)}>Annuler</Btn>
          <Btn variant="primary" onClick={soumettre} disabled={saving}>{saving ? 'Création…' : '✓ Créer le produit'}</Btn>
        </div>
      </Modal>
    </div>
  );
}
