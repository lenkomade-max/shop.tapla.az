'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/types'

interface HeroProps {
  title: string
  subtitle?: string
  description?: string
  image?: string
  theme: ThemeConfig
  ctaText?: string
  ctaLink?: string
}

export function HeroSection({ title, subtitle, description, image, theme, ctaText = 'Sifariş et', ctaLink = '#offer' }: HeroProps) {
  return (
    <section className={cn('relative min-h-[90vh] flex items-center overflow-hidden')}
      style={{ backgroundColor: theme.colors.background, color: theme.colors.foreground }}
    >
      {image && (
        <div className="absolute inset-0 z-0">
          <img src={image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>
      )}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 container mx-auto px-4 md:px-8"
      >
        <div className={cn('max-w-2xl', image ? 'text-white' : '')}>
          {subtitle && (
            <motion.p
              variants={fadeIn}
              className="text-sm md:text-base uppercase tracking-widest mb-4 opacity-80"
              style={image ? {} : { color: theme.colors.primary }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.h1
            variants={fadeIn}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              variants={fadeIn}
              className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed max-w-xl"
            >
              {description}
            </motion.p>
          )}
          <motion.div variants={fadeIn}>
            <a href={ctaLink}>
              <Button
                size="lg"
                className="text-base px-8 py-6 h-auto rounded-xl"
                style={{
                  backgroundColor: theme.colors.primary,
                  color: '#fff',
                  borderRadius: theme.borderRadius,
                }}
              >
                {ctaText}
              </Button>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
