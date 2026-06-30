import { NextResponse, type NextRequest } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'

const COOKIE_NAME = 'admin_token'
const KEY = () => new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'insecure-default-key-change-me')

export async function updateSession(request: NextRequest) {
  // Admin routes: только проверка admin_token, без Supabase.
  // Supabase.auth.getClaims() триггерит рефреш сессии через setAll cookies,
  // что создаёт новый NextResponse и на мобильных браузерах может сбросить
  // admin_token. Админ-лейаут сам показывает форму логина.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get(COOKIE_NAME)?.value
    if (adminToken) {
      try {
        await jwtVerify(adminToken, KEY())
        return NextResponse.next({ request })
      } catch {
        // Просрочен / невалидный — пускаем, лейаут покажет логин
      }
    }
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({ request })

  const { createServerClient } = await import('@supabase/ssr')
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

  return supabaseResponse
}
