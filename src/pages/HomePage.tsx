import { ArrowLeft, Truck, ShieldCheck, Headphones, CreditCard, Wrench, Zap, Flame, Scissors, Car } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { categories, getBestsellers } from '../data';
import ProductCard from '../components/ProductCard';
import { useState, useEffect } from 'react';

type Props = {
  onNavigate: (page: string, productId?: string) => void;
};

const iconMap: Record<string, LucideIcon> = {
  Drill: Wrench,
  Flame: Flame,
  Scissors: Scissors,
  Zap: Zap,
  Wrench: Wrench,
  Car: Car,
};

export default function HomePage({ onNavigate }: Props) {
  const bestsellers = getBestsellers();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'ابزار حرفه‌ای برای حرفه‌ای‌ها',
      subtitle: 'بزرگ‌ترین فروشگاه اینترنتی ابزار کارگاهی در ایران',
      desc: 'دریل، فرز، اره، دستگاه جوش و هزاران محصول دیگر با ضمانت اصالت و ارسال سریع',
      cta: 'مشاهده محصولات',
      page: 'products',
    },
    {
      title: 'تخفیف ویژه پاییزه',
      subtitle: 'تا ۴۰٪ تخفیف روی ابزارهای منتخب',
      desc: 'فرصت محدود برای خرید ابزارهای کارگاهی با بهترین قیمت',
      cta: 'خرید کنید',
      page: 'products',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const benefits = [
    { icon: Truck, title: 'ارسال سریع', desc: 'ارسال به سراسر کشور طی ۲ تا ۵ روز کاری' },
    { icon: ShieldCheck, title: 'ضمانت اصالت کالا', desc: 'تمامی محصولات اورجینال و دارای گارانتی' },
    { icon: Headphones, title: 'پشتیبانی تخصصی', desc: 'مشاوره رایگان قبل و بعد از خرید' },
    { icon: CreditCard, title: 'پرداخت امن', desc: 'درگاه پرداخت معتبر و امکان پرداخت در محل' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero banner */}
      <section className="relative h-[420px] md:h-[520px] overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/38575493/pexels-photo-38575493.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-primary-950/95 via-primary-900/70 to-primary-900/30" />

        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <div className="inline-block bg-accent-500/20 border border-accent-400/30 text-accent-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
              {currentSlide === 0 ? 'خوش آمدید به ابزارسان' : 'فرصت محدود'}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 animate-slide-up">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl text-accent-300 font-semibold mb-3 animate-slide-up">
              {slides[currentSlide].subtitle}
            </p>
            <p className="text-sm md:text-base text-gray-300 mb-6 leading-7 animate-slide-up">
              {slides[currentSlide].desc}
            </p>
            <button
              onClick={() => onNavigate(slides[currentSlide].page)}
              className="btn-primary inline-flex items-center gap-2"
            >
              {slides[currentSlide].cta}
              <ArrowLeft size={18} />
            </button>

            {/* Slide indicators */}
            <div className="flex items-center gap-2 mt-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentSlide ? 'w-8 bg-accent-500' : 'w-2 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map((benefit, i) => {
            const Icon = benefit.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 shadow-lg shadow-primary-900/5 border border-gray-50 flex flex-col items-center text-center md:flex-row md:text-right md:items-start gap-3"
              >
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon className="text-accent-500" size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-500 leading-5">{benefit.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900">دسته‌بندی محصولات</h2>
            <p className="text-sm text-gray-500 mt-1">ابزارهای مورد نیاز کارگاه خود را پیدا کنید</p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-sm font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1"
          >
            همه محصولات
            <ArrowLeft size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || Wrench;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('products', undefined)}
                className="card-hover bg-white rounded-2xl p-5 border border-gray-50 flex flex-col items-center text-center group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary-800 to-primary-950 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="text-accent-400" size={26} />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{cat.name}</h3>
                <p className="text-[10px] text-gray-400 leading-4 line-clamp-2">{cat.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary-900">پرفروش‌ترین محصولات</h2>
              <p className="text-sm text-gray-500 mt-1">محبوب‌ترین ابزارهای کارگاهی</p>
            </div>
            <button
              onClick={() => onNavigate('products')}
              className="text-sm font-semibold text-accent-600 hover:text-accent-700 flex items-center gap-1"
            >
              مشاهده همه
              <ArrowLeft size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-l from-primary-900 to-primary-950 rounded-3xl p-8 md:p-12 text-center md:text-right relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url(https://images.pexels.com/photos/4312855/pexels-photo-4312855.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white max-w-md text-center md:text-right">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">نیاز به مشاوره دارید؟</h2>
              <p className="text-sm text-primary-300 leading-6">
                کارشناسان ما آماده پاسخ به سوالات شما و راهنمایی برای انتخاب بهترین ابزار هستند.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => onNavigate('contact')} className="btn-primary">
                تماس با ما
              </button>
              <button onClick={() => onNavigate('about')} className="btn-outline bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary-900">
                درباره ابزارسان
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
