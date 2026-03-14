import { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Tag, LogOut, ArrowRight, Menu, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import './AdminPages.css';

export default function AdminLayout() {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthenticated(true);
      } else {
        navigate('/admin/login');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthenticated(false);
        navigate('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  if (!authenticated) return null;

  const navItems = [
    { to: '/admin', icon: <LayoutDashboard size={18} />, label: 'لوحة التحكم', exact: true },
    { to: '/admin/products', icon: <Package size={18} />, label: 'المنتجات' },
    { to: '/admin/orders', icon: <ShoppingCart size={18} />, label: 'الطلبات' },
    { to: '/admin/discounts', icon: <Tag size={18} />, label: 'أكواد الخصم' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Mobile Toggle Button */}
      <button 
        className="admin-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle Admin Menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Overlay */}
      <div 
        className={`admin-sidebar-overlay ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      <aside className={`admin-sidebar glass ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <span className="en sidebar-logo">TAGMESH</span>
          <span className="sidebar-badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-link ${isActive(item.to, item.exact) ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link" target="_blank">
            <ArrowRight size={18} />
            <span>الموقع</span>
          </Link>
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
