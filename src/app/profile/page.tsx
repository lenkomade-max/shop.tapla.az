'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Package, Phone, Mail, LogOut, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/components/auth/AuthContext'
import { Container } from '@/components/ui/Container'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 bg-[#FAF9F6]">
        <Container>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-neutral-200 rounded" />
            <div className="h-64 bg-neutral-100 rounded" />
          </div>
        </Container>
      </div>
    )
  }

  if (!user || !profile) return null

  return (
    <div className="pt-32 pb-20 bg-[#FAF9F6] min-h-screen">
      <Container>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-[10px] tracking-widest text-neutral-400 hover:text-neutral-900 uppercase font-bold mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>GERİ QAYIT</span>
        </Link>

        <h1 className="text-xl font-bold tracking-widest uppercase text-neutral-900 mb-10">
          Mənim Profilim
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white border border-neutral-100 p-6 space-y-5">
              <div className="flex items-center space-x-4">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-neutral-200 flex items-center justify-center">
                    <User className="h-5 w-5 text-neutral-500" />
                  </div>
                )}
                <div>
                  <h2 className="text-sm font-bold text-neutral-900">
                    {[profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'İstifadəçi'}
                  </h2>
                  <p className="text-[10px] text-neutral-500">{profile.email || 'Email yoxdur'}</p>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-4 space-y-3">
                <div className="flex items-center space-x-3 text-xs text-neutral-600">
                  <Phone className="h-3.5 w-3.5 text-neutral-400" />
                  <span>{profile.phone || 'Nömrə yoxdur'}</span>
                </div>
                {profile.email && (
                  <div className="flex items-center space-x-3 text-xs text-neutral-600">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>

              <button
                onClick={signOut}
                className="w-full flex items-center justify-center space-x-2 border border-red-200 py-3 text-[10px] font-bold tracking-widest uppercase text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Çıxış</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white border border-neutral-100 p-6">
              <div className="flex items-center space-x-2 border-b border-neutral-100 pb-3 mb-5">
                <Package className="h-4 w-4 text-neutral-800" />
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-900">Mənim Sifarişlərim</h2>
              </div>
              <p className="text-xs text-neutral-400 text-center py-12">
                Hələ ki, sifarişiniz yoxdur.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
