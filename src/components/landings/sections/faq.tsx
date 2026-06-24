'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'
import type { ThemeConfig } from '@/types'

interface FaqItem {
  question: string
  answer: string
}

interface FaqProps {
  title?: string
  items: FaqItem[]
  theme: ThemeConfig
}

export function FaqSection({ title, items, theme }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-20 md:py-28"
      style={{ backgroundColor: theme.colors.secondary, color: theme.colors.foreground }}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
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
        <div className="space-y-3">
          {items.map((item, i) => (
            <div
              key={i}
              className={cn('border rounded-xl overflow-hidden')}
              style={{
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                borderRadius: theme.borderRadius,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left font-medium"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={cn('w-5 h-5 transition-transform duration-300', openIndex === i && 'rotate-180')}
                  style={{ color: theme.colors.primary }}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed opacity-80"
                      style={{ color: theme.colors.mutedForeground }}
                    >
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
