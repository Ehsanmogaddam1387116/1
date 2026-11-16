import { useState, useEffect } from 'react';
import { Clock, Truck, CheckCircle, Eye, X, Phone, MapPin, User, Package } from 'lucide-react';
import { supabase } from '../../supabaseClient';

type Props = {
  onNavigate: (page: string) => void;
};

type Order = {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  status: string;
  created_at: string;
};

type OrderItem = {
  id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
};

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: 'در انتظار', color: 'bg-amber-100 text-amber-700 border-amber-300', icon: Clock },
  shipped: { label: 'ارسال شده', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Truck },
  delivered: { label: 'تحویل شده', color: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
};

export default function AdminOrders({ onNavigate }: Props) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      setOrders(data || []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      if (viewOrder?.id === orderId) {
        setViewOrder({ ...viewOrder, status: newStatus });
      }
    } catch {
      // ignore
    }
  };

  const handleViewOrder = async (order: Order) => {
    setViewOrder(order);
    setOrderItems([]);
    try {
      const { data } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order.id);
      setOrderItems(data || []);
    } catch {
      // keep empty
    }
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter((o) => o.status === filterStatus);

  const formatPrice = (price: number) => price.toLocaleString('fa-IR') + ' تومان';

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارش‌ها</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length.toLocaleString('fa-IR')} سفارش</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {[
          { key: 'all', label: 'همه' },
          { key: 'pending', label: 'در انتظار' },
          { key: 'shipped', label: 'ارسال شده' },
          { key: 'delivered', label: 'تحویل شده' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === tab.key
                ? 'bg-primary-800 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className="mr-1.5 text-xs opacity-70">({statusCounts[tab.key as keyof typeof statusCounts].toLocaleString('fa-IR')})</span>
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400">در حال بارگذاری...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">سفارشی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="py-3 px-4 text-right font-semibold">مشتری</th>
                  <th className="py-3 px-4 text-right font-semibold hidden md:table-cell">تلفن</th>
                  <th className="py-3 px-4 text-right font-semibold">مبلغ</th>
                  <th className="py-3 px-4 text-right font-semibold">وضعیت</th>
                  <th className="py-3 px-4 text-right font-semibold hidden lg:table-cell">تاریخ</th>
                  <th className="py-3 px-4 text-center font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const config = statusConfig[order.status] || statusConfig.pending;
                  const StatusIcon = config.icon;
                  return (
                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-800">{order.customer_name}</td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell" dir="ltr">{order.customer_phone}</td>
                      <td className="py-3 px-4 font-semibold text-primary-800 whitespace-nowrap">
                        {formatPrice(order.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer ${config.color}`}
                        >
                          <option value="pending">در انتظار</option>
                          <option value="shipped">ارسال شده</option>
                          <option value="delivered">تحویل شده</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs hidden lg:table-cell">
                        {new Date(order.created_at).toLocaleDateString('fa-IR')}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            aria-label="مشاهده"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">جزئیات سفارش</h2>
              <button onClick={() => setViewOrder(null)} className="p-2 hover:bg-gray-50 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Customer info */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={18} className="text-gray-400" />
                  <span className="font-semibold text-gray-800">{viewOrder.customer_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-600" dir="ltr">{viewOrder.customer_phone}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin size={18} className="text-gray-400 mt-0.5" />
                  <span className="text-gray-600">{viewOrder.customer_address}</span>
                </div>
              </div>

              {/* Order items */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3">اقلام سفارش</h3>
                <div className="space-y-3">
                  {orderItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                      <img
                        src={item.product_image}
                        alt={item.product_name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{item.product_name}</p>
                        <p className="text-xs text-gray-500">
                          {item.quantity.toLocaleString('fa-IR')} عدد × {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-primary-800 whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-gray-800">مبلغ کل</span>
                  <span className="text-lg font-bold text-primary-900">{formatPrice(viewOrder.total_amount)}</span>
                </div>

                {/* Status changer */}
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-gray-600">تغییر وضعیت:</span>
                  {Object.entries(statusConfig).map(([key, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => handleStatusChange(viewOrder.id, key)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          viewOrder.status === key
                            ? config.color
                            : 'bg-white text-gray-400 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <Icon size={14} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
