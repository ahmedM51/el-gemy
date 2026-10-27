import React, { useState } from 'react';
import { 
  Scissors, 
  Phone, 
  Calendar, 
  Clock, 
  UserCheck, 
  ShieldCheck, 
  Menu, 
  X, 
  MessageCircle, 
  MapPin, 
  LogIn, 
  LogOut, 
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { SALON_INFO } from '../../config/salon';
import { UserRole } from '../../types';
import { AuthUser } from '../../types/auth';

interface NavbarProps {
  currentRole: UserRole;
  currentUser: AuthUser | null;
  onOpenBooking: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  onNavigateToPortal: (role: UserRole) => void;
  isArabic: boolean;
  onToggleLanguage: () => void;
  activeTab: string;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onOpenBooking,
  onOpenLogin,
  onLogout,
  onNavigateToPortal,
  isArabic,
  onToggleLanguage,
  activeTab,
  onNavigateTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home' },
    { id: 'services', labelAr: 'الخدمات والأسعار', labelEn: 'Services & Pricing' },
    { id: 'packages', labelAr: 'باقات العرسان والـ VIP', labelEn: 'VIP Packages' },
    { id: 'barbers', labelAr: 'فريق الحلاقين', labelEn: 'Master Barbers' },
    { id: 'reviews', labelAr: 'آراء العملاء', labelEn: 'Reviews' },
    { id: 'location', labelAr: 'الفرع والموقع', labelEn: 'Mit El-Nasr Branch' },
  ];

  const isStaff = currentUser && ['SUPER_ADMIN', 'ADMIN', 'BARBER', 'RECEPTIONIST'].includes(currentUser.role);
  const isAdmin = currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN');
  const isBarber = currentUser && currentUser.role === 'BARBER';
  const isReceptionist = currentUser && currentUser.role === 'RECEPTIONIST';

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/95 backdrop-blur-md border-b border-neutral-850 transition-all">
      {/* Top Micro Bar: Location, Contact & Working Hours */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 text-xs text-neutral-400 border-b border-neutral-800/50 py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>منية النصر - الدقهلية (شارع المحطة الرئيسي التجاري)</span>
          </span>
          <span className="hidden md:flex items-center gap-1 text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-500" />
            <span>10:00 ص - 12:00 منتصف الليل يومياً</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={`https://wa.me/201096913209?text=${encodeURIComponent('مرحباً صالون الجيمي El Gemy، أود الاستفسار عن المواعيد والخدمات')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>واتساب: {SALON_INFO.phone}</span>
          </a>
          <span className="text-neutral-700">|</span>
          <a 
            href={`tel:${SALON_INFO.phone}`} 
            className="flex items-center gap-1 text-neutral-300 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500" />
            <span>اتصال فوري</span>
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand identity */}
        <div 
          onClick={() => onNavigateTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center">
              <Scissors className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-wider font-extrabold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100">
                EL GEMY
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
                VIP
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              {isArabic ? 'صالون الجيمي للرجال • منية النصر' : 'Barber Lounge & Spa • Mit El-Nasr'}
            </p>
          </div>
        </div>

        {/* Public Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigateTab(link.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === link.id && currentRole === 'CUSTOMER'
                  ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 shadow-sm'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-900'
              }`}
            >
              {isArabic ? link.labelAr : link.labelEn}
            </button>
          ))}
        </nav>

        {/* Action Controls & Authorized Portals */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* SPECIAL AUTHORIZED PORTAL SHORTCUTS (Only appears if logged-in with specific email role!) */}
          {isAdmin && (
            <button
              onClick={() => onNavigateToPortal(currentRole === 'SUPER_ADMIN' ? 'CUSTOMER' : 'SUPER_ADMIN')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentRole === 'SUPER_ADMIN'
                  ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-600/30'
                  : 'bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border-purple-500/50'
              }`}
              title="لوحة تحكم المدير العام"
            >
              <ShieldCheck className="w-4 h-4 text-purple-300" />
              <span>{currentRole === 'SUPER_ADMIN' ? (isArabic ? 'عرض موقع الصالون' : 'View Site') : (isArabic ? '👑 لوحة تحكم الإدارة' : 'Admin Panel')}</span>
            </button>
          )}

          {isBarber && (
            <button
              onClick={() => onNavigateToPortal(currentRole === 'BARBER' ? 'CUSTOMER' : 'BARBER')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentRole === 'BARBER'
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                  : 'bg-cyan-950/40 hover:bg-cyan-900/50 text-cyan-300 border-cyan-500/50'
              }`}
              title="لوحة الحلاق"
            >
              <UserCheck className="w-4 h-4 text-cyan-300" />
              <span>{currentRole === 'BARBER' ? (isArabic ? 'عرض موقع الصالون' : 'View Site') : (isArabic ? '✂️ مواعيدي والخدمة' : 'My Schedule')}</span>
            </button>
          )}

          {isReceptionist && (
            <button
              onClick={() => onNavigateToPortal(currentRole === 'RECEPTIONIST' ? 'CUSTOMER' : 'RECEPTIONIST')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                currentRole === 'RECEPTIONIST'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                  : 'bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border-emerald-500/50'
              }`}
              title="طابور الاستقبال"
            >
              <Clock className="w-4 h-4 text-emerald-300" />
              <span>{currentRole === 'RECEPTIONIST' ? (isArabic ? 'عرض موقع الصالون' : 'View Site') : (isArabic ? '🛎️ كاونتر الاستقبال' : 'Reception Desk')}</span>
            </button>
          )}

          {/* User Account or Sign In Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pe-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs text-white transition-all"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover border border-amber-500/40"
                />
                <div className="text-start">
                  <div className="font-bold text-xs max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {currentUser.role === 'SUPER_ADMIN' ? 'المدير' : currentUser.role === 'BARBER' ? 'مصفف شعر' : currentUser.role === 'RECEPTIONIST' ? 'استقبال' : 'عميل'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-2 w-64 rounded-2xl bg-neutral-900/98 backdrop-blur-xl border border-neutral-800 shadow-2xl p-2 z-50 text-xs space-y-1">
                  <div className="p-3 border-b border-neutral-800">
                    <div className="font-bold text-white text-sm">{currentUser.name}</div>
                    <div className="text-[11px] text-neutral-400 truncate">{currentUser.email}</div>
                    <div className="mt-1.5 inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                      الصلاحية: {currentUser.role}
                    </div>
                  </div>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        onNavigateToPortal('SUPER_ADMIN');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-start px-3 py-2 rounded-xl text-purple-300 hover:bg-purple-950/40 flex items-center gap-2 font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>{isArabic ? 'فتح لوحة التحكم والإدارة' : 'Open Admin Dashboard'}</span>
                    </button>
                  )}

                  {isBarber && (
                    <button
                      onClick={() => {
                        onNavigateToPortal('BARBER');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-start px-3 py-2 rounded-xl text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-2 font-bold"
                    >
                      <Scissors className="w-4 h-4" />
                      <span>{isArabic ? 'فتح جدول مواعيد الحلاق' : 'Open Barber Console'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onLogout();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-start px-3 py-2 rounded-xl text-red-400 hover:bg-red-950/40 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{isArabic ? 'تسجيل الخروج' : 'Sign Out'}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-neutral-200 hover:text-amber-400 border border-neutral-800 text-xs font-bold transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>{isArabic ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* Primary Booking Button */}
          <button
            onClick={onOpenBooking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all duration-300 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>{isArabic ? 'احجز موعدك الآن' : 'Book Online'}</span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-bold transition-all"
            title="تبديل اللغة"
          >
            {isArabic ? 'EN' : 'عربي'}
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          {currentUser ? (
            <button
              onClick={() => onLogout()}
              className="p-2 rounded-lg bg-neutral-900 text-red-400 text-xs"
              title="خروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onOpenLogin}
              className="p-2 rounded-lg bg-neutral-900 text-amber-400 text-xs"
              title="دخول"
            >
              <LogIn className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenBooking}
            className="px-3 py-1.5 rounded-lg bg-amber-500 text-neutral-950 font-bold text-xs"
          >
            {isArabic ? 'احجز' : 'Book'}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-neutral-800 bg-neutral-950/98 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          {/* Mobile Current User Bar if logged in */}
          {currentUser && (
            <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover border border-amber-500/40"
                />
                <div>
                  <div className="font-bold text-xs text-white">{currentUser.name}</div>
                  <div className="text-[10px] text-amber-400 font-medium">
                    {currentUser.role === 'SUPER_ADMIN' ? '👑 المدير العام' : currentUser.role === 'BARBER' ? '✂️ مصفف شعر' : currentUser.role === 'RECEPTIONIST' ? '🛎️ كاونتر الاستقبال' : '👤 عميل'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  onLogout();
                  setMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl bg-neutral-800 text-red-400 text-xs font-semibold hover:bg-red-950/50 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Nav links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigateTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-start px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
                  activeTab === link.id && currentRole === 'CUSTOMER'
                    ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                    : 'text-neutral-300 hover:bg-neutral-900'
                }`}
              >
                <span>{isArabic ? link.labelAr : link.labelEn}</span>
                <span className="text-neutral-600 text-xs">›</span>
              </button>
            ))}
          </div>

          {/* Action Row: Language Toggle & Quick Call */}
          <div className="pt-2 border-t border-neutral-850 flex items-center gap-2">
            <button
              onClick={() => {
                onToggleLanguage();
              }}
              className="flex-1 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>🌐 اللغة / Language:</span>
              <span className="text-amber-400 font-extrabold">{isArabic ? 'English' : 'عربي'}</span>
            </button>

            <a
              href={`https://wa.me/201096913209?text=${encodeURIComponent('مرحباً صالون الجيمي El Gemy، أود الاستفسار')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center"
              title="واتساب"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Authorized Portals */}
          <div className="space-y-2">
            {isAdmin && (
              <button
                onClick={() => {
                  onNavigateToPortal('SUPER_ADMIN');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25 transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isArabic ? '👑 فتح لوحة تحكم الإدارة الشاملة' : 'Open Admin Dashboard'}</span>
              </button>
            )}

            {isBarber && (
              <button
                onClick={() => {
                  onNavigateToPortal('BARBER');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/25 transition-all"
              >
                <Scissors className="w-4 h-4" />
                <span>{isArabic ? '✂️ فتح جدول مواعيد الحلاق والخدمة' : 'Open Barber Schedule'}</span>
              </button>
            )}

            {isReceptionist && (
              <button
                onClick={() => {
                  onNavigateToPortal('RECEPTIONIST');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>{isArabic ? '🛎️ فتح كاونتر الاستقبال والطابور' : 'Open Reception Desk'}</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  onOpenLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-850 text-amber-400 text-xs font-bold border border-amber-500/30 flex items-center justify-center gap-2 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{isArabic ? 'تسجيل الدخول للمنظومة' : 'Sign In to El Gemy'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
