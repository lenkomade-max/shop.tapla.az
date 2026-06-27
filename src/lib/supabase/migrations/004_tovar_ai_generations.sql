-- ============================================================================
-- 004_tovar_ai_generations — хранение результатов генерации карточек
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_product ON tovar_ai_generations(product_id);
CREATE INDEX IF NOT EXISTS idx_tovar_ai_gen_status ON tovar_ai_generations(status);

-- Триггер для updated_at
DROP TRIGGER IF EXISTS tovar_ai_gen_updated_at ON tovar_ai_generations;
CREATE TRIGGER tovar_ai_gen_updated_at BEFORE UPDATE ON tovar_ai_generations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
