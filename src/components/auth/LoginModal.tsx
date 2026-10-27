import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Key, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Scissors, 
  Clock, 
  User 
} from 'lucide-react';
import { 
  AuthUser, 
  DEMO_USERS 
} from '../../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  isArabic: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isArabic,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Logic to show user.role ONLY after successful login verification
  const [authenticatedUser, setAuthenticatedUser] = useState<AuthUser | null>(null);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const inputClean = emailOrPhone.trim().toLowerCase();

    setTimeout(() => {
      // 1. Strict verification against registered users in DEMO_USERS
      const matchedAccount = Object.values(DEMO_USERS).find(
        (u) => u.email.toLowerCase() === inputClean || u.phone === inputClean
      );

      if (!matchedAccount) {
        setErrorMsg(
          isArabic 
            ? 'البريد الإلكتروني أو الهاتف غير مسجل في المنظومة. يرجى التأكد من البريد.' 
            : 'Email address not found in system directory.'
        );
        setIsLoading(false);
        return;
      }

      // 2. Password verification
      if (password.trim() !== matchedAccount.password) {
        setErrorMsg(
          isArabic 
            ? 'كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى.' 
            : 'Incorrect password.'
        );
        setIsLoading(false);
        return;
      }

      // 3. Authentication Succeeded -> Reveal user.role only now!
      setAuthenticatedUser(matchedAccount);
      setIsLoading(false);

      // Auto proceed after 1.4s or user can click proceed immediately
      setTimeout(() => {
        onLoginSuccess(matchedAccount);
        onClose();
        setAuthenticatedUser(null);
        setEmailOrPhone('');
        setPassword('');
      }, 1400);

    }, 450);
  };

  const handleProceedImmediately = () => {
    if (authenticatedUser) {
      onLoginSuccess(authenticatedUser);
      onClose();
      setAuthenticatedUser(null);
      setEmailOrPhone('');
      setPassword('');
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return {
          titleAr: '👑 المدير العام (Super Admin)',
          titleEn: 'Super Administrator',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          descAr: 'تم تفعيل صلاحيات الإدارة الشاملة: الإضافة، التعديل، والحذف لكافة عناصر الموقع.',
          icon: ShieldCheck,
        };
      case 'BARBER':
        return {
          titleAr: '✂️ مصفف شعر معتمد (Barber)',
          titleEn: 'Master Barber',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          descAr: 'تم تفعيل لوحة مواعيد الحلاق والخدمات الميدانية والعمولات.',
          icon: Scissors,
        };
      case 'RECEPTIONIST':
        return {
          titleAr: '🛎️ موظف استقبال (Receptionist)',
          titleEn: 'Front Desk Receptionist',
          badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          descAr: 'تم تفعيل كاونتر الاستقبال وإدارة طابور الحضور والتذاكر.',
          icon: Clock,
        };
      default:
        return {
          titleAr: '👤 عميل الصالون (Customer)',
          titleEn: 'Registered Customer',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          descAr: 'تم تفعيل بوابة الحجز وإدارة المواعيد وسجل الزيارات.',
          icon: User,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                {isArabic ? 'تسجيل الدخول للمنظومة' : 'Sign In to El Gemy'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isArabic ? 'التحقق من البريد وتحديد الصلاحيات تلقائياً' : 'Verified credentials authentication'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STATE 1: SUCCESS STATE SHOWING user.role ONLY AFTER VERIFICATION */}
          {authenticatedUser ? (
            <div className="py-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-lg font-black text-white">
                  {isArabic ? 'تم التحقق وتسجيل الدخول بنجاح!' : 'Authentication Successful!'}
                </h4>
                <p className="text-xs text-neutral-400 mt-1">
                  {isArabic ? `مرحباً بك: ${authenticatedUser.name}` : `Welcome back, ${authenticatedUser.name}`}
                </p>
              </div>

              {/* Verified Role Showcase Card */}
              {(() => {
                const roleInfo = getRoleDisplay(authenticatedUser.role);
                const IconComponent = roleInfo.icon;
                return (
                  <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-start space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                        {isArabic ? 'الدور المصرح به (Verified Role):' : 'Authorized Role:'}
                      </span>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border flex items-center gap-1.5 ${roleInfo.badgeColor}`}>
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>{isArabic ? roleInfo.titleAr : roleInfo.titleEn}</span>
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-300 leading-relaxed pt-1 border-t border-neutral-800/80">
                      {isArabic ? roleInfo.descAr : ''}
                    </p>
                  </div>
                );
              })()}

              <button
                onClick={handleProceedImmediately}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{isArabic ? 'الانتقال للواجهة المخصصة الآن' : 'Continue to Authorized Portal'}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </div>
          ) : (
            /* STATE 2: LOGIN FORM - NO ROLE PICKER */
            <form onSubmit={handleLogin} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  {isArabic ? 'البريد الإلكتروني المعتمد *' : 'Registered Email Address *'}
                </label>
                <div className="relative">
                  <Mail className="absolute right-3.5 rtl:right-3.5 rtl:left-auto left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder={isArabic ? 'أدخل بريدك الإلكتروني المسجل...' : 'user@elgemy.com'}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-10 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1.5">
                  {isArabic ? 'كلمة المرور *' : 'Password *'}
                </label>
                <div className="relative">
                  <Key className="absolute right-3.5 rtl:right-3.5 rtl:left-auto left-3.5 top-3.5 w-4 h-4 text-neutral-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-10 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                <span>{isLoading ? (isArabic ? 'جاري التحقق من البريد في DEMO_USERS...' : 'Verifying with DEMO_USERS...') : (isArabic ? 'تسجيل الدخول والتحقق' : 'Sign In & Verify')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
