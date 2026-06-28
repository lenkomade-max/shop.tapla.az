-- ============================================================================
-- Stage 1.5: новые колонки для расширенных данных товара
-- ============================================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS ideal_for TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS use_cases JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS care_instructions TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS compatibility TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS faq JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_keywords JSONB DEFAULT '[]'::jsonb;
