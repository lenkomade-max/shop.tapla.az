-- ============================================================================
-- 005_tovar_ai_product_mode — supplier_url + product mode для Tovar.AI
-- ============================================================================

-- 1. Добавить supplier_url в products
ALTER TABLE products ADD COLUMN IF NOT EXISTS supplier_url TEXT;

-- 2. Добавить mode и supplier_url в tovar_ai_generations
ALTER TABLE tovar_ai_generations ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'test'
  CHECK (mode IN ('test', 'product'));
ALTER TABLE tovar_ai_generations ADD COLUMN IF NOT EXISTS supplier_url TEXT;
ALTER TABLE tovar_ai_generations ADD COLUMN IF NOT EXISTS product_data JSONB;
ALTER TABLE tovar_ai_generations ADD COLUMN IF NOT EXISTS ready_for_publish BOOLEAN DEFAULT false;
ALTER TABLE tovar_ai_generations ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;

-- 3. Индекс для поиска генераций по product_id + mode
CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_mode ON tovar_ai_generations(mode);
