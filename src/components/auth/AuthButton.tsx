'use client'

import React from 'react'
import Link from 'next/link'
import { User } from 'lucide-react'
import { useAuth } from './AuthContext'

export function AuthButton() {
  const { user, profile, isLoading, openLogin } = useAuth()

  if (isLoading) return <div className="h-8 w-8 rounded-full bg-neutral-100 animate-pulse" />

  if (!user) {
    return (
      <button
        onClick={() => openLogin()}
        className="flex items-center space-x-1.5 text-[9px] font-bold tracking-widest uppercase text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
      >
        <User className="h-4 w-4" />
        <span>Daxil ol</span>
      </button>
    )
  }

  const initials = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .map(n => n?.[0])
    .join('')
    .toUpperCase()

  return (
    <Link
      href="/profile"
      className="flex items-center space-x-2 text-[9px] font-bold tracking-widest uppercase text-neutral-600 hover:text-neutral-900 transition-colors"
    >
      {profile?.avatar_url ? (
        <img src={profile.avatar_url} alt="" className="h-6 w-6 rounded-full object-cover" />
      ) : initials ? (
        <span className="h-6 w-6 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[8px] font-bold">
          {initials}
        </span>
      ) : (
        <User className="h-4 w-4" />
      )}
      <span>{profile?.first_name || 'Profil'}</span>
    </Link>
  )
}
