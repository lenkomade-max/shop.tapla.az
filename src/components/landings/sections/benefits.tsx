'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'
import type { ThemeConfig } from '@/types'

interface Benefit {
  title: string
  description: string
}

interface BenefitsProps {
  title?: string
  benefits: Benefit[]
  theme: ThemeConfig
}

export function BenefitsSection({ title, benefits, theme }: BenefitsProps) {
  return (
    <section className="py-20 md:py-28"
      style={{ backgroundColor: theme.colors.secondary, color: theme.colors.foreground }}
    >
      <div className="container mx-auto px-4 md:px-8">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {title}
          </motion.h2>
        )}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {benefits.map((benefit, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className={cn('p-6 rounded-xl border')}
              style={{
                backgroundColor: theme.colors.card,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius,
              }}
            >
              <CheckCircle className="w-6 h-6 mb-4" style={{ color: theme.colors.primary }} />
              <h3 className="text-xl font-semibold mb-2"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {benefit.title}
              </h3>
              <p className="opacity-80 leading-relaxed text-sm"
                style={{ color: theme.colors.mutedForeground }}
              >
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
