-- ============================================================================
-- shop.tapla.az — Database Schema (single source of truth)
-- ============================================================================
-- Применять через Supabase SQL Editor.
-- Бизнес-логика профилей (создание, форматирование телефона) — в lib/api/profile.ts
-- ============================================================================

-- ============================================================================
-- 1. PRODUCTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  old_price DECIMAL(10,2),
  rating DECIMAL(3,1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  category TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  benefits JSONB DEFAULT '[]'::jsonb,
  how_to_use TEXT,
  ingredients TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  shades JSONB DEFAULT '[]'::jsonb,
  is_new BOOLEAN DEFAULT false,
  try_on_enabled BOOLEAN DEFAULT false,
  supplier_url TEXT,                -- Tovar.AI: ссылка на страницу поставщика
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ============================================================================
-- 1.5 CATEGORIES (иерархическая структура)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Добавляем category_id в products
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- ============================================================================
-- Сеед данных: категории (на основе ассортимента magazam_az)
-- ============================================================================
INSERT INTO categories (slug, title, description, sort_order) VALUES
  ('qulaqliq-ve-audio', 'Qulaqlıq & Audio', 'Simsiz qulaqlıqlar, TWS, dinamiklər, kolonkalar', 1),
  ('telefonlar-ve-plansetler', 'Telefonlar & Planşetlər', 'Düyməli telefonlar, smartfonlar, planşetlər, aksesuarlar', 2),
  ('kicik-meiset-texnikasi', 'Kiçik Məişət Texnikası', 'Fenlər, sərinkeşlər, tozsoranlar, ütülər, mətbəx texnikası', 3),
  ('aqilli-saat-ve-gadget', 'Ağıllı Saat & Gadget', 'Smart saatlar, powerbanklər, oyun aksesuarları', 4),
  ('saglamliq-ve-idman', 'Sağlamlıq & İdman', 'Masaj cihazları, qaçış aparatları, fitnes', 5),
  ('elektronika', 'Elektronika', 'Noutbuklar, DJI, kameralar, günəş panelləri', 6)
ON CONFLICT (slug) DO NOTHING;

-- Подкатегории: Qulaqlıq & Audio
INSERT INTO categories (slug, title, description, parent_id, sort_order) VALUES
  ('tws-qulaqliq', 'Simsiz Qulaqlıq (TWS)', 'AirPods, TWS, bluetooth qulaqlıqlar', (SELECT id FROM categories WHERE slug = 'qulaqliq-ve-audio'), 1),
  ('dinamik-kolonka', 'Dinamik / Kolonka', 'Bluetooth kolonkalar, səs sistemi', (SELECT id FROM categories WHERE slug = 'qulaqliq-ve-audio'), 2),
  ('qulaqustu-qulaqliq', 'Qulaqüstü Qulaqlıq', 'Böyük ölçülü qulaqlıqlar, oyun qulaqlıqları', (SELECT id FROM categories WHERE slug = 'qulaqliq-ve-audio'), 3)
ON CONFLICT (slug) DO NOTHING;

-- Подкатегории: Telefonlar & Planşetlər
INSERT INTO categories (slug, title, description, parent_id, sort_order) VALUES
  ('duymeli-telefon', 'Düyməli Telefon', 'Nokia, Samsung E seriyası, Vertu', (SELECT id FROM categories WHERE slug = 'telefonlar-ve-plansetler'), 1),
  ('smartfon', 'Smartfon (Android)', 'Android telefonlar, DOOV, QIN', (SELECT id FROM categories WHERE slug = 'telefonlar-ve-plansetler'), 2),
  ('planset', 'Planşet', 'Android planşetlər, uşaq planşetləri', (SELECT id FROM categories WHERE slug = 'telefonlar-ve-plansetler'), 3),
  ('tel-aksesuar', 'Tel Aksesuar', 'Çantalar, qoruyucu şüşələr, kabellər', (SELECT id FROM categories WHERE slug = 'telefonlar-ve-plansetler'), 4)
ON CONFLICT (slug) DO NOTHING;

-- Подкатегории: Kiçik Məişət Texnikası
INSERT INTO categories (slug, title, description, parent_id, sort_order) VALUES
  ('fen-serinkes', 'Fen / Sərinkeş', 'Saç qurudanlar, ventilyatorlar, mini sərinkeşlər', (SELECT id FROM categories WHERE slug = 'kicik-meiset-texnikasi'), 1),
  ('temizlik', 'Təmizlik Texnikası', 'Tozsoranlar, xalça yuyan maşınlar', (SELECT id FROM categories WHERE slug = 'kicik-meiset-texnikasi'), 2),
  ('metbex', 'Mətbəx Texnikası', 'Frituzlər, ütülər, hava soyuducular', (SELECT id FROM categories WHERE slug = 'kicik-meiset-texnikasi'), 3)
ON CONFLICT (slug) DO NOTHING;

-- Подкатегории: Ağıllı Saat & Gadget
INSERT INTO categories (slug, title, description, parent_id, sort_order) VALUES
  ('smart-saat', 'Smart Saat', 'Ağıllı saatlar, uşaq saatları, SIM kartlı saatlar', (SELECT id FROM categories WHERE slug = 'aqilli-saat-ve-gadget'), 1),
  ('powerbank', 'Powerbank', 'Portativ enerji yığıcılar, günəş panelli', (SELECT id FROM categories WHERE slug = 'aqilli-saat-ve-gadget'), 2),
  ('oyun-aksesuari', 'Oyun Aksesuarı', 'Coyistiklər, oyun pultları', (SELECT id FROM categories WHERE slug = 'aqilli-saat-ve-gadget'), 3),
  ('diger-gadget', 'Digər Gadgetlər', 'WiFi kameralar, mini klaviaturalar', (SELECT id FROM categories WHERE slug = 'aqilli-saat-ve-gadget'), 4)
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- 2. LANDINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS landings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  theme TEXT NOT NULL DEFAULT 'rose',
  sections JSONB NOT NULL DEFAULT '[]',
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_landings_product_id ON landings(product_id);
CREATE INDEX IF NOT EXISTS idx_landings_slug ON landings(slug);

-- ============================================================================
-- 3. MEDIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_product_id ON media(product_id);

-- ============================================================================
-- 4. PROFILES (пользователи)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL UNIQUE,
  phone TEXT,                         -- nullable, не unique (семейные номера)
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  city TEXT,                          -- город из последнего заказа
  address TEXT,                       -- полный адрес из последнего заказа
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_auth_user ON profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_lookup ON profiles(phone);

-- RLS: пользователь видит/меняет только свой профиль
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users_select_own" ON profiles;
CREATE POLICY "users_select_own" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);
DROP POLICY IF EXISTS "users_insert_own" ON profiles;
CREATE POLICY "users_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);
DROP POLICY IF EXISTS "users_update_own" ON profiles;
CREATE POLICY "users_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Триггер ТОЛЬКО для updated_at (без бизнес-логики!)
DROP TRIGGER IF EXISTS set_updated_at ON profiles;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 5. ORDERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT,
  address TEXT,
  payment_method TEXT,
  quantity INT NOT NULL DEFAULT 1,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_profile ON orders(profile_id);
CREATE INDEX IF NOT EXISTS idx_orders_auth_user ON orders(auth_user_id);

-- ============================================================================
-- 6. LEADS
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landing_id UUID REFERENCES landings(id),
  product_id UUID REFERENCES products(id),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  name TEXT,
  phone TEXT,
  source TEXT,
  campaign TEXT,
  pixel_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_leads_landing_id ON leads(landing_id);

-- ============================================================================
-- 7. COLLECTIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INT NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- ============================================================================
-- 8. REVIEWS
-- ============================================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL DEFAULT now(),
  location TEXT,
  age_range TEXT,
  skin_type TEXT,
  skin_tone TEXT,
  verified_buyer BOOLEAN NOT NULL DEFAULT false,
  images JSONB DEFAULT '[]'::jsonb,
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_date ON reviews(date DESC);

-- ============================================================================
-- 9. FAQs
-- ============================================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- ============================================================================
-- 10. USER CART
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  shade_name TEXT NOT NULL DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (auth_user_id, product_id, shade_name)
);
CREATE INDEX IF NOT EXISTS idx_user_cart_user ON user_cart(auth_user_id);

-- ============================================================================
-- 11. TOVAR AI GENERATIONS
-- ============================================================================
CREATE TABLE IF NOT EXISTS tovar_ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  source_photo TEXT NOT NULL,
  product_analysis JSONB,
  prompts_json JSONB,
  cards JSONB DEFAULT '[]'::jsonb,
  qa_results JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','analyzing','planning','generating','checking','done','failed')),
  error TEXT,
  cost DECIMAL(10,4) DEFAULT 0,
  -- v2: product mode
  mode TEXT DEFAULT 'test' CHECK (mode IN ('test', 'product')),
  supplier_url TEXT,
  product_data JSONB,
  ready_for_publish BOOLEAN DEFAULT false,
  image_urls JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_product ON tovar_ai_generations(product_id);
CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_status ON tovar_ai_generations(status);
CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_mode ON tovar_ai_generations(mode);

DROP TRIGGER IF EXISTS tovar_ai_gen_updated_at ON tovar_ai_generations;
CREATE TRIGGER tovar_ai_gen_updated_at BEFORE UPDATE ON tovar_ai_generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 13. HERO SLIDES (управление слайдером на главной)
-- ============================================================================
CREATE TABLE IF NOT EXISTS hero_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sort_order INT NOT NULL DEFAULT 0,
  tag TEXT DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT DEFAULT '',
  description TEXT DEFAULT '',
  image TEXT NOT NULL DEFAULT '',
  action_text TEXT DEFAULT 'MƏHSULLARI GÖR',
  href TEXT DEFAULT '/#products',
  overlay BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS hero_slides_updated_at ON hero_slides;
CREATE TRIGGER hero_slides_updated_at BEFORE UPDATE ON hero_slides
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: аноним может читать активные слайды
DROP POLICY IF EXISTS "anon can read active hero_slides" ON hero_slides;
CREATE POLICY "anon can read active hero_slides" ON hero_slides
  FOR SELECT TO anon USING (is_active = true);

-- Начальный слайд (если таблица пуста)
INSERT INTO hero_slides (sort_order, tag, title, subtitle, description, image, action_text, href, overlay)
SELECT 0, 'ELEKTRONIKADA ƏN YAXŞI SEÇİMLƏR', 'TAPLA MARKETPLACE', 'RƏSMİ ZƏMANƏT, ƏN UCUZ QİYMƏTLƏR', 'Notebook, telefon, planşet və aksesuarlar ən sərfəli qiymətlərlə. Zəmanətli məhsullar, sürətli çatdırılma.', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200&h=1600', 'MƏHSULLARI GÖR', '/#products', true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides LIMIT 1);

INSERT INTO hero_slides (sort_order, tag, title, subtitle, description, image, action_text, href, overlay)
SELECT 1, 'NOTEBOOK VƏ ULTRABOOKLAR', 'APPLE MACBOOK AIR M3', 'M3 ÇIP İLƏ SUPER SÜRƏT', '18 saat batareya ömrü, Liquid Retina displey, fanless dizayn. İş və təhsil üçün mükəmməl notebook.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1200&h=1600', 'KƏŞF ET', '/products/macbook-air-m3', true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides WHERE sort_order = 1);

INSERT INTO hero_slides (sort_order, tag, title, subtitle, description, image, action_text, href, overlay)
SELECT 2, 'SMARTFON VƏ AKSESUARLAR', 'SAMSUNG GALAXY S25 ULTRA', '200MP KAMERA, S PEN DƏSTƏYİ', 'Ən güclü flagship smartfon. Snapdragon 8 Elite, 6.9" Dynamic AMOLED, S Pen ilə birlikdə.', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&q=80&w=1200&h=1600', 'ƏTRAFLI BAX', '/products/samsung-galaxy-s25-ultra', true
WHERE NOT EXISTS (SELECT 1 FROM hero_slides WHERE sort_order = 2);

-- ============================================================================
-- 12. RLS POLICIES (публичное чтение, защита админки)
-- ============================================================================

-- Products: anon может читать активные
DROP POLICY IF EXISTS "anon can read active products" ON products;
CREATE POLICY "anon can read active products" ON products
  FOR SELECT TO anon USING (status = 'active');

-- Reviews: публичное чтение
DROP POLICY IF EXISTS "anon can read reviews" ON reviews;
CREATE POLICY "anon can read reviews" ON reviews
  FOR SELECT TO anon USING (true);

-- FAQs: публичное чтение
DROP POLICY IF EXISTS "anon can read faqs" ON faqs;
CREATE POLICY "anon can read faqs" ON faqs
  FOR SELECT TO anon USING (true);

-- Collections: публичное чтение активных
DROP POLICY IF EXISTS "anon can read active collections" ON collections;
CREATE POLICY "anon can read active collections" ON collections
  FOR SELECT TO anon USING (status = 'active');

-- Collection-Product mapping: публичное чтение
DROP POLICY IF EXISTS "anon can read collection_products" ON collection_products;
CREATE POLICY "anon can read collection_products" ON collection_products
  FOR SELECT TO anon USING (true);

-- Landings: публичное чтение активных
DROP POLICY IF EXISTS "anon can read active landings" ON landings;
CREATE POLICY "anon can read active landings" ON landings
  FOR SELECT TO anon USING (status = 'active');

-- Categories: публичное чтение активных
DROP POLICY IF EXISTS "anon can read active categories" ON categories;
CREATE POLICY "anon can read active categories" ON categories
  FOR SELECT TO anon USING (status = 'active');

-- Media: публичное чтение
DROP POLICY IF EXISTS "anon can read media" ON media;
CREATE POLICY "anon can read media" ON media
  FOR SELECT TO anon USING (true);

-- Orders: anon может создавать (чекаут) но не читать
DROP POLICY IF EXISTS "anon can insert orders" ON orders;
CREATE POLICY "anon can insert orders" ON orders
  FOR INSERT TO anon WITH CHECK (true);

-- Leads: anon может создавать но не читать
DROP POLICY IF EXISTS "anon can insert leads" ON leads;
CREATE POLICY "anon can insert leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

-- ============================================================================
-- 13. TRIGGER: auto-update updated_at (чисто технический, без бизнес-логики)
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS landings_updated_at ON landings;
CREATE TRIGGER landings_updated_at BEFORE UPDATE ON landings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS categories_updated_at ON categories;
CREATE TRIGGER categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
