import { useState, useEffect } from 'react';
import { getDashboardStats, getCommandes } from '../api/client';
import { StatCard } from '../components/ui';

const STATUT_COLORS = { Confirmée: '#475569', Préparation: '#ffb830', Transit: '#4f9eff', Livrée: '#00e5a0', Annulée: '#ff5a5a' };

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getCommandes({ limit: 500 }),
    ]).then(([d, c]) => {
      setStats(d);
      setCommandes(c.items);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #E5E7EB', borderTop: '3px solid #00e5a0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#94A3B8', fontSize: 13 }}>Chargement des analytics…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!stats) return <div style={{ color: '#ff5a5a', padding: 24 }}>Erreur de chargement. Vérifiez que le backend tourne sur le port 3000.</div>;

  // Répartition par statut (sur l'échantillon de commandes chargé)
  const parStatut = Object.keys(STATUT_COLORS).map(s => ({
    statut: s,
    count: commandes.filter(c => c.statut === s).length,
  }));
  const maxStatut = Math.max(1, ...parStatut.map(s => s.count));

  // Répartition par zone
  const zonesSet = [...new Set(commandes.map(c => c.zone))];
  const parZone = zonesSet.map(z => {
    const items = commandes.filter(c => c.zone === z);
    return { zone: z, count: items.length, ca: items.reduce((s, c) => s + c.montant, 0) };
  }).sort((a, b) => b.ca - a.ca);
  const maxZoneCA = Math.max(1, ...parZone.map(z => z.ca));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <StatCard label="CA mensuel (XAF)" value={stats.totalCA} change={`+${stats.tendances.ca}% ce mois`} color="#00e5a0" />
        <StatCard label="Commandes ce mois" value={stats.totalCommandes} change={`+${stats.tendances.commandes}%`} color="#4f9eff" />
        <StatCard label="Taux de livraison" value={`${stats.tauxLivraison}%`} change={`+${stats.tendances.livraison}%`} color="#ffb830" />
        <StatCard label="Panier moyen" value={stats.valeurMoyenne} suffix=" XAF" color="#a78bfa" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        {/* Revenus */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Revenus & commandes — 7 derniers jours</div>
          </div>
          <div style={{ padding: 20 }}>
            <BarChart data={stats.graphique} />
          </div>
        </div>

        {/* Paiements */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB' }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Modes de paiement</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {stats.paiements.map((p, i) => {
              const colors = ['#ffb830', '#ff7f50', '#4f9eff'];
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                    <span style={{ color: '#475569' }}>{p.mode}</span>
                    <span style={{ fontWeight: 600, color: colors[i] }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#E5E7EB', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: colors[i], borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>{p.montant.toLocaleString('fr-FR')} XAF</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        {/* Répartition par statut */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>Commandes par statut</div>
          {parStatut.map(s => (
            <div key={s.statut} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#475569' }}>{s.statut}</span>
                <span style={{ fontWeight: 600, color: STATUT_COLORS[s.statut] }}>{s.count}</span>
              </div>
              <div style={{ height: 6, background: '#E5E7EB', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${(s.count / maxStatut) * 100}%`, background: STATUT_COLORS[s.statut], borderRadius: 4, transition: 'width .5s' }} />
              </div>
            </div>
          ))}
        </div>

        {/* CA par zone */}
        <div style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 }}>
          <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 16 }}>Chiffre d'affaires par zone</div>
          {parZone.map(z => (
            <div key={z.zone} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                <span style={{ color: '#475569' }}>{z.zone} · {z.count} commande{z.count > 1 ? 's' : ''}</span>
                <span style={{ fontWeight: 600, color: '#00e5a0', fontFamily: 'monospace' }}>{z.ca.toLocaleString('fr-FR')}</span>
              </div>
              <div style={{ height: 6, background: '#E5E7EB', borderRadius: 4 }}>
                <div style={{ height: '100%', width: `${(z.ca / maxZoneCA) * 100}%`, background: '#00e5a0', borderRadius: 4, transition: 'width .5s' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data?.length) return null;
  const W = 500, H = 180, PAD = 30;
  const max = Math.max(...data.map(d => d.ca));
  const barW = (W - PAD * 2) / data.length * 0.6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 180 }}>
      {[0.25, 0.5, 0.75, 1].map(v => (
        <line key={v} x1={PAD} y1={H - PAD - v * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - v * (H - PAD * 2)} stroke="#ECEEF0" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const slot = (W - PAD * 2) / data.length;
        const x = PAD + i * slot + (slot - barW) / 2;
        const barH = (d.ca / max) * (H - PAD * 2);
        const y = H - PAD - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx="3" fill="#00e5a0" opacity={i === data.length - 1 ? 1 : 0.55} />
            <text x={x + barW / 2} y={H - 6} fill="#94A3B8" fontSize="10" textAnchor="middle" fontFamily="system-ui">{d.jour}</text>
          </g>
        );
      })}
    </svg>
  );
}
