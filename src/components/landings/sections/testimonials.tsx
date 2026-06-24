'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import type { ThemeConfig } from '@/types'

interface Testimonial {
  name: string
  text: string
  rating?: number
  avatar?: string
}

interface TestimonialsProps {
  title?: string
  testimonials: Testimonial[]
  theme: ThemeConfig
}

export function TestimonialsSection({ title, testimonials, theme }: TestimonialsProps) {
  return (
    <section className="py-20 md:py-28"
      style={{ backgroundColor: theme.colors.background, color: theme.colors.foreground }}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t, i) => (
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
              {t.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: theme.colors.primary }} />
                  ))}
                </div>
              )}
              <p className="text-sm leading-relaxed mb-4 italic opacity-85">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                {t.avatar ? (
                  <img src={t.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                    style={{ backgroundColor: theme.colors.secondary, color: theme.colors.primary }}
                  >
                    {t.name.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium">{t.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
