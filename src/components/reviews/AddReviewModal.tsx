import React, { useState } from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';
import { INITIAL_BARBERS } from '../../config/salon';
import { Review } from '../../types';

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
  isArabic: boolean;
}

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmitReview,
  isArabic,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [selectedBarberName, setSelectedBarberName] = useState(INITIAL_BARBERS[0].name_ar);
  const [overallRating, setOverallRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      customer_name: customerName,
      barber_name: selectedBarberName,
      branch_name: 'صالون الجيمي - فرع منية النصر الرئيسي',
      overall_rating: overallRating,
      barber_rating: overallRating,
      cleanliness_rating: cleanlinessRating,
      comment: comment,
      date: isArabic ? 'اليوم' : 'Today',
      is_verified: true,
    };

    onSubmitReview(newRev);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-base">
              {isArabic ? 'تقييم تجربتك في صالون الجيمي' : 'Rate Your Experience at El Gemy'}
            </h3>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isArabic ? 'اسمك الكريم *' : 'Your Name *'}
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder={isArabic ? 'مثال: أسامة النجار' : 'e.g. Osama El-Naggar'}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isArabic ? 'مصفف الشعر الذي خدمك' : 'Stylist'}
            </label>
            <select
              value={selectedBarberName}
              onChange={(e) => setSelectedBarberName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
            >
              {INITIAL_BARBERS.map((b) => (
                <option key={b.id} value={b.name_ar}>
                  {b.name_ar}
                </option>
              ))}
            </select>
          </div>

          {/* Star Rating Selectors */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-neutral-900/60 rounded-xl border border-neutral-800">
            <div>
              <span className="block text-neutral-300 font-semibold mb-1">
                {isArabic ? 'التقييم العام:' : 'Overall Rating:'}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setOverallRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= overallRating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-neutral-300 font-semibold mb-1">
                {isArabic ? 'التعقيم والنظافة:' : 'Cleanliness:'}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setCleanlinessRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= cleanlinessRating ? 'fill-emerald-400 text-emerald-400' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {isArabic ? 'رأيك وملاحظاتك بالتفصيل *' : 'Review & Comments *'}
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isArabic ? 'اكتب تجربتك مع الحلاقة والخدمة في الصالون...' : 'Tell us about your cut and service...'}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
            >
              {isArabic ? 'نشر التقييم' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
