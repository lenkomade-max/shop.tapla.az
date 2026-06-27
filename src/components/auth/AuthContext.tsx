'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { createClient, resetClient } from '@/lib/supabase/client'
import { ensureProfile, updatePhone, formatPhone } from '@/lib/api/profile'
import type { Profile } from '@/lib/supabase/types'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { AuthModal } from './AuthModal'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthenticated: boolean
  isPhoneRequired: boolean
  openLogin: (returnTo?: string) => void
  requireAuth: (returnTo?: string) => boolean
  signOut: () => Promise<void>
  setPhone: (phone: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [returnTo, setReturnTo] = useState<string | undefined>()
  const [isAuthRedirecting, setIsAuthRedirecting] = useState(false)
  const syncingRef = useRef(false) // защита от дублирования syncProfile

  useEffect(() => {
    const supabase = createClient()

    const syncProfile = async (userId: string) => {
      if (syncingRef.current) return // уже синхронизируемся
      syncingRef.current = true

      try {
        const { data: userData } = await supabase.auth.getUser()
        const meta = userData?.user?.user_metadata ?? {}

        const p = await ensureProfile({
          authUserId: userId,
          email: userData?.user?.email,
          firstName: (meta.first_name ?? meta.given_name) as string | undefined,
          lastName: (meta.last_name ?? meta.family_name) as string | undefined,
          avatarUrl: (meta.avatar_url ?? meta.picture) as string | undefined,
          phone: meta.phone as string | undefined,
        })

        if (p) setProfile(p)
      } catch (err) {
        console.error('[syncProfile] error:', err)
      } finally {
        syncingRef.current = false
      }
    }

    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await syncProfile(session.user.id)
      }
      setIsLoading(false)
    }
    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
      if (event === 'SIGNED_IN' && session?.user) {
        syncProfile(session.user.id)
      }
      if (event === 'SIGNED_OUT') {
        setProfile(null)
      }
    })

    return () => subscription?.unsubscribe()
  }, [])

  const isAuthenticated = !!user

  // Не показывать PhonePrompt пока идёт загрузка или синхронизация
  const isPhoneRequired = !isLoading && !syncingRef.current && !!user && !!profile && !profile.phone

  const openLogin = useCallback((redirectTo?: string) => {
    setReturnTo(redirectTo)
    setIsModalOpen(true)
  }, [])

  const requireAuth = useCallback((redirectTo?: string): boolean => {
    if (isAuthenticated) {
      if (redirectTo) window.location.href = redirectTo
      return true
    }
    openLogin(redirectTo)
    return false
  }, [isAuthenticated, openLogin])

  const handleGoogleSignIn = async () => {
    setIsAuthRedirecting(true)
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))

    const supabase = createClient()
    const baseUrl = `${window.location.origin}/auth/callback`
    const redirectUrl = returnTo
      ? `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}`
      : baseUrl

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectUrl },
    })
  }

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    resetClient()
    setUser(null)
    setProfile(null)
    window.location.href = '/'
  }

  const setPhone = async (phone: string) => {
    if (!user) return
    const ok = await updatePhone(user.id, phone)
    if (ok) {
      // Сохраняем форматированный номер в стейт (как в БД)
      const formatted = formatPhone(phone) ?? phone
      setProfile(prev => prev ? { ...prev, phone: formatted } : null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      isLoading,
      isAuthenticated,
      isPhoneRequired,
      openLogin,
      requireAuth,
      signOut,
      setPhone,
    }}>
      {children}
      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => { if (!isAuthRedirecting) setIsModalOpen(false) }}
          onGoogleSignIn={handleGoogleSignIn}
          isLoading={isAuthRedirecting}
        />
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
