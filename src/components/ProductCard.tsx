import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice } from '../ProductsContext';
import { useCart } from '../CartContext';

type Props = {
  product: Product;
  onNavigate: (page: string, productId?: string) => void;
};

export default function ProductCard({ product, onNavigate }: Props) {
  const { addToCart } = useCart();

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div
      className="card-hover bg-white rounded-2xl overflow-hidden border border-gray-100 flex flex-col cursor-pointer group"
      onClick={() => onNavigate('product', product.id)}
    >
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {discount}٪ تخفیف
          </span>
        )}
        {product.isBestseller && (
          <span className="absolute top-3 left-3 bg-primary-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            پرفروش
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-accent-600 font-semibold mb-1">{product.brand}</p>
        <h3 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 leading-6 min-h-[3rem]">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(product.rating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 mr-1">({product.reviewCount})</span>
        </div>

        <div className="mt-auto">
          {product.oldPrice && (
            <p className="text-xs text-gray-400 line-through mb-0.5">
              {formatPrice(product.oldPrice)}
            </p>
          )}
          <p className="text-base font-bold text-primary-800 mb-3">{formatPrice(product.price)}</p>

          <button
            className="w-full bg-accent-500 hover:bg-accent-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product.id);
            }}
          >
            <ShoppingCart size={16} />
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}
