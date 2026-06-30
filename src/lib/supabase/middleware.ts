import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  await supabase.auth.getClaims()

  // Admin protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // 1. Сначала проверяем jose JWT (admin_token) — это основная авторизация админки
    //    Если токен валидный — пропускаем без проверки Supabase
    const adminToken = request.cookies.get('admin_token')?.value
    if (adminToken) {
      try {
        const { jwtVerify } = await import('jose')
        const key = new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'insecure-default-key-change-me')
        await jwtVerify(adminToken, key)
        return supabaseResponse
      } catch {
        // admin_token невалидный — пробуем Supabase
      }
    }

    // 2. Legacy Supabase auth check
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('auth_user_id', user.id)
          .single()
        if (profile && profile.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url))
        }
      }
    } catch {
      // Если Supabase не отвечает — пропускаем, админ-лейаут сам проверит
    }
  }

  return supabaseResponse
}
