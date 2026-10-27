import { 
  Appointment, 
  WalkinQueueItem, 
  Review, 
  PaymentRecord, 
  Customer, 
  Service, 
  Barber, 
  Branch 
} from '../types';
import { 
  INITIAL_BRANCHES, 
  INITIAL_BARBERS, 
  INITIAL_SERVICES, 
  INITIAL_REVIEWS 
} from '../config/salon';
import { supabase } from './supabase';

const STORAGE_KEYS = {
  APPOINTMENTS: 'elgemy_appointments_v1',
  QUEUE: 'elgemy_queue_v1',
  REVIEWS: 'elgemy_reviews_v1',
  PAYMENTS: 'elgemy_payments_v1',
  CUSTOMERS: 'elgemy_customers_v1',
};

// Seed initial appointments for today to showcase realistic busy salon dashboard
const getInitialAppointments = (): Appointment[] => {
  const todayStr = new Date().toISOString().split('T')[0];
  return [
    {
      id: 'appt-seed-1',
      appointment_number: 'GMY-2610-1011',
      branch_id: 'branch-mit-el-nasr',
      barber_id: 'barber-elgemy',
      customer_id: 'cust-1',
      customer_name: 'حسام البدري',
      customer_phone: '01012345678',
      status: 'IN_SERVICE',
      date: todayStr,
      start_time: '14:00',
      end_time: '14:45',
      services: [INITIAL_SERVICES[0]],
      total_duration_minutes: 45,
      total_amount: 250,
      discount_amount: 0,
      final_amount: 250,
      customer_notes: 'تدريج خفيف وتحديد لحية',
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'appt-seed-2',
      appointment_number: 'GMY-2610-1012',
      branch_id: 'branch-mit-el-nasr',
      barber_id: 'barber-sayad',
      customer_id: 'cust-2',
      customer_name: 'عمر مصطفى',
      customer_phone: '01123456789',
      status: 'ARRIVED',
      date: todayStr,
      start_time: '15:00',
      end_time: '15:40',
      services: [INITIAL_SERVICES[1]],
      total_duration_minutes: 40,
      total_amount: 200,
      discount_amount: 0,
      final_amount: 200,
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'appt-seed-3',
      appointment_number: 'GMY-2610-1013',
      branch_id: 'branch-mit-el-nasr',
      barber_id: 'barber-fawzy',
      customer_id: 'cust-3',
      customer_name: 'م. أحمد رزق',
      customer_phone: '01234567890',
      status: 'CONFIRMED',
      date: todayStr,
      start_time: '16:30',
      end_time: '17:30',
      services: [INITIAL_SERVICES[5]],
      total_duration_minutes: 60,
      total_amount: 450,
      discount_amount: 50,
      final_amount: 400,
      customer_notes: 'جلسة هيدرافيشال لعريس',
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'appt-seed-4',
      appointment_number: 'GMY-2610-1014',
      branch_id: 'branch-mit-el-nasr',
      barber_id: 'barber-elgemy',
      customer_id: 'cust-4',
      customer_name: 'يوسف عبد الرحمن',
      customer_phone: '01099887766',
      status: 'COMPLETED',
      date: todayStr,
      start_time: '12:00',
      end_time: '12:45',
      services: [INITIAL_SERVICES[0]],
      total_duration_minutes: 45,
      total_amount: 250,
      discount_amount: 0,
      final_amount: 250,
      is_walk_in: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

const getInitialQueue = (): WalkinQueueItem[] => [
  {
    id: 'queue-1',
    ticket_number: 14,
    branch_id: 'branch-mit-el-nasr',
    customer_name: 'مصطفى كامل',
    customer_phone: '01065432198',
    barber_id: 'barber-sayad',
    service_names: ['قص وتدريج سكين فيد', 'تحديد لحية سريع'],
    estimated_duration: 35,
    status: 'WAITING',
    created_at: new Date(Date.now() - 15 * 60000).toISOString(),
  },
  {
    id: 'queue-2',
    ticket_number: 15,
    branch_id: 'branch-mit-el-nasr',
    customer_name: 'إبراهيم علي',
    customer_phone: '01511223344',
    service_names: ['قص شعر أطفال'],
    estimated_duration: 25,
    status: 'WAITING',
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
  },
];

export const getStoredAppointments = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) {
      const initial = getInitialAppointments();
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialAppointments();
  }
};

export const saveAppointments = (appointments: Appointment[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  } catch (err) {
    console.error('Failed to save appointments:', err);
  }
};

export const getStoredQueue = (): WalkinQueueItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUEUE);
    if (!raw) {
      const initial = getInitialQueue();
      localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return getInitialQueue();
  }
};

export const saveQueue = (queue: WalkinQueueItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to save queue:', err);
  }
};

export const getStoredReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
      return INITIAL_REVIEWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_REVIEWS;
  }
};

export const saveReviews = (reviews: Review[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  } catch (err) {
    console.error('Failed to save reviews:', err);
  }
};

export const getStoredPayments = (): PaymentRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
    if (!raw) {
      const initial: PaymentRecord[] = [
        {
          id: 'pay-1',
          appointment_id: 'appt-seed-4',
          customer_name: 'يوسف عبد الرحمن',
          customer_phone: '01099887766',
          amount: 250,
          currency: 'EGP',
          method: 'CASH',
          status: 'PAID',
          transaction_ref: 'CSH-0912',
          created_at: new Date().toISOString(),
        },
        {
          id: 'pay-2',
          customer_name: 'كريم المنصوري',
          customer_phone: '01091234567',
          amount: 450,
          currency: 'EGP',
          method: 'INSTAPAY',
          status: 'PAID',
          transaction_ref: 'INSTA-8827361',
          created_at: new Date(Date.now() - 3600000).toISOString(),
        },
      ];
      localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const savePayments = (payments: PaymentRecord[]) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
  } catch (err) {
    console.error('Failed to save payments:', err);
  }
};
