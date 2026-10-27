import React, { useState, useMemo } from 'react';
import { 
  X, 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  ChevronRight, 
  ChevronLeft, 
  Scissors, 
  Sparkles, 
  ShieldCheck, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { 
  INITIAL_BRANCHES, 
  INITIAL_BARBERS, 
  INITIAL_SERVICES, 
  INITIAL_PACKAGES, 
  SALON_INFO 
} from '../../config/salon';
import { Service, Barber, Appointment } from '../../types';
import { 
  generateAvailableSlots, 
  calculateEndTime, 
  generateAppointmentNumber 
} from '../../lib/booking-engine';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingAppointments: Appointment[];
  onBookSuccess: (newAppointment: Appointment) => void;
  isArabic: boolean;
  preselectedServiceId?: string;
  preselectedBarberId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  existingAppointments,
  onBookSuccess,
  isArabic,
  preselectedServiceId,
  preselectedBarberId,
}) => {
  // Steps: 1: Branch, 2: Services, 3: Barber, 4: Date & Time, 5: Customer Info, 6: Confirmed
  const [step, setStep] = useState(1);

  // Form State
  const [selectedBranchId, setSelectedBranchId] = useState(INITIAL_BRANCHES[0].id);
  const [selectedServices, setSelectedServices] = useState<Service[]>(() => {
    if (preselectedServiceId) {
      const found = INITIAL_SERVICES.find((s) => s.id === preselectedServiceId);
      return found ? [found] : [INITIAL_SERVICES[0]];
    }
    return [INITIAL_SERVICES[0]];
  });
  const [selectedBarberId, setSelectedBarberId] = useState<string>(preselectedBarberId || 'any');
  
  // Date selection (default today or tomorrow)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  // Customer Information
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Summary calculations
  const totalDuration = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.duration_minutes, 0),
    [selectedServices]
  );

  const totalAmount = useMemo(
    () => selectedServices.reduce((sum, s) => sum + s.base_price, 0),
    [selectedServices]
  );

  // Available Time Slots for chosen Date & Barber
  const availableSlots = useMemo(() => {
    if (!selectedDate || totalDuration === 0) return [];
    return generateAvailableSlots(
      selectedDate,
      totalDuration,
      existingAppointments,
      selectedBarberId
    );
  }, [selectedDate, totalDuration, existingAppointments, selectedBarberId]);

  if (!isOpen) return null;

  const handleToggleService = (service: Service) => {
    if (selectedServices.some((s) => s.id === service.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
      }
    } else {
      setSelectedServices([...selectedServices, service]);
    }
    // reset chosen time slot as total duration changed
    setSelectedTimeSlot('');
  };

  const handleSelectPackage = (pkg: typeof INITIAL_PACKAGES[0]) => {
    const servicesInPkg = INITIAL_SERVICES.filter((s) => pkg.service_ids.includes(s.id));
    if (servicesInPkg.length > 0) {
      setSelectedServices(servicesInPkg);
    }
    setSelectedTimeSlot('');
  };

  const handleConfirmBooking = () => {
    setErrorMessage('');
    if (!customerName.trim()) {
      setErrorMessage(isArabic ? 'يرجى إدخال اسم العميل بالكامل' : 'Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.length < 10) {
      setErrorMessage(isArabic ? 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01096913209)' : 'Please enter a valid phone number');
      return;
    }
    if (!selectedTimeSlot) {
      setErrorMessage(isArabic ? 'يرجى اختيار الموعد المناسب' : 'Please pick a time slot');
      return;
    }

    setIsSubmitting(true);

    // Concurrency double-check against current state
    const endTime = calculateEndTime(selectedTimeSlot, totalDuration);
    const chosenBarber = selectedBarberId === 'any' 
      ? INITIAL_BARBERS[0].id 
      : selectedBarberId;

    const newAppt: Appointment = {
      id: 'appt-' + Date.now(),
      appointment_number: generateAppointmentNumber(),
      branch_id: selectedBranchId,
      barber_id: chosenBarber,
      customer_id: 'cust-' + Date.now(),
      customer_name: customerName,
      customer_phone: customerPhone,
      status: 'CONFIRMED',
      date: selectedDate,
      start_time: selectedTimeSlot,
      end_time: endTime,
      services: selectedServices,
      total_duration_minutes: totalDuration,
      total_amount: totalAmount,
      discount_amount: 0,
      final_amount: totalAmount,
      customer_notes: customerNotes,
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onBookSuccess(newAppt);
      setCreatedAppointment(newAppt);
      setStep(6);
      setIsSubmitting(false);
    }, 450);
  };

  // Next dates helper (Today, Tomorrow, +2 days, etc.)
  const nextDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateKey = d.toISOString().split('T')[0];
    const dayNameAr = d.toLocaleDateString('ar-EG', { weekday: 'short' });
    const dayNameEn = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = d.getDate();
    return { dateKey, dayNameAr, dayNameEn, dayNum };
  });

  const selectedBarber = INITIAL_BARBERS.find((b) => b.id === selectedBarberId);
  const selectedBranch = INITIAL_BRANCHES.find((b) => b.id === selectedBranchId) || INITIAL_BRANCHES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>{isArabic ? 'حجز موعد أونلاين' : 'Online Booking'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {isArabic ? `الخطوة ${Math.min(step, 5)} من 5` : `Step ${Math.min(step, 5)} of 5`}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate max-w-[200px] sm:max-w-none">
                {isArabic ? 'منية النصر - الدقهلية • حجز فوري مؤكد' : 'Mit El-Nasr • Instant confirmed slot'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {step <= 5 && (
          <div className="grid grid-cols-5 bg-neutral-900 h-1.5 w-full flex-shrink-0">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`h-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-3.5 sm:p-6 overflow-y-auto touch-scroll flex-1 space-y-4 sm:space-y-5">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Branch Selection */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  {isArabic ? '1. اختر الفرع المناسب لك' : '1. Select Branch Location'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isArabic ? 'يمكنك التمتع بالخدمة في فرعنا الرئيسي بمنية النصر أو فرع المنصورة' : 'Select our flagship Mit El-Nasr branch or Mansoura VIP'}
                </p>
              </div>

              <div className="space-y-3">
                {INITIAL_BRANCHES.map((branch) => {
                  const isSelected = selectedBranchId === branch.id;
                  return (
                    <div
                      key={branch.id}
                      onClick={() => setSelectedBranchId(branch.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base text-white">
                              {isArabic ? branch.name_ar : branch.name_en}
                            </span>
                            {branch.slug === 'mit-el-nasr' && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-neutral-950">
                                {isArabic ? 'الفرع الرئيسي' : 'Flagship'}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400">
                            {isArabic ? branch.address_ar : branch.address_en}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-amber-400/90 pt-1">
                            <span>📞 {branch.phone}</span>
                            <span>•</span>
                            <span>⏰ {isArabic ? 'مفتوح حتى 12 ليلاً' : 'Open till Midnight'}</span>
                          </div>
                        </div>

                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                          isSelected ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700'
                        }`}>
                          {isSelected && <Check className="w-4 h-4 font-bold" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: Service & Package Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-200">
                    {isArabic ? '2. اختر الخدمات أو الباقات' : '2. Choose Services & Packages'}
                  </h4>
                  <p className="text-xs text-neutral-400">
                    {isArabic ? 'يمكنك اختيار أكثر من خدمة معاً' : 'Select one or multiple services'}
                  </p>
                </div>
                <div className="text-end">
                  <div className="text-xs text-neutral-400">{isArabic ? 'الإجمالي:' : 'Total:'}</div>
                  <div className="text-base font-extrabold text-amber-400">
                    {totalAmount} {SALON_INFO.currency}
                    <span className="text-[11px] font-normal text-neutral-400 ms-1">({totalDuration} دقيقة)</span>
                  </div>
                </div>
              </div>

              {/* VIP Packages Quick Pick */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-neutral-900 to-amber-950/30 border border-amber-500/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isArabic ? 'باقات موفرة وشاملة (أفضل قيمة):' : 'Recommended Bundles:'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {INITIAL_PACKAGES.slice(0, 2).map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg)}
                      className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-amber-500/40 text-start text-xs transition-all"
                    >
                      <div className="font-bold text-neutral-200">{isArabic ? pkg.name_ar : pkg.name_en}</div>
                      <div className="flex items-center justify-between mt-1 text-amber-400 font-extrabold">
                        <span>{pkg.discounted_price} {SALON_INFO.currency}</span>
                        <span className="text-[10px] text-neutral-500 line-through">{pkg.original_price} {SALON_INFO.currency}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Individual Services */}
              <div className="space-y-2.5 max-h-64 overflow-y-auto pe-1">
                {INITIAL_SERVICES.map((srv) => {
                  const isChecked = selectedServices.some((s) => s.id === srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => handleToggleService(srv)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/60'
                          : 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                          <span>{isArabic ? srv.name_ar : srv.name_en}</span>
                          {srv.is_featured && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                              {isArabic ? 'مميز' : 'Popular'}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-1">
                          {isArabic ? srv.description_ar : srv.description_en}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          ⏱ {srv.duration_minutes} {isArabic ? 'دقيقة' : 'min'}
                        </div>
                      </div>

                      <div className="text-end ps-3">
                        <div className="text-sm font-extrabold text-amber-400">
                          {srv.base_price} {SALON_INFO.currency}
                        </div>
                        <div className={`mt-1 w-5 h-5 rounded-md border mx-auto flex items-center justify-center ${
                          isChecked ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 font-bold" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Barber Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  {isArabic ? '3. اختر الحلاق المفضل لديك' : '3. Choose Your Preferred Barber'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isArabic ? 'أو اختر (أي مصفف متاح) لأسرع موعد في الصالون' : 'Or select (Any Barber) for the earliest slot'}
                </p>
              </div>

              {/* Any Barber Option */}
              <div
                onClick={() => setSelectedBarberId('any')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedBarberId === 'any'
                    ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-amber-400 font-bold text-sm">
                    ⚡
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">
                      {isArabic ? 'أي حلاق متاح أولاً (أسرع موعد)' : 'Any Available Barber (Fastest Slot)'}
                    </div>
                    <div className="text-xs text-neutral-400">
                      {isArabic ? 'سيتولى خدمتك أول مقعد متاح في التوقيت الذي تفضله' : 'The first available master stylist will take care of you'}
                    </div>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedBarberId === 'any' ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700'
                }`}>
                  {selectedBarberId === 'any' && <Check className="w-3.5 h-3.5 font-bold" />}
                </div>
              </div>

              {/* Barber Profiles */}
              <div className="space-y-3">
                {INITIAL_BARBERS.map((barber) => {
                  const isSelected = selectedBarberId === barber.id;
                  return (
                    <div
                      key={barber.id}
                      onClick={() => setSelectedBarberId(barber.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/60 ring-1 ring-amber-500/30'
                          : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={barber.photo_url}
                          alt={barber.name_ar}
                          className="w-12 h-12 rounded-full object-cover border border-amber-500/30"
                        />
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-white flex items-center gap-2">
                            <span>{isArabic ? barber.name_ar : barber.name_en}</span>
                            <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                              ★ {barber.average_rating}
                            </span>
                          </div>
                          <p className="text-xs text-amber-300/80 font-medium">
                            {isArabic ? barber.title_ar : barber.title_en}
                          </p>
                          <p className="text-[11px] text-neutral-400">
                            {isArabic ? `خبرة ${barber.experience_years} سنوات` : `${barber.experience_years} yrs exp`}
                          </p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-amber-500 border-amber-500 text-neutral-950' : 'border-neutral-700'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 font-bold" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Date & Available Time Slots */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  {isArabic ? '4. اختر اليوم والموعد المناسب' : '4. Pick Date & Available Time Slot'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isArabic ? 'يتم حساب الفترات الشاغرة ديناميكياً لضمان عدم الانتظار وتجنب التضارب' : 'Real-time slot availability avoiding double-booking'}
                </p>
              </div>

              {/* Date Pills Slider */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {nextDates.map((item) => {
                  const isSelected = selectedDate === item.dateKey;
                  return (
                    <button
                      key={item.dateKey}
                      onClick={() => {
                        setSelectedDate(item.dateKey);
                        setSelectedTimeSlot('');
                      }}
                      className={`flex-shrink-0 px-3.5 py-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-neutral-950 border-amber-400 font-bold shadow-md shadow-amber-500/20'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="text-[11px] uppercase opacity-80">
                        {isArabic ? item.dayNameAr : item.dayNameEn}
                      </div>
                      <div className="text-base font-extrabold">{item.dayNum}</div>
                    </button>
                  );
                })}
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>{isArabic ? 'الأوقات المتاحة:' : 'Available Slots:'}</span>
                  <span className="text-[11px] text-emerald-400">
                    🟢 {availableSlots.filter((s) => s.available).length} {isArabic ? 'موعد شاغر' : 'slots free'}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-56 overflow-y-auto pe-1">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedTimeSlot === slot.time;
                    if (!slot.available) {
                      return (
                        <div
                          key={slot.time}
                          className="p-2 rounded-lg bg-neutral-900/40 border border-neutral-850 text-neutral-600 text-center text-xs cursor-not-allowed line-through"
                          title="هذا الموعد محجوز"
                        >
                          {slot.displayTime}
                        </div>
                      );
                    }

                    return (
                      <button
                        key={slot.time}
                        onClick={() => setSelectedTimeSlot(slot.time)}
                        className={`p-2 rounded-lg border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-md shadow-amber-500/30'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-200 hover:border-amber-500/40 hover:text-white'
                        }`}
                      >
                        {slot.displayTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Customer Contact & Final Confirmation */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-neutral-200">
                  {isArabic ? '5. بيانات العميل وتأكيد الحجز' : '5. Customer Details & Confirmation'}
                </h4>
                <p className="text-xs text-neutral-400">
                  {isArabic ? 'سنرسل لك تفاصيل الموعد ورسالة التأكيد مباشرة عبر الواتساب' : 'We will send appointment details to your WhatsApp'}
                </p>
              </div>

              {/* Booking Summary Box */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2 text-xs">
                <div className="flex justify-between text-neutral-300">
                  <span className="text-neutral-500">{isArabic ? 'الفرع:' : 'Branch:'}</span>
                  <span className="font-bold text-white">{isArabic ? selectedBranch.name_ar : selectedBranch.name_en}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span className="text-neutral-500">{isArabic ? 'الحلاق:' : 'Barber:'}</span>
                  <span className="font-bold text-amber-400">
                    {selectedBarberId === 'any' ? (isArabic ? 'أي حلاق متاح' : 'Any Master Barber') : (isArabic ? selectedBarber?.name_ar : selectedBarber?.name_en)}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span className="text-neutral-500">{isArabic ? 'التاريخ والوقت:' : 'Date & Time:'}</span>
                  <span className="font-bold text-white">
                    {selectedDate} • {selectedTimeSlot} ({totalDuration} {isArabic ? 'دقيقة' : 'min'})
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300 pt-2 border-t border-neutral-800">
                  <span className="text-neutral-400 font-bold">{isArabic ? 'الإجمالي المقدر:' : 'Estimated Total:'}</span>
                  <span className="font-black text-sm text-amber-400">{totalAmount} {SALON_INFO.currency}</span>
                </div>
              </div>

              {/* Form inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {isArabic ? 'الاسم بالكامل *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 rtl:right-3 rtl:left-auto left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={isArabic ? 'مثال: محمد أحمد مصطفى' : 'e.g. Mohamed Ahmed'}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {isArabic ? 'رقم الهاتف والواتساب *' : 'Phone / WhatsApp *'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 rtl:right-3 rtl:left-auto left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="01096913209"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-10 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    {isArabic ? 'ملاحظات خاصة للحلاق (اختياري)' : 'Special Notes (Optional)'}
                  </label>
                  <textarea
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    rows={2}
                    placeholder={isArabic ? 'مثال: تجهيز عريس، تفضيل تدريج معين، حساسية بشرة...' : 'e.g. Skin fade preferences, groom preparation...'}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Success Confirmation Screen */}
          {step === 6 && createdAppointment && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 text-neutral-950 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                <Check className="w-9 h-9 stroke-[3]" />
              </div>

              <div>
                <h4 className="text-xl font-black text-white">
                  {isArabic ? 'تم تأكيد حجزك بنجاح في صالون الجيمي!' : 'Booking Successfully Confirmed!'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {isArabic ? 'أهلاً بك في تجربة الفخامة والأناقة في منية النصر' : 'Welcome to the luxury lounge experience'}
                </p>
              </div>

              {/* Receipt Ticket Box */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-amber-500/30 text-start space-y-2.5 text-xs max-w-md mx-auto">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-800">
                  <span className="text-neutral-400">{isArabic ? 'رقم الحجز المرجعي:' : 'Ticket Ref:'}</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">{createdAppointment.appointment_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{isArabic ? 'العميل:' : 'Customer:'}</span>
                  <span className="font-bold text-white">{createdAppointment.customer_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{isArabic ? 'الموعد:' : 'Appointment:'}</span>
                  <span className="font-bold text-emerald-400">
                    {createdAppointment.date} @ {createdAppointment.start_time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">{isArabic ? 'الفرع:' : 'Branch:'}</span>
                  <span className="text-white">{isArabic ? selectedBranch.name_ar : selectedBranch.name_en}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 text-sm">
                  <span className="font-bold text-neutral-300">{isArabic ? 'المبلغ:' : 'Total:'}</span>
                  <span className="font-extrabold text-amber-400">{createdAppointment.final_amount} {SALON_INFO.currency}</span>
                </div>
              </div>

              {/* WhatsApp Action */}
              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <a
                  href={`https://wa.me/201096913209?text=${encodeURIComponent(
                    `مرحباً صالون الجيمي، قمت بالحجز عبر الموقع برقم (${createdAppointment.appointment_number}) باسم ${createdAppointment.customer_name} في موعد ${createdAppointment.date} الساعة ${createdAppointment.start_time}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/25"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{isArabic ? 'فتح المحادثة على الواتساب' : 'Open WhatsApp Chat'}</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold transition-all"
                >
                  {isArabic ? 'إغلاق والعودة للموقع' : 'Close & Return'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step <= 5 && (
          <div className="p-3.5 sm:p-4 border-t border-neutral-800 bg-neutral-950/98 backdrop-blur-md flex items-center justify-between flex-shrink-0 pb-safe sm:pb-4">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-300 text-xs font-semibold transition-all"
              >
                {isArabic ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isArabic ? 'السابق' : 'Back'}</span>
              </button>
            ) : <div />}

            {step < 5 ? (
              <button
                onClick={() => {
                  setErrorMessage('');
                  if (step === 2 && selectedServices.length === 0) {
                    setErrorMessage(isArabic ? 'يرجى اختيار خدمة واحدة على الأقل' : 'Please pick at least one service');
                    return;
                  }
                  if (step === 4 && !selectedTimeSlot) {
                    setErrorMessage(isArabic ? 'يرجى اختيار فترة الموعد المتاحة' : 'Please select an available slot');
                    return;
                  }
                  setStep(step + 1);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs transition-all shadow-lg shadow-amber-500/20"
              >
                <span>{isArabic ? 'متابعة' : 'Continue'}</span>
                {isArabic ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <button
                onClick={handleConfirmBooking}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-neutral-950 font-black text-xs transition-all shadow-xl shadow-amber-500/30 active:scale-95 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubmitting 
                    ? (isArabic ? 'جاري تأكيد الحجز...' : 'Confirming...') 
                    : (isArabic ? 'تأكيد الحجز الفوري' : 'Confirm Instant Booking')}
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
