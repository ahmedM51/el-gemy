-- ============================================================================
-- EL GEMY BARBER LOUNGE - PRODUCTION DATABASE MIGRATION
-- Multi-Branch Barber SaaS System (Egypt - EGP / Africa/Cairo)
-- Generated on: 2026-10-06
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================

DO $$ BEGIN
  CREATE TYPE user_role_enum AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'BRANCH_MANAGER',
    'RECEPTIONIST',
    'BARBER',
    'ACCOUNTANT',
    'MARKETING',
    'CUSTOMER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE appointment_status_enum AS ENUM (
    'PENDING',
    'CONFIRMED',
    'ARRIVED',
    'IN_SERVICE',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM (
    'CASH',
    'VISA',
    'MASTERCARD',
    'VODAFONE_CASH',
    'INSTAPAY',
    'ONLINE_GATEWAY',
    'LOYALTY_POINTS',
    'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM (
    'PENDING',
    'PAID',
    'PARTIALLY_REFUNDED',
    'REFUNDED',
    'FAILED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE walkin_queue_status_enum AS ENUM (
    'WAITING',
    'CALLED',
    'IN_SERVICE',
    'COMPLETED',
    'CANCELLED'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. AUTH & PROFILES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(25) UNIQUE,
  email VARCHAR(150) UNIQUE,
  avatar_url TEXT,
  role user_role_enum NOT NULL DEFAULT 'CUSTOMER',
  preferred_branch_id UUID,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- ============================================================================
-- 3. BRANCHES & BRANCH STAFF
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.branches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  city VARCHAR(100) NOT NULL DEFAULT 'الدقهلية',
  district VARCHAR(100) NOT NULL DEFAULT 'منية النصر',
  address_ar TEXT NOT NULL,
  address_en TEXT,
  phone VARCHAR(30) NOT NULL,
  whatsapp VARCHAR(30) NOT NULL,
  email VARCHAR(100),
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.branch_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  UNIQUE(branch_id, user_id)
);

-- ============================================================================
-- 4. BARBERS & WORKING HOURS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.barbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  title_ar VARCHAR(100) DEFAULT 'Master Barber - مصفف محترف',
  title_en VARCHAR(100) DEFAULT 'Master Barber',
  phone VARCHAR(30) NOT NULL,
  bio_ar TEXT,
  bio_en TEXT,
  photo_url TEXT,
  experience_years INTEGER NOT NULL DEFAULT 3,
  commission_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  average_rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.barber_working_hours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 5=Friday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_day_off BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  UNIQUE(barber_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS public.barber_time_off (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  start_datetime TIMESTAMPTZ NOT NULL,
  end_datetime TIMESTAMPTZ NOT NULL,
  reason TEXT,
  approved_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  CHECK (end_datetime > start_datetime)
);

-- ============================================================================
-- 5. SERVICE CATEGORIES & SERVICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(100) NOT NULL,
  name_en VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  previous_price NUMERIC(10, 2),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  buffer_minutes INTEGER NOT NULL DEFAULT 5,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.service_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES public.branches(id) ON DELETE CASCADE,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  effective_from TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  effective_to TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.barber_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  UNIQUE(barber_id, service_id)
);

-- ============================================================================
-- 6. PACKAGES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  discounted_price NUMERIC(10, 2) NOT NULL CHECK (discounted_price >= 0),
  original_price NUMERIC(10, 2) NOT NULL CHECK (original_price >= discounted_price),
  total_duration_minutes INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.package_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  package_id UUID NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  UNIQUE(package_id, service_id)
);

-- ============================================================================
-- 7. CUSTOMERS & CRM
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name VARCHAR(150) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(150),
  preferred_branch_id UUID REFERENCES public.branches(id),
  preferred_barber_id UUID REFERENCES public.barbers(id),
  total_visits INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  last_visit_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- ============================================================================
-- 8. APPOINTMENTS & CONCURRENCY GUARD
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_number VARCHAR(30) UNIQUE NOT NULL,
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
  barber_id UUID NOT NULL REFERENCES public.barbers(id) ON DELETE RESTRICT,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
  status appointment_status_enum NOT NULL DEFAULT 'CONFIRMED',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  total_duration_minutes INTEGER NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  final_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  customer_notes TEXT,
  barber_notes TEXT,
  is_walk_in BOOLEAN NOT NULL DEFAULT FALSE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  CHECK (end_time > start_time)
);

-- Exclusion constraint to mathematically guarantee NO DOUBLE BOOKING per barber for active slots
ALTER TABLE public.appointments 
  ADD CONSTRAINT no_double_booking_per_barber 
  EXCLUDE USING gist (
    barber_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  )
  WHERE (status IN ('PENDING', 'CONFIRMED', 'ARRIVED', 'IN_SERVICE'));

CREATE TABLE IF NOT EXISTS public.appointment_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  price NUMERIC(10, 2) NOT NULL,
  duration_minutes INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS public.appointment_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  old_status appointment_status_enum,
  new_status appointment_status_enum NOT NULL,
  changed_by UUID REFERENCES public.profiles(id),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- Walk-in Queue Table
CREATE TABLE IF NOT EXISTS public.queue_walkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
  ticket_number INTEGER NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(30) NOT NULL,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  service_ids UUID[] NOT NULL,
  estimated_duration INTEGER NOT NULL DEFAULT 30,
  status walkin_queue_status_enum NOT NULL DEFAULT 'WAITING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  called_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- 9. PAYMENTS & INVOICES
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  branch_id UUID NOT NULL REFERENCES public.branches(id),
  subtotal NUMERIC(10, 2) NOT NULL,
  discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  total_amount NUMERIC(10, 2) NOT NULL,
  status payment_status_enum NOT NULL DEFAULT 'UNPAID',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'EGP',
  method payment_method_enum NOT NULL DEFAULT 'CASH',
  status payment_status_enum NOT NULL DEFAULT 'PAID',
  transaction_reference VARCHAR(100),
  processed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- ============================================================================
-- 10. REVIEWS & PROMOTIONS & LOYALTY
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID UNIQUE NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id),
  barber_id UUID NOT NULL REFERENCES public.barbers(id),
  branch_id UUID NOT NULL REFERENCES public.branches(id),
  overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  barber_rating SMALLINT CHECK (barber_rating BETWEEN 1 AND 5),
  cleanliness_rating SMALLINT CHECK (cleanliness_rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name_ar VARCHAR(150) NOT NULL,
  name_en VARCHAR(150) NOT NULL,
  discount_percentage NUMERIC(5, 2) CHECK (discount_percentage BETWEEN 0 AND 100),
  discount_fixed_egp NUMERIC(10, 2) CHECK (discount_fixed_egp >= 0),
  min_spend NUMERIC(10, 2) DEFAULT 0.00,
  max_discount_egp NUMERIC(10, 2),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER,
  usage_count INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID UNIQUE NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  tier VARCHAR(50) NOT NULL DEFAULT 'SILVER',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_account_id UUID NOT NULL REFERENCES public.loyalty_accounts(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  reason VARCHAR(100) NOT NULL,
  appointment_id UUID REFERENCES public.appointments(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- ============================================================================
-- 11. CMS, BLOG, SEO, NOTIFICATIONS & AUDIT
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(30) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_ar VARCHAR(255) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt_ar TEXT,
  excerpt_en TEXT,
  content_ar TEXT NOT NULL,
  content_en TEXT,
  cover_image_url TEXT,
  author_name VARCHAR(100) DEFAULT 'فريق El Gemy',
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ DEFAULT timezone('Africa/Cairo', now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100),
  old_value JSONB,
  new_value JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

CREATE TABLE IF NOT EXISTS public.settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('Africa/Cairo', now())
);

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can view active branches, services, barbers, packages, and published reviews/blogs
CREATE POLICY "Public can view active branches" ON public.branches FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active services" ON public.services FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active categories" ON public.service_categories FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active barbers" ON public.barbers FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view active packages" ON public.packages FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public can view published reviews" ON public.reviews FOR SELECT USING (is_published = TRUE);
CREATE POLICY "Public can view published blogs" ON public.blog_posts FOR SELECT USING (is_published = TRUE);

-- Profiles policy
CREATE POLICY "Users view own profile or admins view all" ON public.profiles FOR SELECT 
USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER'))
);

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Appointments policy
CREATE POLICY "Customers view own appointments" ON public.appointments FOR SELECT 
USING (
  customer_id IN (SELECT id FROM public.customers WHERE profile_id = auth.uid()) OR
  barber_id IN (SELECT id FROM public.barbers WHERE profile_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('SUPER_ADMIN', 'ADMIN', 'BRANCH_MANAGER', 'RECEPTIONIST'))
);

CREATE POLICY "Allow public booking creation" ON public.appointments FOR INSERT WITH CHECK (TRUE);

-- Contact messages insertion
CREATE POLICY "Public can submit contact messages" ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

-- ============================================================================
-- 13. SEED INITIAL ENTERPRISE DATA FOR "EL GEMY"
-- ============================================================================

INSERT INTO public.branches (
  name_ar, name_en, slug, city, district, address_ar, address_en, phone, whatsapp, latitude, longitude
) VALUES (
  'صالون الجيمي - فرع منية النصر الرئيسي',
  'El Gemy Lounge - Mit El-Nasr Main Branch',
  'mit-el-nasr',
  'الدقهلية',
  'منية النصر',
  'محافظة الدقهلية، مركز منية النصر، الشارع التجاري الرئيسي، مقابل المحطة',
  'Main Commercial St., Facing Station, Mit El-Nasr, Dakahlia',
  '01096913209',
  '01096913209',
  31.1278,
  31.6432
) ON CONFLICT (slug) DO NOTHING;

-- Seed Categories
INSERT INTO public.service_categories (name_ar, name_en, slug, sort_order) VALUES
('قص الشعر وتصفيفه', 'Haircuts & Styling', 'haircuts', 1),
('تهذيب وعناية اللحية', 'Beard Care & Shave', 'beard', 2),
('عناية بالبشرة وتنظيف عميق', 'Facial & Skin Care', 'skincare', 3),
('معالجات وبروتين الشعر', 'Hair Treatments & Protein', 'treatments', 4),
('صبغات وتلوين الشعر واللحية', 'Coloring & Highlights', 'coloring', 5),
('البكجات وعروض العرسان', 'Groom & VIP Packages', 'packages', 6)
ON CONFLICT (slug) DO NOTHING;

-- Seed Services
DO $$
DECLARE
  cat_hair UUID;
  cat_beard UUID;
  cat_skin UUID;
  cat_treat UUID;
  cat_pkg UUID;
  branch_id_val UUID;
BEGIN
  SELECT id INTO cat_hair FROM public.service_categories WHERE slug = 'haircuts' LIMIT 1;
  SELECT id INTO cat_beard FROM public.service_categories WHERE slug = 'beard' LIMIT 1;
  SELECT id INTO cat_skin FROM public.service_categories WHERE slug = 'skincare' LIMIT 1;
  SELECT id INTO cat_treat FROM public.service_categories WHERE slug = 'treatments' LIMIT 1;
  SELECT id INTO cat_pkg FROM public.service_categories WHERE slug = 'packages' LIMIT 1;
  SELECT id INTO branch_id_val FROM public.branches WHERE slug = 'mit-el-nasr' LIMIT 1;

  INSERT INTO public.services (category_id, name_ar, name_en, description_ar, description_en, base_price, duration_minutes, is_featured) VALUES
  (cat_hair, 'قص شعر كلاسيك ملكي مع استشوار', 'Signature Royal Haircut & Blow Dry', 'قص احترافي مخصص لشكل الوجه مع غسيل بالشامبو والبلسم وتصفيف سيشوار', 'Bespoke precision haircut tailored to facial anatomy including wash and styling', 250.00, 45, TRUE),
  (cat_hair, 'قص شعر أطفال وشبابي تريند', 'Junior & Trend Haircut', 'قصات عصرية للأطفال والطلاب مع رسم خطوط وتصفيف كريم مميز', 'Trendy cuts for young gents and kids with precision line styling', 150.00, 30, FALSE),
  (cat_beard, 'تحديد وتهذيب لحية بالبخار والموس', 'Royal Beard Grooming & Hot Towel', 'تهذيب وتحديد لحية بالبخار، منشفة ساخنة، زيوت طبيعية معقمة وترطيب', 'Steam beard sculpt, hot towel luxury treatment, and natural argan oil finish', 150.00, 30, TRUE),
  (cat_skin, 'جلسة هيدرافيشال وتنظيف بشرة عميق 7 مراحل', 'Hydrafacial 7-Step Deep Cleansing', 'تنظيف مسام بالشفط، إزالة الرؤوس السوداء، تقشير ماسي، سيروم الهيالورونيك وماسك طين البحر الميت', '7-stage deep hydrafacial suction, blackhead extraction, diamond peel, and collagen mask', 450.00, 60, TRUE),
  (cat_skin, 'ماسك الفحم الذهبي وتقشير الوجه بالبخار', 'Gold Charcoal Mask & Steam Peel', 'إزالة الخلايا الميتة وتنقية مسام الوجه ومنح البشرة نضارة فورية', 'Instant brightening peeling with steam and mineral charcoal extract', 180.00, 25, FALSE),
  (cat_treat, 'جلسة بروتين وكولاجين برازيلي علاجي خالي من الفورمالين', 'Brazilian Protein & Collagen Therapy', 'فرد ومعالجة الشعر التالف ببروتين طبيعي آمن يدوم حتى 6 أشهر', 'Zero-formalin therapeutic organic protein treatment for shiny sleek hair', 1200.00, 120, TRUE)
  ON CONFLICT DO NOTHING;

  -- Seed Master Barbers for Mit El-Nasr Branch
  INSERT INTO public.barbers (branch_id, name_ar, name_en, title_ar, title_en, phone, experience_years, average_rating, total_reviews) VALUES
  (branch_id_val, 'كابتن جيمي (المدير الفني)', 'Captain El Gemy (Master Stylist)', 'مؤسس الصالون وكبير مصففي الشعر', 'Founder & Head Barber', '01096913209', 12, 4.95, 240),
  (branch_id_val, 'محمود الصياد', 'Mahmoud El-Sayad', 'خبير قصات كلاسيك وفيد', 'Classic & Fade Specialist', '01096913209', 7, 4.88, 160),
  (branch_id_val, 'أحمد فوزي', 'Ahmed Fawzy', 'أخصائي عناية بالبشرة ولحية', 'Skin & Beard Sculptor', '01096913209', 6, 4.92, 195)
  ON CONFLICT DO NOTHING;
END $$;
