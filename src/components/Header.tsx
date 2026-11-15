import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Search, Wrench } from 'lucide-react';
import { useCart } from '../CartContext';
import { categories } from '../data';

type Props = {
  onNavigate: (page: string, productId?: string) => void;
  currentPage: string;
};

export default function Header({ onNavigate, currentPage }: Props) {
  const { totalItems } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'صفحه اصلی', page: 'home' },
    { label: 'محصولات', page: 'products' },
    { label: 'درباره ما', page: 'about' },
    { label: 'تماس با ما', page: 'contact' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('products', undefined);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary-950 text-white text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>ارسال رایگان برای خرید بالای ۲ میلیون تومان</span>
          </div>
          <div className="flex items-center gap-4">
            <span>۰۲۱-۸۸۷۷۶۶۵۵</span>
            <span className="text-primary-300">|</span>
            <span>پشتیبانی: ۰۹۱۲۳۴۵۶۷۸۹</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? 'shadow-lg shadow-primary-900/5' : 'shadow-sm'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleNav('home')}
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-primary-800 to-primary-950 rounded-xl flex items-center justify-center shadow-md">
                <Wrench className="text-accent-400" size={24} />
              </div>
              <div>
                <h1 className="text-lg md:text-xl font-bold text-primary-900 leading-none">ابزارسان</h1>
                <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">فروشگاه ابزارهای کارگاهی</p>
              </div>
            </div>

            {/* Search - desktop */}
            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8 relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی محصول..."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition-all"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </button>
            </form>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    currentPage === link.page
                      ? 'text-accent-600 bg-accent-50'
                      : 'text-gray-700 hover:text-primary-800 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            {/* Cart icon */}
            <button
              onClick={() => handleNav('cart')}
              className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="سبد خرید"
            >
              <ShoppingCart className="text-primary-800" size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -left-1 bg-accent-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-slide-down">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="منو"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 animate-slide-down">
            <div className="container mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="جستجوی محصول..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={18} />
                </button>
              </form>

              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.page}
                    onClick={() => handleNav(link.page)}
                    className={`px-4 py-3 text-right text-sm font-semibold rounded-lg transition-colors ${
                      currentPage === link.page
                        ? 'text-accent-600 bg-accent-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </nav>

              {/* Mobile categories */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 mb-2">دسته‌بندی‌ها</p>
                <div className="flex flex-col gap-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onNavigate('products', undefined);
                        setMobileMenuOpen(false);
                      }}
                      className="px-4 py-2 text-right text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
