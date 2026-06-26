-- ALUNA — reviews, faqs, Aluna-колонки в products
-- Run this in Supabase SQL Editor after creating the project

-- ============================================================
-- 1. reviews — отзывы для Aluna ReviewsSection
-- ============================================================
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

-- ============================================================
-- 2. faqs — вопросы/ответы для Aluna FAQ accordion
-- ============================================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category);

-- ============================================================
-- 3. Aluna-колонки в products (дополнение к v1-схеме)
-- ============================================================
ALTER TABLE products ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL(3,1) DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0;
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS benefits JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS how_to_use TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS shades JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS try_on_enabled BOOLEAN DEFAULT false;

-- Для существующих строк: name = title (обратная совместимость)
UPDATE products SET name = title WHERE name IS NULL;
