'use client'

import React, { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Извлечь человеко-читаемое сообщение из любого объекта ошибки Supabase */
function extractErrorMessage(err: unknown): string {
  if (!err) return 'Naməlum xəta baş verdi'
  if (typeof err === 'string') return err
  if (typeof err === 'object' && err !== null) {
    const e = err as Record<string, unknown>
    if (typeof e.message === 'string' && e.message.length > 0) return e.message
    // Supabase иногда возвращает ошибку без message, но с code/details
    if (typeof e.code === 'string') return `Xəta kodu: ${e.code}`
    try { return JSON.stringify(err) } catch { /* fallthrough */ }
  }
  return String(err)
}

/** Сопоставить техническое сообщение об ошибке с азербайджанским текстом */
function localizeAuthError(msg: string): string {
  const lower = msg.toLowerCase()
  if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) return 'Email və ya şifrə yanlışdır'
  if (lower.includes('user already registered') || lower.includes('user_already_exists')) return 'Bu email artıq qeydiyyatdan keçib'
  if (lower.includes('signup requires a valid password') || lower.includes('weak_password')) return 'Şifrə ən azı 6 simvol olmalıdır'
  if (lower.includes('email') && lower.includes('confirm')) return 'Email təsdiqlənməyib. Zəhmət olmasa emailinizi yoxlayın.'
  if (lower.includes('rate') || lower.includes('limit')) return 'Çox sayda cəhd. Bir az gözləyin və təkrar yoxlayın.'
  return msg
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const PHONE_PREFIX = '+994'
const PHONE_MIN_LENGTH = 12 // +994XXXXXXXXX (оператор + 7 цифр)

// ---------------------------------------------------------------------------
// AuthModal
// ---------------------------------------------------------------------------

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onGoogleSignIn: () => Promise<void>
  isLoading: boolean
}

export function AuthModal({ isOpen, onClose, onGoogleSignIn, isLoading }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-md mx-4 p-8 shadow-xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 cursor-pointer">
          <X className="h-4 w-4" />
        </button>

        <div className="flex space-x-0 mb-6 border-b border-neutral-200">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 pb-3 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
              tab === 'login' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400'
            }`}
          >
            Daxil ol
          </button>
          <button
            onClick={() => setTab('register')}
            className={`flex-1 pb-3 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer ${
              tab === 'register' ? 'text-neutral-900 border-b-2 border-neutral-900' : 'text-neutral-400'
            }`}
          >
            Qeydiyyat
          </button>
        </div>

        {tab === 'login' ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSuccess={onClose} />
        )}

        <div className="flex items-center my-5">
          <div className="flex-1 border-t border-neutral-200" />
          <span className="px-4 text-[9px] text-neutral-400 font-semibold tracking-widest uppercase">və ya</span>
          <div className="flex-1 border-t border-neutral-200" />
        </div>

        <button
          onClick={onGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center space-x-3 border border-neutral-300 py-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-neutral-400 border-t-transparent rounded-full" />
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Google ilə daxil ol</span>
            </>
          )}
        </button>

        <p className="mt-5 text-[9px] text-neutral-400 text-center leading-relaxed">
          Davam etməklə{" "}
          <a href="#" className="underline hover:text-neutral-900">İstifadə şərtləri</a>
          {" "}və{" "}
          <a href="#" className="underline hover:text-neutral-900">Məxfilik siyasətini</a>
          {" "}qəbul edirsiniz.
        </p>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LoginForm
// ---------------------------------------------------------------------------

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(localizeAuthError(extractErrorMessage(signInError)))
      } else {
        onSuccess()
      }
    } catch (err) {
      setError(localizeAuthError(extractErrorMessage(err)))
    } finally {
      setLoading(false)
    }
  }, [email, password, onSuccess])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Şifrə</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-neutral-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Yüklənir...' : 'Daxil ol'}
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------------
// RegisterForm
// ---------------------------------------------------------------------------

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('+994')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    // Разрешить только цифры после +994, сохраняя префикс
    if (val === '' || val === '+') {
      setPhone('+994')
      return
    }
    if (val.startsWith(PHONE_PREFIX)) {
      // Ограничить длину: +994 + макс 9 цифр = 13 символов
      const digits = val.slice(PHONE_PREFIX.length).replace(/\D/g, '')
      setPhone(PHONE_PREFIX + digits.slice(0, 9))
    }
    // Если пользователь стирает префикс — не даём, восстанавливаем
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const nameParts = name.trim().split(/\s+/)
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      // Валидация телефона: либо оставлен по умолчанию (пропускаем), либо полный номер
      const cleanPhone = phone.trim()
      const phoneToSend = cleanPhone.length >= PHONE_MIN_LENGTH ? cleanPhone : undefined

      const supabase = createClient()

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            ...(phoneToSend ? { phone: phoneToSend } : {}),
          },
        },
      })

      if (signUpError) {
        setError(localizeAuthError(extractErrorMessage(signUpError)))
        setLoading(false)
        return
      }

      // После signUp проверяем — если email confirmation включён,
      // getSession() вернёт null и нужна дополнительная обработка
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // Пробуем сразу залогиниться (на случай если confirmations выключены)
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
          setError('Email təsdiqlənməyib. Zəhmət olmasa emailinizi yoxlayın.')
          setLoading(false)
          return
        }
      }

      onSuccess()
    } catch (err) {
      setError(localizeAuthError(extractErrorMessage(err)))
    } finally {
      setLoading(false)
    }
  }, [name, email, phone, password, onSuccess])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Ad, Soyad</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="Ad Soyad"
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Telefon</label>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="+994 55 123 45 67"
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      <div>
        <label className="text-[9px] font-bold tracking-widest text-neutral-500 uppercase block mb-1">Şifrə</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full border border-neutral-200 px-4 py-3 text-xs focus:outline-hidden focus:border-neutral-900"
        />
      </div>
      {error && <p className="text-[10px] text-red-500 font-semibold">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-neutral-950 text-white text-[10px] font-bold tracking-widest uppercase py-3.5 hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Yüklənir...' : 'Qeydiyyatdan keç'}
      </button>
    </form>
  )
}
