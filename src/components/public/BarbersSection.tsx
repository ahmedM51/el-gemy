import React from 'react';
import { 
  Star, 
  Award, 
  Calendar, 
  Scissors, 
  CheckCircle,
  Phone
} from 'lucide-react';
import { INITIAL_BARBERS, SALON_INFO } from '../../config/salon';

interface BarbersSectionProps {
  onOpenBookingWithBarber: (barberId: string) => void;
  isArabic: boolean;
}

export const BarbersSection: React.FC<BarbersSectionProps> = ({
  onOpenBookingWithBarber,
  isArabic,
}) => {
  return (
    <section id="barbers" className="py-16 sm:py-24 bg-neutral-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>{isArabic ? 'صُنّاع الأناقة والمحترفون' : 'Master Craftsmen'}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {isArabic ? 'فريق مصففي صالون الجيمي' : 'Meet Our Master Stylists'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            {isArabic ? 'سنوات من الخبرة الفندقية، دقة متناهية بالمقص والموس، وشغف حقيقي بكل تفصيلة في إطلالتك' : 'Decades of combined artistry, precision scissor work, and dedicated grooming masters'}
          </p>
        </div>

        {/* Barbers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_BARBERS.map((barber) => (
            <div
              key={barber.id}
              className="group rounded-3xl bg-neutral-900/60 border border-neutral-800/80 hover:border-amber-500/50 overflow-hidden transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo & Rating Badge */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  <img
                    src={barber.photo_url}
                    alt={barber.name_ar}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                  {/* Rating Tag */}
                  <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-neutral-950/80 backdrop-blur-md border border-neutral-800 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{barber.average_rating}</span>
                    <span className="text-[10px] text-neutral-400">({barber.total_reviews})</span>
                  </div>

                  {/* Experience Badge */}
                  <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500 text-neutral-950">
                    {isArabic ? `خبرة ${barber.experience_years} سنوات` : `${barber.experience_years} Years Exp`}
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                      {isArabic ? barber.name_ar : barber.name_en}
                    </h3>
                    <p className="text-xs text-amber-300 font-medium">
                      {isArabic ? barber.title_ar : barber.title_en}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {isArabic ? barber.bio_ar : barber.bio_en}
                  </p>

                  {/* Specialties Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {barber.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800/80 text-neutral-300 border border-neutral-700/50"
                      >
                        ✓ {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onOpenBookingWithBarber(barber.id)}
                  className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isArabic ? `حجز موعد مع ${barber.name_ar.split(' ')[0]}` : `Book with ${barber.name_en.split(' ')[0]}`}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
