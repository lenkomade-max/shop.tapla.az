'use client';

import React, { useState } from 'react';

export function LoginForm() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(false);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;

    try {
      const resp = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (resp.ok) {
        // Ждём микротаск чтобы cookie точно установилась в браузере
        await new Promise(r => setTimeout(r, 50));
        window.location.replace('/admin');
      } else {
        setError(true);
        setLoading(false);
      }
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
        <h1 className="mb-6 text-center text-lg font-bold uppercase tracking-wider">TAPLA Admin</h1>
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          required
          autoFocus
          disabled={loading}
          className="mb-4 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-black disabled:opacity-50"
        />
        {error && <p className="mb-4 text-center text-sm text-red-500">Неверный пароль</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}
