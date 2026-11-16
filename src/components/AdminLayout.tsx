import { useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X, Wrench, Store } from 'lucide-react';
import { logoutAdmin } from '../pages/AdminLoginPage';

type Props = {
  onNavigate: (page: string) => void;
  currentPage: string;
  onLogout: () => void;
  children: React.ReactNode;
};

type NavItem = { page: string; label: string; icon: typeof LayoutDashboard };

const navItems: NavItem[] = [
  { page: 'admin-dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { page: 'admin-products', label: 'محصولات', icon: Package },
  { page: 'admin-orders', label: 'سفارش‌ها', icon: ShoppingBag },
];

export default function AdminLayout({ onNavigate, currentPage, onLogout, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (page: string) => {
    onNavigate(page);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logoutAdmin();
    onLogout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden lg:flex w-64 bg-primary-950 text-white flex-col fixed inset-y-0 right-0 z-40">
        <div className="p-5 border-b border-primary-800/50">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
              <Wrench size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold">ابزارسان</h2>
              <p className="text-[10px] text-primary-300">پنل مدیریت</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.page}
                onClick={() => handleNav(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  currentPage === item.page
                    ? 'bg-accent-500 text-white'
                    : 'text-primary-300 hover:bg-primary-800/50'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-primary-800/50 space-y-1">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-300 hover:bg-primary-800/50 transition-colors"
          >
            <Store size={20} />
            مشاهده سایت
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            خروج
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside
            className="absolute top-0 right-0 bottom-0 w-64 bg-primary-950 text-white flex flex-col animate-slide-down"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-primary-800/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center">
                  <Wrench size={22} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold">ابزارسان</h2>
                  <p className="text-[10px] text-primary-300">پنل مدیریت</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.page}
                    onClick={() => handleNav(item.page)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      currentPage === item.page
                        ? 'bg-accent-500 text-white'
                        : 'text-primary-300 hover:bg-primary-800/50'
                    }`}
                  >
                    <Icon size={20} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="p-3 border-t border-primary-800/50 space-y-1">
              <button
                onClick={() => onNavigate('home')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-primary-300 hover:bg-primary-800/50"
              >
                <Store size={20} />
                مشاهده سایت
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10"
              >
                <LogOut size={20} />
                خروج
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:mr-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-primary-950 text-white sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-accent-500 rounded-lg flex items-center justify-center">
                <Wrench size={18} className="text-white" />
              </div>
              <span className="font-bold text-sm">پنل مدیریت</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-primary-800/50 rounded-lg">
              <Menu size={22} />
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
