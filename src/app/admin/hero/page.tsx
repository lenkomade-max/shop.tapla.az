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

export default async function AdminHeroPage() {
  const slides = await getSlides();
  return <AdminHeroClient slides={slides} />;
}
