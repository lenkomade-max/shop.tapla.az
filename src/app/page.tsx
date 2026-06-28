import React from 'react';
import { dbService } from '@/services/db';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { Hero } from '@/components/sections/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { FeaturesStep } from '@/components/sections/FeaturesStep';
import { PromoBanners } from '@/components/sections/PromoBanners';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { FAQ } from '@/components/sections/FAQ';
import { ValueProps } from '@/components/sections/ValueProps';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Concurrent server-side fetch calls
  const [products, reviews, faqs, steps, benefits, heroSlides] = await Promise.all([
    dbService.getProducts(),
    dbService.getReviews(),
    dbService.getFAQs(),
    dbService.getRitualSteps(),
    dbService.getBenefits(),
    supabaseAdmin
      .from('hero_slides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) =>
        ((data || []) as Record<string, unknown>[]).map(s => ({
          id: s.id as number,
          tag: (s.tag as string) || '',
          title: (s.title as string) || '',
          subtitle: (s.subtitle as string) || '',
          description: (s.description as string) || '',
          image: (s.image as string) || '',
          actionText: (s.action_text as string) || 'MƏHSULLARI GÖR',
          href: (s.href as string) || '/#products',
          overlay: s.overlay !== false,
        }))
      ),
  ]);

  return (
    <div className="overflow-hidden bg-white">
      {/* 1. Immersive Editorial Slide Show Hero */}
      <Hero slides={heroSlides} />

      {/* 2. Primary Products Grid with Quick View modal */}
      <ProductGrid products={products} />

      {/* 3. Core Value Props & Diagnostic Quiz Row */}
      <ValueProps />

      {/* 4. Steps Evening Ritual Showcase ("ALUNA İLƏ AXŞAM RİTUALI") */}
      <FeaturesStep steps={steps} />

      {/* 5. Multi-Column Spotlight Editorial Banners */}
      <PromoBanners />

      {/* 6. Brand Quality Benefits Panel */}
      <Benefits benefits={benefits} />

      {/* 7. Ratings snapshot & verified reviews with write-a-review form */}
      <ReviewsSection initialReviews={reviews} />

      {/* 8. Localized FAQ Accordion with keyword search */}
      <FAQ faqs={faqs} />
    </div>
  );
}
