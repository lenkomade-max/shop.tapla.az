-- Extend orders.status to support payment flow.
-- Run this in Supabase SQL Editor for the shared database (nzkqorbyexisnbyjhvdf.supabase.co).

-- Drop existing constraint and recreate with new values
ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'cancelled', 'paid', 'payment_failed'));
