import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const NAV = [
  { section: 'Principal' },
  { to: '/', icon: '⊞', label: "Vue d'ensemble" },
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

export default function Layout({ children }) {
  const location = useLocation();

  const pageTitle = () => {
    const map = {
      '/': "Vue d'ensemble",
      '/commandes': 'Commandes',
      '/produits': 'Produits',
      '/stock': 'Stock',
      '/livraisons': 'Livraisons',
      '/paiements': 'Paiements',
      '/analytics': 'Analytics',
      '/zones': 'Zones & Tarifs',
      '/equipe': 'Équipe & Livreurs',
    };
    return map[location.pathname] || 'DeltaSaaS';
  };

  return (
    <div style={styles.appLayout}>
      {/* ── SIDEBAR ── */}
      <aside style={styles.sidebar}>
        {/* Logo */}
        <div style={styles.logoContainer}>
          <div style={styles.logoIcon}>✓</div>
          <div>
            <div style={styles.logoText}>DeltaSaaS</div>
            <div style={styles.logoSubtext}>Logistique · Afrique</div>
          </div>
        </div>

        {/* Tenant */}
        <div style={styles.tenantBox}>
          <div style={styles.tenantDot} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.tenantName}>Boutique Ange — Kribi</div>
            <div style={styles.tenantPlan}>Plan Pro · Actif</div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={styles.navContainer}>
          {NAV.map((item, i) =>
            item.section ? (
              <div key={i} style={styles.navSectionHeader}>
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                style={({ isActive }) => ({
                  ...styles.navItem,
                  ...(isActive ? styles.navItemActive : {}),
                })}
              >
                {({ isActive }) => (
                  <>
                    <span style={styles.navIcon}>{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span
                        style={{
                          ...styles.badge,
                          ...(item.badgeColor === 'red' ? styles.badgeRed : styles.badgeAmber),
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          )}
        </nav>

        {/* User */}
        <div style={styles.sidebarFooter}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>AD</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={styles.userName}>Ange Dubois</div>
              <div style={styles.userRole}>Administrateur</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={styles.mainWrapper}>
        {/* Topbar */}
        <header style={styles.topbar}>
          <div>
            <h1 style={styles.pageTitle}>{pageTitle()}</h1>
            <div style={styles.pageDate}>
              {new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>

          <div style={styles.topbarActions}>
            <button style={styles.btnGhost}>📥 Exporter</button>

            {location.pathname === '/commandes' && (
              <NavLink to="/commandes/new" style={styles.btnPrimary}>
                + Nouvelle commande
              </NavLink>
            )}

            {location.pathname === '/stock' && (
              <button style={styles.btnPrimary} onClick={() => alert('Modal ajout produit')}>
                + Nouveau produit
              </button>
            )}

            <div style={styles.notifButton}>
              🔔
              <span style={styles.notifBadgeDot} />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={styles.contentArea}>{children}</main>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F8FAFC; color: #0F172A; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F1F5F9; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
      `}</style>
    </div>
  );
}

const styles = {
  appLayout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#F8FAFC',
    color: '#0F172A',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },
  sidebar: {
    width: '230px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid #E2E8F0',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 40,
  },
  logoContainer: {
    padding: '18px 20px',
    borderBottom: '1px solid #F1F5F9',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    width: '32px',
    height: '32px',
    background: '#0F172A',
    color: '#00E5A0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: '-0.3px',
    lineHeight: '1.2',
  },
  logoSubtext: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginTop: '2px',
  },
  tenantBox: {
    margin: '12px 14px',
    padding: '9px 12px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tenantDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#00E5A0',
    animation: 'pulse 2s infinite',
    boxShadow: '0 0 6px rgba(0, 229, 160, 0.4)',
  },
  tenantName: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#1E293B',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  tenantPlan: {
    fontSize: '10px',
    fontWeight: '600',
    color: '#059669',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  navContainer: {
    flex: 1,
    padding: '6px 0',
    overflowY: 'auto',
  },
  navSectionHeader: {
    padding: '14px 18px 6px',
    fontSize: '10px',
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#475569',
    textDecoration: 'none',
    transition: 'all .15s ease',
    borderLeft: '3px solid transparent',
  },
  navItemActive: {
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    fontWeight: '600',
    borderLeft: '3px solid #0F172A',
  },
  navIcon: {
    fontSize: '15px',
    width: '20px',
    textAlign: 'center',
    display: 'inline-block',
  },
  badge: {
    fontSize: '10px',
    fontWeight: '600',
    padding: '1px 7px',
    borderRadius: '12px',
    lineHeight: '1.2',
  },
  badgeRed: {
    backgroundColor: '#FEE2E2',
    color: '#DC2626',
  },
  badgeAmber: {
    backgroundColor: '#FEF3C7',
    color: '#D97706',
  },
  sidebarFooter: {
    padding: '12px 14px',
    borderTop: '1px solid #F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#3B82F6',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#0F172A',
    lineHeight: '1.2',
  },
  userRole: {
    fontSize: '11px',
    color: '#64748B',
  },
  mainWrapper: {
    flex: 1,
    marginLeft: '230px',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  topbar: {
    padding: '14px 28px',
    borderBottom: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: '-0.3px',
  },
  pageDate: {
    fontSize: '12px',
    color: '#64748B',
    marginTop: '2px',
    textTransform: 'capitalize',
  },
  topbarActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 13px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    backgroundColor: '#FFFFFF',
    color: '#334155',
    border: '1px solid #CBD5E1',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 13px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    border: '1px solid #0F172A',
    textDecoration: 'none',
    boxShadow: '0 1px 2px rgba(15, 23, 42, 0.12)',
  },
  notifButton: {
    width: '34px',
    height: '34px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    position: 'relative',
    fontSize: '14px',
  },
  notifBadgeDot: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '7px',
    height: '7px',
    backgroundColor: '#FF5A5A',
    borderRadius: '50%',
    border: '1.5px solid #FFFFFF',
  },
  contentArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 28px',
  },
};