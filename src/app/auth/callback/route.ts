import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const returnTo = searchParams.get('returnTo')
  const redirectOrigin = getExternalOrigin(request)

  let next = returnTo ?? '/'
  if (!next.startsWith('/')) next = '/'
  if (!code) return NextResponse.redirect(`${redirectOrigin}/?auth_error=no_code`)

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${redirectOrigin}/?auth_error=exchange_failed`)

  return NextResponse.redirect(`${redirectOrigin}${next}`)
}

function getExternalOrigin(request: Request) {
  const url = new URL(request.url)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto')
  const host = forwardedHost || request.headers.get('host') || url.host
  const protocol = forwardedProto || url.protocol.replace(':', '')
  return `${protocol}://${host}`
}
