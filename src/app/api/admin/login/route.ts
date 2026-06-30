// ============================================================================
// POST /api/admin/login — аутентификация админа
// Используется вместо Server Action для корректной установки cookie
// на мобильных браузерах.
// ============================================================================

import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const COOKIE_NAME = 'admin_token';
const KEY = () => new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'insecure-default-key-change-me');

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ ok: false, error: 'Неверный пароль' }, { status: 401 });
    }

    const token = await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(KEY());

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ ok: false, error: 'Внутренняя ошибка' }, { status: 500 });
  }
}
