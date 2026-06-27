/**
 * Profile API — единый слой для работы с профилями пользователей.
 *
 * Заменяет SQL триггер on_auth_user_created (бизнес-логика должна быть в коде, не в SQL).
 * Вызывается из:
 *   - AuthContext.tsx (клиент — после signUp/signInWithOAuth)
 *   - auth/callback/route.ts (сервер — после Google OAuth exchangeCodeForSession)
 */

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/supabase/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PHONE_PREFIX = '+994'
const PHONE_MIN_LENGTH = 12 // +994 + минимум 7 цифр

/** Форматировать телефон: только +994 и цифры, макс 13 символов */
export function formatPhone(phone: string | null | undefined): string | undefined {
  if (!phone) return undefined
  const cleaned = phone.replace(/\s|-|\(|\)/g, '')
  if (!cleaned.startsWith(PHONE_PREFIX)) {
    if (cleaned.startsWith('994')) return `+${cleaned}`
    return undefined
  }
  const digits = cleaned.slice(PHONE_PREFIX.length).replace(/\D/g, '')
  if (digits.length < 7) return undefined // недостаточно цифр
  return PHONE_PREFIX + digits.slice(0, 9)
}

// ---------------------------------------------------------------------------
// ensureProfile (серверная версия — с service_role, обходит RLS)
// ---------------------------------------------------------------------------

interface ProfileInput {
  authUserId: string
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  avatarUrl?: string | null
  phone?: string | null
}

/** Серверная версия: используется в callback/route.ts и Server Actions */
export async function ensureProfileServer(input: ProfileInput): Promise<Profile | null> {
  const phone = formatPhone(input.phone)

  // 1. Проверить существующий профиль
  const { data: existing } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('auth_user_id', input.authUserId)
    .maybeSingle()

  if (existing) {
    // Обновить если есть новые данные (Google OAuth может дать больше полей)
    const updates: Record<string, unknown> = {}
    if (input.email && !existing.email) updates.email = input.email
    if (input.firstName && !existing.first_name) updates.first_name = input.firstName
    if (input.lastName && !existing.last_name) updates.last_name = input.lastName
    if (input.avatarUrl && !existing.avatar_url) updates.avatar_url = input.avatarUrl
    if (phone && !existing.phone) updates.phone = phone

    if (Object.keys(updates).length > 0) {
      const { data: updated } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('auth_user_id', input.authUserId)
        .select()
        .single()
      return (updated as Profile) ?? (existing as Profile)
    }

    return existing as Profile
  }

  // 2. Создать новый профиль
  const { data: created, error } = await supabaseAdmin
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
    // Гонка: другой клиент уже вставил — перечитать
    if (error.code === '23505') {
      const { data: retry } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('auth_user_id', input.authUserId)
        .maybeSingle()
      return (retry as Profile) ?? null
    }
    console.error('[ensureProfileServer] insert error:', error)
    return null
  }

  return created as Profile
}

// ---------------------------------------------------------------------------
// ensureProfile (клиентская версия — через anon key, с RLS)
// ---------------------------------------------------------------------------

/** Клиентская версия: используется в AuthContext.tsx (браузер) */
export async function ensureProfileClient(input: ProfileInput): Promise<Profile | null> {
  const supabase = createClient()
  const phone = formatPhone(input.phone)

  // 1. Проверить существующий
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

  // 2. Создать
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
    console.error('[ensureProfileClient] insert error:', error)
    return null
  }

  return created as Profile
}

// ---------------------------------------------------------------------------
// Обновление профиля
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

export async function setPhoneServer(authUserId: string, phone: string): Promise<boolean> {
  const formatted = formatPhone(phone)
  if (!formatted) return false

  const { error } = await supabaseAdmin
    .from('profiles')
    .update({ phone: formatted })
    .eq('auth_user_id', authUserId)

  return !error
}
