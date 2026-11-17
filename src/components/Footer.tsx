import { Wrench, Phone, Mail, MapPin, Instagram, Send, Facebook, Twitter, Clock } from 'lucide-react';

type Props = {
  onNavigate: (page: string) => void;
};

export default function Footer({ onNavigate }: Props) {
  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-950 text-white mt-20">
      {/* Trust badges */}
      <div className="border-b border-primary-800/50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🚚', title: 'ارسال سریع', desc: 'توسط پست و تیپاکس' },
              { icon: '✓', title: 'ضمانت اصالت', desc: 'اصالت کالا تضمینی' },
              { icon: '↺', title: 'بازگشت ۷ روزه', desc: 'تضمین بازگشت وجه' },
              { icon: '🛡', title: 'پرداخت امن', desc: 'درگاه پرداخت معتبر' },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-800/50 rounded-xl flex items-center justify-center text-2xl shrink-0">
                  {badge.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold">{badge.title}</h4>
                  <p className="text-xs text-primary-300">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center">
                <Wrench className="text-accent-400" size={22} />
              </div>
              <h3 className="text-lg font-bold">ابزارسان</h3>
            </div>
            <p className="text-sm text-primary-300 leading-6">
              فروشگاه اینترنتی ابزارسان، ارائه‌دهنده انواع ابزارهای کارگاهی و صنعتی با کیفیت و ضمانت
              اصالت کالا.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" className="w-9 h-9 bg-primary-800/50 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-800/50 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors">
                <Send size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-800/50 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-9 h-9 bg-primary-800/50 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-accent-400">دسترسی سریع</h4>
            <ul className="space-y-3">
              {[
                { label: 'صفحه اصلی', page: 'home' },
                { label: 'محصولات', page: 'products' },
                { label: 'درباره ما', page: 'about' },
                { label: 'تماس با ما', page: 'contact' },
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-sm text-primary-300 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-accent-400">دسته‌بندی‌ها</h4>
            <ul className="space-y-3">
              {[
                { label: 'دریل و پیچ‌گوشتی', page: 'products' },
                { label: 'فرز و سنگ‌فر', page: 'products' },
                { label: 'اره و برش', page: 'products' },
                { label: 'دستگاه جوش', page: 'products' },
                { label: 'ابزار دستی', page: 'products' },
                { label: 'جک و تجهیزات', page: 'products' },
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNav(link.page)}
                    className="text-sm text-primary-300 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold mb-4 text-accent-400">اطلاعات تماس</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-300">
                <MapPin size={18} className="shrink-0 mt-0.5 text-accent-400" />
                <span>تهران، خیابان جمهوری، پاساژ ابزارفر، طبقه دوم، پلاک ۱۴</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-300">
                <Phone size={18} className="shrink-0 text-accent-400" />
                <span>۰۲۱-۸۸۷۷۶۶۵۵</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-300">
                <Mail size={18} className="shrink-0 text-accent-400" />
                <span>info@toolsan.ir</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-300">
                <Clock size={18} className="shrink-0 text-accent-400" />
                <span>شنبه تا پنجشنبه ۹ تا ۱۸</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-primary-400">
              © ۱۴۰۵ ابزارسان - تمامی حقوق محفوظ است
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('admin-login')}
                className="text-[10px] text-primary-500 hover:text-accent-400 transition-colors"
              >
                پنل مدیریت
              </button>
              <span className="text-xs text-primary-600">روش‌های پرداخت:</span>
              <div className="flex items-center gap-2">
                <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-semibold">شتاب</div>
                <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-semibold">زرین‌پال</div>
                <div className="bg-white/10 px-3 py-1 rounded text-[10px] font-semibold">ملت</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
