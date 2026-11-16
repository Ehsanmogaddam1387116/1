import { Trash2, Minus, Plus, ShoppingCart, ArrowLeft, Check, User, Phone, MapPin } from 'lucide-react';
import { useCart } from '../CartContext';
import { useProducts, formatPrice } from '../ProductsContext';
import { supabase } from '../supabaseClient';
import { useState } from 'react';

type Props = {
  onNavigate: (page: string, productId?: string) => void;
};

export default function CartPage({ onNavigate }: Props) {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const { getProductById } = useProducts();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingCost = totalPrice >= 2000000 || totalPrice === 0 ? 0 : 150000;
  const finalTotal = totalPrice + shippingCost;

  const handleSubmitOrder = async () => {
    if (!customer.name.trim() || !customer.phone.trim() || !customer.address.trim()) {
      setError('لطفاً تمام فیلدها را پر کنید');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_address: customer.address,
          total_amount: finalTotal,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((item) => {
        const product = getProductById(item.productId);
        return {
          order_id: orderData.id,
          product_id: item.productId,
          product_name: product?.name || '',
          product_image: product?.image || '',
          price: product?.price || 0,
          quantity: item.quantity,
        };
      });

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ثبت سفارش');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-3">سفارش شما ثبت شد!</h1>
          <p className="text-sm text-gray-500 mb-6 leading-6">
            از خرید شما سپاسگزاریم. سفارش شما در حال پردازش است و به زودی ارسال خواهد شد.
          </p>
          <button onClick={() => onNavigate('home')} className="btn-primary">
            بازگشت به صفحه اصلی
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-gray-300" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 mb-3">سبد خرید شما خالی است</h1>
          <p className="text-sm text-gray-500 mb-6">هنوز محصولی به سبد خرید اضافه نکرده‌اید</p>
          <button onClick={() => onNavigate('products')} className="btn-primary inline-flex items-center gap-2">
            مشاهده محصولات
            <ArrowLeft size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-primary-950 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold mb-2">سبد خرید</h1>
          <p className="text-sm text-primary-300">{totalItems} کالا در سبد خرید شما</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {items.map((item, index) => {
                const product = getProductById(item.productId);
                if (!product) return null;

                return (
                  <div
                    key={item.productId}
                    className={`flex gap-4 p-4 md:p-5 ${index !== items.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div
                      className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0 cursor-pointer"
                      onClick={() => onNavigate('product', product.id)}
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="text-xs text-accent-600 font-semibold mb-1">{product.brand}</p>
                          <h3
                            className="text-sm md:text-base font-bold text-gray-800 cursor-pointer hover:text-accent-600 transition-colors"
                            onClick={() => onNavigate('product', product.id)}
                          >
                            {product.name}
                          </h3>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-end justify-between mt-auto">
                        <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 font-bold text-gray-800 text-sm min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <div className="text-left">
                          <p className="text-sm md:text-base font-bold text-primary-900">
                            {formatPrice(product.price * item.quantity)}
                          </p>
                          <p className="text-xs text-gray-400">{formatPrice(product.price)} / هر عدد</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="p-4 border-t border-gray-100 flex justify-between items-center">
                <button
                  onClick={clearCart}
                  className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  پاک کردن سبد
                </button>
                <button
                  onClick={() => onNavigate('products')}
                  className="text-sm text-accent-600 hover:text-accent-700 font-semibold flex items-center gap-1"
                >
                  ادامه خرید
                  <ArrowLeft size={16} />
                </button>
              </div>
            </div>

            {/* Checkout form */}
            {showCheckout && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-6 animate-slide-down">
                <h3 className="text-base font-bold text-gray-800 mb-4">اطلاعات تحویل</h3>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 mb-4 text-sm">
                    {error}
                  </div>
                )}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">نام و نام خانوادگی</label>
                    <div className="relative">
                      <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        value={customer.name}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        placeholder="نام خود را وارد کنید"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">شماره تماس</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">آدرس</label>
                    <div className="relative">
                      <MapPin className="absolute right-3 top-4 text-gray-400" size={18} />
                      <textarea
                        rows={3}
                        value={customer.address}
                        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                        placeholder="آدرس کامل تحویل"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-28">
              <h3 className="text-base font-bold text-gray-800 mb-5">خلاصه سفارش</h3>

              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">مجموع کالاها</span>
                  <span className="font-semibold text-gray-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">هزینه ارسال</span>
                  <span className="font-semibold text-gray-800">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">رایگان</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>
                {shippingCost === 0 && totalPrice > 0 && (
                  <div className="bg-green-50 text-green-700 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                    <Check size={14} />
                    ارسال رایگان برای خرید بالای ۲ میلیون تومان
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">مبلغ قابل پرداخت</span>
                  <span className="text-xl font-bold text-primary-900">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              {showCheckout ? (
                <button
                  onClick={handleSubmitOrder}
                  disabled={submitting}
                  className="w-full btn-primary mb-3 disabled:opacity-50"
                >
                  {submitting ? 'در حال ثبت...' : 'تایید و ثبت سفارش'}
                </button>
              ) : (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full btn-primary mb-3"
                >
                  ادامه و ثبت سفارش
                </button>
              )}

              <p className="text-[11px] text-gray-400 text-center leading-5">
                با ثبت سفارش، شرایط خرید از ابزارسان را می‌پذیرید.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
