import { useState } from 'react';
import { ShoppingCart, Star, Check, Truck, ShieldCheck, RotateCcw, ChevronLeft, Minus, Plus, Share2 } from 'lucide-react';
import { getProductById, getCategoryById, getProductsByCategory, formatPrice } from '../data';
import { useCart } from '../CartContext';
import ProductCard from '../components/ProductCard';

type Props = {
  productId: string;
  onNavigate: (page: string, productId?: string) => void;
};

export default function ProductDetailPage({ productId, onNavigate }: Props) {
  const product = getProductById(productId);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'specs'>('description');

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">محصول یافت نشد</p>
        <button onClick={() => onNavigate('products')} className="btn-primary mt-4">
          بازگشت به محصولات
        </button>
      </div>
    );
  }

  const category = getCategoryById(product.categoryId);
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
            <button onClick={() => onNavigate('home')} className="hover:text-accent-600">صفحه اصلی</button>
            <ChevronLeft size={14} />
            <button onClick={() => onNavigate('products')} className="hover:text-accent-600">محصولات</button>
            <ChevronLeft size={14} />
            {category && (
              <>
                <button onClick={() => onNavigate('products')} className="hover:text-accent-600">{category.name}</button>
                <ChevronLeft size={14} />
              </>
            )}
            <span className="text-primary-800 font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product image */}
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 aspect-square sticky top-28">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 right-4 bg-accent-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
                  {discount}٪ تخفیف
                </span>
              )}
            </div>
          </div>

          {/* Product info */}
          <div>
            <p className="text-sm font-semibold text-accent-600 mb-2">{product.brand}</p>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-3 leading-8">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < Math.round(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">{product.rating}</span>
              <span className="text-sm text-gray-400">({product.reviewCount} نظر)</span>
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 mb-5">
              <span className={`w-2.5 h-2.5 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                {product.inStock ? 'موجود در انبار' : 'ناموجود'}
              </span>
            </div>

            {/* Price */}
            <div className="bg-gray-50 rounded-xl p-5 mb-5">
              {product.oldPrice && (
                <p className="text-sm text-gray-400 line-through mb-1">{formatPrice(product.oldPrice)}</p>
              )}
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold text-primary-900">{formatPrice(product.price)}</p>
                {discount > 0 && (
                  <span className="bg-accent-100 text-accent-700 text-xs font-bold px-2 py-1 rounded">
                    {discount}٪ تخفیف
                  </span>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-sm font-semibold text-gray-700">تعداد:</span>
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-bold text-gray-800 min-w-[3rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 ${
                  added
                    ? 'bg-green-500 text-white'
                    : 'bg-accent-500 hover:bg-accent-600 text-white hover:shadow-lg hover:shadow-accent-500/30'
                } ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    به سبد اضافه شد
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    افزودن به سبد خرید
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  navigator.share?.({ title: product.name }).catch(() => {});
                }}
                className="p-3.5 border-2 border-gray-200 rounded-xl hover:border-primary-800 hover:text-primary-800 transition-colors"
              >
                <Share2 size={20} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
              {[
                { icon: Truck, text: 'ارسال سریع' },
                { icon: ShieldCheck, text: 'ضمانت اصالت' },
                { icon: RotateCcw, text: 'بازگشت ۷ روزه' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center gap-1.5">
                    <Icon size={20} className="text-primary-700" />
                    <span className="text-[11px] text-gray-600 font-medium">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-12">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'description'
                  ? 'text-accent-600 border-b-2 border-accent-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              توضیحات محصول
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'specs'
                  ? 'text-accent-600 border-b-2 border-accent-500'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              مشخصات فنی
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'description' ? (
              <div>
                <p className="text-sm text-gray-600 leading-7 mb-6">{product.description}</p>
                <h4 className="text-sm font-bold text-gray-800 mb-3">ویژگی‌های محصول:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check size={16} className="text-green-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specs.map((spec, i) => (
                      <tr
                        key={i}
                        className={i % 2 === 0 ? 'bg-gray-50' : ''}
                      >
                        <td className="py-3 px-4 font-semibold text-gray-700 w-1/3">{spec.label}</td>
                        <td className="py-3 px-4 text-gray-600">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-primary-900 mb-6">محصولات مرتبط</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
