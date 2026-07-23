import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Truck, Tag, Settings, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import logo from '../imports/drippy logo.png';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdminHome = location.pathname === '/admin';
  const hash = location.hash;

  const NAV_ITEMS = [
    { label: 'Dashboard', to: '/admin', isActive: isAdminHome && !hash },
    { label: 'Products', to: '/admin#products-heading', isActive: isAdminHome && hash === '#products-heading' },
    { label: 'Delivery Rates', to: '/admin#delivery-heading', isActive: isAdminHome && hash === '#delivery-heading' },
    { label: 'Orders', to: '/admin/orders', isActive: location.pathname === '/admin/orders' },
    { label: 'Shipment Tracking', to: '/admin/tracking', isActive: location.pathname === '/admin/tracking' },
    { label: 'Settings', to: '/admin/settings', isActive: location.pathname === '/admin/settings' },
  ];

  const ICONS = [LayoutDashboard, Package, Tag, ShoppingBag, Truck, Settings];

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleNavClick = (to: string) => {
    setSidebarOpen(false);
    // If navigating to an anchor on the current page, scroll to it manually
    const [path, hashPart] = to.split('#');
    if (hashPart && location.pathname === path) {
      setTimeout(() => {
        document.getElementById(hashPart)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-bone">
      {/* Admin top bar */}
      <header className="fixed top-0 left-0 right-0 z-[60] h-16 flex items-center gap-4 px-4 sm:px-6 bg-[rgba(26,14,5,0.97)] backdrop-blur-xl border-b border-white/10">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-bone hover:border-volt/40 transition-all cursor-pointer shrink-0"
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <Link to="/" className="flex items-center h-full overflow-hidden">
          <img src={logo} alt="Drippy" className="h-24 w-auto object-contain -my-4" />
        </Link>
        <span className="text-xs font-mono uppercase tracking-widest text-ash border-l border-white/10 pl-4 ml-1 hidden sm:inline">
          Admin
        </span>
      </header>

      {/* Sidebar (slide-out panel) */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-zinc border-r border-white/10 flex flex-col z-[55] transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto pt-4">
          {NAV_ITEMS.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => handleNavClick(item.to)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  item.isActive
                    ? 'bg-volt/10 text-volt border border-volt/20'
                    : 'text-ash hover:text-bone hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-ash hover:text-rose-400 hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed top-16 inset-x-0 bottom-0 bg-ink/70 backdrop-blur-sm z-[50]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="pt-16">{children}</main>
    </div>
  );
}