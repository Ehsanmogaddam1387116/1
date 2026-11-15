import { useState, useMemo } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { categories, products } from '../data';
import ProductCard from '../components/ProductCard';

type Props = {
  onNavigate: (page: string, productId?: string) => void;
  initialCategory?: string;
};

type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating';

export default function ProductsPage({ onNavigate, initialCategory }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoryId === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query)
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    setShowFilters(false);
  };

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-primary-950 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">محصولات</h1>
          <p className="text-sm text-primary-300">مجموعه کاملی از ابزارهای کارگاهی و صنعتی</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="نام محصول یا برند را وارد کنید..."
              className="w-full bg-white border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 shadow-sm"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 shadow-sm cursor-pointer"
            >
              <option value="default">مرتب‌سازی: پیش‌فرض</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating">محبوب‌ترین</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm font-semibold flex items-center gap-2 shadow-sm"
            >
              <SlidersHorizontal size={18} />
              فیلتر
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar - desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-28">
              <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} />
                دسته‌بندی‌ها
              </h3>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-800 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  همه محصولات
                  <span className="float-left text-xs opacity-70">{products.length}</span>
                </button>
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary-800 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                      <span className="float-left text-xs opacity-70">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowFilters(false)}>
              <div
                className="absolute top-0 right-0 bottom-0 w-72 bg-white p-5 animate-slide-down overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-800">دسته‌بندی‌ها</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X size={20} />
                  </button>
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === 'all' ? 'bg-primary-800 text-white' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    همه محصولات ({products.length})
                  </button>
                  {categories.map((cat) => {
                    const count = products.filter((p) => p.categoryId === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`text-right px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedCategory === cat.id ? 'bg-primary-800 text-white' : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {cat.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredProducts.length} محصول یافت شد
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
                <p className="text-gray-400 text-lg mb-2">محصولی یافت نشد</p>
                <p className="text-sm text-gray-400">فیلترها را تغییر دهید یا جستجوی دیگری امتحان کنید</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
