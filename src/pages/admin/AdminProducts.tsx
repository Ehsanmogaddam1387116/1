import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Search, Package, AlertCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { categories, formatPrice } from '../../ProductsContext';

type DbProduct = {
  id: string;
  name: string;
  brand: string;
  category_id: string;
  price: number;
  old_price: number | null;
  image: string;
  description: string;
  in_stock: boolean;
  is_bestseller: boolean;
};

type Props = {
  onNavigate: (page: string) => void;
};

type FormState = {
  name: string;
  brand: string;
  category_id: string;
  price: string;
  old_price: string;
  image: string;
  description: string;
  in_stock: boolean;
  is_bestseller: boolean;
};

const emptyForm: FormState = {
  name: '',
  brand: '',
  category_id: 'drill',
  price: '',
  old_price: '',
  image: '',
  description: '',
  in_stock: true,
  is_bestseller: false,
};

export default function AdminProducts({ onNavigate }: Props) {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProducts(data || []);
    } catch {
      // keep empty
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(
    (p) => p.name.includes(search) || p.brand.includes(search)
  );

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setShowForm(true);
  };

  const openEditForm = (product: DbProduct) => {
    setForm({
      name: product.name,
      brand: product.brand,
      category_id: product.category_id,
      price: String(product.price),
      old_price: product.old_price ? String(product.old_price) : '',
      image: product.image,
      description: product.description,
      in_stock: product.in_stock,
      is_bestseller: product.is_bestseller,
    });
    setEditingId(product.id);
    setError(null);
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price.trim() || !form.image.trim()) {
      setError('نام، قیمت و عکس محصول الزامی است');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      brand: form.brand,
      category_id: form.category_id,
      price: parseInt(form.price.replace(/[^0-9]/g, '')) || 0,
      old_price: form.old_price ? parseInt(form.old_price.replace(/[^0-9]/g, '')) || null : null,
      image: form.image,
      description: form.description,
      in_stock: form.in_stock,
      is_bestseller: form.is_bestseller,
      rating: 4.5,
      review_count: 0,
      features: [] as string[],
      specs: [] as unknown[],
    };

    try {
      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
      }
      setShowForm(false);
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در ذخیره محصول');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteId);
      if (error) throw error;
      setProducts(products.filter((p) => p.id !== deleteId));
    } catch {
      // ignore
    } finally {
      setDeleteId(null);
    }
  };

  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || id;

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت محصولات</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length.toLocaleString('fa-IR')} محصول</p>
        </div>
        <button onClick={openAddForm} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={18} />
          افزودن محصول
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جستجوی محصول..."
          className="w-full bg-white border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 shadow-sm"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      {/* Products table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-sm text-gray-400">در حال بارگذاری...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-400">محصولی یافت نشد</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="py-3 px-4 text-right font-semibold">عکس</th>
                  <th className="py-3 px-4 text-right font-semibold">نام</th>
                  <th className="py-3 px-4 text-right font-semibold hidden md:table-cell">دسته</th>
                  <th className="py-3 px-4 text-right font-semibold">قیمت</th>
                  <th className="py-3 px-4 text-right font-semibold hidden lg:table-cell">موجودی</th>
                  <th className="py-3 px-4 text-center font-semibold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.brand}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell text-gray-600">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="py-3 px-4 font-semibold text-primary-800 whitespace-nowrap">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        product.in_stock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {product.in_stock ? 'موجود' : 'ناموجود'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          aria-label="ویرایش"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label="حذف"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'ویرایش محصول' : 'افزودن محصول جدید'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-50 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">نام محصول *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="مثلاً: دریل شارژی بوش"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">برند</label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    placeholder="بوش"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">دسته‌بندی</label>
                  <select
                    value={form.category_id}
                    onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">قیمت (تومان) *</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="4850000"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">قیمت قبل تخفیف</label>
                  <input
                    type="text"
                    value={form.old_price}
                    onChange={(e) => setForm({ ...form, old_price: e.target.value })}
                    placeholder="اختیاری"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">آدرس عکس *</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
                  dir="ltr"
                />
                {form.image && (
                  <img src={form.image} alt="پیش‌نمایش" className="w-24 h-24 rounded-lg object-cover mt-2" />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">توضیحات</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="توضیحات محصول..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 resize-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.in_stock}
                    onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span className="text-sm text-gray-700">موجود در انبار</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_bestseller}
                    onChange={(e) => setForm({ ...form, is_bestseller: e.target.checked })}
                    className="w-4 h-4 accent-accent-500"
                  />
                  <span className="text-sm text-gray-700">پرفروش</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 btn-primary disabled:opacity-50">
                  {saving ? 'در حال ذخیره...' : editingId ? 'ذخیره تغییرات' : 'افزودن محصول'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDeleteId(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <Trash2 className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-800">حذف محصول</h3>
                <p className="text-xs text-gray-500">آیا مطمئن هستید؟</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">این عملیات قابل بازگشت نیست.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors">
                حذف
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="px-6 py-2.5 border-2 border-gray-200 text-gray-600 font-semibold rounded-lg hover:bg-gray-50"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
