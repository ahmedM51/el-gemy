import React, { useState } from 'react';
import { 
  Scissors, 
  Sparkles, 
  Clock, 
  Check, 
  ChevronRight, 
  Calendar 
} from 'lucide-react';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_SERVICES, 
  SALON_INFO 
} from '../../config/salon';
import { Service } from '../../types';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceId: string) => void;
  isArabic: boolean;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceToBook,
  isArabic,
}) => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');

  const filteredServices = activeCategoryId === 'all'
    ? INITIAL_SERVICES
    : INITIAL_SERVICES.filter((s) => s.category_id === activeCategoryId);

  return (
    <section id="services" className="py-16 sm:py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Scissors className="w-3.5 h-3.5" />
            <span>{isArabic ? 'قائمة الخدمات الفندقية وقائمة الأسعار' : 'Menu & Pricing'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isArabic ? 'خدمات مصممة خصيصاً للرجل العصري' : 'Bespoke Services for Gentlemen'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {isArabic ? 'أسعار واضحة ومحددة بالجنيه المصري، شاملة التعقيم واستخدام أفضل المستحضرات العالمية الأصلية' : 'Transparent pricing in EGP with high-end sterilization & luxury products'}
          </p>
        </div>

        {/* Category Pills Navigation */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setActiveCategoryId('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
              activeCategoryId === 'all'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
            }`}
          >
            {isArabic ? 'جميع الخدمات' : 'All Services'}
          </button>

          {INITIAL_CATEGORIES.filter((c) => c.slug !== 'packages').map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                activeCategoryId === cat.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:border-neutral-700'
              }`}
            >
              {isArabic ? cat.name_ar : cat.name_en}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group rounded-2xl bg-neutral-900/50 border border-neutral-800/80 hover:border-amber-500/50 p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-500/5"
            >
              <div className="space-y-3">
                {/* Header of card: Title, popular badge, and price */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                      {isArabic ? service.name_ar : service.name_en}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mt-1">
                      <Clock className="w-3.5 h-3.5 text-amber-500/80" />
                      <span>{service.duration_minutes} {isArabic ? 'دقيقة' : 'min'}</span>
                    </div>
                  </div>

                  <div className="text-end flex-shrink-0">
                    <div className="text-lg font-black text-amber-400">
                      {service.base_price} {SALON_INFO.currency}
                    </div>
                    {service.previous_price && (
                      <div className="text-[11px] text-neutral-500 line-through">
                        {service.previous_price} ج.م
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {isArabic ? service.description_ar : service.description_en}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-4 mt-4 border-t border-neutral-800/60 flex items-center justify-between">
                {service.is_featured ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {isArabic ? 'الأكثر طلباً' : 'Bestseller'}
                  </span>
                ) : <div />}

                <button
                  onClick={() => onSelectServiceToBook(service.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-bold text-xs transition-all duration-200"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'احجز هذه الخدمة' : 'Book Service'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
