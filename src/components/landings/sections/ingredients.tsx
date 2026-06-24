'use client'

import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/types'

interface Ingredient {
  name: string
  description: string
  icon?: string
}

interface IngredientsProps {
  title?: string
  ingredients: Ingredient[]
  theme: ThemeConfig
}

export function IngredientsSection({ title, ingredients, theme }: IngredientsProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ingredients.map((ingredient, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className={cn('p-6 border')}
              style={{
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius,
              }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: theme.colors.secondary }}
              >
                <span className="text-lg font-bold" style={{ color: theme.colors.primary }}>
                  {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-semibold mb-2"
                style={{ fontFamily: theme.fonts.heading }}
              >
                {ingredient.name}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: theme.colors.mutedForeground }}>
                {ingredient.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
