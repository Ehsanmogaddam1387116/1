import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare, User, Check } from 'lucide-react';

type Props = {
  onNavigate: (page: string) => void;
};

export default function ContactPage({ onNavigate }: Props) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    { icon: MapPin, title: 'آدرس', value: 'تهران، خیابان جمهوری، پاساژ ابزارفر، طبقه دوم، پلاک ۱۴' },
    { icon: Phone, title: 'تلفن', value: '۰۲۱-۸۸۷۷۶۶۵۵' },
    { icon: Mail, title: 'ایمیل', value: 'info@toolsan.ir' },
    { icon: Clock, title: 'ساعات کاری', value: 'شنبه تا پنجشنبه ۹ تا ۱۸' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-primary-950 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">تماس با ما</h1>
          <p className="text-sm md:text-base text-primary-300 max-w-xl mx-auto">
            سوال یا پیشنهادی دارید؟ کارشناسان ما آماده پاسخگویی به شما هستند
          </p>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactInfo.map((info, i) => {
            const Icon = info.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-gray-50 text-center"
              >
                <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-accent-500" size={26} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-2">{info.title}</h3>
                <p className="text-xs text-gray-500 leading-6">{info.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Contact form and map */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary-800 rounded-xl flex items-center justify-center">
                <MessageSquare className="text-accent-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">ارسال پیام</h2>
                <p className="text-xs text-gray-500">فرم زیر را پر کنید تا با شما تماس بگیریم</p>
              </div>
            </div>

            {submitted && (
              <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-5 flex items-center gap-3 animate-slide-down">
                <Check size={20} />
                <span className="text-sm font-semibold">پیام شما با موفقیت ارسال شد. به زودی پاسخ خواهیم داد.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">نام و نام خانوادگی</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="نام خود را وارد کنید"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">ایمیل</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="ایمیل خود را وارد کنید"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg pr-10 pl-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">موضوع</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  placeholder="موضوع پیام"
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">پیام</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="پیام خود را بنویسید..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent resize-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                <Send size={18} />
                ارسال پیام
              </button>
            </form>
          </div>

          {/* Map + info */}
          <div className="space-y-6">
            {/* Map placeholder */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-[300px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin size={48} className="text-primary-800 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-primary-900">نقشه فروشگاه ابزارسان</p>
                  <p className="text-xs text-primary-700 mt-1">تهران، خیابان جمهوری</p>
                </div>
              </div>
            </div>

            {/* Support info */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-950 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">پشتیبانی مشتریان</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Phone size={18} className="text-accent-400" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-300">تلفن پشتیبانی</p>
                    <p className="text-sm font-semibold">۰۲۱-۸۸۷۷۶۶۵۵</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <MessageSquare size={18} className="text-accent-400" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-300">واتساپ</p>
                    <p className="text-sm font-semibold">۰۹۱۲۳۴۵۶۷۸۹</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-accent-400" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-300">ساعات پاسخگویی</p>
                    <p className="text-sm font-semibold">شنبه تا پنجشنبه ۹ تا ۱۸</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('products')}
                className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-3 rounded-lg mt-6 transition-colors"
              >
                مشاهده محصولات
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
