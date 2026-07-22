import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api/client';
import { StatCard } from '../components/ui';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: 16 }}>
      <div style={{ width: 40, height: 40, border: '3px solid #ffffff12', borderTop: '3px solid #00e5a0', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <span style={{ color: '#555e78', fontSize: 13 }}>Chargement du tableau de bord…</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!stats) return <div style={{ color: '#ff5a5a', padding: 24 }}>Erreur de chargement. Vérifiez que le backend tourne sur le port 3000.</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Status bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '10px 16px', background: '#12151c', border: '1px solid #ffffff12', borderRadius: 10, fontSize: 12, flexWrap: 'wrap' }}>
        {[
          { label: 'API', ok: true },
          { label: 'Base de données · 32ms', ok: true },
          { label: 'MTN MoMo', ok: true },
          { label: 'Orange Money', ok: true },
          { label: 'SMS Gateway', ok: false },
        ].map((s, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#8b92a8' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.ok ? '#00e5a0' : '#ffb830', display: 'inline-block' }} />
            {s.label}
            {i < 4 && <span style={{ marginLeft: 8, opacity: .3 }}>|</span>}
          </span>
        ))}
        <span style={{ marginLeft: 'auto', color: '#555e78' }}>SLA 99.8% ce mois</span>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
        <div onClick={() => navigate('/commandes')} style={{ cursor: 'pointer' }}>
          <StatCard label="CA mensuel (XAF)" value={stats.totalCA} change={`+${stats.tendances.ca}% ce mois`} color="#00e5a0" />
        </div>
        <div onClick={() => navigate('/commandes')} style={{ cursor: 'pointer' }}>
          <StatCard label="Commandes ce mois" value={stats.totalCommandes} change={`+${stats.tendances.commandes}%`} color="#4f9eff" />
        </div>
        <div onClick={() => navigate('/livraisons')} style={{ cursor: 'pointer' }}>
          <StatCard label="Taux de livraison" value={`${stats.tauxLivraison}%`} change={`+${stats.tendances.livraison}%`} color="#ffb830" />
        </div>
        <div onClick={() => navigate('/stock')} style={{ cursor: 'pointer' }}>
          <StatCard label="Alertes stock faible" value={stats.alertesStock} change="Réapprovisionnement requis" color="#ff5a5a" changeType="down" />
        </div>
      </div>

      {/* Graphique + Commandes récentes */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
        {/* Graphique revenus */}
        <div style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ffffff12', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>Revenus & commandes</div>
              <div style={{ fontSize: 11, color: '#555e78', marginTop: 2 }}>7 derniers jours · XAF</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['7J', '30J', '90J'].map((l, i) => (
                <button key={l} style={{ padding: '4px 10px', border: '1px solid #ffffff1e', borderRadius: 20, background: i === 0 ? '#181c26' : 'transparent', color: i === 0 ? '#e8ecf4' : '#555e78', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ padding: '20px' }}>
            <MiniChart data={stats.graphique} />
          </div>
        </div>

        {/* Modes de paiement */}
        <div style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ffffff12' }}>
            <div style={{ fontWeight: 500, fontSize: 14 }}>Modes de paiement</div>
            <div style={{ fontSize: 11, color: '#555e78', marginTop: 2 }}>Répartition ce mois</div>
          </div>
          <div style={{ padding: '16px 20px' }}>
            {stats.paiements.map((p, i) => {
              const colors = ['#ffb830', '#ff7f50', '#4f9eff'];
              return (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                    <span style={{ color: '#8b92a8' }}>{p.mode}</span>
                    <span style={{ fontWeight: 600, color: colors[i] }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#1e2330', borderRadius: 4 }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: colors[i], borderRadius: 4, transition: 'width .6s' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#555e78', marginTop: 3 }}>{p.montant.toLocaleString('fr-FR')} XAF</div>
                </div>
              );
            })}
            <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #ffffff0a' }}>
              <div style={{ fontSize: 11, color: '#555e78', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>Volume total</div>
              <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.5px' }}>{stats.totalCA.toLocaleString('fr-FR')} <span style={{ fontSize: 13, fontWeight: 400, color: '#8b92a8' }}>XAF</span></div>
              <div style={{ fontSize: 12, color: '#00e5a0', marginTop: 3 }}>↑ +{stats.tendances.ca}% vs mois dernier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mini stats bottom */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 12 }}>
        {[
          { label: 'Livreurs actifs', value: '7', color: '#00e5a0' },
          { label: 'Zones couvertes', value: '4', color: '#e8ecf4' },
          { label: 'Délai moyen livraison', value: '2.4h', color: '#4f9eff' },
          { label: 'Note moyenne client', value: '4.7★', color: '#ffb830' },
          { label: 'Taux de retour', value: '1.8%', color: '#a78bfa' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-.5px', color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: '#555e78', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

// ── Graphique SVG léger ──────────────────────────────────────────────────
function MiniChart({ data }) {
  if (!data?.length) return null;
  const W = 500, H = 160, PAD = 30;
  const maxCA = Math.max(...data.map(d => d.ca));
  const pts = data.map((d, i) => {
    const x = PAD + (i / (data.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((d.ca / maxCA) * (H - PAD * 2));
    return { x, y, ...d };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${H - PAD} ` + pts.map(p => `${p.x},${p.y}`).join(' ') + ` ${pts[pts.length - 1].x},${H - PAD}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 160 }}>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00e5a0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00e5a0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Grille */}
      {[0.25, 0.5, 0.75, 1].map(v => (
        <line key={v} x1={PAD} y1={H - PAD - v * (H - PAD * 2)} x2={W - PAD} y2={H - PAD - v * (H - PAD * 2)} stroke="#ffffff08" strokeWidth="1" />
      ))}
      {/* Zone */}
      <polygon fill="url(#g1)" points={area} />
      {/* Ligne */}
      <polyline fill="none" stroke="#00e5a0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={polyline} />
      {/* Points + labels X */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={i === pts.length - 1 ? 4 : 3} fill="#00e5a0" stroke="#0d0f14" strokeWidth="2" />
          <text x={p.x} y={H - 6} fill="#555e78" fontSize="10" textAnchor="middle" fontFamily="system-ui">{p.jour}</text>
        </g>
      ))}
    </svg>
  );
}
