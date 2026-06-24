'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Phone, User, MapPin, Building2 } from 'lucide-react'
import type { ThemeConfig } from '@/types'

interface CheckoutProps {
  title?: string
  submitLabel?: string
  theme: ThemeConfig
}

export function CheckoutSection({ title, submitLabel = 'Sifarişi təsdiq et', theme }: CheckoutProps) {
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: send to Supabase
    console.log('Order:', form)
  }

  return (
    <section className="py-20 md:py-28"
      style={{ backgroundColor: theme.colors.secondary, color: theme.colors.foreground }}
    >
      <div className="container mx-auto px-4 md:px-8 max-w-lg">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-center mb-12"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {title}
          </motion.h2>
        )}
        <motion.form
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className={cn('p-8 rounded-xl border space-y-5')}
          style={{
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
            borderRadius: theme.borderRadius,
          }}
        >
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.mutedForeground }} />
            <input
              type="text"
              placeholder="Adınız"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border text-sm outline-none transition-colors"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.mutedForeground }} />
            <input
              type="tel"
              placeholder="Telefon nömrəniz"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border text-sm outline-none"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.mutedForeground }} />
            <input
              type="text"
              placeholder="Şəhər"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border text-sm outline-none"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            />
          </div>
          <div className="relative">
            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: theme.colors.mutedForeground }} />
            <input
              type="text"
              placeholder="Ünvan"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full pl-12 pr-4 py-3.5 rounded-lg border text-sm outline-none"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.foreground,
              }}
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full text-base py-6 h-auto font-semibold"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#fff',
              borderRadius: theme.borderRadius,
            }}
          >
            {submitLabel}
          </Button>
        </motion.form>
      </div>
    </section>
  )
}
