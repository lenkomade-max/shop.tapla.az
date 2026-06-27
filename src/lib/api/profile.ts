/**
 * Profile API (client-safe) — работает в браузере через anon key + RLS.
 * Используется из AuthContext.tsx.
 *
 * Серверная версия (через service_role): lib/api/profile-server.ts
 */

import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PHONE_PREFIX = '+994'

/** Форматировать телефон: +994 + цифры (мин 7), макс 13 символов */
export function formatPhone(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined
  const cleaned = phone.replace(/\s|-|\(|\)/g, '')
  if (!cleaned.startsWith(PHONE_PREFIX)) {
    if (cleaned.startsWith('994')) return `+${cleaned}`
    return undefined
  }
  const digits = cleaned.slice(PHONE_PREFIX.length).replace(/\D/g, '')
  if (digits.length < 7) return undefined
  return PHONE_PREFIX + digits.slice(0, 9)
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ProfileInput {
  authUserId: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  phone?: string | null
}

// ---------------------------------------------------------------------------
// ensureProfile (клиент — через anon key, RLS защищает)
// ---------------------------------------------------------------------------

/** Создать или обновить профиль после signUp/signIn */
export async function ensureProfile(input: ProfileInput): Promise<Profile | null> {
  const supabase = createClient()
  const phone = formatPhone(input.phone)

  // Проверить существующий
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('auth_user_id', input.authUserId)
    .maybeSingle()

  if (existing) {
    const updates: Record<string, unknown> = {}
    if (input.email && !existing.email) updates.email = input.email
    if (input.firstName && !existing.first_name) updates.first_name = input.firstName
    if (input.lastName && !existing.last_name) updates.last_name = input.lastName
    if (input.avatarUrl && !existing.avatar_url) updates.avatar_url = input.avatarUrl
    if (phone && !existing.phone) updates.phone = phone

    if (Object.keys(updates).length > 0) {
      const { data: updated } = await supabase
        .from('profiles')
        .update(updates)
        .eq('auth_user_id', input.authUserId)
        .select()
        .single()
      return (updated as Profile) ?? (existing as Profile)
    }
    return existing as Profile
  }

  // Создать
  const { data: created, error } = await supabase
    .from('profiles')
    .insert({
      auth_user_id: input.authUserId,
      email: input.email ?? undefined,
      first_name: input.firstName ?? undefined,
      last_name: input.lastName ?? undefined,
      avatar_url: input.avatarUrl ?? undefined,
      phone: phone ?? undefined,
      is_guest: false,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      const { data: retry } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', input.authUserId)
        .maybeSingle()
      return (retry as Profile) ?? null
    }
    console.error('[ensureProfile] insert error:', error)
    return null
  }

  return created as Profile
}

// ---------------------------------------------------------------------------
// updatePhone
// ---------------------------------------------------------------------------

export async function updatePhone(authUserId: string, phone: string): Promise<boolean> {
  const formatted = formatPhone(phone)
  if (!formatted) return false

  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ phone: formatted })
    .eq('auth_user_id', authUserId)

  return !error
}
