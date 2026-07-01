# AUTH — TAPLA MARKETPLACE

## Обзор

Два независимых механизма аутентификации:
- **Клиенты** — Supabase Auth (Email + Google OAuth)
- **Админ** — JWT (jose, httpOnly cookie)

---

## 1. Клиентская Auth (Supabase Auth)

### Поток

```
Регистрация (Email + пароль)     Google OAuth
        │                              │
        ▼                              ▼
  supabase.auth.signUp()       signInWithOAuth('google')
        │                              │
        ▼                              ▼
  onAuthStateChange('SIGNED_IN') → AuthContext.user = session.user
        │
        ▼
  ensureProfile() → создаёт/обновляет профиль в profiles
        │
        ▼
  AuthContext.profile = profile
```

### Компоненты

| Файл | Роль |
|------|------|
| `lib/supabase/client.ts` | Browser singleton (createBrowserClient, @supabase/ssr) |
| `lib/supabase/server.ts` | Server per-request client (cookies()) |
| `lib/supabase/middleware.ts` | Cookie refresh + admin JWT check |
| `components/auth/AuthContext.tsx` | React Context: user, profile, isLoading, openLogin, signOut, setPhone |
| `components/auth/AuthModal.tsx` | Модалка: 2 таба (Daxil ol / Qeydiyyat), Email+Google |
| `components/auth/AuthButton.tsx` | Кнопка в хедере: логин / аватар+dropdown |
| `components/auth/PhonePrompt.tsx` | Запрос телефона после Google входа |
| `lib/api/profile.ts` | ensureProfile (создание/обновление), updatePhone (client-side) |
| `lib/api/profile-server.ts` | ensureProfile (service_role) для auth callback |
| `app/auth/callback/route.ts` | OAuth callback: exchangeCodeForSession → ensureProfile → redirect |

### AuthContext (ключевые детали)

- `getSession()` при монтировании → восстановление сессии из cookie
- `onAuthStateChange` ловит SIGNED_IN/SIGNED_OUT
- `ensureProfile()` после каждого SIGNED_IN — upsert профиля
- `syncingRef` — защита от дублирования запросов
- `isPhoneRequired` — true если user есть, profile есть, но phone = null
- `signOut()` → `supabase.auth.signOut()` → `resetClient()` → `window.location.href = '/'`

### Profile API (`lib/api/profile.ts`)

- `ensureProfile(input)` — проверяет есть ли профиль по `auth_user_id`
  - Если есть — обновляет только пустые поля (не затирает существующие)
  - Если нет — создаёт (`is_guest: false`)
  - При ошибке unique (23505) — повторный SELECT
- `updatePhone(userId, phone)` — форматирует +994 и сохраняет
- `formatPhone(phone)` — нормализация: +994 + макс 9 цифр

### OAuth Callback (`/auth/callback`)

```
GET /auth/callback?code=...&returnTo=/products
  → exchangeCodeForSession(code)
  → ensureProfile из user_metadata (first_name, last_name, avatar_url)
  → redirect to returnTo (или /)
```

Поддержка `x-forwarded-host/proto` для прокси.

---

## 2. Админ Auth (JWT)

### Механизм

```
ADMIN_PASSWORD из .env.local → JWT (jose, HS256)
  → httpOnly cookie (admin_token) на 24ч
  → middleware проверяет cookie на /admin/*
  → admin/layout.tsx — checkAuth() если нет → LoginForm
```

### Файлы

| Файл | Роль |
|------|------|
| `lib/auth.ts` | `signToken()`, `verifyToken()`, `checkAuth()` — Server Action helpers |
| `lib/actions.ts` | `loginAction`, `logoutAction` — Server Actions |
| `lib/supabase/middleware.ts` | `updateSession()` — проверяет admin_token для /admin/* |
| `app/admin/layout.tsx` | Auth guard: вызывает `checkAuth()`, если не ок — LoginForm |
| `app/admin/login-form.tsx` | Форма: пароль → `loginAction` → JWT в cookie |

Данные: CRUD через `supabaseAdmin` (service_role ключ, `lib/supabase/admin.ts`).

---

## 3. Guest Checkout

Гость может оформить заказ без регистрации.

**Поток (submitOrder в lib/actions.ts):**

```
1. Поиск профиля по phone (getProfileByPhone)
   a. Найден → profileId = existing.id, обновить first_name/email/city/address
   b. Не найден → createGuestProfile({ phone, email, first_name, city, address })
      → is_guest = true, auth_user_id = null

2. INSERT orders (profile_id, items, total, payment_method, deposit_method...)

3. Если есть Supabase сессия (auth_user_id):
   → UPDATE orders SET auth_user_id = session.user.id
   → UPDATE profiles SET auth_user_id = ..., is_guest = false WHERE id = profileId

4. Если online_card → POST tapla.az/api/payments/pasha/create (Pasha Bank gateway)
   → return redirectUrl

5. clearCart(), confirmation screen
```

**GuestUpgradeBanner:** кнопка "QEYDİYYATDAN KEÇ" на экране успеха (редирект на /?register=1).

---

## 4. Profiles — структура

```sql
profiles (
  id UUID PK,
  auth_user_id UUID → auth.users(id) ON DELETE SET NULL,
  phone TEXT UNIQUE,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  city TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

**Триггер** `on_auth_user_created` — создаёт профиль при signUp (из `raw_user_meta_data`).

**Индексы:** `phone`, `auth_user_id` (в schema.sql).

---

## 5. Файлы (полный список)

```
src/
  lib/
    supabase/
      client.ts              — Browser singleton (+ resetClient)
      server.ts              — Server per-request (cookies)
      admin.ts               — Service Role (supabaseAdmin proxy)
      middleware.ts          — admin_token check + Supabase cookie refresh
      types.ts               — Profile, Order, Product, etc.
    api/
      profile.ts             — ensureProfile, updatePhone (client-side)
      profile-server.ts      — ensureProfile (service_role)
    auth.ts                  — signToken, verifyToken, checkAuth (админ JWT)
    actions.ts               — loginAction, logoutAction, submitOrder
  components/
    auth/
      AuthContext.tsx         — React Context провайдер
      AuthModal.tsx           — Login/Register модалка
      AuthButton.tsx          — Кнопка в хедере
      PhonePrompt.tsx         — Запрос телефона
  providers/
    AppProviders.tsx          — AuthProvider → CartProvider
  app/
    auth/callback/route.ts   — OAuth callback handler
    profile/page.tsx         — /profile (защищённая страница)
    admin/
      layout.tsx             — JWT guard
      login-form.tsx          — Форма входа
```

---

## 6. Что НЕ реализовано

- ❌ Cart sync to server (user_cart table не используется)
- ❌ Wishlist / Избранное
- ❌ SMS-верификация
- ❌ Forget / Reset password
- ❌ Middleware на клиентские маршруты (только админка)
- ❌ Полная миграция админки на Supabase Auth
