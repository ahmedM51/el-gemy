import React from 'react';
import { 
  Sparkles, 
  Check, 
  Crown, 
  Calendar, 
  Clock 
} from 'lucide-react';
import { INITIAL_PACKAGES, SALON_INFO } from '../../config/salon';

interface PackagesSectionProps {
  onOpenBooking: () => void;
  isArabic: boolean;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  onOpenBooking,
  isArabic,
}) => {
  return (
    <section id="packages" className="py-16 sm:py-24 bg-neutral-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Crown className="w-3.5 h-3.5" />
            <span>{isArabic ? 'باقات كبار الشخصيات وتجهيز العرسان' : 'VIP & Groom Elite Bundles'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isArabic ? 'باقات استثنائية لأهم مناسباتك' : 'Exclusive Transformation Packages'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {isArabic ? 'وفر حتى 35% مع باقاتنا المتكاملة التي تجمع بين الحلاقة والعناية بالبشرة والمساج' : 'Save up to 35% with all-inclusive grooming and relaxation sessions'}
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {INITIAL_PACKAGES.map((pkg) => {
            const isFeatured = pkg.is_featured;
            return (
              <div
                key={pkg.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isFeatured
                    ? 'bg-gradient-to-b from-neutral-900 via-neutral-950 to-amber-950/20 border-2 border-amber-500 shadow-2xl shadow-amber-500/10'
                    : 'bg-neutral-950 border border-neutral-800'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-black text-[11px] shadow-lg shadow-amber-500/30 uppercase tracking-wider">
                    {isArabic ? 'الباقة الملكية الأكثر طلباً' : 'MOST POPULAR ELITE'}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{pkg.total_duration_minutes} {isArabic ? 'دقيقة راحة' : 'minutes'}</span>
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      {isArabic ? `وفر ${pkg.original_price - pkg.discounted_price} ج.م` : `Save ${pkg.original_price - pkg.discounted_price} EGP`}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {isArabic ? pkg.name_ar : pkg.name_en}
                  </h3>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">
                      {pkg.discounted_price}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">{SALON_INFO.currency}</span>
                    <span className="text-sm text-neutral-500 line-through ms-2">
                      {pkg.original_price} {SALON_INFO.currency}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-3">
                    {isArabic ? pkg.description_ar : pkg.description_en}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-neutral-800">
                  <button
                    onClick={onOpenBooking}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 ${
                      isFeatured
                        ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-lg shadow-amber-500/20'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{isArabic ? 'حجز هذه الباقة الملكية' : 'Book This VIP Package'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
