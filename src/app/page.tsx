import React from 'react';
import { dbService } from '@/services/db';
import { Hero } from '@/components/sections/Hero';
import { Benefits } from '@/components/sections/Benefits';
import { FeaturesStep } from '@/components/sections/FeaturesStep';
import { PromoBanners } from '@/components/sections/PromoBanners';
import { ProductGrid } from '@/components/sections/ProductGrid';
import { ReviewsSection } from '@/components/sections/ReviewsSection';
import { FAQ } from '@/components/sections/FAQ';
import { ValueProps } from '@/components/sections/ValueProps';

export const revalidate = 3600; // Cache data for 1 hour

export default async function Home() {
  // Concurrent server-side fetch calls (Highly performant, clean architecture)
  const [products, reviews, faqs, steps, benefits] = await Promise.all([
    dbService.getProducts(),
    dbService.getReviews(),
    dbService.getFAQs(),
    dbService.getRitualSteps(),
    dbService.getBenefits(),
  ]);

  return (
    <div className="overflow-hidden bg-white">
      {/* 1. Immersive Editorial Slide Show Hero */}
      <Hero />

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
