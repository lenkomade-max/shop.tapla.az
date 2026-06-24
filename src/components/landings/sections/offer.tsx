'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { ThemeConfig } from '@/types'

interface OfferProps {
  title?: string
  subtitle?: string
  price: string
  oldPrice?: string
  features: string[]
  ctaText?: string
  theme: ThemeConfig
}

export function OfferSection({ title, subtitle, price, oldPrice, features, ctaText = 'İndi sifariş et', theme }: OfferProps) {
  return (
    <section className="py-20 md:py-28"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.foreground }}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-lg mx-auto">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={cn('p-8 md:p-10 text-center border-2 rounded-2xl')}
            style={{
              borderColor: theme.colors.primary,
              backgroundColor: theme.colors.card,
              borderRadius: `calc(${theme.borderRadius} * 1.5)`,
            }}
          >
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold mb-2"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm opacity-70 mb-6">{subtitle}</p>
            )}
            <div className="flex items-baseline justify-center gap-3 mb-6">
              <span className="text-4xl md:text-5xl font-bold" style={{ color: theme.colors.primary }}>
                {price}
              </span>
              {oldPrice && (
                <span className="text-xl line-through opacity-40">{oldPrice}</span>
              )}
            </div>
            <ul className="space-y-3 mb-8 text-left">
              {features.map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 flex-shrink-0" style={{ color: theme.colors.primary }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            <Button
              size="lg"
              className="w-full text-base py-6 h-auto font-semibold"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#fff',
                borderRadius: theme.borderRadius,
              }}
            >
              {ctaText}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
