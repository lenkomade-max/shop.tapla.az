/**
 * Profile API (server-only) — через service_role, обходит RLS.
 * Только для серверного кода: Route Handlers, Server Actions.
 * НЕ импортировать в клиентские компоненты!
 *
 * Клиентская версия: lib/api/profile.ts
 */

import { supabaseAdmin } from '@/lib/supabase/admin'
import { formatPhone } from '@/lib/api/profile'
import type { ProfileInput } from '@/lib/api/profile'
import type { Profile } from '@/lib/supabase/types'

export { type ProfileInput } from '@/lib/api/profile'

/** Серверная версия ensureProfile — через service_role */
export async function ensureProfile(input: ProfileInput): Promise<Profile | null> {
  const phone = formatPhone(input.phone)

  const { data: existing } = await supabaseAdmin
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
