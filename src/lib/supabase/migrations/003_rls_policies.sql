-- RLS policies for public read access
-- Run this in Supabase SQL Editor after migrations 001 and 002

-- Products: anon can read active products
DROP POLICY IF EXISTS "anon can read active products" ON products;
CREATE POLICY "anon can read active products" ON products
  FOR SELECT TO anon
  USING (status = 'active');

-- Reviews: anon can read all reviews
DROP POLICY IF EXISTS "anon can read reviews" ON reviews;
CREATE POLICY "anon can read reviews" ON reviews
  FOR SELECT TO anon
  USING (true);

-- FAQs: anon can read all FAQs
DROP POLICY IF EXISTS "anon can read faqs" ON faqs;
CREATE POLICY "anon can read faqs" ON faqs
  FOR SELECT TO anon
  USING (true);

-- Collections: anon can read active collections
DROP POLICY IF EXISTS "anon can read active collections" ON collections;
CREATE POLICY "anon can read active collections" ON collections
  FOR SELECT TO anon
  USING (status = 'active');

-- Collection-Product mapping: anon can read all
DROP POLICY IF EXISTS "anon can read collection_products" ON collection_products;
CREATE POLICY "anon can read collection_products" ON collection_products
  FOR SELECT TO anon
  USING (true);

-- Landings: anon can read active landings
DROP POLICY IF EXISTS "anon can read active landings" ON landings;
CREATE POLICY "anon can read active landings" ON landings
  FOR SELECT TO anon
  USING (status = 'active');

-- Media: anon can read all media
DROP POLICY IF EXISTS "anon can read media" ON media;
CREATE POLICY "anon can read media" ON media
  FOR SELECT TO anon
  USING (true);

-- Orders: anon can INSERT orders (checkout) but not read
DROP POLICY IF EXISTS "anon can insert orders" ON orders;
CREATE POLICY "anon can insert orders" ON orders
  FOR INSERT TO anon
  WITH CHECK (true);

-- Leads: anon can INSERT leads but not read
DROP POLICY IF EXISTS "anon can insert leads" ON leads;
CREATE POLICY "anon can insert leads" ON leads
  FOR INSERT TO anon
  WITH CHECK (true);
