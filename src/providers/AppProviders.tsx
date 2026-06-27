'use client'

import React from 'react'
import { CartProvider } from '@/store/CartContext'
import { AuthProvider } from '@/components/auth/AuthContext'
import { PhonePrompt } from '@/components/auth/PhonePrompt'

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
        <PhonePrompt />
      </CartProvider>
    </AuthProvider>
  )
}
