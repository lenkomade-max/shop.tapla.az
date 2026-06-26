import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const COOKIE_NAME = 'admin_token';
const KEY = () => new TextEncoder().encode(process.env.ADMIN_PASSWORD || 'insecure-default-key-change-me');

export async function login(password: string): Promise<boolean> {
  if (password !== process.env.ADMIN_PASSWORD) return false;

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(KEY());

  const c = await cookies();
  c.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24,
    path: '/',
  });
  return true;
}

export async function logout() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
  redirect('/admin');
}

export async function checkAuth(): Promise<boolean> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, KEY());
    return true;
  } catch { return false; }
}
