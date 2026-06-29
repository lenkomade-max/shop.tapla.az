'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Product, Shade } from '@/types'
import { useAuth } from '@/components/auth/AuthContext'

export interface CartItem {
  product: Product
  selectedShade?: Shade
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, shade?: Shade, quantity?: number) => void
  addToCartSilent: (product: Product, shade?: Shade, quantity?: number) => void
  removeFromCart: (productId: string, shadeName?: string) => void
  updateQuantity: (productId: string, quantity: number, shadeName?: string) => void
  clearCart: () => void
  cartCount: number
  cartTotal: number
  isCartOpen: boolean
  setIsCartOpen: (isOpen: boolean) => void
  isSyncing: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tapla_cart')
      if (stored) {
        try { return JSON.parse(stored) }
        catch { /* ignore */ }
      }
    }
    return []
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [hasSynced, setHasSynced] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('tapla_cart', JSON.stringify(cartItems))
    }
  }, [cartItems, isMounted])

  useEffect(() => {
    if (!user || hasSynced || typeof window === 'undefined') return
    const syncFromLocal = async () => {
      const stored = localStorage.getItem('tapla_cart')
      if (!stored) return
      const localItems: CartItem[] = JSON.parse(stored)
      if (localItems.length === 0) return

      setIsSyncing(true)
      const { syncCartFromLocal, getUserCart } = await import('@/lib/supabase/queries')
      const result = await syncCartFromLocal(user.id, localItems)
      if (result.synced > 0) {
        const serverCart = await getUserCart(user.id)
        if (serverCart && serverCart.length > 0) setCartItems(serverCart)
        localStorage.removeItem('tapla_cart')
      }
      setIsSyncing(false)
      setHasSynced(true)
    }
    syncFromLocal()
  }, [user?.id, hasSynced])

  const addToCart = (product: Product, shade?: Shade, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!shade || item.selectedShade?.name === shade.name)
      )
      if (existingIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingIndex].quantity += quantity
        return newItems
      }
      return [...prevItems, { product, selectedShade: shade, quantity }]
    })
    setIsCartOpen(true)
  }

  const addToCartSilent = (product: Product, shade?: Shade, quantity: number = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          (!shade || item.selectedShade?.name === shade.name)
      )
      if (existingIndex > -1) {
        const newItems = [...prevItems]
        newItems[existingIndex].quantity += quantity
        return newItems
      }
      return [...prevItems, { product, selectedShade: shade, quantity }]
    })
  }

  const removeFromCart = (productId: string, shadeName?: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === productId && (!shadeName || item.selectedShade?.name === shadeName))
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, shadeName?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, shadeName)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && (!shadeName || item.selectedShade?.name === shadeName)
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('tapla_cart')
  }

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        addToCartSilent,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
