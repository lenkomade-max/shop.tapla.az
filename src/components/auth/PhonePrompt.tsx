'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthContext'
import { Phone } from 'lucide-react'

export function PhonePrompt() {
  const { isPhoneRequired, setPhone, signOut } = useAuth()
  const [phone, setPhoneInput] = useState('+994')
  const [loading, setLoading] = useState(false)

  if (!isPhoneRequired) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setLoading(true)
    await setPhone(phone)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white w-full max-w-md mx-4 p-8 shadow-xl">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 bg-neutral-100 flex items-center justify-center rounded-full">
            <Phone className="h-5 w-5 text-neutral-700" />
          </div>
        </div>

        <h2 className="text-center text-sm font-bold tracking-widest uppercase text-neutral-900 mb-2">
          Nömrənizi daxil edin
        </h2>
        <p className="text-center text-[10px] text-neutral-500 mb-6 leading-relaxed">
          Sifariş vermək üçün əlaqə nömrənizi qeyd etməlisiniz.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="tel"
            value={phone}
            onChange={e => setPhoneInput(e.target.value)}
            placeholder="+994 55 123 45 67"
            required
            className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900 text-center"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Yadda saxlanılır...' : 'Yadda saxla'}
          </button>
        </form>

        <button
          onClick={signOut}
          className="w-full text-center text-[9px] text-neutral-400 hover:text-neutral-900 mt-4 cursor-pointer underline"
        >
          Geri qayıt
        </button>
      </div>
    </div>
  )
}
