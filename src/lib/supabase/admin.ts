import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

let _admin: SupabaseClient | null = null
const noopHandler: ProxyHandler<SupabaseClient> = {
  get(_, prop) {
    if (!_admin) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const serviceRoleKey = process.env.SUPABASE_SECRET_KEY || ''
      _admin = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })
    }
    return (_admin as any)[prop]
  },
}

export const supabaseAdmin = new Proxy<SupabaseClient>({} as SupabaseClient, noopHandler)
