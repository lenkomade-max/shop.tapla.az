# Rebranding Report: ALUNA (Beauty/Skincare) → TAPLA MARKETPLACE (Electronics Marketplace)

## Overview

**Project:** `shop.tapla.az` — Next.js 16 e-commerce application  
**Current brand:** ALUNA — premium beauty/skincare devices (LED therapy, ultrasonic cleaners, eye massagers, microcurrent lifters)  
**Target brand:** TAPLA MARKETPLACE — electronics marketplace (laptops, phones, tablets, accessories, etc.)

The codebase is deeply branded as ALUNA — from metadata, layout components, and product data down to localStorage keys, email addresses, and social proof content. This report catalogs every file containing ALUNA-specific or beauty-specific content and proposes exact changes for rebranding to TAPLA MARKETPLACE.

**Scope:** ~45 files to modify across 11 categories  
**Estimated total effort:** 12-16 hours for thorough conversion  
**Priority system used throughout:** High = blocks shipping; Medium = degrades UX; Low = cosmetic

---

## 1. Brand Name & Metadata

### 1.1 `/Users/user/Mac-Server/shop.tapla.az/src/app/layout.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 13 | `default: 'ALUNA | Premium Gözəllik və Üz Qulluğu Cihazları'` | `default: 'TAPLA MARKETPLACE | Onlayn Elektronika Mağazası'` | **High** |
| 14 | `template: '%s | ALUNA'` | `template: '%s | TAPLA MARKETPLACE'` | **High** |
| 16 | `description: 'Aluna ilə evinizdə lüks salon qulluğu. 7 fərqli LED işıq terapiyası, EMS mikroaxın liftinqi və sonik üz təmizləmə cihazları ilə dərhal gənclik və parlaqlıq.'` | `description: 'TAPLA MARKETPLACE — Azərbaycanda ən sərfəli qiymətlərlə elektronika, notebook, telefon, aksesuar və daha çoxu. Sürətli çatdırılma, zəmanət və etibarlı xidmət.'` | **High** |

### 1.2 `/Users/user/Mac-Server/shop.tapla.az/src/app/admin/layout.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 18 | `<Link href="/admin" className="text-sm font-bold uppercase tracking-wider">Aluna Admin</Link>` | `<Link href="/admin" className="text-sm font-bold uppercase tracking-wider">TAPLA Admin</Link>` | **Medium** |

### 1.3 `/Users/user/Mac-Server/shop.tapla.az/src/app/admin/login-form.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 19 | `<h1 className="mb-6 text-center text-lg font-bold uppercase tracking-wider">Aluna Admin</h1>` | `<h1>TAPLA Admin</h1>` | **Medium** |

### 1.4 `/Users/user/Mac-Server/shop.tapla.az/src/app/products/page.tsx`

No direct ALUNA references found. Metadata is generic (`'Məhsullar'`). No change needed.

### 1.5 `/Users/user/Mac-Server/shop.tapla.az/next.config.ts`

No ALUNA references. No change needed.

### 1.6 `/Users/user/Mac-Server/shop.tapla.az/src/app/page.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 35 | `{/* 4. Steps Evening Ritual Showcase ("ALUNA İLƏ AXŞAM RİTUALI") */}` | `{/* 4. FeaturesStep component */}` (comment only, no visible text) | **Low** |

---

## 2. Layout Components

### 2.1 `/Users/user/Mac-Server/shop.tapla.az/src/components/layout/Header.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 123 | `<span className="...">ALUNA</span>` (logo text) | `<span className="...">TAPLA</span>` | **High** |
| 191 | `<Drawer ... title="ALUNA MENYU"` | `<Drawer ... title="MENYU"` | **High** |
| 244 | `"Premium Aluna cihazlarını kəşf edərək dərhal sifariş edin."` | `"Premium məhsulları kəşf edərək dərhal sifariş edin."` | **Medium** |

**Additional note:** The header uses `NAVIGATION_ITEMS` from data.ts (see section 5). Navigation labels are beauty-category-specific and will need full replacement.

### 2.2 `/Users/user/Mac-Server/shop.tapla.az/src/components/layout/Footer.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 37 | `ALUNA HAQQINDA` | `TAPLA HAQQINDA` | **High** |
| 40 | `Aluna Texnologiyası` | `Satış və Qaydalar` | **Medium** |
| 41 | `Niyə Aluna?` | `Niyə TAPLA?` | **Medium** |
| 48 | `ŞƏXSİ ALUNA` | `ŞƏXSİ KABİNET` | **Medium** |
| 73 | `support@aluna.az` | `support@tapla.az` | **High** |
| 82 | `ALUNA-YA QOŞULUN` | `TAPLA-YA QOŞULUN` | **Medium** |
| 92 | `Aluna Gözəllik Klubuna üzvlüyünüz uğurla təsdiqləndi. 15% endirim kuponunuz e-mailinizə göndərildi.` | `TAPLA Market klubuna üzvlüyünüz uğurla təsdiqləndi. Endirim kuponunuz e-mailinizə göndərildi.` | **Medium** |
| 142 | `Mən Aluna Gözəllik və Skincare məhsulları haqqında xəbərləri...` | `Mən TAPLA MARKETPLACE haqqında xəbərləri...` | **Medium** |
| 186 | `© {new Date().getFullYear()} ALUNA BEAUTY LLC. BÜTÜN HÜQUQLAR QORUNUR.` | `© {new Date().getFullYear()} TAPLA MARKETPLACE MMC. BÜTÜN HÜQUQLAR QORUNUR.` | **High** |
| 193 | `Premium Azerbaijani Beauty Brand. Powered by Aluna Technology.` | `Premium Azerbaijani Electronics Marketplace. Powered by Tapla Platform.` | **Medium** |

### 2.3 `/Users/user/Mac-Server/shop.tapla.az/src/components/layout/StickyMobileBar.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 19 | `alert('Aluna Müştəri Xidmətləri: WhatsApp (+994 55 123-45-67) və ya Onlayn Çat vasitəsilə 24/7 xidmətinizdəyik!')` | `alert('TAPLA MARKETPLACE Müştəri Xidmətləri: WhatsApp (+994 55 123-45-67) və ya Onlayn Çat vasitəsilə 24/7 xidmətinizdəyik!')` | **Medium** |
| 23 | `alert('Klubumuza xoş gəldiniz! Sifariş zamanı ALUNA15 kodunu istifadə edərək dərhal 15% endirim qazanın.')` | Remove or replace with a generic marketplace promo message | **Medium** |

### 2.4 `/Users/user/Mac-Server/shop.tapla.az/src/components/layout/AnnouncementBar.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 8 | `YENİ ALUNA RADIANCE PRO SATIŞDA! İLK SİFARİŞƏ ÖZƏL 15% ENDİRİM - ALUNA15, href: '#aluna-radiance-pro'` | `YENİ MƏHSULLAR SATIŞDA! BÜTÜN ELEKTRONIKA MƏHSULLARINA ENDIRIMLƏR, href: '/#products'` | **High** |

---

## 3. Homepage Sections

### 3.1 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/Hero.tsx`

The entire `HERO_SLIDES` array is beauty-branded:

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 13 | `title: 'ALUNA RADIANCE PRO'` | `title: 'TAPLA MARKETPLACE'` | **High** |
| 14 | `subtitle: 'MÜKƏMMƏL DƏRİ SİRRİ'` | `subtitle: 'ELEKTRONIKADA ƏN YAXŞI SEÇİMLƏR'` | **High** |
| 15 | `description: 'Ev şəraitində peşəkar salon nəticələri...'` | `description: 'Notebook, telefon, planşet və aksesuarlar ən sərfəli qiymətlərlə. Zəmanətli məhsullar, sürətli çatdırılma.'` | **High** |
| 18 | `href: '#aluna-radiance-pro'` | `href: '/#products'` | **High** |
| 22-28 | Slide 2 (beauty ultrasonic cleaning) | Replace with electronics-focused slide (e.g., "Notebook və Ultrabooklar") | **High** |
| 32-38 | Slide 3 (eye care) | Replace with electronics-focused slide (e.g., "Aksesuar və Qadjetlər") | **High** |

All slide images (Unsplash beauty/people photos) should be replaced with electronics/tech imagery.

### 3.2 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/Benefits.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 39 | `NİYƏ MƏHZ ALUNA?` | `NİYƏ TAPLA MARKETPLACE?` | **High** |
| 42 | `Hər bir cihazımız unikal texnoloji struktura və dərinin sağlamlığını dərindən dəstəkləyən təhlükəsizlik sertifikatlarına malikdir.` | `Rəsmi zəmanətli məhsullar, ən aşağı qiymətlər və sürətli çatdırılma — TAPLA MARKETPLACE fərqi ilə.` | **High** |

### 3.3 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/FeaturesStep.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 36 | `ALUNA İLƏ AXŞAM RİTUALI` | `TAPLA MARKETPLACE İLƏ ALIŞ-VERİŞ` | **High** |
| 39 | `Dərinizin gecə boyu özünü bərpa etməsi üçün Aluna texnologiyalarını birləşdirən 4 sadə addımlı lüks qulluq sistemi.` | `Məhsul seçimi, müqayisə, sifariş və çatdırılma — 4 sadə addımda TAPLA təcrübəsi.` | **High** |

This entire component is currently a beauty ritual showcase. It should be transformed into a "Shopping Steps" section (Browse → Compare → Order → Delivery).

### 3.4 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/PromoBanners.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 19 | `alt="Aluna Sonik təmizləmə gücü"` | `alt="TAPLA Notebook və Ultrabooklar"` | **Medium** |
| 28 | `MƏMİŞŞAH ÜÇLÜ TƏMİZLƏMƏ GÜCÜ` | `YENİ NƏSİL NOTEBOOKLAR` | **High** |
| 31 | `Məsamələri 99.8% kirlərdən dərhal təmizləyən...` | `Intel Core Ultra, SSD, 32GB RAM — oyun və iş üçün ən güclü notebooklar ən sərfəli qiymətlərlə.` | **High** |
| 47 | `alt="Aluna LED Cavanlaşma gücü"` | `alt="TAPLA Telefon və Planşetlər"` | **Medium** |
| 56 | `GƏNC DƏRİNİN SÜNİ İNTELLEKT GÜCÜ` | `AKSESUARLARDA BÖYÜK ENDİRİM` | **High** |
| 59 | `İstifadəçilərin 100%-i 14 günlük tətbiqdən sonra...` | `Qulaqlıq, smart saat, kabel, şarj cihazı və daha çoxu — bütün aksesuarlar endirimli qiymətlərlə.` | **High** |
| 76 | `alt="Aluna Radiance full spotlight"` | `alt="TAPLA Kampaniya"` | **Medium** |
| 89 | `ALUNA GLOW - MÜKƏMMƏL ÜZ KONTURU VƏ PARILTISI` | `TAPLA MARKETPLACE - BÜTÜN ELEKTRONIKA BIR YERDƏ` | **High** |
| 92 | `Yeni mikroaxınlı liftinq başlığı və patentləşdirilmiş LED dalğaları ilə...` | `Smartfon, notebook, planşet, televizor, mətbəx texnikası və daha çoxu. Rəsmi zəmanət, sürətli çatdırılma, ən ucuz qiymətlər.` | **High** |

### 3.5 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/ProductGrid.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 63 | `ALUNA BUTİK` | `TAPLA MARKETPLACE` | **High** |
| 66 | `MƏHSUL KOLLEKSİYAMIZ` | `MƏHSUL KATEQORİYALARIMIZ` | **Medium** |
| 69 | `Dərinizə rəqəmsal dəqiqlik bəxş edən yüksək keyfiyyətli cihazlarımızla tanış olun...` | `Elektronika dünyasının ən sevilən məhsulları ilə tanış olun və ehtiyacınıza uyğun olanı seçin.` | **Medium** |

**Categories** (lines 20-25) must change from beauty categories to electronics categories:
- `'LED TERAPİYA'` → `'NOTEBOOK / Ultrabook'`
- `'TƏMİZLƏMƏ'` → `'SMARTFON / Planşet'`
- `'GÖZ QULLUĞU'` → `'AKSESUAR / Qadjet'`
- `'LİFTİNQ'` → `'TV / Audio / Ev'`

### 3.6 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/ReviewsSection.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 85 | `ALUNA İSTİFADƏÇİ RƏYLƏRİ` | `MÜŞTƏRİ RƏYLƏRİ` | **Medium** |
| 88 | `Həqiqi istifadəçilərimizin Aluna texnologiyaları ilə əldə etdikləri unikal nəticələr...` | `Həqiqi müştərilərimizin TAPLA MARKETPLACE-də aldıqları məhsullar haqqında rəyləri.` | **Medium** |
| 115 | `İstifadəçilərimizin 100%-i bu məhsulu rəfiqələrinə və ailə üzvlərinə tövsiyə edir.` | `Müştərilərimizin 95%-i TAPLA MARKETPLACE-i dostlarına tövsiyə edir.` | **Medium** |
| 147 | `Digər gözəllik axtarışında olan xanımlara kömək edin.` | `Digər müştərilərimizə kömək edin.` | **Medium** |
| 213 | `title="YENİ GÖZƏLLİK RƏYİ YAZ"` | `title="YENİ RƏY YAZ"` | **Low** |
| 219 | `ALUNA QİYMƏTLƏNDİRİLMƏSİ *` | `MƏHSUL QİYMƏTLƏNDİRİLMƏSİ *` | **Low** |
| 259 | `Aluna cihazımızla bağlı təcrübənizi...` | `Məhsulla bağlı təcrübənizi...` | **Low** |
| 303-331 | Skin type, skin tone dropdown fields (beauty-specific) | Remove or replace with product category / usage fields | **Medium** |

### 3.7 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/ValueProps.tsx`

This entire component is heavily beauty-specific (skin quiz, AI beauty advisor, cosmetologist consultation):

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 21 | `Salam! Mən Aluna Virtual Gözəllik məsləhətçisiyəm. Dərinizdə hansı problemi həll etmək istədiyinizi qeyd edin...` | `Salam! Mən TAPLA MARKETPLACE köməkçisiyəm. Hansı məhsulu axtardığınızı qeyd edin...` | **High** |
| 41 | `DƏRİ TİPİNİ TƏYİN ET` | `MƏHSUL TAPICI` | **High** |
| 42 | `1 dəqiqəlik testlə dərinizə ən uyğun qulluq rejimini seçin.` | `1 dəqiqəlik testlə sizə ən uyğun məhsulu seçin.` | **High** |
| 50 | `Ehtiyaclarınıza uyğun Aluna texnologiyasını müəyyən edin.` | `Büdcənizə və tələblərinizə uyğun məhsulu müqayisə edin.` | **High** |
| 58 | `Süni intellekt dəstəkli dəri analizi...` | `Süni intellekt dəstəkli məhsul tövsiyələri.` | **High** |
| 65-70 | `CANLI GÖZƏLLİK EKSPERTİ` / `peşəkar kosmetoloqlarımızla` | `CANLI DƏSTƏK` / `texniki dəstək komandamızla` | **High** |
| 50-56 | AI chatbot responses referencing beauty products (ALUNA Radiance Pro, Sonic Deep Cleanser, etc.) | Replace with electronics recommendations | **High** |
| 121 | `1-DƏQİQƏLİK ÜZ QULLUĞU TESTİ` | `1-DƏQİQƏLİK MƏHSUL TESTİ` | **High** |
| 127-174 | Quiz steps: skin type, skin issues, beauty routine time | Replace: device type, budget range, usage purpose (gaming/work/study) | **High** |
| 183 | `SİZƏ UYĞUN CİHAZ: ALUNA RADIANCE PRO` | `SİZƏ UYĞUN MƏHSUL:` (dynamic) | **High** |
| 216 | `Ehtiyaclarınıza uyğun Aluna texnologiyalarını...` | `Ehtiyaclarınıza uyğun məhsulları...` | **High** |
| 223-258 | Comparison table: Radiance Pro, Sonic Deep, V-Sculpt | Replace with electronics product comparison | **High** |
| 277 | `ALUNA VİRTUAL AI ASSİSTENT` | `TAPLA VİRTUAL KÖMƏKÇİ` | **High** |
| 320 | `KOSMETOLOQ İLƏ CANLI GÖRÜŞ` | `TEXNİKİ DƏSTƏK İLƏ CANLI GÖRÜŞ` | **High** |
| 324 | `Bizim rəsmi tibbi kosmetoloqlarımızla ödənişsiz 15 dəqiqəlik onlayn video konsultasiya...` | `Bizim texniki mütəxəssislərimizlə ödənişsiz konsultasiya...` | **High** |

### 3.8 `/Users/user/Mac-Server/shop.tapla.az/src/components/sections/FAQ.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 36 | `Aluna cihazlarının istifadə qaydaları, zəmanət müddəti, ölkədaxili çatdırılma və təhlükəsizlik qaydaları haqqında...` | `TAPLA MARKETPLACE-də çatdırılma, zəmanət, qaytarma və ödəniş qaydaları haqqında bütün sualların cavabları.` | **High** |
| 111 | `href="mailto:support@aluna.az"` | `href="mailto:support@tapla.az"` | **High** |
| 116 | `support@aluna.az` | `support@tapla.az` | **High** |
| 84 | `Bizim mehriban gözəllik komandamız...` | `Bizim mehriban dəstək komandamız...` | **Medium** |

---

## 4. Product Detail Page

### 4.1 `/Users/user/Mac-Server/shop.tapla.az/src/app/products/[slug]/ProductClient.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 142 | `<h3 className="...">ALUNA LED SİMULYATORU</h3>` | Remove or replace with generic "Interactive Preview" | **High** |
| 430 | `Bu cihazı (ALUNA Radiance Pro) alandan bəri...` | Replace with electronics-specific review | **High** |
| 442 | `...Təşəkkürlər ALUNA!` | `...Təşəkkürlər TAPLA!` | **Medium** |
| 61-66 | LED simulator data (`ledDetails` — red/blue/green/yellow light descriptions) | Remove entirely; this is beauty-specific interactive LED try-on | **High** |

---

## 5. Constants & Data

### 5.1 `/Users/user/Mac-Server/shop.tapla.az/src/constants/data.ts`

This is the single largest data file requiring changes. Every product, review, FAQ, ritual step, and benefit is beauty-branded.

#### NAVIGATION_ITEMS (lines 3-36)

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 5 | `CİHAZLAR` | `MƏHSULLAR` | **High** |
| 8 | `LED Terapiya Cihazları` | `Notebook / Ultrabook` | **High** |
| 9 | `Ultrases Təmizləyicilər` | `Smartfon / Planşet` | **High** |
| 10 | `Mikroaxın Liftinq` | `TV / Audio Sistemlər` | **High** |
| 11 | `Göz Ətrafı Masajerlər` | `Aksesuar / Qadjetlər` | **High** |
| 15 | `QULLUQ MƏHSULLARI` | `XÜSUSİ TƏKLİFLƏR` | **High** |
| 21 | `RİTUALLLAR` | `BLOQ / XƏBƏRLƏR` | **Medium** |

#### VALUE_PROPS (lines 38-71)

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 41 | `DƏRİ TİPİNİ TƏYİN ET` | `MƏHSUL SEÇİM KÖMƏKÇİSİ` | **High** |
| 42 | `1 dəqiqəlik testlə dərinizə ən uyğun qulluq rejimini seçin.` | `1 dəqiqəlik suallarla sizə ən uyğun məhsulu tapaq.` | **High** |
| 50 | `Ehtiyaclarınıza uyğun Aluna texnologiyasını müəyyən edin.` | `Büdcənizə və tələblərinizə uyğun ən yaxşı məhsulu müqayisə edin.` | **High** |
| 58 | `Süni intellekt dəstəkli dəri analizi...` | `Süni intellekt dəstəkli məhsul tövsiyələri...` | **High** |
| 65-66 | `CANLI GÖZƏLLİK EKSPERTİ` / `peşəkar kosmetoloqlarımızla` | `TEXNİKİ DƏSTƏK` / `texniki mütəxəssis` | **High** |

#### PRODUCTS (lines 73-188) — All 4 products must be replaced

| Product ID | Current Name | Change To | Priority |
|-----------|-------------|-----------|----------|
| `aluna-radiance-pro` | `ALUNA Radiance Pro` | `Apple MacBook Air M3` (or similar electronics) | **High** |
| `aluna-ultrasonic-clean` | `ALUNA Sonic Deep Cleanser` | `Samsung Galaxy S25 Ultra` (or similar) | **High** |
| `aluna-eye-glow` | `ALUNA Eye Radiance Duo` | `Sony WH-1000XM5` (or similar) | **High** |
| `aluna-lift-sculpt` | `ALUNA Contour Lift V-Sculpt` | `iPad Pro M4` (or similar) | **High** |

Each product object (id, slug, name, subtitle, description, price, benefits, howToUse, ingredients, shades, etc.) is deeply beauty-specific and must be fully rewritten for electronics.

#### REVIEWS (lines 190-251) — All 4 reviews

| ID | Beauty Content | Electronics Content | Priority |
|----|----------------|-------------------|----------|
| rev-1 | `Aluna Radiance Pro-nu... Qırmızı LED və EMS liftinq...` | Rewrite as electronics product review | **High** |
| rev-2 | `Aluna Sonic Deep Cleanser... qara nöqtələri təmizlədi...` | Rewrite as electronics product review | **High** |
| rev-3 | `Eye Radiance Duo... göz altı torbaları...` | Rewrite as electronics product review | **High** |
| rev-4 | `Contour Lift V-Sculpt... buxaq nahiyəmi toparlamaq üçün...` | Rewrite as electronics product review | **High** |

Review fields `skinType`, `skinTone`, `ageRange` should be removed or replaced.

#### FAQS (lines 253-284) — All 5 items

| ID | Current Question | Proposed New Question | Priority |
|----|-----------------|---------------------|----------|
| faq-1 | `Aluna gözəllik cihazlarını hər gün istifadə etmək təhlükəsizdirmi?` | `TAPLA MARKETPLACE-də məhsulların zəmanəti varmı?` | **High** |
| faq-2 | `Cihazlar hansı dəri tipləri üçün uyğundur?` | `Məhsulu neçə günə geri qaytara bilərəm?` | **High** |
| faq-3 | `Çatdırılma şərtləriniz necədir? Rayonlara göndəriş var?` | Keep but remove beauty branding; update with current shipping policy | **High** |
| faq-4 | `Aluna məhsullarına rəsmi zəmanət verilirmi?` | `Rəsmi zəmanət şərtləri necədir?` | **High** |
| faq-5 | `Hamiləlik və ya digər tibbi vəziyyətlərdə istifadə etmək olarmı?` | `Məhsulun orijinal olduğunu necə yoxlaya bilərəm?` | **High** |

#### RITUAL_STEPS (lines 286-323) — All 4 steps

| Step | Beauty Content | Proposed Electronics Content | Priority |
|------|---------------|----------------------------|----------|
| 1 | `DƏRİN ULTRASES TƏMİZLƏMƏ` / `ALUNA Sonic Deep Cleanser` | `MƏHSUL SEÇİMİ` / `Kateqoriyaları araşdırın` | **High** |
| 2 | `AKTİV SERUM VƏ ABSORBSİYA` / `Aluna Qulluq Serumu` | `XÜSUSİYYƏTLƏRİ MÜQAYİSƏ EDİN` | **High** |
| 3 | `MİKROAXIN MASAJI VƏ LİFTİNQ` / `ALUNA Contour V-Sculpt` | `SİFARİŞ VERİN` / `Təhlükəsiz ödənişlə sifariş edin` | **High** |
| 4 | `LED TERAPİYA İLƏ CAVANLAŞMA` / `ALUNA Radiance Pro` | `SÜRƏTLİ ÇATDIRILMA` / `Bakı daxili 24 saat` | **High** |

#### BENEFITS_LIST (lines 325-350) — All 4 items

| ID | Beauty Content | Proposed Electronics Content | Priority |
|----|---------------|----------------------------|----------|
| ben-1 | `Evdə Salon Komfortu` | `RƏSMİ ZƏMANƏT` | **High** |
| ben-2 | `Dərhal Görünən Nəticələr` | `SÜRƏTLİ ÇATDIRILMA` | **High** |
| ben-3 | `Hipoallergik və Təhlükəsiz` | `ORİJİNAL MƏHSULLAR` | **High** |
| ben-4 | `Zəmanət və Texniki Dəstək` | `TEXNİKİ DƏSTƏK` | **High** |

---

## 6. Landing Pages (`src/landings/`)

### 6.1 Overview

All 3 landing pages are cosmetics/beauty-specific and must be deleted or archived:

| Landing | Path | Theme | Content |
|---------|------|-------|---------|
| essential-lash-serum | `/landing/essential-lash-serum` | custom | Eyelash serum |
| lash-serum | `/landing/lash-serum` | rose | Kirpik serumu |
| collagen-mask | `/landing/collagen-mask` | medical | Collagen face mask |

### 6.2 Files to delete/archive (14 files, ~1,800 lines)

- `src/landings/essential-lash-serum/config.ts`
- `src/landings/essential-lash-serum/sections/luxury-hero.tsx`
- `src/landings/essential-lash-serum/sections/benefits-stats.tsx`
- `src/landings/essential-lash-serum/sections/growth-timeline.tsx`
- `src/landings/essential-lash-serum/sections/ingredient-story.tsx`
- `src/landings/essential-lash-serum/sections/before-after.tsx`
- `src/landings/essential-lash-serum/sections/how-to-use.tsx`
- `src/landings/essential-lash-serum/sections/faq.tsx`
- `src/landings/essential-lash-serum/sections/checkout-offer.tsx`
- `src/landings/lash-serum/config.ts`
- `src/landings/collagen-mask/config.ts`
- `src/app/landing/essential-lash-serum/page.tsx`

### 6.3 `src/landings/registry.ts` — Remove all 3 imports and entries

### 6.4 `src/landings/themes.ts` — Remove `beautyPremium` theme or rename label

---

## 7. Types & Services

### 7.1 `/Users/user/Mac-Server/shop.tapla.az/src/types/index.ts`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 62 | `// --- Aluna v2 types ---` | `// --- Product types ---` | **Low** |
| 107-113 | Review has `skinType`, `skinTone`, `ageRange` | Remove or make optional | **Medium** |

### 7.2 `/Users/user/Mac-Server/shop.tapla.az/src/services/db.ts`

No direct ALUNA references. Brand-agnostic data service layer. No changes needed.

### 7.3 `/Users/user/Mac-Server/shop.tapla.az/src/components/cards/ProductCard.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 60 | `priority={product.id === 'aluna-radiance-pro'}` | Update or remove for new product IDs | **Medium** |

---

## 8. Images & Assets

| File | Action | Priority |
|------|--------|----------|
| `public/images/logo.png` | Replace with TAPLA MARKETPLACE logo | **High** |
| `public/images/hero/1.jpg` through `6.jpg` | Replace with electronics/tech images | **High** |
| `public/images/products/1.jpg` through `12.jpg` | Replace with electronics product images | **High** |
| `src/app/favicon.ico` | Replace with TAPLA favicon | **High** |

---

## 9. Providers & Store

### 9.1 `/Users/user/Mac-Server/shop.tapla.az/src/store/CartContext.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 29 | `localStorage.getItem('aluna_cart')` | `localStorage.getItem('tapla_cart')` | **High** |
| 53 | `localStorage.setItem('aluna_cart', ...)` | `localStorage.setItem('tapla_cart', ...)` | **High** |

⚠️ Changing localStorage key will invalidate all existing user carts.

---

## 10. Checkout Page

### 10.1 `/Users/user/Mac-Server/shop.tapla.az/src/app/checkout/page.tsx`

| Line | Current Text | Proposed Change | Priority |
|------|-------------|-----------------|----------|
| 166 | `Təbrik edirik! Aluna premium gözəllik cihazları ilə...` | `Təbrik edirik! TAPLA MARKETPLACE-dən etdiyiniz alış-veriş üçün təşəkkür edirik.` | **High** |
| 491 | WhatsApp link text `Aluna-da` | `TAPLA-dan` | **Medium** |
| 671 | `ALUNA-da bütün əməliyyatlarınız...` | `TAPLA MARKETPLACE-də bütün əməliyyatlarınız...` | **High** |
| 134 | `const randomId = 'ALN-' + ...` | `const randomId = 'TPL-' + ...` | **Medium** |

---

## 11. Documentation & Config

### 11.1 `/Users/user/Mac-Server/shop.tapla.az/CLAUDE.md`

Multiple references (lines 9, 17, 38, 44-45, 50-51, 56, 62, 75, 84-111). All `Aluna` mentions should be replaced or removed. ~15 changes, all **Low** priority.

### 11.2 `/Users/user/Mac-Server/shop.tapla.az/docs/ARCHITECTURE.md`

Multiple references (lines 18, 30, 54, 56, 67, 84, 87, 92, 109, 118). ~10 changes, all **Low** priority.

### 11.3 `/Users/user/Mac-Server/shop.tapla.az/src/lib/supabase/migrations/002_aluna_tables.sql`

Comment-only references (lines 1, 5, 31, 45). Cosmetic updates only.

---

## 12. Database (Supabase)

| Item | Current | Change Required | Priority |
|------|---------|----------------|----------|
| `reviews.skin_type` | beauty-specific field | Keep or drop | **Low** |
| `reviews.skin_tone` | beauty-specific field | Keep or drop | **Low** |
| `reviews.age_range` | beauty-specific field | Keep or drop | **Low** |
| `products.shades` | beauty color variants | Repurpose for storage/color variants | **Medium** |
| `products.try_on_enabled` | LED simulator flag | Set to false for all electronics products | **Medium** |
| Existing products in DB | 4 Aluna beauty products | Replace with electronics products | **High** |

---

## Summary Statistics

### Total Files to Modify/Delete: ~45

| Category | Files | Effort |
|----------|-------|--------|
| Metadata & layout (Section 1) | 4 | Small |
| Layout components (Section 2) | 4 | Medium |
| Homepage sections (Section 3) | 8 | Large |
| Product detail (Section 4) | 1 | Medium |
| Constants/data (Section 5) | 1 | **Very Large** (full rewrite) |
| Landing pages (Section 6) | 14 | Medium (delete) |
| Types & services (Section 7) | 2 | Small |
| Images/assets (Section 8) | 15+ | Medium (replace) |
| Store/Providers (Section 9) | 1 | Small |
| Checkout (Section 10) | 1 | Small |
| Documentation (Section 11) | 3 | Small |
| Database (Section 12) | 1 migration | Small |

### Effort Distribution

| Effort | Files |
|--------|-------|
| **Very Large** (full rewrite) | 1 (`data.ts`) |
| **Large** (50+ line changes) | 8 (Hero, ValueProps, FeaturesStep, PromoBanners, ProductGrid, Benefits, ReviewsSection, FAQ) |
| **Medium** (10-50 line changes) | 6 (Footer, Header, ProductClient, Checkout, themes.ts, landing configs) |
| **Small** (<10 line changes) | ~15 (layout.tsx, admin files, CartContext, types, docs, etc.) |
| **Delete** (entire files) | 14 (landing files) |
| **Replace** (binary assets) | 15+ (images, favicon, logo) |

### Priority Distribution

| Priority | Change Count |
|----------|-------------|
| **High** | ~80+ changes across 25+ files |
| **Medium** | ~30+ changes across 15+ files |
| **Low** | ~20+ changes across 10+ files |

### Estimated Total Time: 13-18 hours

| Task | Time |
|------|------|
| Update metadata & layout files | 30 min |
| Update all homepage sections | 4-5 hours |
| Rewrite `constants/data.ts` | 3-4 hours |
| Delete/archive landing pages | 30 min |
| Replace images, logo, favicon | 1-2 hours |
| Update store (localStorage key) | 5 min |
| Update checkout page | 15 min |
| Update documentation | 30 min |
| Database migration + seed data | 1-2 hours |
| Testing (build, lint, visual QA) | 2-3 hours |

### Key Challenges

1. **`data.ts` rewrite is the largest task** — all 4 products, 4 reviews, 5 FAQs, 4 ritual steps, 4 benefits, value props, and navigation must be rewritten from beauty to electronics context
2. **ValueProps.tsx component is deeply beauty-specific** — skin quiz, AI beauty advisor, cosmetologist consultation features must be substantially redesigned for electronics marketplace
3. **FeaturesStep.tsx** — the "Evening Ritual" concept is beauty-specific and needs a complete conceptual redesign for a shopping flow
4. **Landing page deletion** — 3 complete landing modules (~1,800 lines) must be removed and `registry.ts` updated
5. **Image assets** — all hero images, product images, and the logo must be replaced with electronics-appropriate visuals
6. **Database migration** — existing Aluna products in Supabase must be migrated or replaced
