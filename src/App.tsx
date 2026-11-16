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

function App() {
  const [page, setPage] = useState<Page>('home');
  const [productId, setProductId] = useState<string | undefined>();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (page === 'admin-login' || page === 'admin-dashboard' || page === 'admin-products' || page === 'admin-orders') {
      setIsAdmin(isAdminAuthed());
    }
  }, [page]);

  const navigate = (newPage: string, newProductId?: string) => {
    setPage(newPage as Page);
    if (newProductId) setProductId(newProductId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  const isAdminPage = page === 'admin-login' || page === 'admin-dashboard' || page === 'admin-products' || page === 'admin-orders';
  const isAdminProtected = page === 'admin-dashboard' || page === 'admin-products' || page === 'admin-orders';

  // Admin login page - standalone, no storefront header/footer
  if (page === 'admin-login') {
    if (isAdmin) {
      navigate('admin-dashboard');
      return null;
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
