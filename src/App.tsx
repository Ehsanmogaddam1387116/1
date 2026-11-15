import { useState, useEffect } from 'react';
import { CartProvider } from './CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

type Page = 'home' | 'products' | 'product' | 'cart' | 'about' | 'contact';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [productId, setProductId] = useState<string | undefined>();

  const navigate = (newPage: string, newProductId?: string) => {
    setPage(newPage as Page);
    if (newProductId) setProductId(newProductId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
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
  );
}

export default App;
