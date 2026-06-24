'use client'

import { motion } from 'framer-motion'
import { fadeIn, staggerContainer } from '@/lib/animations'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/types'

interface BeforeAfterItem {
  before: string
  after: string
  label?: string
}

interface BeforeAfterProps {
  title?: string
  items: BeforeAfterItem[]
  theme: ThemeConfig
}

export function BeforeAfterSection({ title, items, theme }: BeforeAfterProps) {
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
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeIn}
              className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden"
              style={{ borderRadius: theme.borderRadius }}
            >
              <div className="relative">
                <img src={item.before} alt="Before" className="w-full h-64 object-cover" />
                <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-black/50 text-white">
                  Before
                </span>
              </div>
              <div className="relative">
                <img src={item.after} alt="After" className="w-full h-64 object-cover" />
                <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-black/50 text-white">
                  After
                </span>
              </div>
              {item.label && (
                <p className="col-span-2 text-center text-sm mt-2 font-medium opacity-70">{item.label}</p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
