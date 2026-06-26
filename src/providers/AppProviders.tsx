'use client';

import React from 'react';
import { CartProvider } from '@/store/CartContext';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
