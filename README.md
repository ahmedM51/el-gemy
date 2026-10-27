# 💈 El Gemy Barber Lounge (صالون الجيمي للرجال)
### Multi-Branch Luxury Barber Management Platform & Booking SaaS (Egypt)

منصة متكاملة وفندقية لإدارة صالون حلاقة رجالي فاخر متعدد الفروع، مصممة خصيصاً لصالون **El Gemy** في **محافظة الدقهلية - مركز منية النصر**.

---

## 📌 معلومات الصالون والتواصل (Brand Info)
- **اسم الصالون:** صالون الجيمي للرجال (El Gemy Barber Lounge)
- **الفرع الرئيسي:** محافظة الدقهلية، مركز منية النصر، شارع المحطة الرئيسي التجاري
- **رقم الهاتف والواتساب:** `01096913209`
- **العملة الأساسية:** الجنيه المصري (`EGP`)
- **المنطقة الزمنية:** `Africa/Cairo`
- **مواعيد العمل:** يومياً من 10:00 صباحاً حتى 12:00 منتصف الليل

---

## 🚀 المميزات الرئيسية (Core Features)

1. **واجهة العميل والحجز الذكي (Customer Booking Engine):**
   - حجز أونلاين متقدم من 5 خطوات بدون انتظار.
   - حساب الأوقات الشاغرة ديناميكياً بناءً على فترات الخدمة والتعقيم لمنع الحجز المزدوج (Zero Double-Booking).
   - إرسال تذكرة الحجز المرجعية مباشرة إلى واتساب الصالون (`01096913209`).

2. **كاونتر الاستقبال وطابور الحضور (Walk-in Queue Kiosk):**
   - تسجيل الزبائن الحاضرين مباشرة دون موعد مسبق.
   - إصدار أرقام تذاكر تسلسلية (Tickets) مع حساب وقت الانتظار التقديري.
   - تتبع حالات الدور: `في الانتظار` ➔ `تم النداء` ➔ `على المقعد` ➔ `مكتمل`.

3. **لوحة تحكم الحلاق الميدانية (Barber Mobile Console):**
   - جدول مواعيد اليوم لكل حلاق (كابتن جيمي، محمود الصياد، أحمد فوزي).
   - بدء الخدمة وإنهائها بضغطة زر.
   - تسجيل الملاحظات الفنية للزبون (نمرة الماكينة، تفضيلات السشوار).
   - حاسبة العمولة اليومية والأرباح المستحقة بالجنيه المصري.

4. **لوحة الإدارة الشاملة (Executive Multi-Branch Dashboard):**
   - مراقبة إيرادات الفروع (فرع منية النصر الرئيسي + فرع المنصورة VIP).
   - سجل الكاشير والمدفوعات (كاش، فيزا، إنستاباي، فودافون كاش).
   - إدارة وتعديل أسعار الخدمات والبكجات مباشرة (Dynamic Pricing).

5. **السيو المحلي والبيانات المهيكلة (Local SEO):**
   - بيانات `BarberShop` و `LocalBusiness` و `FAQPage` متوافقة مع Google Schema و JSON-LD.
   - استهداف كلمات البحث لمنية النصر والدقهلية.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
- **Database & Auth:** Supabase PostgreSQL 15+ مع قيد GiST لمنع الحجز المزدوج و RLS Policies.
- **Testing:** Vitest.
- **Deployment:** Vercel / GitHub Actions.

---

## 💻 التشغيل محلياً (Run Locally)

```bash
# 1. تثبيت الحزم
npm install

# 2. تشغيل السيرفر المحلي
npm run dev

# 3. تشغيل الاختبارات
npm run test

# 4. بناء نسخة الإنتاج
npm run build
```

---

## 🐙 خطوات الرفع على GitHub (Push to GitHub)

افتح سطر الأوامر (Terminal) في مجلد المشروع ونفّذ الخطوات التالية:

```bash
# 1. تهيئة مستودع Git
git init

# 2. إضافة كافة الملفات
git add .

# 3. حفظ التغييرات الأولى
git commit -m "feat: initial commit for El Gemy Barber Lounge SaaS platform"

# 4. إنشاء فرع main
git branch -M main

# 5. ربط المستودع بمستودعك على GitHub
git remote add origin https://github.com/a7medibrahem12-ship-it/el-gemy.git

# 6. رفع الكود
git push -u origin main
```

---

## ⚡ خطوات النشر على Vercel (Deploy to Vercel)

### الطريقة الأولى: عبر لوحة تحكم Vercel (موصى بها)
1. ادخل على [Vercel Dashboard](https://vercel.com).
2. اضغط على **"Add New..."** ثم اختر **"Project"**.
3. قم باستيراد مستودع الـ GitHub: `el-gemy`.
4. في إعدادات المشروع (Project Settings):
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. أضف متغيرات البيئة (Environment Variables):
   - `VITE_SUPABASE_URL`: `https://ogmngsymbqlyayhdscuf.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nbW5nc3ltYnFseWF5aGRzY3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyNTg1MDcsImV4cCI6MjEwNjgzNDUwN30.gi-YVLH9VjM5R1XLmzKccxqxSTbcAjtoaNQBtwtDp4w`
6. اضغط **Deploy** وخلال ثوانٍ سيكون موقعك لايف برابط سريع وآمن (SSL)!

### الطريقة الثانية: عبر Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🗄️ إعداد قاعدة البيانات في Supabase
الملف الجاهز للميجريشن موجود في:
`supabase/migrations/20261006000001_initial_schema.sql`

يمكنك نسخه ولصقه في **SQL Editor** داخل لوحة تحكم Supabase لتفعيل كافة الجداول، والـ Enums، والـ RLS، وبذور البيانات الأولية فورياً.
