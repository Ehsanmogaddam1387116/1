import { Package, ShoppingBag, Clock, Truck, CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

type Props = {
  onNavigate: (page: string) => void;
};

type Stats = {
  productCount: number;
  orderCount: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  totalRevenue: number;
};

export default function AdminDashboard({ onNavigate }: Props) {
  const [stats, setStats] = useState<Stats>({
    productCount: 0,
    orderCount: 0,
    pendingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      const { data: orders } = await supabase.from('orders').select('*');

      const orderList = orders || [];
      setStats({
        productCount: productCount || 0,
        orderCount: orderList.length,
        pendingOrders: orderList.filter((o) => o.status === 'pending').length,
        shippedOrders: orderList.filter((o) => o.status === 'shipped').length,
        deliveredOrders: orderList.filter((o) => o.status === 'delivered').length,
        totalRevenue: orderList
          .filter((o) => o.status === 'delivered')
          .reduce((sum, o) => sum + (o.total_amount || 0), 0),
      });

      const sorted = [...orderList]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
      setRecentOrders(sorted);
    } catch {
      // keep defaults
    } finally {
      setLoading(false);
    }
  };

  const statusLabels: Record<string, string> = {
    pending: 'در انتظار',
    shipped: 'ارسال شده',
    delivered: 'تحویل شده',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
  };

  const cards: { icon: LucideIcon; label: string; value: string; color: string }[] = [
    { icon: Package, label: 'تعداد محصولات', value: stats.productCount.toLocaleString('fa-IR'), color: 'bg-primary-800' },
    { icon: ShoppingBag, label: 'کل سفارش‌ها', value: stats.orderCount.toLocaleString('fa-IR'), color: 'bg-accent-500' },
    { icon: Clock, label: 'در انتظار', value: stats.pendingOrders.toLocaleString('fa-IR'), color: 'bg-amber-500' },
    { icon: TrendingUp, label: 'درآمد تحویل‌شده', value: stats.totalRevenue.toLocaleString('fa-IR') + ' ت', color: 'bg-green-600' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">داشبورد</h1>
        <p className="text-sm text-gray-500 mt-1">نمای کلی فروشگاه</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="text-white" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {loading ? '...' : card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Order status summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'در انتظار', count: stats.pendingOrders, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'ارسال شده', count: stats.shippedOrders, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'تحویل شده', count: stats.deliveredOrders, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center`}>
                <Icon className={item.color} size={24} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-800">{item.count.toLocaleString('fa-IR')}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-800">آخرین سفارش‌ها</h2>
          <button
            onClick={() => onNavigate('admin-orders')}
            className="text-sm font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1"
          >
            مشاهده همه
            <ArrowLeft size={16} />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingBag size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">هنوز سفارشی ثبت نشده است</p>
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
                  <th className="py-3 px-4 text-right font-semibold hidden md:table-cell">تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id as string} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{order.customer_name as string}</td>
                    <td className="py-3 px-4 text-gray-600 hidden md:table-cell" dir="ltr">{order.customer_phone as string}</td>
                    <td className="py-3 px-4 font-semibold text-primary-800">
                      {(order.total_amount as number).toLocaleString('fa-IR')} ت
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[order.status as string]}`}>
                        {statusLabels[order.status as string]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs hidden md:table-cell">
                      {new Date(order.created_at as string).toLocaleDateString('fa-IR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <button
          onClick={() => onNavigate('admin-products')}
          className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow text-right"
        >
          <div className="w-14 h-14 bg-primary-800 rounded-xl flex items-center justify-center">
            <Package className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">مدیریت محصولات</h3>
            <p className="text-xs text-gray-500 mt-1">افزودن، ویرایش و حذف محصولات</p>
          </div>
        </button>

        <button
          onClick={() => onNavigate('admin-orders')}
          className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow text-right"
        >
          <div className="w-14 h-14 bg-accent-500 rounded-xl flex items-center justify-center">
            <ShoppingBag className="text-white" size={28} />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-800">مدیریت سفارش‌ها</h3>
            <p className="text-xs text-gray-500 mt-1">مشاهده و تغییر وضعیت سفارش‌ها</p>
          </div>
        </button>
      </div>
    </div>
  );
}
