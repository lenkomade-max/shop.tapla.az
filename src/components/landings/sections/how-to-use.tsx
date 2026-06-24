'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/types'

interface Step {
  title: string
  description: string
  icon?: string
}

interface HowToUseProps {
  title?: string
  steps: Step[]
  theme: ThemeConfig
}

export function HowToUseSection({ title, steps, theme }: HowToUseProps) {
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
        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block"
            style={{ backgroundColor: theme.colors.border }}
          />
          <div className="space-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative flex gap-8 items-start"
              >
                <div
                  className="w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center text-lg font-bold z-10"
                  style={{
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                  }}
                >
                  {i + 1}
                </div>
                <div className="pt-3">
                  <h3 className="text-xl font-semibold mb-2"
                    style={{ fontFamily: theme.fonts.heading }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: theme.colors.mutedForeground }}>
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
