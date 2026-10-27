import React, { useState } from 'react';
import { 
  Scissors, 
  Calendar, 
  Clock, 
  CheckCircle, 
  User, 
  DollarSign, 
  Star, 
  Phone, 
  AlertCircle,
  FileText,
  Play
} from 'lucide-react';
import { INITIAL_BARBERS, SALON_INFO } from '../../config/salon';
import { Appointment, Barber } from '../../types';

interface BarberConsoleProps {
  appointments: Appointment[];
  onUpdateStatus: (appointmentId: string, status: Appointment['status'], notes?: string) => void;
  isArabic: boolean;
}

export const BarberConsole: React.FC<BarberConsoleProps> = ({
  appointments,
  onUpdateStatus,
  isArabic,
}) => {
  const [selectedBarberId, setSelectedBarberId] = useState(INITIAL_BARBERS[0].id);
  const [activeTab, setActiveTab] = useState<'today' | 'completed' | 'stats'>('today');
  const [noteModalAppt, setNoteModalAppt] = useState<Appointment | null>(null);
  const [noteText, setNoteText] = useState('');

  const currentBarber = INITIAL_BARBERS.find((b) => b.id === selectedBarberId) || INITIAL_BARBERS[0];

  // Filter appointments for this barber
  const barberAppts = appointments.filter((a) => a.barber_id === currentBarber.id);
  const activeToday = barberAppts.filter((a) => ['PENDING', 'CONFIRMED', 'ARRIVED', 'IN_SERVICE'].includes(a.status));
  const completedToday = barberAppts.filter((a) => a.status === 'COMPLETED');

  // Daily revenue & commission calculation
  const totalCompletedRevenue = completedToday.reduce((sum, a) => sum + a.final_amount, 0);
  const barberEarnings = Math.round((totalCompletedRevenue * currentBarber.commission_percentage) / 100);

  const handleSaveNotes = () => {
    if (noteModalAppt) {
      onUpdateStatus(noteModalAppt.id, noteModalAppt.status, noteText);
      setNoteModalAppt(null);
      setNoteText('');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Barber Portal Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={currentBarber.photo_url}
            alt={currentBarber.name_ar}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shadow-amber-500/10"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">
                {isArabic ? currentBarber.name_ar : currentBarber.name_en}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
                {isArabic ? 'بوابة الحلاق' : 'Barber Console'}
              </span>
            </div>
            <p className="text-xs text-amber-400 font-medium">
              {isArabic ? currentBarber.title_ar : currentBarber.title_en}
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
              <span className="flex items-center gap-1 text-amber-300 font-bold">
                ★ {currentBarber.average_rating} ({currentBarber.total_reviews} {isArabic ? 'تقييم' : 'reviews'})
              </span>
              <span>•</span>
              <span>نسبة العمولة: {currentBarber.commission_percentage}%</span>
            </div>
          </div>
        </div>

        {/* Barber Switcher for testing/demo */}
        <div className="flex items-center gap-2 bg-neutral-900 p-2 rounded-xl border border-neutral-800">
          <span className="text-xs text-neutral-400 px-1 font-semibold">
            {isArabic ? 'مصفف الشعر:' : 'Stylist:'}
          </span>
          <select
            value={selectedBarberId}
            onChange={(e) => setSelectedBarberId(e.target.value)}
            className="bg-neutral-950 text-white border border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-amber-500"
          >
            {INITIAL_BARBERS.map((b) => (
              <option key={b.id} value={b.id}>
                {isArabic ? b.name_ar : b.name_en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-xs text-neutral-400 block">{isArabic ? 'مواعيد اليوم المتبقية' : 'Remaining Today'}</span>
          <span className="text-2xl font-black text-white">{activeToday.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-xs text-neutral-400 block">{isArabic ? 'الخدمات المكتملة' : 'Completed'}</span>
          <span className="text-2xl font-black text-emerald-400">{completedToday.length}</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-xs text-neutral-400 block">{isArabic ? 'إجمالي إيراد مقعدك' : 'Chair Revenue'}</span>
          <span className="text-2xl font-black text-amber-400">{totalCompletedRevenue} {SALON_INFO.currency}</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800">
          <span className="text-xs text-neutral-400 block">{isArabic ? 'عمولتك المستحقة اليوم' : 'Your Commission'}</span>
          <span className="text-2xl font-black text-cyan-400">{barberEarnings} {SALON_INFO.currency}</span>
        </div>
      </div>

      {/* Appointments Navigation Tabs */}
      <div className="flex border-b border-neutral-800 gap-2">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'today'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? `مواعيدي النشطة (${activeToday.length})` : `Active Queue (${activeToday.length})`}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'completed'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? `السجل المنتهي اليوم (${completedToday.length})` : `Completed Today (${completedToday.length})`}
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-3">
        {activeTab === 'today' && (
          activeToday.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 text-neutral-500 text-xs">
              {isArabic ? 'لا توجد مواعيد متبقية على مقعدك لليوم. عمل رائع!' : 'No pending appointments for today.'}
            </div>
          ) : (
            activeToday.map((appt) => (
              <div
                key={appt.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  appt.status === 'IN_SERVICE'
                    ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                    : 'bg-neutral-900/60 border-neutral-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-neutral-800 text-amber-400">
                        {appt.appointment_number}
                      </span>
                      <span className="text-base font-bold text-white">
                        {appt.customer_name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        appt.status === 'IN_SERVICE'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : appt.status === 'ARRIVED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1 text-white font-medium">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        {appt.start_time} - {appt.end_time} ({appt.total_duration_minutes} دقيقة)
                      </span>
                      <span>•</span>
                      <a href={`tel:${appt.customer_phone}`} className="flex items-center gap-1 text-neutral-300 hover:text-amber-400">
                        <Phone className="w-3.5 h-3.5" />
                        {appt.customer_phone}
                      </a>
                    </div>

                    <div className="text-xs text-neutral-300 pt-1">
                      ✂️ <span className="font-semibold text-amber-300">الخدمات:</span>{' '}
                      {appt.services.map((s) => (isArabic ? s.name_ar : s.name_en)).join(' + ')}
                    </div>

                    {appt.customer_notes && (
                      <div className="text-[11px] text-neutral-400 bg-neutral-950/60 p-2 rounded-lg border border-neutral-850 mt-1">
                        💬 <span className="text-neutral-500">ملاحظة الزبون:</span> {appt.customer_notes}
                      </div>
                    )}
                  </div>

                  {/* Actions for barber */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0">
                    <button
                      onClick={() => {
                        setNoteModalAppt(appt);
                        setNoteText(appt.barber_notes || '');
                      }}
                      className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs flex items-center gap-1"
                      title="ملاحظات فنية للحلاق"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{appt.barber_notes ? 'تعديل الملاحظات' : 'إضافة ملاحظة'}</span>
                    </button>

                    {appt.status !== 'IN_SERVICE' ? (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'IN_SERVICE')}
                        className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/20"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'بدء الخدمة على المقعد' : 'Start Service'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onUpdateStatus(appt.id, 'COMPLETED')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{isArabic ? 'إنهاء الخدمة ومحاسبة' : 'Complete Service'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onUpdateStatus(appt.id, 'NO_SHOW')}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-400 hover:text-red-400 text-xs"
                    >
                      {isArabic ? 'لم يحضر' : 'No Show'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )
        )}

        {activeTab === 'completed' && (
          completedToday.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800 text-neutral-500 text-xs">
              {isArabic ? 'لم تكتمل أي خدمات بعد اليوم.' : 'No completed appointments yet.'}
            </div>
          ) : (
            completedToday.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white text-sm">{appt.customer_name}</div>
                  <div className="text-neutral-400">
                    {appt.start_time} - {appt.end_time} • {appt.services.map((s) => s.name_ar).join(', ')}
                  </div>
                </div>
                <div className="text-end font-bold text-amber-400">
                  {appt.final_amount} {SALON_INFO.currency}
                  <span className="block text-[10px] text-emerald-400">
                    عمولتك: {Math.round((appt.final_amount * currentBarber.commission_percentage) / 100)} {SALON_INFO.currency}
                  </span>
                </div>
              </div>
            ))
          )
        )}
      </div>

      {/* Note Edit Modal */}
      {noteModalAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-5 space-y-4 my-auto max-h-[90vh] overflow-y-auto touch-scroll">
            <h4 className="text-sm font-bold text-white">
              {isArabic ? `ملاحظات فنية للعميل (${noteModalAppt.customer_name})` : 'Barber Technical Notes'}
            </h4>
            <p className="text-xs text-neutral-400">
              {isArabic ? 'سجل نمرة تدريج الشعر، حساسية البشرة، أو تفضيلات العميل ليتم الرجوع إليها في الزيارات القادمة:' : 'Record taper blade guards, skin sensitivity, or customer preferences:'}
            </p>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={isArabic ? 'مثال: فيد نمرة 1.5 على الجوانب، سشوار هواء بارد، يفضل زيت الأرجان بدون عطر...' : 'e.g. Guard #1.5 on sides, cold blow-dry...'}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setNoteModalAppt(null)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
              >
                {isArabic ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
              >
                {isArabic ? 'حفظ الملاحظة' : 'Save Notes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
