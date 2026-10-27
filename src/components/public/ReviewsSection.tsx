import React from 'react';
import { 
  Star, 
  MessageSquare, 
  CheckCircle, 
  Plus 
} from 'lucide-react';
import { Review } from '../../types';

interface ReviewsSectionProps {
  reviews: Review[];
  onOpenAddReview: () => void;
  isArabic: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  onOpenAddReview,
  isArabic,
}) => {
  return (
    <section id="reviews" className="py-16 sm:py-24 bg-neutral-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{isArabic ? 'تقييمات عملاء الصالون' : 'Verified Client Reviews'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white">
              {isArabic ? 'ماذا يقول رواد صالون الجيمي؟' : 'What Our Gentlemen Say'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              {isArabic ? 'تقييمات حقيقية من زبائن الصالون في منية النصر ومحافظة الدقهلية بعد تجربة خدماتنا' : 'Genuine feedback from our esteemed gentlemen in Dakahlia'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-end">
              <div className="text-2xl font-black text-amber-400">4.96 / 5.0</div>
              <div className="text-[11px] text-neutral-400">★★★★★ {isArabic ? 'أعلى تقييم بالمنطقة' : 'Top Rated'}</div>
            </div>

            <button
              onClick={onOpenAddReview}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{isArabic ? 'أضف تقييمك' : 'Write Review'}</span>
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-400">
                    {Array.from({ length: rev.overall_rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-500">{rev.date}</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-900 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{rev.customer_name}</span>
                    {rev.is_verified && (
                      <span title="عميل مؤكد">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-amber-400/80">
                    {rev.barber_name}
                  </div>
                </div>

                <span className="text-[10px] text-neutral-500">
                  {rev.branch_name.includes('منية النصر') ? 'فرع منية النصر' : 'الفرع الرئيسي'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
