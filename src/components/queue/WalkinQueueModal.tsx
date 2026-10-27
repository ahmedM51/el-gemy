import React, { useState } from 'react';
import { 
  X, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Scissors, 
  Play, 
  Phone, 
  Sparkles,
  Ticket
} from 'lucide-react';
import { WalkinQueueItem, Barber } from '../../types';
import { INITIAL_BARBERS, INITIAL_SERVICES, SALON_INFO } from '../../config/salon';

interface WalkinQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  queue: WalkinQueueItem[];
  onUpdateQueue: (updatedQueue: WalkinQueueItem[]) => void;
  isArabic: boolean;
}

export const WalkinQueueModal: React.FC<WalkinQueueModalProps> = ({
  isOpen,
  onClose,
  queue,
  onUpdateQueue,
  isArabic,
}) => {
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('any');
  const [selectedServices, setSelectedServices] = useState<string[]>([INITIAL_SERVICES[0].name_ar]);
  const [showAddForm, setShowAddForm] = useState(false);

  if (!isOpen) return null;

  const handleAddWalkin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim() || !newCustomerPhone.trim()) return;

    const nextTicket = queue.length > 0 
      ? Math.max(...queue.map((q) => q.ticket_number)) + 1 
      : 101;

    const newItem: WalkinQueueItem = {
      id: 'walkin-' + Date.now(),
      ticket_number: nextTicket,
      branch_id: 'branch-mit-el-nasr',
      customer_name: newCustomerName,
      customer_phone: newCustomerPhone,
      barber_id: selectedBarberId === 'any' ? undefined : selectedBarberId,
      service_names: selectedServices,
      estimated_duration: 35,
      status: 'WAITING',
      created_at: new Date().toISOString(),
    };

    onUpdateQueue([...queue, newItem]);
    setNewCustomerName('');
    setNewCustomerPhone('');
    setShowAddForm(false);
  };

  const handleStatusChange = (id: string, newStatus: WalkinQueueItem['status']) => {
    const updated = queue.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: newStatus,
          called_at: newStatus === 'CALLED' ? new Date().toISOString() : item.called_at,
        };
      }
      return item;
    });
    onUpdateQueue(updated);
  };

  const handleRemove = (id: string) => {
    onUpdateQueue(queue.filter((q) => q.id !== id));
  };

  const waitingCount = queue.filter((q) => q.status === 'WAITING').length;
  const inServiceCount = queue.filter((q) => q.status === 'IN_SERVICE').length;
  const estimatedTotalWait = waitingCount * 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-3.5 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-1.5 sm:gap-2">
                <span>{isArabic ? 'طابور العملاء الحاضرين' : 'Walk-in Queue'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isArabic ? 'مباشر' : 'Live'}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 truncate max-w-[200px] sm:max-w-none">
                {isArabic ? 'منية النصر • تنظيم حضور الزبائن وتوزيع المقاعد' : 'Manage on-site customers & seat allocation'}
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

        {/* Live Status Stats Ribbon */}
        <div className="grid grid-cols-3 bg-neutral-900/80 border-b border-neutral-800 p-2.5 sm:p-3 text-center text-xs flex-shrink-0">
          <div>
            <span className="text-neutral-400 block text-[11px]">{isArabic ? 'قيد الانتظار' : 'Waiting'}</span>
            <span className="text-sm sm:text-base font-extrabold text-amber-400">{waitingCount}</span>
          </div>
          <div className="border-x border-neutral-800">
            <span className="text-neutral-400 block text-[11px]">{isArabic ? 'على الكراسي' : 'In Service'}</span>
            <span className="text-sm sm:text-base font-extrabold text-cyan-400">{inServiceCount}</span>
          </div>
          <div>
            <span className="text-neutral-400 block text-[11px]">{isArabic ? 'متوسط الانتظار' : 'Est. Wait'}</span>
            <span className="text-sm sm:text-base font-extrabold text-emerald-400">
              ~{estimatedTotalWait} {isArabic ? 'د' : 'min'}
            </span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-3.5 sm:p-6 overflow-y-auto touch-scroll flex-1 space-y-4">
          {/* Action to add a walk-in */}
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs transition-all shadow-lg shadow-emerald-600/20"
            >
              <UserPlus className="w-4 h-4" />
              <span>{isArabic ? '+ تسجيل زبون حاضر جديد وإصدار رقم تذكرة' : '+ Check-in New Walk-in Customer'}</span>
            </button>
          ) : (
            <form onSubmit={handleAddWalkin} className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-white border-b border-neutral-800 pb-2">
                <span>{isArabic ? 'تسجيل عميل جديد على كاونتر الاستقبال' : 'New Walk-in Check-in Form'}</span>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isArabic ? 'اسم العميل *' : 'Customer Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder={isArabic ? 'مثال: سامح فودة' : 'e.g. Sameh Fouda'}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isArabic ? 'رقم الهاتف *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="01096913209"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isArabic ? 'تفضيل الحلاق' : 'Preferred Barber'}
                  </label>
                  <select
                    value={selectedBarberId}
                    onChange={(e) => setSelectedBarberId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="any">{isArabic ? 'أي مقعد متاح أولاً' : 'First Available Barber'}</option>
                    {INITIAL_BARBERS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {isArabic ? b.name_ar : b.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    {isArabic ? 'الخدمة الأساسية' : 'Service'}
                  </label>
                  <select
                    onChange={(e) => setSelectedServices([e.target.value])}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    {INITIAL_SERVICES.map((s) => (
                      <option key={s.id} value={s.name_ar}>
                        {isArabic ? s.name_ar : s.name_en} ({s.base_price} {SALON_INFO.currency})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                >
                  {isArabic ? 'إصدار التذكرة وإضافة للطابور' : 'Issue Ticket & Enqueue'}
                </button>
              </div>
            </form>
          )}

          {/* Current Queue List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              {isArabic ? 'قائمة العملاء الحاضرين حالياً بالصالون:' : 'Active Walk-in Waiting List:'}
            </h4>

            {queue.length === 0 ? (
              <div className="text-center py-10 bg-neutral-900/40 border border-neutral-800/80 rounded-xl text-neutral-500 text-xs">
                {isArabic ? 'لا يوجد عملاء في الانتظار حالياً. جميع الكراسي متاحة.' : 'No active walk-in customers currently.'}
              </div>
            ) : (
              queue.map((item) => {
                const assignedBarber = INITIAL_BARBERS.find((b) => b.id === item.barber_id);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      item.status === 'IN_SERVICE'
                        ? 'bg-cyan-950/20 border-cyan-500/40'
                        : item.status === 'CALLED'
                        ? 'bg-amber-950/20 border-amber-500/40 animate-pulse'
                        : 'bg-neutral-900/60 border-neutral-800'
                    }`}
                  >
                    {/* Customer & Ticket Details */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 flex flex-col items-center justify-center font-bold text-amber-400">
                        <span className="text-[10px] text-neutral-400 uppercase">TICKET</span>
                        <span className="text-base font-black">#{item.ticket_number}</span>
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{item.customer_name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            item.status === 'IN_SERVICE'
                              ? 'bg-cyan-500/20 text-cyan-300'
                              : item.status === 'CALLED'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {item.status === 'WAITING' && (isArabic ? 'في الانتظار' : 'Waiting')}
                            {item.status === 'CALLED' && (isArabic ? 'تم النداء' : 'Called')}
                            {item.status === 'IN_SERVICE' && (isArabic ? 'على المقعد' : 'In Service')}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400">
                          📞 {item.customer_phone} • {item.service_names.join(', ')}
                        </div>
                        <div className="text-[11px] text-amber-400/80">
                          ✂️ {assignedBarber ? (isArabic ? assignedBarber.name_ar : assignedBarber.name_en) : (isArabic ? 'أي مقعد متاح' : 'Any seat')}
                        </div>
                      </div>
                    </div>

                    {/* Quick State Transition Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {item.status === 'WAITING' && (
                        <button
                          onClick={() => handleStatusChange(item.id, 'CALLED')}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-all"
                        >
                          {isArabic ? 'نداء العميل' : 'Call'}
                        </button>
                      )}

                      {item.status === 'CALLED' && (
                        <button
                          onClick={() => handleStatusChange(item.id, 'IN_SERVICE')}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all"
                        >
                          {isArabic ? 'بدء الخدمة' : 'Start'}
                        </button>
                      )}

                      {item.status === 'IN_SERVICE' && (
                        <button
                          onClick={() => handleRemove(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all"
                        >
                          {isArabic ? 'إتمام ومحاسبة' : 'Complete & Pay'}
                        </button>
                      )}

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                        title="إلغاء التذكرة"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
