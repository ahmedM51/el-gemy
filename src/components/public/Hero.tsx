import React from 'react';
import { 
  Calendar, 
  MessageCircle, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Star,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { SALON_INFO } from '../../config/salon';

interface HeroProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
  isArabic: boolean;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBooking,
  onExploreServices,
  isArabic,
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 bg-neutral-950">
      {/* Background Glows & Patterns */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start">
            {/* VIP Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'صالون النخبة للرجال في الدقهلية • منية النصر' : 'Elite Masculine Grooming Lounge • Dakahlia'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.2]">
              {isArabic ? (
                <>
                  الفخامة تبدأ من <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">الجيمي</span>
                  <br />
                  حلاقة فندقية تليق بك
                </>
              ) : (
                <>
                  Elegance Redefined at <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">El Gemy</span>
                  <br />
                  Bespoke Barber Lounge
                </>
              )}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {isArabic ? (
                'نحن لا نقدم مجرد قصة شعر، بل تجربة متكاملة من الاسترخاء والاهتمام الفندقي: أحدث قصات الفيد والتدريج الكلاسيكي، نحت اللحية بالبخار الساخن، وجلسات الهيدرافيشال 7 مراحل ومعالجات البروتين العضوي الخالي من الفورمالين.'
              ) : (
                'More than a haircut—a luxury ritual. Master skin fades, steam beard sculpting, 7-stage hydrafacial therapy, and organic protein reconstruction in Mit El-Nasr.'
              )}
            </p>

            {/* Direct Location & Time Badge */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-neutral-400 pt-1">
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <MapPin className="w-4 h-4" />
                <span>منية النصر، شارع المحطة الرئيسي التجاري</span>
              </span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>10:00 ص - 12:00 منتصف الليل</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-sm shadow-xl shadow-amber-500/25 transition-all duration-300 active:scale-95 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isArabic ? 'احجز موعدك أونلاين الآن' : 'Book Your Seat Online'}</span>
              </button>

              <a
                href={`https://wa.me/201096913209?text=${encodeURIComponent('مرحباً صالون الجيمي El Gemy، أود الاستفسار عن المواعيد والخدمات وباقات العرسان')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-emerald-500/40 text-neutral-200 hover:text-emerald-300 font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{isArabic ? 'واتساب: 01096913209' : 'WhatsApp Us'}</span>
              </a>

              <button
                onClick={onExploreServices}
                className="hidden sm:inline-flex px-4 py-3 text-xs text-neutral-400 hover:text-amber-400 font-semibold transition-colors"
              >
                {isArabic ? 'استكشف قائمة الأسعار ↓' : 'View Pricing ↓'}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-neutral-900 max-w-xl mx-auto lg:mx-0">
              <div className="text-center lg:text-start">
                <div className="text-xl sm:text-2xl font-black text-amber-400">4.98 ★</div>
                <div className="text-[11px] text-neutral-500">{isArabic ? 'أكثر من 700 تقييم موثق' : '700+ Verified Reviews'}</div>
              </div>
              <div className="text-center lg:text-start border-x border-neutral-900 px-2">
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-[11px] text-neutral-500">{isArabic ? 'تعقيم طبي وأدوات مفردة' : 'Medical Sterilization'}</div>
              </div>
              <div className="text-center lg:text-start">
                <div className="text-xl sm:text-2xl font-black text-white">0 {isArabic ? 'انتظار' : 'Wait'}</div>
                <div className="text-[11px] text-neutral-500">{isArabic ? 'دقة مواعيد بالدقيقة' : 'Zero Wait Guarantee'}</div>
              </div>
            </div>
          </div>

          {/* Luxury Imagery & Highlights Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Card with Image */}
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl p-2.5">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80"
                  alt="El Gemy Barber Lounge"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl"
                />

                {/* Floating Overlay Badge: Groom VIP */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-neutral-950/85 backdrop-blur-md border border-neutral-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {isArabic ? 'العرض الحصري' : 'EXCLUSIVE OFFER'}
                    </span>
                    <h3 className="text-sm font-bold text-white">
                      {isArabic ? 'باقة العريس الملكية المتكاملة' : 'Royal Groom VIP Elite'}
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      {isArabic ? 'قصة شعر + هيدرافيشال + لحية بالبخار' : 'Cut + Hydrafacial + Beard Sculpt'}
                    </p>
                  </div>
                  <div className="text-end">
                    <span className="text-xs text-neutral-500 line-through">1550 ج.م</span>
                    <div className="text-lg font-black text-amber-400">1100 ج.م</div>
                  </div>
                </div>
              </div>

              {/* Floating Testimonial Pill */}
              <div className="hidden sm:flex absolute -top-5 -left-5 p-3 rounded-2xl bg-neutral-900/95 border border-amber-500/30 shadow-xl items-center gap-3 text-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                  ★
                </div>
                <div>
                  <div className="font-bold text-white">صالون الجيمي - منية النصر</div>
                  <div className="text-[10px] text-neutral-400">المركز الأول في تقييمات العملاء بالدقهلية</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
