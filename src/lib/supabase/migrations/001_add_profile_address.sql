-- ============================================================================
-- Migration 001: add city/address to profiles, add payment_method/email to orders
-- ============================================================================
-- Применить через Supabase SQL Editor.
-- Код автоматически заполняет city/address в profiles при оформлении заказа.
-- ============================================================================

-- 1. Profiles: добавляем поля для сохранения адреса доставки
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS address TEXT;

COMMENT ON COLUMN profiles.city IS 'Город из последнего заказа (автозаполнение)';
COMMENT ON COLUMN profiles.address IS 'Полный адрес из последнего заказа (автозаполнение)';

-- 2. Orders: добавляем payment_method и email (уже используются в коде, но отсутствуют в DDL)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT;

COMMENT ON COLUMN orders.payment_method IS 'Способ оплаты: cash_delivery, card_delivery, online_card';
COMMENT ON COLUMN orders.email IS 'Email заказчика';
