import { Wrench, Target, Eye, Award, Users, Package, Truck, Headphones } from 'lucide-react';

type Props = {
  onNavigate: (page: string) => void;
};

export default function AboutPage({ onNavigate }: Props) {
  const stats = [
    { icon: Package, value: '+۵۰۰۰', label: 'محصول متنوع' },
    { icon: Users, value: '+۵۰٬۰۰۰', label: 'مشتری راضی' },
    { icon: Truck, value: '+۱۰', label: 'سال تجربه' },
    { icon: Award, value: '+۵۰', label: 'برند معتبر' },
  ];

  const values = [
    {
      icon: Target,
      title: 'ماموریت ما',
      desc: 'ارائه ابزارهای باکیفیت و اورجینال به قیمت منصفانه برای تمامی فعالان صنعت و کارگاه‌های کشور.',
    },
    {
      icon: Eye,
      title: 'چشم‌انداز ما',
      desc: 'تبدیل شدن به بزرگ‌ترین و معتبرترین فروشگاه آنلاین ابزار کارگاهی در ایران و منطقه.',
    },
    {
      icon: Award,
      title: 'ارزش‌های ما',
      desc: 'صداقت در فروش، کیفیت در محصولات، سرعت در ارسال و پشتیبانی کامل از مشتریان.',
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[300px] md:h-[360px] overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-950 to-primary-800"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/5194769/pexels-photo-5194769.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        />
        <div className="absolute inset-0 bg-primary-950/70" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div className="text-white max-w-2xl">
            <div className="w-16 h-16 bg-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Wrench size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">درباره ابزارسان</h1>
            <p className="text-sm md:text-base text-primary-200 leading-7">
              بیش از یک دهه تجربه در تامین ابزارهای کارگاهی و صنعتی برای حرفه‌ای‌های ایرانی
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-primary-900/5 border border-gray-50 text-center"
              >
                <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="text-accent-500" size={26} />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-primary-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6">داستان ابزارسان</h2>
          <div className="space-y-4 text-sm md:text-base text-gray-600 leading-8">
            <p>
              ابزارسان در سال ۱۳۹۴ با هدف ساده‌سازی دسترسی حرفه‌ای‌های ایرانی به ابزارهای باکیفیت و اورجینال
              تاسیس شد. ما که خود از فعالان صنعت بودیم، می‌دانستیم که پیدا کردن ابزار مطمئن و اورجینال در بازار
              پر از کالاهای تقلبی چقدر دشوار است.
            </p>
            <p>
              از همان روز اول، تعهد ما به فروش فقط محصولات اورجینال و دارای گارانتی، همراه با قیمت منصفانه
              و پشتیبانی تخصصی، باعث شد تا اعتماد هزاران کارگاه، تعمیرگاه و فعال صنعتی را جلب کنیم.
            </p>
            <p>
              امروز با بیش از ۵۰۰۰ محصول از معتبرترین برندهای دنیا مانند بوش، ماکیتا، دوالت و رونیکس،
              ابزارسان به یکی از بزرگ‌ترین فروشگاه‌های آنلاین ابزار در ایران تبدیل شده است. اما ماموریت ما
              تغییری نکرده: ارائه بهترین ابزارها با بهترین قیمت و پشتیبانی کامل.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-900 text-center mb-12">آنچه ما را متمایز می‌کند</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-gray-50 text-center card-hover"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-800 to-primary-950 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <Icon className="text-accent-400" size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-sm text-gray-500 leading-7">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-6">چرا از ابزارسان خرید کنیم؟</h2>
            <div className="space-y-4">
              {[
                { title: 'اصالت تضمینی کالا', desc: 'تمامی محصولات مستقیما از واردکنندگان معتبر تهیه می‌شوند.' },
                { title: 'قیمت منصفانه', desc: 'با حذف واسطه‌ها، بهترین قیمت را به شما ارائه می‌دهیم.' },
                { title: 'پشتیبانی تخصصی', desc: 'کارشناسان فنی ما قبل و بعد از خرید همراه شما هستند.' },
                { title: 'ارسال به سراسر کشور', desc: 'ارسال سریع و مطمئن به تمامی نقاط ایران.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-accent-50 rounded-xl flex items-center justify-center shrink-0">
                    <Package className="text-accent-500" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 leading-6">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden h-[350px]">
            <img
              src="https://images.pexels.com/photos/6790036/pexels-photo-6790036.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="کارگاه ابزار"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-l from-primary-900 to-primary-950 rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">آماده خرید هستید؟</h2>
          <p className="text-sm text-primary-300 mb-6 max-w-md mx-auto">
            هزاران ابزار حرفه‌ای منتظر شماست. همین حالا خرید را شروع کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => onNavigate('products')} className="btn-primary">
              مشاهده محصولات
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary-900"
            >
              تماس با ما
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
