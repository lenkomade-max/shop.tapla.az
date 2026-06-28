import React from 'react';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { AdminHeroClient } from './hero-client';

export const dynamic = 'force-dynamic';

interface HeroSlide {
  id: string;
  sort_order: number;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  image_mobile: string;
  action_text: string;
  href: string;
  overlay: boolean;
  is_active: boolean;
}

async function getSlides(): Promise<HeroSlide[]> {
  try {
    const { data } = await supabaseAdmin
      .from('hero_slides')
      .select('*')
      .order('sort_order', { ascending: true });
    if (data) return data as HeroSlide[];
  } catch (err) {
    console.error('Failed to fetch hero slides:', err);
  }
  return [];
}

async function getProducts(): Promise<Array<{ id: string; name: string; slug: string }>> {
  try {
    const { data } = await supabaseAdmin
      .from('products')
      .select('id, name, slug')
      .eq('status', 'active')
      .order('name', { ascending: true });
    if (data) return data as Array<{ id: string; name: string; slug: string }>;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  }
  return [];
}

export default async function AdminHeroPage() {
  const [slides, products] = await Promise.all([getSlides(), getProducts()]);
  return <AdminHeroClient slides={slides} products={products} />;
}
