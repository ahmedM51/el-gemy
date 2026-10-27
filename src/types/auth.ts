import { UserRole } from './index';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatarUrl: string;
  barberId?: string; // Assigned barber id if role === 'BARBER'
}

export const ADMIN_EMAILS = [
  'ahmedibrahemmostafy@gmail.com',
  'admin@elgemy.com',
  'superadmin@elgemy.com',
];

export const BARBER_ACCOUNTS: Record<string, { name: string; barberId: string; phone: string }> = {
  'elgemy@elgemy.com': { name: 'كابتن جيمي (المدير الفني)', barberId: 'barber-elgemy', phone: '01096913209' },
  'sayad@elgemy.com': { name: 'محمود الصياد (خبير فيد)', barberId: 'barber-sayad', phone: '01096913209' },
  'fawzy@elgemy.com': { name: 'أحمد فوزي (أخصائي عناية)', barberId: 'barber-fawzy', phone: '01096913209' },
};

export const RECEPTION_EMAILS = [
  'reception@elgemy.com',
  'staff@elgemy.com',
];

/**
 * Automatically determines user role and permissions from their authenticated email/phone
 * Completely removes any manual role picking from the UI
 */
export function determineUserRoleFromEmail(emailOrPhone: string): {
  role: UserRole;
  name: string;
  barberId?: string;
  avatarUrl: string;
} {
  const cleanInput = emailOrPhone.trim().toLowerCase();

  // 1. Check if ADMIN / OWNER
  if (ADMIN_EMAILS.some((adminEmail) => adminEmail.toLowerCase() === cleanInput)) {
    return {
      role: 'SUPER_ADMIN',
      name: cleanInput === 'ahmedibrahemmostafy@gmail.com' ? 'أحمد إبراهيم (المدير العام)' : 'أحمد الجيمي (الإدارة العامة)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    };
  }

  // 2. Check if BARBER Staff
  if (cleanInput in BARBER_ACCOUNTS) {
    const barberInfo = BARBER_ACCOUNTS[cleanInput];
    return {
      role: 'BARBER',
      name: barberInfo.name,
      barberId: barberInfo.barberId,
      avatarUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=200&q=80',
    };
  }

  // 3. Check if RECEPTIONIST Staff
  if (RECEPTION_EMAILS.some((rEmail) => rEmail.toLowerCase() === cleanInput)) {
    return {
      role: 'RECEPTIONIST',
      name: 'مسؤول الاستقبال والـ Walk-in',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    };
  }

  // 4. Default: Customer
  const customerName = cleanInput.includes('@') ? cleanInput.split('@')[0] : 'عميل الصالون';
  return {
    role: 'CUSTOMER',
    name: customerName,
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  };
}

export const DEMO_USERS: Record<string, AuthUser & { password: string; titleAr: string }> = {
  OWNER: {
    id: 'user-owner-1',
    name: 'أحمد إبراهيم (المدير والمالك)',
    email: 'ahmedibrahemmostafy@gmail.com',
    phone: '01096913209',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    password: 'admin',
    titleAr: 'المالك والمدير العام - صلاحية كاملة للإضافة والتعديل والحذف',
  },
  ADMIN: {
    id: 'user-admin-1',
    name: 'أحمد الجيمي (المدير العام)',
    email: 'admin@elgemy.com',
    phone: '01096913209',
    role: 'SUPER_ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    password: 'admin',
    titleAr: 'المدير العام - صلاحية كاملة للإضافة والتعديل والحذف',
  },
  RECEPTIONIST: {
    id: 'user-recep-1',
    name: 'زياد طارق (مسؤول الاستقبال)',
    email: 'reception@elgemy.com',
    phone: '01096913209',
    role: 'RECEPTIONIST',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    password: 'recep',
    titleAr: 'موظف الاستقبال - إدارة الطابور والمواعيد المباشرة',
  },
  BARBER_ELGEMY: {
    id: 'user-barber-elgemy',
    name: 'كابتن جيمي (كبير المصففين)',
    email: 'elgemy@elgemy.com',
    phone: '01096913209',
    role: 'BARBER',
    barberId: 'barber-elgemy',
    avatarUrl: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=200&q=80',
    password: 'barber',
    titleAr: 'كبير مصففي الشعر - إدارة المواعيد ونسب الأرباح',
  },
  BARBER_SAYAD: {
    id: 'user-barber-sayad',
    name: 'محمود الصياد (خبير فيد)',
    email: 'sayad@elgemy.com',
    phone: '01096913209',
    role: 'BARBER',
    barberId: 'barber-sayad',
    avatarUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=200&q=80',
    password: 'barber',
    titleAr: 'مصفف شعر - تدريج وسكين فيد',
  },
  CUSTOMER: {
    id: 'user-cust-1',
    name: 'م. كريم الشربيني (عميل VIP)',
    email: 'karim@gmail.com',
    phone: '01012345678',
    role: 'CUSTOMER',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80',
    password: 'cust',
    titleAr: 'عميل الصالون - الحجز وسجل الزيارات والولاء',
  },
};
