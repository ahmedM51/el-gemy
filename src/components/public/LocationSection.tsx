import React from 'react';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  Navigation, 
  ShieldCheck,
  Calendar
} from 'lucide-react';
import { SALON_INFO, INITIAL_BRANCHES } from '../../config/salon';

interface LocationSectionProps {
  onOpenBooking: () => void;
  isArabic: boolean;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  onOpenBooking,
  isArabic,
}) => {
  const mainBranch = INITIAL_BRANCHES[0];

  return (
    <section id="location" className="py-16 sm:py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>{isArabic ? 'موقع الصالون وتفاصيل التواصل' : 'Visit Our Flagship Lounge'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isArabic ? 'نرحب بك في صالون الجيمي - منية النصر' : 'Welcome to El Gemy Lounge'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {isArabic ? 'موقع مميز وسهل الوصول في قلب مركز منية النصر بالدقهلية مع أماكن انتظار سيارات' : 'Conveniently located in Mit El-Nasr commercial heart, Dakahlia'}
          </p>
        </div>

        {/* Location & Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Information Card */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base sm:text-lg">
                    {isArabic ? mainBranch.name_ar : mainBranch.name_en}
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    {isArabic ? mainBranch.address_ar : mainBranch.address_en}
                  </p>
                  <p className="text-[11px] text-amber-400/90 mt-1 font-medium">
                    {isArabic ? 'محافظة الدقهلية • مركز منية النصر' : 'Dakahlia Governorate • Mit El-Nasr'}
                  </p>
                </div>
              </div>

              {/* Working Hours & Daily Schedule */}
              <div className="flex items-start gap-4 pt-3 border-t border-neutral-800">
                <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center text-neutral-300 flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {isArabic ? 'مواعيد العمل واستقبال العملاء' : 'Operating Hours'}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-0.5">
                    {isArabic ? SALON_INFO.working_hours_ar : SALON_INFO.working_hours_en}
                  </p>
                  <p className="text-[11px] text-emerald-400 mt-0.5 font-semibold">
                    {isArabic ? '● مفتوح الآن لاستقبالكم والحجز أونلاين' : '● Open Daily for VIP bookings'}
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp Contacts */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${SALON_INFO.phone}`}
                    className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">{isArabic ? 'اتصال تليفوني مباشر' : 'Phone Call'}</span>
                      <span className="text-xs font-bold text-white">{SALON_INFO.phone}</span>
                    </div>
                  </a>

                  <a
                    href={`https://wa.me/201096913209?text=${encodeURIComponent('مرحباً صالون الجيمي El Gemy في منية النصر، أود الاستفسار والحجز')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-emerald-500/50 flex items-center gap-3 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-500 block">{isArabic ? 'واتساب الصالون' : 'WhatsApp'}</span>
                      <span className="text-xs font-bold text-white">{SALON_INFO.whatsapp}</span>
                    </div>
                  </a>
                </div>

                <button
                  onClick={onOpenBooking}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{isArabic ? 'احجز كرسيك الآن لتجنب الانتظار' : 'Book Your Seat Instantly'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900 p-2 relative shadow-2xl">
              <div className="h-80 sm:h-96 w-full rounded-2xl bg-neutral-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center">
                {/* Styled Map Background Placeholder with Google Map link */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative z-10 space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <Navigation className="w-8 h-8 animate-bounce" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-white text-base">
                      {isArabic ? 'مركز منية النصر - الدقهلية' : 'Mit El-Nasr Center - Dakahlia'}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {isArabic ? 'شارع المحطة التجاري الرئيسي أمام محطة القطار' : 'Facing Main Station, Commercial District'}
                    </p>
                  </div>

                  <a
                    href="https://maps.google.com/?q=Mit+El+Nasr,+Dakahlia,+Egypt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-amber-400 text-xs font-bold transition-all shadow-lg"
                  >
                    <span>{isArabic ? 'فتح الاتجاهات على خرائط Google' : 'Open in Google Maps'}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
