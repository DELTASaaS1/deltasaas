// ─── Badge statut ─────────────────────────────────────────────────────────
const STATUT_STYLES = {
  Livrée:      { bg: '#00e5a020', color: '#00e5a0' },
  livrée:      { bg: '#00e5a020', color: '#00e5a0' },
  livré:       { bg: '#00e5a020', color: '#00e5a0' },
  Transit:     { bg: '#4f9eff20', color: '#4f9eff' },
  en_transit:  { bg: '#4f9eff20', color: '#4f9eff' },
  Préparation: { bg: '#ffb83020', color: '#ffb830' },
  preparation: { bg: '#ffb83020', color: '#ffb830' },
  Confirmée:   { bg: '#ffffff14', color: '#8b92a8' },
  Annulée:     { bg: '#ff5a5a20', color: '#ff5a5a' },
  annulé:      { bg: '#ff5a5a20', color: '#ff5a5a' },
  Critique:    { bg: '#ff5a5a20', color: '#ff5a5a' },
  Normal:      { bg: '#00e5a020', color: '#00e5a0' },
};

export function Badge({ statut }) {
  const s = STATUT_STYLES[statut] || { bg: '#ffffff14', color: '#8b92a8' };
  const labels = { en_transit: 'En transit', livré: 'Livré', preparation: 'Préparation', annulé: 'Annulé' };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 9px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }} />
      {labels[statut] || statut}
    </span>
  );
}

// ─── Carte KPI ─────────────────────────────────────────────────────────────
export function StatCard({ label, value, change, changeType = 'up', color = '#00e5a0', suffix = '' }) {
  return (
    <div style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 11, color: '#555e78', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.5px', color }}>{typeof value === 'number' ? value.toLocaleString('fr-FR') : value}{suffix}</div>
      {change != null && (
        <div style={{ fontSize: 11, color: changeType === 'up' ? '#00e5a0' : '#ff5a5a', marginTop: 4 }}>
          {changeType === 'up' ? '↑' : '↓'} {change}
        </div>
      )}
    </div>
  );
}

// ─── Tableau générique ─────────────────────────────────────────────────────
export function Table({ columns, data, onRowClick, loading }) {
  if (loading) return <div style={{ padding: '40px', textAlign: 'center', color: '#555e78' }}>Chargement…</div>;
  return (
    <div style={{ background: '#12151c', border: '1px solid #ffffff12', borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#181c26', borderBottom: '1px solid #ffffff12' }}>
            {columns.map(col => (
              <th key={col.key} style={{ padding: '10px 14px', fontSize: 11, fontWeight: 500, color: '#555e78', textTransform: 'uppercase', letterSpacing: '.07em', textAlign: col.align || 'left', whiteSpace: 'nowrap' }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding: 32, textAlign: 'center', color: '#555e78' }}>Aucun résultat</td></tr>
          ) : data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              style={{ borderBottom: '1px solid #ffffff0a', cursor: onRowClick ? 'pointer' : 'default', transition: 'background .1s' }}
              onMouseEnter={e => { if (onRowClick) e.currentTarget.style.background = '#181c26'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {columns.map(col => (
                <td key={col.key} style={{ padding: '11px 14px', fontSize: 13, color: '#e8ecf4', textAlign: col.align || 'left', verticalAlign: 'middle' }}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Barre de recherche ────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Rechercher…' }) {
  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
      <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555e78', fontSize: 15, pointerEvents: 'none' }}>🔍</span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', padding: '8px 10px 8px 32px', border: '1px solid #ffffff1e', borderRadius: 8, background: '#12151c', color: '#e8ecf4', fontSize: 13, fontFamily: 'inherit', outline: 'none' }}
      />
    </div>
  );
}

// ─── Onglets filtre ────────────────────────────────────────────────────────
export function Tabs({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #ffffff12' }}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          style={{
            padding: '9px 16px', fontSize: 13, border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit',
            color: active === tab.value ? '#4f9eff' : '#8b92a8',
            borderBottom: active === tab.value ? '2px solid #4f9eff' : '2px solid transparent',
            marginBottom: -1, whiteSpace: 'nowrap', transition: 'all .15s',
          }}
        >
          {tab.label}
          {tab.count != null && (
            <span style={{ marginLeft: 5, padding: '1px 5px', borderRadius: 10, fontSize: 10, background: active === tab.value ? '#4f9eff20' : '#181c26', color: active === tab.value ? '#4f9eff' : '#555e78' }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Modal ─────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000000aa', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={onClose}>
      <div style={{ background: '#12151c', border: '1px solid #ffffff1e', borderRadius: 14, padding: 24, minWidth: 460, maxWidth: 600, width: '90vw', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: '1px solid #ffffff1e', color: '#8b92a8', borderRadius: 8, width: 30, height: 30, cursor: 'pointer', fontSize: 16 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ─── Boutons ───────────────────────────────────────────────────────────────
export function Btn({ children, onClick, variant = 'ghost', disabled, style = {} }) {
  const base = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 13px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: disabled ? 0.5 : 1, border: 'none', transition: 'all .15s' };
  const variants = {
    ghost:   { background: 'transparent', color: '#8b92a8', border: '1px solid #ffffff1e' },
    primary: { background: '#00e5a0', color: '#0d0f14' },
    danger:  { background: '#ff5a5a22', color: '#ff5a5a', border: '1px solid #ff5a5a44' },
    blue:    { background: '#4f9eff22', color: '#4f9eff', border: '1px solid #4f9eff44' },
  };
  return <button style={{ ...base, ...variants[variant], ...style }} onClick={onClick} disabled={disabled}>{children}</button>;
}

// ─── Input label ───────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 11, color: '#555e78', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 5 }}>{label}</label>
      {children}
    </div>
  );
}

export const inputStyle = {
  width: '100%', padding: '9px 12px', border: '1px solid #ffffff1e', borderRadius: 8,
  background: '#181c26', color: '#e8ecf4', fontSize: 13, fontFamily: 'inherit', outline: 'none',
};
