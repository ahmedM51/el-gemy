# El Gemy Barber Lounge - Multi-Branch Enterprise SaaS Platform
## System Architecture & Technical Specifications

- **Client Brand**: El Gemy Barber Lounge (صالون الجيمي للرجال)
- **Primary Region / Branch**: الدقهلية - منية النصر (Mit El-Nasr, Dakahlia, Egypt)
- **Phone & WhatsApp**: 01096913209
- **Currency**: EGP (جنيه مصري)
- **Timezone**: Africa/Cairo (UTC+2 / UTC+3 DST compliant)

---

### 1. High-Level System Architecture
```
  [ Mobile Clients / Web Browsers ] (Arabic RTL Primary / English LTR)
                 │
                 ▼
  [ Edge CDN / Next.js & Vite Client Layer ]
     ├── Public Luxury Portal & Booking Wizard (SEO-optimized, Schema.org)
     ├── Admin Dashboard (Multi-Branch, Financials, Analytics, Inventory, Staff)
     ├── Branch Manager & Receptionist Walk-in Queue System
     └── Barber Mobile Console (Schedule, In-Service tracking, Tips/Commissions)
                 │
                 ▼
  [ API / Server Actions / Supabase Realtime Edge Layer ]
     ├── Concurrency-Safe Booking Engine (PostgreSQL range exclusion & atomic locks)
     ├── Dynamic Pricing & Branch Override Engine
     ├── Notification Pipeline (WhatsApp / SMS / In-App alerts)
     └── Audit Log & Security Policy Enforcement
                 │
                 ▼
  [ Supabase PostgreSQL 15+ & Storage ]
     ├── Tables with Strict RLS (Row Level Security)
     ├── GiST Exclusion Constraints for Double-Booking prevention
     ├── Realtime Subscriptions for Walk-in Queue & Booking Slots
     └── Secure Storage Buckets (barbers, gallery, invoices, avatars)
```

---

### 2. Recommended Modular Folder Structure
```
/
├── supabase/
│   ├── migrations/
│   │   └── 20261006000001_initial_schema.sql
│   └── seed.sql
├── src/
│   ├── app/ (or routes for portals)
│   ├── components/
│   │   ├── ui/               # Base primitives (Button, Modal, Drawer, Tabs, Dialog)
│   │   ├── layout/           # Navbar, Footer, Sidebar, BranchHeader
│   │   ├── booking/          # Step-by-step Booking Wizard, SlotPicker, Calendar
│   │   ├── queue/            # Walk-in Queue Kanban, Ticket Printer component
│   │   └── dashboard/        # KPI Cards, Analytics Charts, Barber Roster
│   ├── features/
│   │   ├── appointments/     # Service layer, availability calculations
│   │   ├── branches/         # Branch selector, branch pricing logic
│   │   ├── barbers/          # Schedules, time-off, commission calculations
│   │   ├── customers/        # CRM, visit history, loyalty points
│   │   ├── payments/         # Multi-method cashier, invoices, refunds
│   │   └── cms/              # Services catalog, packages, testimonials, blog
│   ├── lib/
│   │   ├── supabase.ts       # Supabase client instantiation
│   │   ├── booking-engine.ts # Slot availability math with buffer intervals
│   │   ├── formatters.ts     # EGP currency, Cairo date-time formatters
│   │   └── seo.ts            # LocalBusiness, JSON-LD generator
│   ├── hooks/
│   │   ├── use-appointments.ts
│   │   ├── use-realtime-queue.ts
│   │   └── use-auth-role.ts
│   ├── types/
│   │   └── database.types.ts # TypeScript types generated from Postgres schema
│   ├── schemas/
│   │   └── booking.schema.ts # Zod validation schemas
│   └── config/
│       └── salon.config.ts   # El Gemy brand constants, contacts, working hours
```
