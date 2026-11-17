import { useState, useEffect } from 'react';
import { CartProvider } from './CartContext';
import { ProductsProvider } from './ProductsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage, { isAdminAuthed } from './pages/AdminLoginPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';

type Page =
  | 'home'
  | 'products'
  | 'product'
  | 'cart'
  | 'about'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-orders';

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').split('/')[0];
  const validPages: Page[] = [
    'home', 'products', 'product', 'cart', 'about', 'contact',
    'admin-login', 'admin-dashboard', 'admin-products', 'admin-orders',
  ];
  if (hash === 'admin') return 'admin-login';
  return validPages.includes(hash as Page) ? (hash as Page) : 'home';
}

function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);
  const [productId, setProductId] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(isAdminAuthed());
  }, []);

  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (newPage: string, newProductId?: string) => {
    const target = newPage === 'admin-login' ? 'admin' : newPage;
    window.location.hash = target;
    setPage(newPage as Page);
    if (newProductId) setProductId(newProductId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  const isAdminProtected = page === 'admin-dashboard' || page === 'admin-products' || page === 'admin-orders';

  // Admin login page - standalone, no storefront header/footer
  if (page === 'admin-login') {
    if (isAdmin) {
      return (
        <AdminLayout onNavigate={navigate} currentPage="admin-dashboard" onLogout={() => setIsAdmin(false)}>
          <AdminDashboard onNavigate={navigate} />
        </AdminLayout>
      );
    }
    return (
      <AdminLoginPage
        onLogin={() => setIsAdmin(true)}
        onNavigate={navigate}
      />
    );
  }

  // Admin protected pages - admin layout with sidebar
  if (isAdminProtected) {
    if (!isAdmin) {
      return <AdminLoginPage onLogin={() => setIsAdmin(true)} onNavigate={navigate} />;
    }

    return (
      <ProductsProvider>
        <AdminLayout onNavigate={navigate} currentPage={page} onLogout={() => setIsAdmin(false)}>
          {page === 'admin-dashboard' && <AdminDashboard onNavigate={navigate} />}
          {page === 'admin-products' && <AdminProducts onNavigate={navigate} />}
          {page === 'admin-orders' && <AdminOrders onNavigate={navigate} />}
        </AdminLayout>
      </ProductsProvider>
    );
  }

  // Storefront pages
  return (
    <ProductsProvider>
      <CartProvider>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header onNavigate={navigate} currentPage={page} />

          <main className="flex-1">
            {page === 'home' && <HomePage onNavigate={navigate} />}
            {page === 'products' && <ProductsPage onNavigate={navigate} />}
            {page === 'product' && productId && (
              <ProductDetailPage productId={productId} onNavigate={navigate} />
            )}
            {page === 'cart' && <CartPage onNavigate={navigate} />}
            {page === 'about' && <AboutPage onNavigate={navigate} />}
            {page === 'contact' && <ContactPage onNavigate={navigate} />}
          </main>

          <Footer onNavigate={navigate} />
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}

export default App;
