'use client'

import type { SectionConfig, ThemeConfig } from '@/types'
import {
  HeroSection,
  BenefitsSection,
  IngredientsSection,
  HowToUseSection,
  BeforeAfterSection,
  TestimonialsSection,
  FaqSection,
  OfferSection,
  CheckoutSection,
} from './sections'
import type { LandingData } from '@/lib/supabase/queries'

interface LandingRendererProps {
  landing: LandingData
  theme: ThemeConfig
}

export function LandingRenderer({ landing, theme }: LandingRendererProps) {
  const sections = landing.sections as SectionConfig[]

  return (
    <main>
      {sections.map((section, i) => {
        const props = section.props || {}

        switch (section.name) {
          case 'hero':
            return (
              <HeroSection
                key={i}
                title={landing.title}
                subtitle={landing.subtitle ?? undefined}
                description={props.description as string}
                image={props.image as string}
                theme={theme}
                ctaText={props.ctaText as string}
              />
            )
          case 'benefits':
            return (
              <BenefitsSection
                key={i}
                title={section.title}
                benefits={props.benefits as { title: string; description: string }[]}
                theme={theme}
              />
            )
          case 'ingredients':
            return (
              <IngredientsSection
                key={i}
                title={section.title}
                ingredients={props.ingredients as { name: string; description: string }[]}
                theme={theme}
              />
            )
          case 'howToUse':
            return (
              <HowToUseSection
                key={i}
                title={section.title}
                steps={props.steps as { title: string; description: string }[]}
                theme={theme}
              />
            )
          case 'beforeAfter':
            return (
              <BeforeAfterSection
                key={i}
                title={section.title}
                items={props.items as { before: string; after: string; label?: string }[]}
                theme={theme}
              />
            )
          case 'testimonials':
            return (
              <TestimonialsSection
                key={i}
                title={section.title}
                testimonials={props.testimonials as { name: string; text: string; rating?: number }[]}
                theme={theme}
              />
            )
          case 'faq':
            return (
              <FaqSection
                key={i}
                title={section.title}
                items={props.items as { question: string; answer: string }[]}
                theme={theme}
              />
            )
          case 'offer':
            return (
              <OfferSection
                key={i}
                title={section.title}
                subtitle={section.subtitle}
                price={props.price as string}
                oldPrice={props.oldPrice as string}
                features={props.features as string[]}
                theme={theme}
              />
            )
          case 'checkout':
            return (
              <CheckoutSection
                key={i}
                title={section.title}
                submitLabel={props.submitLabel as string}
                theme={theme}
              />
            )
          default:
            return null
        }
      })}
    </main>
  )
}
