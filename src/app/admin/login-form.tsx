'use client';

import React, { useState } from 'react';
import { loginAction } from '@/lib/actions';

export function LoginForm() {
  const [error, setError] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const ok = await loginAction(form.get('password') as string);
    if (!ok) setError(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-lg font-bold uppercase tracking-wider">Aluna Admin</h1>
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          required
          autoFocus
          className="mb-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-black"
        />
        {error && <p className="mb-4 text-center text-sm text-red-500">Неверный пароль</p>}
        <button type="submit" className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white hover:bg-zinc-800">
          Войти
        </button>
      </form>
    </div>
  );
}
