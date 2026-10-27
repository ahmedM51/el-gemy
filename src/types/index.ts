export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'BRANCH_MANAGER' 
  | 'RECEPTIONIST' 
  | 'BARBER' 
  | 'ACCOUNTANT' 
  | 'MARKETING' 
  | 'CUSTOMER';

export type AppointmentStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'ARRIVED' 
  | 'IN_SERVICE' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'NO_SHOW';

export type PaymentMethod = 
  | 'CASH' 
  | 'VISA' 
  | 'MASTERCARD' 
  | 'VODAFONE_CASH' 
  | 'INSTAPAY' 
  | 'LOYALTY_POINTS';

export type PaymentStatus = 'PENDING' | 'PAID' | 'REFUNDED' | 'FAILED';

export type WalkinStatus = 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'COMPLETED' | 'CANCELLED';

export interface Branch {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  city: string;
  district: string;
  address_ar: string;
  address_en: string;
  phone: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  opening_time: string;
  closing_time: string;
  is_active: boolean;
}

export interface Barber {
  id: string;
  branch_id: string;
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  phone: string;
  bio_ar: string;
  bio_en: string;
  photo_url: string;
  experience_years: number;
  commission_percentage: number;
  average_rating: number;
  total_reviews: number;
  specialties: string[];
  is_active: boolean;
}

export interface ServiceCategory {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  sort_order: number;
  icon_name?: string;
}

export interface Service {
  id: string;
  category_id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  base_price: number;
  previous_price?: number;
  duration_minutes: number;
  buffer_minutes: number;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
}

export interface Package {
  id: string;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  discounted_price: number;
  original_price: number;
  total_duration_minutes: number;
  service_ids: string[];
  is_featured?: boolean;
  is_active: boolean;
}

export interface Customer {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
  preferred_branch_id?: string;
  preferred_barber_id?: string;
  total_visits: number;
  total_spent: number;
  last_visit_at?: string;
  notes?: string;
  loyalty_points: number;
  tier: 'SILVER' | 'GOLD' | 'VIP';
}

export interface Appointment {
  id: string;
  appointment_number: string;
  branch_id: string;
  barber_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  status: AppointmentStatus;
  date: string; // YYYY-MM-DD
  start_time: string; // HH:mm
  end_time: string; // HH:mm
  services: Service[];
  total_duration_minutes: number;
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  customer_notes?: string;
  barber_notes?: string;
  is_walk_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface WalkinQueueItem {
  id: string;
  ticket_number: number;
  branch_id: string;
  customer_name: string;
  customer_phone: string;
  barber_id?: string;
  service_names: string[];
  estimated_duration: number;
  status: WalkinStatus;
  created_at: string;
  called_at?: string;
}

export interface PaymentRecord {
  id: string;
  appointment_id?: string;
  customer_name: string;
  customer_phone: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_ref?: string;
  created_at: string;
}

export interface Review {
  id: string;
  appointment_id?: string;
  customer_name: string;
  barber_name: string;
  branch_name: string;
  overall_rating: number;
  barber_rating: number;
  cleanliness_rating: number;
  comment: string;
  date: string;
  is_verified: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  excerpt_ar: string;
  excerpt_en: string;
  content_ar: string;
  cover_image: string;
  read_time: string;
  published_at: string;
  author: string;
}
