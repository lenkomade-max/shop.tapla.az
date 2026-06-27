-- Create payment_transactions table for Pasha Bank payment tracking.
-- Run this in Supabase SQL Editor for the shared database (nzkqorbyexisnbyjhvdf.supabase.co).

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('pasha-bank')),
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('vip', 'premium', 'boost', 'posting_package', 'shop_order')),
  amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
  currency TEXT NOT NULL DEFAULT '944',
  status TEXT NOT NULL DEFAULT 'created' CHECK (
    status IN ('created', 'redirected', 'authorized', 'completed', 'failed', 'declined', 'cancelled')
  ),
  provider_trans_id TEXT UNIQUE,
  provider_result_code TEXT,
  result_code TEXT,
  provider_approval_code TEXT,
  rrn TEXT,
  idempotency_key TEXT UNIQUE NOT NULL,
  request_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  effects_state TEXT NOT NULL DEFAULT 'pending' CHECK (effects_state IN ('pending', 'processing', 'applied', 'failed')),
  effects_claimed_at TIMESTAMPTZ,
  effects_applied_at TIMESTAMPTZ,
  effects_error TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_tx_provider_status
  ON public.payment_transactions(provider, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_tx_effects_state
  ON public.payment_transactions(effects_state, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_payment_tx_provider_trans_id
  ON public.payment_transactions(provider_trans_id);

-- RLS: only allow service_role access (server-to-server)
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
