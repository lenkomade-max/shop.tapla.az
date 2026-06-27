-- Fix: product_id should be nullable — an order can contain multiple products
-- Run this in Supabase SQL Editor

ALTER TABLE public.orders ALTER COLUMN product_id DROP NOT NULL;
