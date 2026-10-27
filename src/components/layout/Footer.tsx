import React from 'react';
import { 
  Scissors, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Heart 
} from 'lucide-react';
import { SALON_INFO } from '../../config/salon';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
  onOpenBooking: () => void;
  isArabic: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  onOpenBooking,
  isArabic,
}) => {
  return (
    <footer className="bg-neutral-950 border-t border-neutral-850 pt-16 pb-12 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Scissors className="w-5 h-5" />
              </div>
              <span className="font-serif font-black text-xl text-white tracking-wider">
                EL GEMY <span className="text-amber-400 text-xs font-sans">VIP LOUNGE</span>
              </span>
            </div>

            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              {isArabic 
                ? 'صالون الجيمي للرجال في منية النصر - الدقهلية. الوجهة الأولى للرجل الباحث عن التميز والقصات الفندقية الراقية، عناية اللحية الملكية، والهيدرافيشال ومعالجات الشعر المتطورة.'
                : 'The premier destination in Mit El-Nasr, Dakahlia for gentleman grooming, bespoke skin fades, hot steam beard rituals, and clinical facial therapy.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/201096913209`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/50 text-emerald-400 transition-colors"
                title="واتساب مباشر"
              >
                <MessageCircle className="w-4 h-4" />
              </a>

              <a
                href={`tel:${SALON_INFO.phone}`}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-amber-500/50 text-amber-400 transition-colors"
                title="اتصال مباشر"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isArabic ? 'روابط سريعة' : 'Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigateTab('home')} className="hover:text-amber-400 transition-colors">
                  {isArabic ? 'الصفحة الرئيسية' : 'Home'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('services')} className="hover:text-amber-400 transition-colors">
                  {isArabic ? 'الخدمات والأسعار' : 'Services & Pricing'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('packages')} className="hover:text-amber-400 transition-colors">
                  {isArabic ? 'باقات كبار الشخصيات والعرسان' : 'VIP Groom Packages'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('barbers')} className="hover:text-amber-400 transition-colors">
                  {isArabic ? 'فريق الحلاقين المحترفين' : 'Master Barbers'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateTab('reviews')} className="hover:text-amber-400 transition-colors">
                  {isArabic ? 'آراء وتقييمات العملاء' : 'Client Reviews'}
                </button>
              </li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isArabic ? 'ساعات العمل' : 'Opening Hours'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isArabic ? 'يومياً طوال الأسبوع:' : 'Daily 7 Days a Week:'}</span>
              </div>
              <p className="text-white font-bold ps-5">
                10:00 ص - 12:00 منتصف الليل
              </p>
              <p className="text-[11px] text-emerald-400 ps-5">
                {isArabic ? 'خدمة الحجز أونلاين متاحة 24/7' : 'Online booking available 24/7'}
              </p>
            </div>
          </div>

          {/* Location & Contact Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {isArabic ? 'الفرع والتواصل' : 'Location & Contacts'}
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>الدقهلية - مركز منية النصر - شارع المحطة الرئيسي التجاري</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${SALON_INFO.phone}`} className="hover:text-white font-bold">
                  {SALON_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <a href={`https://wa.me/201096913209`} className="hover:text-white font-bold">
                  واتساب: {SALON_INFO.whatsapp}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} El Gemy Barber Lounge. All rights reserved • صالون الجيمي للرجال - منية النصر، الدقهلية.
          </div>
          <div className="flex items-center gap-4">
            <span>العملة: EGP (جنيه مصري)</span>
            <span>•</span>
            <span>التوقيت: Africa/Cairo</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
