import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar, 
  Scissors, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  CreditCard, 
  Edit2, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Search, 
  X, 
  Check,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  Appointment, 
  PaymentRecord, 
  Service, 
  Barber, 
  Branch 
} from '../../types';
import { 
  INITIAL_BRANCHES, 
  INITIAL_CATEGORIES, 
  SALON_INFO 
} from '../../config/salon';

interface AdminDashboardProps {
  appointments: Appointment[];
  payments: PaymentRecord[];
  services: Service[];
  barbers: Barber[];
  branches: Branch[];
  isArabic: boolean;
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onAddBarber: (newBarber: Barber) => void;
  onUpdateBarber: (updatedBarber: Barber) => void;
  onDeleteBarber: (barberId: string) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onUpdateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => void;
  onUpdateBranch: (updatedBranch: Branch) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  payments,
  services,
  barbers,
  branches,
  isArabic,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddBarber,
  onUpdateBarber,
  onDeleteBarber,
  onDeleteAppointment,
  onUpdateAppointmentStatus,
  onUpdateBranch,
}) => {
  const [selectedBranchId, setSelectedBranchId] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services' | 'barbers' | 'cashier' | 'branches'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals for CRUD
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [isBarberModalOpen, setIsBarberModalOpen] = useState(false);
  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState<{ type: 'service' | 'barber' | 'appointment'; id: string; name: string } | null>(null);

  // Form State for Service
  const [serviceForm, setServiceForm] = useState({
    name_ar: '',
    name_en: '',
    category_id: INITIAL_CATEGORIES[0].id,
    base_price: 200,
    duration_minutes: 30,
    description_ar: '',
    is_featured: false,
  });

  // Form State for Barber
  const [barberForm, setBarberForm] = useState({
    name_ar: '',
    name_en: '',
    title_ar: 'مصفف شعر محترف',
    phone: '01096913209',
    experience_years: 5,
    commission_percentage: 25,
    bio_ar: '',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    specialties: 'تدريج، قصات كلاسيك',
  });

  // Filtered Appointments
  const filteredAppointments = appointments.filter((a) => {
    if (selectedBranchId === 'all') return true;
    return a.branch_id === selectedBranchId;
  });

  // Financial calculations in EGP
  const totalRevenue = filteredAppointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.final_amount, 0);

  const completedCount = filteredAppointments.filter((a) => a.status === 'COMPLETED').length;
  const activeCount = filteredAppointments.filter((a) => ['PENDING', 'CONFIRMED', 'ARRIVED', 'IN_SERVICE'].includes(a.status)).length;
  const cancelledCount = filteredAppointments.filter((a) => a.status === 'CANCELLED' || a.status === 'NO_SHOW').length;
  const avgTicket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 250;

  // Handle open service modal
  const handleOpenAddService = () => {
    setEditingService(null);
    setServiceForm({
      name_ar: '',
      name_en: '',
      category_id: INITIAL_CATEGORIES[0].id,
      base_price: 200,
      duration_minutes: 35,
      description_ar: '',
      is_featured: false,
    });
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (s: Service) => {
    setEditingService(s);
    setServiceForm({
      name_ar: s.name_ar,
      name_en: s.name_en,
      category_id: s.category_id,
      base_price: s.base_price,
      duration_minutes: s.duration_minutes,
      description_ar: s.description_ar,
      is_featured: s.is_featured,
    });
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      onUpdateService({
        ...editingService,
        name_ar: serviceForm.name_ar,
        name_en: serviceForm.name_en || serviceForm.name_ar,
        category_id: serviceForm.category_id,
        base_price: Number(serviceForm.base_price),
        previous_price: editingService.base_price,
        duration_minutes: Number(serviceForm.duration_minutes),
        description_ar: serviceForm.description_ar,
        is_featured: serviceForm.is_featured,
      });
    } else {
      const newService: Service = {
        id: 'srv-' + Date.now(),
        name_ar: serviceForm.name_ar,
        name_en: serviceForm.name_en || serviceForm.name_ar,
        category_id: serviceForm.category_id,
        base_price: Number(serviceForm.base_price),
        duration_minutes: Number(serviceForm.duration_minutes),
        buffer_minutes: 5,
        description_ar: serviceForm.description_ar,
        description_en: serviceForm.name_ar,
        is_featured: serviceForm.is_featured,
        is_active: true,
      };
      onAddService(newService);
    }
    setIsServiceModalOpen(false);
  };

  // Handle open barber modal
  const handleOpenAddBarber = () => {
    setEditingBarber(null);
    setBarberForm({
      name_ar: '',
      name_en: '',
      title_ar: 'مصفف شعر محترف',
      phone: '01096913209',
      experience_years: 4,
      commission_percentage: 25,
      bio_ar: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      specialties: 'تدريج، قصات كلاسيك',
    });
    setIsBarberModalOpen(true);
  };

  const handleOpenEditBarber = (b: Barber) => {
    setEditingBarber(b);
    setBarberForm({
      name_ar: b.name_ar,
      name_en: b.name_en,
      title_ar: b.title_ar,
      phone: b.phone,
      experience_years: b.experience_years,
      commission_percentage: b.commission_percentage,
      bio_ar: b.bio_ar,
      photo_url: b.photo_url,
      specialties: b.specialties.join(', '),
    });
    setIsBarberModalOpen(true);
  };

  const handleSaveBarber = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBarber) {
      onUpdateBarber({
        ...editingBarber,
        name_ar: barberForm.name_ar,
        name_en: barberForm.name_en || barberForm.name_ar,
        title_ar: barberForm.title_ar,
        phone: barberForm.phone,
        experience_years: Number(barberForm.experience_years),
        commission_percentage: Number(barberForm.commission_percentage),
        bio_ar: barberForm.bio_ar,
        photo_url: barberForm.photo_url,
        specialties: barberForm.specialties.split(',').map((s) => s.trim()),
      });
    } else {
      const newB: Barber = {
        id: 'barber-' + Date.now(),
        branch_id: branches[0]?.id || 'branch-mit-el-nasr',
        name_ar: barberForm.name_ar,
        name_en: barberForm.name_en || barberForm.name_ar,
        title_ar: barberForm.title_ar,
        title_en: 'Stylist',
        phone: barberForm.phone,
        bio_ar: barberForm.bio_ar,
        bio_en: barberForm.bio_ar,
        photo_url: barberForm.photo_url,
        experience_years: Number(barberForm.experience_years),
        commission_percentage: Number(barberForm.commission_percentage),
        average_rating: 5.0,
        total_reviews: 1,
        specialties: barberForm.specialties.split(',').map((s) => s.trim()),
        is_active: true,
      };
      onAddBarber(newB);
    }
    setIsBarberModalOpen(false);
  };

  const handleExecuteDelete = () => {
    if (!deleteConfirmId) return;
    if (deleteConfirmId.type === 'service') {
      onDeleteService(deleteConfirmId.id);
    } else if (deleteConfirmId.type === 'barber') {
      onDeleteBarber(deleteConfirmId.id);
    } else if (deleteConfirmId.type === 'appointment') {
      onDeleteAppointment(deleteConfirmId.id);
    }
    setDeleteConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner: Master Powers Announcement */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-neutral-900 via-purple-950/40 to-neutral-900 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>👑 {isArabic ? 'لوحة تحكم المدير العام (Master Admin Controls)' : 'Master Super Admin'}</span>
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
              {isArabic ? 'صلاحيات الإضافة والتعديل والحذف الكاملة' : 'Full CRUD Master Access'}
            </span>
          </div>
          <p className="text-xs text-neutral-300 mt-1">
            {isArabic 
              ? 'بصفتك مديراً عاماً، لديك صلاحية الإضافة والتعديل والحذف لكافة عناصر الموقع: الخدمات، الحلاقين، الفروع، المواعيد، والأسعار المباشرة.'
              : 'You possess full authorization to add, update, and delete any services, barbers, branches, appointments, and financials.'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenAddService}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? '+ إضافة خدمة جديدة' : '+ Add Service'}</span>
          </button>

          <button
            onClick={handleOpenAddBarber}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{isArabic ? '+ إضافة حلاق جديد' : '+ Add Barber'}</span>
          </button>
        </div>
      </div>

      {/* Financial KPIs Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isArabic ? 'الإيراد المحصل الكلي' : 'Collected Revenue'}</span>
            <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold">$</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">
            {totalRevenue.toLocaleString()} {SALON_INFO.currency}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {completedCount} {isArabic ? 'خدمة مكتملة ومحصلة' : 'completed appointments'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isArabic ? 'إجمالي الحجوزات' : 'Total Bookings'}</span>
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400 font-bold">#</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {filteredAppointments.length}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 font-bold">
            {activeCount} {isArabic ? 'موعد نشط قيد التنفيذ' : 'in queue or in-service'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isArabic ? 'قائمة الخدمات الفعالة' : 'Active Services'}</span>
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400 font-bold">✂️</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 mt-2">
            {services.length} {isArabic ? 'خدمة' : 'services'}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">
            {isArabic ? 'يمكنك التعديل والحذف الفوري' : 'Direct CRUD capability'}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>{isArabic ? 'فريق الحلاقين والمقاعد' : 'Active Barbers'}</span>
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-bold">★</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white mt-2">
            {barbers.length} {isArabic ? 'مصفف شعر' : 'barbers'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-bold">
            {isArabic ? 'جاهزون لخدمة العملاء' : 'Active on chairs'}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'overview' ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? 'إدارة المواعيد والحجوزات' : 'Appointments Manager'}
        </button>

        <button
          onClick={() => setActiveTab('services')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'services' ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? `إدارة وتعديل الخدمات (${services.length})` : `Services CRUD (${services.length})`}
        </button>

        <button
          onClick={() => setActiveTab('barbers')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'barbers' ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? `إدارة وتعديل الحلاقين (${barbers.length})` : `Barbers CRUD (${barbers.length})`}
        </button>

        <button
          onClick={() => setActiveTab('cashier')}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === 'cashier' ? 'border-amber-500 text-amber-400' : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          {isArabic ? 'الكاشير والمدفوعات' : 'Cashier'}
        </button>
      </div>

      {/* TAB 1: Appointments Manager with Cancel/Delete & Status Control */}
      {activeTab === 'overview' && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-neutral-800 gap-1">
            <h4 className="text-xs font-bold text-white uppercase">
              {isArabic ? 'جدول المواعيد العام والتحكم الإداري:' : 'All Salon Appointments:'}
            </h4>
            <span className="text-[11px] text-neutral-400">
              {isArabic ? 'يمكنك التمرير أفقياً وتغيير الحالة أو حذف أي موعد كمدير عام' : 'Scroll horizontally to view & manage status'}
            </span>
          </div>

          <div className="overflow-x-auto touch-scroll">
            <table className="w-full text-xs text-start min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-[11px]">
                <th className="pb-3 text-start">رقم الحجز</th>
                <th className="pb-3 text-start">العميل والهاتف</th>
                <th className="pb-3 text-start">الحلاق</th>
                <th className="pb-3 text-start">الموعد</th>
                <th className="pb-3 text-start">المبلغ</th>
                <th className="pb-3 text-start">الحالة</th>
                <th className="pb-3 text-end">إجراءات المدير</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredAppointments.map((appt) => {
                const assignedBarber = barbers.find((b) => b.id === appt.barber_id);
                return (
                  <tr key={appt.id} className="hover:bg-neutral-850/50">
                    <td className="py-3 font-mono font-bold text-amber-400">{appt.appointment_number}</td>
                    <td className="py-3">
                      <div className="font-bold text-white">{appt.customer_name}</div>
                      <div className="text-[11px] text-neutral-400">{appt.customer_phone}</div>
                    </td>
                    <td className="py-3 text-neutral-300">
                      {assignedBarber ? assignedBarber.name_ar : 'أي مقعد'}
                    </td>
                    <td className="py-3 text-neutral-300">
                      <div>{appt.date}</div>
                      <div className="text-neutral-500">{appt.start_time} - {appt.end_time}</div>
                    </td>
                    <td className="py-3 font-bold text-white">
                      {appt.final_amount} {SALON_INFO.currency}
                    </td>
                    <td className="py-3">
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateAppointmentStatus(appt.id, e.target.value as Appointment['status'])}
                        className="bg-neutral-950 border border-neutral-700 rounded px-2 py-1 text-[11px] font-bold text-amber-400 focus:outline-none"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="ARRIVED">ARRIVED</option>
                        <option value="IN_SERVICE">IN_SERVICE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="NO_SHOW">NO_SHOW</option>
                      </select>
                    </td>
                    <td className="py-3 text-end">
                      <button
                        onClick={() => setDeleteConfirmId({ type: 'appointment', id: appt.id, name: appt.appointment_number })}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400 transition-colors"
                        title="حذف هذا الحجز"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* TAB 2: Services CRUD (Add, Edit, Delete) */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase">
              {isArabic ? 'قائمة الخدمات المتاحة للعملاء (تعديل كامل وحذف):' : 'Manage All Services:'}
            </h4>
            <button
              onClick={handleOpenAddService}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? '+ إضافة خدمة جديدة' : '+ Add Service'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-white text-sm">{srv.name_ar}</h5>
                    <span className="text-sm font-black text-amber-400 flex-shrink-0">
                      {srv.base_price} {SALON_INFO.currency}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">{srv.description_ar}</p>
                  <div className="text-[11px] text-neutral-500">
                    ⏱ {srv.duration_minutes} دقيقة {srv.is_featured && '• ⭐ مميز'}
                  </div>
                </div>

                {/* Edit & Delete Controls */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditService(srv)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                  >
                    <Edit2 className="w-3 h-3 text-amber-400" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId({ type: 'service', id: srv.id, name: srv.name_ar })}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                    title="حذف الخدمة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Barbers CRUD (Add, Edit, Delete) */}
      {activeTab === 'barbers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase">
              {isArabic ? 'إدارة فريق الحلاقين ومصففي الشعر:' : 'Manage Stylists:'}
            </h4>
            <button
              onClick={handleOpenAddBarber}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isArabic ? '+ إضافة حلاق جديد' : '+ Add Barber'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={barber.photo_url}
                      alt={barber.name_ar}
                      className="w-14 h-14 rounded-2xl object-cover border border-amber-500/40"
                    />
                    <div>
                      <h5 className="font-bold text-white text-sm">{barber.name_ar}</h5>
                      <p className="text-xs text-amber-400">{barber.title_ar}</p>
                      <p className="text-[11px] text-neutral-400">📞 {barber.phone}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 space-y-1 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span>نسبة العمولة:</span>
                      <span className="text-cyan-400 font-bold">{barber.commission_percentage}%</span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>سنوات الخبرة:</span>
                      <span className="text-white font-bold">{barber.experience_years} سنوات</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditBarber(barber)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold"
                  >
                    <Edit2 className="w-3 h-3 text-cyan-400" />
                    <span>تعديل</span>
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId({ type: 'barber', id: barber.id, name: barber.name_ar })}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950 text-neutral-400 hover:text-red-400"
                    title="حذف الحلاق"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Cashier Tab */}
      {activeTab === 'cashier' && (
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
          <h4 className="text-xs font-bold text-white uppercase">
            {isArabic ? 'سجل العمليات المالية والتحصيل المباشر:' : 'Cashier Payments:'}
          </h4>
          <div className="space-y-2">
            {payments.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{p.customer_name} ({p.customer_phone})</div>
                  <div className="text-[11px] text-neutral-400">طريقة السداد: <span className="text-amber-400 font-semibold">{p.method}</span></div>
                </div>
                <div className="text-end">
                  <span className="text-base font-black text-emerald-400">+{p.amount} {SALON_INFO.currency}</span>
                  <span className="block text-[10px] text-emerald-300">مكتمل</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Service Add / Edit */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto touch-scroll">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-white text-base">
                {editingService ? (isArabic ? 'تعديل بيانات الخدمة' : 'Edit Service') : (isArabic ? 'إضافة خدمة جديدة' : 'Add New Service')}
              </h4>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">اسم الخدمة بالعربية *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.name_ar}
                  onChange={(e) => setServiceForm({ ...serviceForm, name_ar: e.target.value })}
                  placeholder="مثال: قص شعر ملكي + سشوار"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">السعر (EGP) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.base_price}
                    onChange={(e) => setServiceForm({ ...serviceForm, base_price: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">المدة (بالدقائق) *</label>
                  <input
                    type="number"
                    required
                    value={serviceForm.duration_minutes}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration_minutes: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">التصنيف</label>
                <select
                  value={serviceForm.category_id}
                  onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                >
                  {INITIAL_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">وصف الخدمة</label>
                <textarea
                  rows={2}
                  value={serviceForm.description_ar}
                  onChange={(e) => setServiceForm({ ...serviceForm, description_ar: e.target.value })}
                  placeholder="وصف تفصيلي للخدمة وميزاتها..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="is_featured_cb"
                  checked={serviceForm.is_featured}
                  onChange={(e) => setServiceForm({ ...serviceForm, is_featured: e.target.checked })}
                  className="rounded border-neutral-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="is_featured_cb" className="text-neutral-300">
                  تمييز هذه الخدمة كخدمة الأكثر طلباً (Featured)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold"
                >
                  {editingService ? 'حفظ التعديلات' : 'إضافة الخدمة'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Barber Add / Edit */}
      {isBarberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto touch-scroll">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
              <h4 className="font-bold text-white text-base">
                {editingBarber ? 'تعديل بيانات الحلاق' : 'إضافة حلاق جديد'}
              </h4>
              <button onClick={() => setIsBarberModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBarber} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1">اسم الحلاق *</label>
                <input
                  type="text"
                  required
                  value={barberForm.name_ar}
                  onChange={(e) => setBarberForm({ ...barberForm, name_ar: e.target.value })}
                  placeholder="مثال: يوسف الشناوي"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">المسمى المهني</label>
                  <input
                    type="text"
                    value={barberForm.title_ar}
                    onChange={(e) => setBarberForm({ ...barberForm, title_ar: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">الهاتف</label>
                  <input
                    type="text"
                    value={barberForm.phone}
                    onChange={(e) => setBarberForm({ ...barberForm, phone: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">نسبة العمولة %</label>
                  <input
                    type="number"
                    value={barberForm.commission_percentage}
                    onChange={(e) => setBarberForm({ ...barberForm, commission_percentage: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">سنوات الخبرة</label>
                  <input
                    type="number"
                    value={barberForm.experience_years}
                    onChange={(e) => setBarberForm({ ...barberForm, experience_years: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">التخصصات (مفصولة بفاصلة)</label>
                <input
                  type="text"
                  value={barberForm.specialties}
                  onChange={(e) => setBarberForm({ ...barberForm, specialties: e.target.value })}
                  placeholder="سكين فيد، تحديد لحية، هيدرافيشال"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsBarberModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
                >
                  {editingBarber ? 'حفظ التعديلات' : 'إضافة الحلاق'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-neutral-950 border border-red-500/50 rounded-2xl p-5 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">تأكيد عملية الحذف</h4>
              <p className="text-xs text-neutral-400 mt-1">
                هل أنت متأكد من حذف ({deleteConfirmId.name}) نهائياً من النظام؟
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-600/30"
              >
                نعم، احذف نهائياً
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
