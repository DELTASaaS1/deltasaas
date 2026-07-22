import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { section: 'Principal' },
  { to: '/', icon: '⊞', label: 'Vue d\'ensemble' },
  { to: '/commandes', icon: '🛍', label: 'Commandes', badge: '12', badgeColor: 'red' },
  { to: '/produits', icon: '📦', label: 'Produits' },
  { to: '/stock', icon: '🗃', label: 'Stock', badge: '3', badgeColor: 'amber' },
  { section: 'Opérations' },
  { to: '/livraisons', icon: '🚚', label: 'Livraisons' },
  { to: '/paiements', icon: '💳', label: 'Paiements' },
  { to: '/analytics', icon: '📊', label: 'Analytics' },
  { section: 'Paramètres' },
  { to: '/zones', icon: '🗺', label: 'Zones' },
  { to: '/equipe', icon: '👥', label: 'Équipe' },
];

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return isMobile;
}

export default function Layout({ children }) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const pageTitle = () => {
    const map = {
      '/': 'Vue d\'ensemble', '/commandes': 'Commandes', '/produits': 'Produits',
      '/stock': 'Stock', '/livraisons': 'Livraisons', '/paiements': 'Paiements',
      '/analytics': 'Analytics', '/zones': 'Zones de livraison', '/equipe': 'Équipe',
    };
    return map[location.pathname] || 'DeltaSaaS';
  };

  const sidebarContent = (
    <>
      <div style={{ padding: '20px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#00E5A0,#00B4D8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, color: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,229,160,0.35)', flexShrink: 0 }}>✓</div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px', color: '#0F172A' }}>DeltaSaaS</div>
          <div style={{ fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.1em' }}>Logistique · Afrique</div>
        </div>
        {isMobile && (
          <button onClick={() => setMenuOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#475569' }}>✕</button>
        )}
      </div>

      <div style={{ margin: '14px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 2px rgba(15,23,42,0.04)' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00E5A0', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Boutique Ange — Kribi</div>
          <div style={{ fontSize: 10, color: '#00A87C', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600 }}>Plan Pro · Actif</div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '8px 10px', overflowY: 'auto' }}>
        {NAV.map((item, i) =>
          item.section ? (
            <div key={i} style={{ padding: '16px 8px 6px', fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
              {item.section}
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', marginBottom: 2,
                fontSize: 13, fontWeight: isActive ? 600 : 500,
                color: isActive ? '#00A87C' : '#475569',
                background: isActive ? '#ECFDF5' : 'transparent',
                borderRadius: 8,
                textDecoration: 'none', transition: 'all .15s', position: 'relative',
                borderLeft: isActive ? '3px solid #00E5A0' : '3px solid transparent',
              })}
            >
              <span style={{ fontSize: 16, width: 20, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: item.badgeColor === 'red' ? '#FEE2E2' : '#FEF3C7',
                  color: item.badgeColor === 'red' ? '#FF5A5A' : '#B45309',
                  fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 20, flexShrink: 0,
                }}>{item.badge}</span>
              )}
            </NavLink>
          )
        )}
      </nav>

      <div style={{ padding: '14px', borderTop: '1px solid #E5E7EB' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, cursor: 'pointer', transition: 'background .15s' }}
             onMouseEnter={e => e.currentTarget.style.background = '#F8FAFC'}
             onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#4F9EFF,#A78BFA)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#fff', flexShrink: 0 }}>AD</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0F172A' }}>Ange Dubois</div>
            <div style={{ fontSize: 11, color: '#94A3B8' }}>Administrateur</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div style={{ display: isMobile ? 'block' : 'grid', gridTemplateColumns: isMobile ? undefined : '240px 1fr', minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {!isMobile && (
        <aside style={{ background: '#FFFFFF', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column' }}>
          {sidebarContent}
        </aside>
      )}

      {isMobile && menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.4)', zIndex: 100 }} />
      )}
      {isMobile && (
        <aside style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: '78vw', maxWidth: 280,
          background: '#FFFFFF', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column',
          zIndex: 101, transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform .2s ease',
        }}>
          {sidebarContent}
        </aside>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: '100vh' }}>
        <div style={{ padding: isMobile ? '12px 14px' : '16px 28px', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFFFFF', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 3px rgba(15,23,42,0.04)', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {isMobile && (
              <button onClick={() => setMenuOpen(true)} style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 8, width: 34, height: 34, fontSize: 16, cursor: 'pointer', color: '#475569', flexShrink: 0 }}>☰</button>
            )}
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: isMobile ? 16 : 19, fontWeight: 700, letterSpacing: '-0.3px', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pageTitle()}</div>
              {!isMobile && (
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
            {!isMobile && <button style={btnGhost}>📥 Exporter</button>}
            {location.pathname === '/commandes' && !isMobile && (
              <NavLink to="/commandes/new" style={btnPrimary}>+ Nouvelle commande</NavLink>
            )}
            <div style={{ width: 36, height: 36, background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
              🔔
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: '#FF5A5A', borderRadius: '50%', border: '2px solid #FFFFFF' }} />
            </div>
          </div>
        </div>

        <main style={{ flex: 1, overflow: 'auto', padding: isMobile ? '14px' : '24px 28px' }}>
          {children}
        </main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8FAFC; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </div>
  );
}

const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
  background: '#FFFFFF', color: '#475569', border: '1px solid #E5E7EB',
};
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
  borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
  background: '#00E5A0', color: '#0F172A', border: 'none', textDecoration: 'none',
  boxShadow: '0 1px 2px rgba(0,229,160,0.4)',
};
