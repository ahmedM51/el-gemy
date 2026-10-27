import React, { useState, useEffect } from 'react';
import { 
  Navbar 
} from './components/layout/Navbar';
import { 
  Footer 
} from './components/layout/Footer';
import { 
  Hero 
} from './components/public/Hero';
import { 
  ServicesSection 
} from './components/public/ServicesSection';
import { 
  PackagesSection 
} from './components/public/PackagesSection';
import { 
  BarbersSection 
} from './components/public/BarbersSection';
import { 
  ReviewsSection 
} from './components/public/ReviewsSection';
import { 
  LocationSection 
} from './components/public/LocationSection';
import { 
  BookingModal 
} from './components/booking/BookingModal';
import { 
  WalkinQueueModal 
} from './components/queue/WalkinQueueModal';
import { 
  BarberConsole 
} from './components/barber/BarberConsole';
import { 
  AdminDashboard 
} from './components/dashboard/AdminDashboard';
import { 
  AddReviewModal 
} from './components/reviews/AddReviewModal';
import { 
  LoginModal 
} from './components/auth/LoginModal';
import { 
  JsonLd 
} from './components/seo/JsonLd';
import { 
  UserRole, 
  Appointment, 
  WalkinQueueItem, 
  Review, 
  PaymentRecord,
  Service,
  Barber,
  Branch
} from './types';
import { 
  AuthUser, 
  DEMO_USERS 
} from './types/auth';
import { 
  getStoredAppointments, 
  saveAppointments, 
  getStoredQueue, 
  saveQueue, 
  getStoredReviews, 
  saveReviews, 
  getStoredPayments, 
  savePayments 
} from './lib/storage';
import { 
  INITIAL_SERVICES, 
  INITIAL_BARBERS, 
  INITIAL_BRANCHES, 
  SALON_INFO 
} from './config/salon';
import { 
  Calendar, 
  MessageCircle, 
  Scissors, 
  Clock, 
  Sparkles, 
  Phone, 
  ShieldCheck,
  UserCheck
} from 'lucide-react';

export default function App() {
  // Localization State
  const [isArabic, setIsArabic] = useState(true);

  // Authentication & RBAC Role State (Default to public customer view until signed in)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('elgemy_auth_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'CUSTOMER';
  });

  const [activeTab, setActiveTab] = useState('home');

  // Core Data State (With local storage and persistent fallback)
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const stored = localStorage.getItem('elgemy_services_v1');
      return stored ? JSON.parse(stored) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [barbers, setBarbers] = useState<Barber[]>(() => {
    try {
      const stored = localStorage.getItem('elgemy_barbers_v1');
      return stored ? JSON.parse(stored) : INITIAL_BARBERS;
    } catch {
      return INITIAL_BARBERS;
    }
  });

  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const stored = localStorage.getItem('elgemy_branches_v1');
      return stored ? JSON.parse(stored) : INITIAL_BRANCHES;
    } catch {
      return INITIAL_BRANCHES;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments);
  const [queue, setQueue] = useState<WalkinQueueItem[]>(getStoredQueue);
  const [reviews, setReviews] = useState<Review[]>(getStoredReviews);
  const [payments, setPayments] = useState<PaymentRecord[]>(getStoredPayments);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>();
  const [preselectedBarberId, setPreselectedBarberId] = useState<string | undefined>();

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
    document.documentElement.lang = isArabic ? 'ar' : 'en';
  }, [isArabic]);

  // Save services/barbers to local storage
  const persistServices = (newServices: Service[]) => {
    setServices(newServices);
    try {
      localStorage.setItem('elgemy_services_v1', JSON.stringify(newServices));
    } catch (e) {
      console.error(e);
    }
  };

  const persistBarbers = (newBarbers: Barber[]) => {
    setBarbers(newBarbers);
    try {
      localStorage.setItem('elgemy_barbers_v1', JSON.stringify(newBarbers));
    } catch (e) {
      console.error(e);
    }
  };

  // Auth handlers
  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    try {
      localStorage.setItem('elgemy_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(isArabic ? `مرحباً بك يا ${user.name}، تم تسجيل الدخول بصلاحية: ${user.role}` : `Welcome ${user.name}! Logged in as ${user.role}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('CUSTOMER');
    try {
      localStorage.removeItem('elgemy_auth_user');
    } catch (e) {
      console.error(e);
    }
    showToast(isArabic ? 'تم تسجيل الخروج بنجاح والعودة لواجهة العميل' : 'Signed out successfully');
  };

  const handleRoleChange = (role: UserRole) => {
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      if (!currentUser || (currentUser.role !== 'SUPER_ADMIN' && currentUser.role !== 'ADMIN')) {
        showToast(isArabic ? 'عذراً، هذا القسم مخصص لإدارة الصالون فقط. يرجى تسجيل الدخول بحساب مسؤول.' : 'Unauthorized access. Admin credentials required.');
        setIsLoginOpen(true);
        return;
      }
    } else if (role === 'BARBER') {
      if (!currentUser || currentUser.role !== 'BARBER') {
        showToast(isArabic ? 'عذراً، هذا القسم مخصص لمصففي الصالون فقط.' : 'Unauthorized access. Barber credentials required.');
        setIsLoginOpen(true);
        return;
      }
    } else if (role === 'RECEPTIONIST') {
      if (!currentUser || currentUser.role !== 'RECEPTIONIST') {
        showToast(isArabic ? 'عذراً، هذا القسم مخصص لموظف الاستقبال.' : 'Unauthorized access. Receptionist credentials required.');
        setIsLoginOpen(true);
        return;
      }
    }
    setCurrentRole(role);
    showToast(isArabic ? `تم الانتقال إلى: ${role === 'SUPER_ADMIN' ? 'لوحة تحكم الإدارة' : role === 'BARBER' ? 'لوحة الحلاق' : role === 'RECEPTIONIST' ? 'الاستقبال' : 'بوابة العميل'}` : `Switched to role: ${role}`);
  };

  // Booking handlers
  const handleBookSuccess = (newAppt: Appointment) => {
    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    saveAppointments(updated);
    showToast(isArabic ? `تم تأكيد حجزك برقم (${newAppt.appointment_number}) بنجاح!` : `Booking confirmed #${newAppt.appointment_number}`);
  };

  // Admin Master CRUD Handlers
  const handleAddService = (newService: Service) => {
    const updated = [newService, ...services];
    persistServices(updated);
    showToast(isArabic ? `تمت إضافة خدمة (${newService.name_ar}) بنجاح!` : 'Service added successfully');
  };

  const handleUpdateService = (updatedService: Service) => {
    const updated = services.map((s) => s.id === updatedService.id ? updatedService : s);
    persistServices(updated);
    showToast(isArabic ? `تم تعديل خدمة (${updatedService.name_ar}) بنجاح!` : 'Service updated successfully');
  };

  const handleDeleteService = (serviceId: string) => {
    const target = services.find((s) => s.id === serviceId);
    const updated = services.filter((s) => s.id !== serviceId);
    persistServices(updated);
    showToast(isArabic ? `تم حذف الخدمة (${target?.name_ar || ''}) نهائياً!` : 'Service deleted permanently');
  };

  const handleAddBarber = (newBarber: Barber) => {
    const updated = [...barbers, newBarber];
    persistBarbers(updated);
    showToast(isArabic ? `تمت إضافة مصفف الشعر (${newBarber.name_ar}) بنجاح!` : 'Barber added successfully');
  };

  const handleUpdateBarber = (updatedBarber: Barber) => {
    const updated = barbers.map((b) => b.id === updatedBarber.id ? updatedBarber : b);
    persistBarbers(updated);
    showToast(isArabic ? `تم تعديل بيانات (${updatedBarber.name_ar}) بنجاح!` : 'Barber updated successfully');
  };

  const handleDeleteBarber = (barberId: string) => {
    const target = barbers.find((b) => b.id === barberId);
    const updated = barbers.filter((b) => b.id !== barberId);
    persistBarbers(updated);
    showToast(isArabic ? `تم حذف الحلاق (${target?.name_ar || ''}) نهائياً!` : 'Barber deleted permanently');
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    const updated = appointments.filter((a) => a.id !== appointmentId);
    setAppointments(updated);
    saveAppointments(updated);
    showToast(isArabic ? 'تم حذف الموعد نهائياً من النظام' : 'Appointment deleted permanently');
  };

  const handleUpdateAppointmentStatus = (
    appointmentId: string, 
    newStatus: Appointment['status'], 
    notes?: string
  ) => {
    const updated = appointments.map((a) => {
      if (a.id === appointmentId) {
        return {
          ...a,
          status: newStatus,
          barber_notes: notes !== undefined ? notes : a.barber_notes,
          updated_at: new Date().toISOString(),
        };
      }
      return a;
    });

    setAppointments(updated);
    saveAppointments(updated);

    // If completed, auto-create a cashier payment record
    if (newStatus === 'COMPLETED') {
      const appt = appointments.find((a) => a.id === appointmentId);
      if (appt) {
        const newPay: PaymentRecord = {
          id: 'pay-' + Date.now(),
          appointment_id: appt.id,
          customer_name: appt.customer_name,
          customer_phone: appt.customer_phone,
          amount: appt.final_amount,
          currency: 'EGP',
          method: 'CASH',
          status: 'PAID',
          transaction_ref: 'CSH-' + Math.floor(1000 + Math.random() * 9000),
          created_at: new Date().toISOString(),
        };
        const updatedPays = [newPay, ...payments];
        setPayments(updatedPays);
        savePayments(updatedPays);
      }
    }

    showToast(isArabic ? 'تم تحديث حالة الموعد بنجاح' : 'Appointment status updated');
  };

  const handleUpdateBranch = (updatedBranch: Branch) => {
    const updated = branches.map((b) => b.id === updatedBranch.id ? updatedBranch : b);
    setBranches(updated);
    showToast(isArabic ? 'تم تحديث بيانات الفرع' : 'Branch updated');
  };

  const handleUpdateQueue = (newQueue: WalkinQueueItem[]) => {
    setQueue(newQueue);
    saveQueue(newQueue);
  };

  const handleSubmitReview = (newReview: Review) => {
    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveReviews(updated);
    showToast(isArabic ? 'شكراً لك! تم إضافة تقييمك بنجاح' : 'Thank you! Review submitted');
  };

  const handleSelectServiceToBook = (serviceId: string) => {
    setPreselectedServiceId(serviceId);
    setPreselectedBarberId(undefined);
    setIsBookingOpen(true);
  };

  const handleSelectBarberToBook = (barberId: string) => {
    setPreselectedBarberId(barberId);
    setPreselectedServiceId(undefined);
    setIsBookingOpen(true);
  };

  const handleNavigateTab = (tab: string) => {
    setActiveTab(tab);
    setCurrentRole('CUSTOMER');
    const targetElement = document.getElementById(tab);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Structured SEO Schema Data */}
      <JsonLd />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-black text-xs sm:text-sm shadow-2xl shadow-amber-500/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        currentUser={currentUser}
        onNavigateToPortal={handleRoleChange}
        onOpenBooking={() => {
          setPreselectedServiceId(undefined);
          setPreselectedBarberId(undefined);
          setIsBookingOpen(true);
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        isArabic={isArabic}
        onToggleLanguage={() => setIsArabic(!isArabic)}
        activeTab={activeTab}
        onNavigateTab={handleNavigateTab}
      />

      {/* Role Banner if not on public customer portal */}
      {currentRole !== 'CUSTOMER' && currentUser && (
        <div className="bg-gradient-to-r from-neutral-900 via-purple-950/40 to-neutral-900 border-b border-purple-500/30 px-4 py-2.5 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 text-purple-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>
              {isArabic 
                ? `الواجهة النشطة الحالية: ${
                    currentRole === 'BARBER' 
                      ? '✂️ لوحة الحلاق (مواعيدي والخدمة)' 
                      : (currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN')
                      ? '👑 لوحة المدير والتقارير المالية (كامل الصلاحيات للإضافة والتعديل والحذف)' 
                      : '🛎️ موظف الاستقبال وطابور الحضور'
                  }`
                : `Active Mode: ${currentRole}`}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-[11px] text-amber-400 hover:underline font-bold"
            >
              {isArabic ? 'تبديل الحساب...' : 'Switch user...'}
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={() => setCurrentRole('CUSTOMER')}
              className="text-[11px] underline text-neutral-300 hover:text-white"
            >
              {isArabic ? 'الرجوع للموقع العام (واجهة العميل) ←' : 'Return to Customer Site →'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area based on RBAC Role */}
      <main className="flex-1 pb-24 lg:pb-0">
        {/* 1. CUSTOMER PORTAL (بوابة العميل - الحجز العام) */}
        {currentRole === 'CUSTOMER' && (
          <>
            <Hero
              onOpenBooking={() => {
                setPreselectedServiceId(undefined);
                setPreselectedBarberId(undefined);
                setIsBookingOpen(true);
              }}
              onExploreServices={() => handleNavigateTab('services')}
              isArabic={isArabic}
            />

            <ServicesSection
              onSelectServiceToBook={handleSelectServiceToBook}
              isArabic={isArabic}
            />

            <PackagesSection
              onOpenBooking={() => setIsBookingOpen(true)}
              isArabic={isArabic}
            />

            <BarbersSection
              onOpenBookingWithBarber={handleSelectBarberToBook}
              isArabic={isArabic}
            />

            <ReviewsSection
              reviews={reviews}
              onOpenAddReview={() => setIsAddReviewOpen(true)}
              isArabic={isArabic}
            />

            <LocationSection
              onOpenBooking={() => setIsBookingOpen(true)}
              isArabic={isArabic}
            />
          </>
        )}

        {/* 2. RECEPTIONIST PORTAL (موظف الاستقبال والـ Walk-in) */}
        {currentRole === 'RECEPTIONIST' && currentUser && currentUser.role === 'RECEPTIONIST' && (
          <div className="py-8 space-y-4">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
              <div>
                <h3 className="font-bold text-white text-base">
                  {isArabic ? '🛎️ كاونتر الاستقبال والعملاء الحاضرين' : 'Receptionist Desk'}
                </h3>
                <p className="text-xs text-neutral-400">
                  {isArabic ? 'تسجيل الزبائن بدون موعد مسبق ونداء التذاكر ومراقبة المقاعد' : 'Walk-in check-in & live queue'}
                </p>
              </div>

              <button
                onClick={() => setIsQueueOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20"
              >
                + فتح نافذة إدارة الطابور والتذاكر
              </button>
            </div>

            <AdminDashboard
              appointments={appointments}
              payments={payments}
              services={services}
              barbers={barbers}
              branches={branches}
              isArabic={isArabic}
              onAddService={handleAddService}
              onUpdateService={handleUpdateService}
              onDeleteService={handleDeleteService}
              onAddBarber={handleAddBarber}
              onUpdateBarber={handleUpdateBarber}
              onDeleteBarber={handleDeleteBarber}
              onDeleteAppointment={handleDeleteAppointment}
              onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
              onUpdateBranch={handleUpdateBranch}
            />
          </div>
        )}

        {/* 3. BARBER CONSOLE (لوحة الحلاق - مواعيدي والخدمة) */}
        {currentRole === 'BARBER' && currentUser && currentUser.role === 'BARBER' && (
          <BarberConsole
            appointments={appointments}
            onUpdateStatus={handleUpdateAppointmentStatus}
            isArabic={isArabic}
          />
        )}

        {/* 4. ADMIN DASHBOARD (لوحة المدير والتقارير المالية - صلاحيات كاملة) */}
        {(currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN') && currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
          <AdminDashboard
            appointments={appointments}
            payments={payments}
            services={services}
            barbers={barbers}
            branches={branches}
            isArabic={isArabic}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onAddBarber={handleAddBarber}
            onUpdateBarber={handleUpdateBarber}
            onDeleteBarber={handleDeleteBarber}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            onUpdateBranch={handleUpdateBranch}
          />
        )}
      </main>

      {/* Luxury Footer */}
      <Footer
        onNavigateTab={handleNavigateTab}
        onOpenBooking={() => setIsBookingOpen(true)}
        isArabic={isArabic}
      />

      {/* Sticky Mobile Quick Action Bar (Bottom Floating) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-800 p-2.5 px-4 flex items-center justify-between gap-3 shadow-2xl pb-safe">
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/201096913209?text=${encodeURIComponent('مرحباً صالون الجيمي El Gemy، أود حجز موعد')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center"
            title="واتساب"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
          <a
            href={`tel:${SALON_INFO.phone}`}
            className="p-2.5 rounded-xl bg-neutral-900 text-amber-400 border border-neutral-800 flex items-center justify-center"
            title="اتصال"
          >
            <Phone className="w-5 h-5" />
          </a>
        </div>

        <button
          onClick={() => {
            setPreselectedServiceId(undefined);
            setPreselectedBarberId(undefined);
            setIsBookingOpen(true);
          }}
          className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Calendar className="w-4 h-4" />
          <span>{isArabic ? 'احجز موعدك الآن' : 'Book Now'}</span>
        </button>
      </div>

      {/* Login & RBAC Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        isArabic={isArabic}
      />

      {/* 5-Step Interactive Booking Engine Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        existingAppointments={appointments}
        onBookSuccess={handleBookSuccess}
        isArabic={isArabic}
        preselectedServiceId={preselectedServiceId}
        preselectedBarberId={preselectedBarberId}
      />

      {/* Walk-in Queue System Modal */}
      <WalkinQueueModal
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
        queue={queue}
        onUpdateQueue={handleUpdateQueue}
        isArabic={isArabic}
      />

      {/* Add Review Modal */}
      <AddReviewModal
        isOpen={isAddReviewOpen}
        onClose={() => setIsAddReviewOpen(false)}
        onSubmitReview={handleSubmitReview}
        isArabic={isArabic}
      />
    </div>
  );
}
