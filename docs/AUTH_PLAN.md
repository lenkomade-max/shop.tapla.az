# AUTH PLAN — TAPLA MARKETPLACE

> Базируется на архитектуре Vakansiya (tapla.az). Все паттерны проверены в production.

---

## 1. Три пути регистрации

### Path A: Email + Password

```
[Форма регистрации: email, password, firstName, lastName, phone?]
  → supabase.auth.signUp({ email, password, options: { data: { first_name, last_name } } })
  → Триггер on_auth_user_created → INSERT profiles (auth_user_id, email, first_name, last_name, is_guest=false)
  → После signUp: сессия установлена
  → Если phone не указан → показать PhonePrompt
```

### Path B: Google OAuth

```
[Кнопка "Google ilə daxil ol"]
  → supabase.auth.signInWithOAuth({ provider: 'google', redirectTo: '/auth/callback' })
  → Редирект на Google → подтверждение → редирект на /auth/callback?code=...
  → Route handler: exchangeCodeForSession(code) → Supabase пишет cookies
  → Редирект на returnTo (или /)
  → Триггер on_auth_user_created: INSERT profiles (auth_user_id, full_name, avatar_url из Google raw_user_meta_data)
  → AuthContext.getSession() → user ≠ null
  → Fallback профиля нет: profiles.phone IS NULL → PhonePrompt
  → PhonePrompt: "Zəhmət olmasa nömrənizi daxil edin" → UPDATE profiles SET phone = ... WHERE auth_user_id = ...
```

**Phone обязателен** для оформления заказа, не обязателен для просмотра.

### Path C: Guest Checkout → Профиль

```
[Гость на /checkout]
  → Заполняет: firstName, lastName, phone, email (опц, уже есть в форме), city, address
  → Submit:

    1. profiles.findFirst(phone) — поиск по телефону
       a. Найден guest-профиль (is_guest=true, auth_user_id=null):
          → UPDATE first_name, last_name, email (если изменились)
          → profile_id = этот
       b. Найден full-профиль (auth_user_id ≠ null):
          → Модалка: "Bu nömrə ilə hesabınız var. Daxil olun?"
             [Daxil ol] → LoginForm
             [Qonaq olaraq davam et] → продолжаем как гость
       c. Не найден:
          → INSERT profiles (phone, first_name, last_name, email, is_guest=true)
          → profile_id = новый

    2. INSERT orders (..., profile_id, auth_user_id если есть)
    3. clearCart()
    4. Confirmation screen + GuestUpgradeBanner

  → GuestUpgradeBanner: "Sifarişlərinizi izləmək üçün hesab yaradın"
    [Qeydiyyatdan keç] → RegisterForm → UPDATE profiles SET is_guest=false, auth_user_id=...
    [Daha sonra] → скрыть
```

**Важно**: `auth.users` пользователь НЕ создаётся автоматически при чекауте. Только при явной регистрации.

---

## 2. Profiles — Database Schema

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  is_guest BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_phone ON profiles(phone);
CREATE INDEX idx_profiles_auth_user ON profiles(auth_user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$ BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create profile after auth.users INSERT (email signup / Google OAuth)
CREATE OR REPLACE FUNCTION handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (auth_user_id, phone, email, first_name, last_name, avatar_url, is_guest)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'phone',
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'avatar_url',
    false
  )
  ON CONFLICT (phone) DO UPDATE SET
    auth_user_id = EXCLUDED.auth_user_id,
    email = COALESCE(EXCLUDED.email, profiles.email),
    first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
    last_name = COALESCE(EXCLUDED.last_name, profiles.last_name),
    is_guest = false;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_auth_user();
```

### Orders + Leads migration

```sql
ALTER TABLE orders ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
CREATE INDEX idx_orders_profile ON orders(profile_id);
```

---

## 3. Supabase Client Layer

**Зависимость**: `npm install @supabase/ssr` (в дополнение к существующему `@supabase/supabase-js`).

### 3.1 `src/lib/supabase/client.ts` — Browser (singleton, в точности как Vakansiya)

```typescript
import { createBrowserClient } from '@supabase/ssr'

let client: ReturnType<typeof createBrowserClient> | undefined

function getSupabaseBrowserClient() {
  if (client) return client
  client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  return client
}

export function createClient() {
  return getSupabaseBrowserClient()
}

export function resetClient() {
  client = undefined
}
```

**Ключевые детали:**
- **Singleton** — один на весь lifecycle приложения
- `resetClient()` вызывается при signOut (см. AuthContext)
- `createBrowserClient` из `@supabase/ssr` — автоматически управляет cookie `sb-*-auth-token`
- Session читается из cookie (JWT), НЕ из HTTP-запроса к Supabase

### 3.2 `src/lib/supabase/server.ts` — Server (NEW)

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options))
          } catch {
            // Подавляем "Set was called from a Server Component"
            // Cookie всё равно обновится в middleware
          }
        },
      },
    }
  )
}
```

**Важно**: `try/catch` в `setAll`, потому что в Server Components `cookies().set()` выбрасывает ошибку. Middleware подхватит и запишет cookie в ответ.

### 3.3 `src/lib/supabase/middleware.ts` — Middleware (NEW)

```typescript
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

  // Refresh session if token expired
  await supabase.auth.getClaims()

  // Admin protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('auth_user_id', user.id)
      .single()
    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}
```

**Двойная запись cookie** (критично):
1. `request.cookies.set()` — обновляет cookie для текущего запроса
2. `supabaseResponse.cookies.set()` — записывает cookie в HTTP-ответ (Set-Cookie header)

### 3.4 `src/lib/supabase/admin.ts` — оставить как есть (service_role)

Текущий код с `createClient` и `SUPABASE_SECRET_KEY` — подходит для Server Actions. Не трогаем.

### 3.5 `src/lib/supabase/queries.ts` — добавить новые функции

```typescript
// profile
export async function getProfileByPhone(phone: string): Promise<Profile | null>
export async function createGuestProfile(data: GuestProfileData): Promise<Profile>
export async function getProfileByAuthUserId(authUserId: string): Promise<Profile | null>
export async function updateProfilePhone(authUserId: string, phone: string): Promise<void>

// cart sync
export async function syncCartFromLocal(userId: string, items: CartItem[]): Promise<{ synced: number }>
export async function getUserCart(userId: string): Promise<CartItem[] | null>
export async function clearUserCart(userId: string): Promise<void>

// orders
export async function createOrder(data: OrderData): Promise<Order>
```

---

## 4. AuthContext — React Context (в точности как Vakansiya)

### 4.1 Типы

```typescript
interface AuthContextType {
  user: User | null          // Supabase Auth user
  profile: Profile | null    // Из таблицы profiles
  isAuthenticated: boolean    // !!user
  isLoading: boolean          // true пока не проинициализирована сессия

  openLogin: (returnTo?: string) => void
  requireAuth: (returnTo?: string) => boolean  // открыть модалку если не авторизован
  signOut: () => Promise<void>

  // TAPLA-specific
  openPhonePrompt: () => void
  setPhone: (phone: string) => Promise<void>
  isPhoneRequired: boolean     // true после Google если нет телефона
}
```

### 4.2 Инициализация сессии

```typescript
// Внутри AuthProvider:
const [user, setUser] = useState<User | null>(null)
const [profile, setProfile] = useState<Profile | null>(null)
const [isLoading, setIsLoading] = useState(true)
const [isModalOpen, setIsModalOpen] = useState(false)
const [returnTo, setReturnTo] = useState<string | undefined>()
const [isAuthRedirecting, setIsAuthRedirecting] = useState(false)

useEffect(() => {
  const supabase = createClient()

  const initAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user ?? null)
    // Если user есть — подгрузить профиль
    if (session?.user) {
      const profile = await getProfileByAuthUserId(session.user.id)
      setProfile(profile)
    }
    setIsLoading(false)
  }
  initAuth()

  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    setUser(session?.user ?? null)
    if (event === 'SIGNED_IN' && session?.user) {
      getProfileByAuthUserId(session.user.id).then(setProfile)
    }
    if (event === 'SIGNED_OUT') {
      setProfile(null)
      setIsLoading(false)
    }
  })

  return () => subscription.unsubscribe()
}, [])
```

### 4.3 Google sign in

```typescript
const handleGoogleSignIn = async () => {
  setIsAuthRedirecting(true)

  // requestAnimationFrame — даёт React отрисовать спиннер до редиректа
  await new Promise(resolve => requestAnimationFrame(() => resolve()))

  const supabase = createClient()
  const baseUrl = `${window.location.origin}/auth/callback`
  const redirectUrl = returnTo
    ? `${baseUrl}?returnTo=${encodeURIComponent(returnTo)}`
    : baseUrl

  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectUrl },
  })
}
```

### 4.4 requireAuth

```typescript
const requireAuth = (redirectTo?: string): boolean => {
  if (isAuthenticated) {
    if (redirectTo) window.location.href = redirectTo
    return true
  }
  openLogin(redirectTo)
  return false
}
```

### 4.5 signOut

```typescript
const signOut = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
  resetClient()
  setUser(null)
  setProfile(null)
  window.location.href = '/'
}
```

**`window.location.href = '/'`** — полный reload, а не router.push, чтобы все state обнулились.

### 4.6 PhonePrompt

```typescript
// После Google или email signup если phone не указан
const [showPhonePrompt, setShowPhonePrompt] = useState(false)

const isPhoneRequired = !!user && !!profile && !profile.phone

useEffect(() => {
  if (isPhoneRequired) setShowPhonePrompt(true)
}, [isPhoneRequired])

const setPhone = async (phone: string) => {
  const supabase = createClient()
  await supabase.from('profiles')
    .update({ phone })
    .eq('auth_user_id', user!.id)
  setProfile(prev => prev ? { ...prev, phone } : null)
  setShowPhonePrompt(false)
}
```

### 4.7 Встраивание AuthModal в AuthProvider

```typescript
// AuthProvider рендерит:
<AuthContext.Provider value={...}>
  {children}
  <AuthModal
    isOpen={isModalOpen}
    onClose={() => { if (!isAuthRedirecting) setIsModalOpen(false) }}
    onGoogleSignIn={handleGoogleSignIn}
    isLoading={isAuthRedirecting}
  />
  {showPhonePrompt && <PhonePrompt onSetPhone={setPhone} />}
</AuthContext.Provider>
```

---

## 5. OAuth Callback Route

`src/app/auth/callback/route.ts`:

```typescript
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
```

**x-forwarded-host/proto** — поддержка прокси (если понадобится Cloudflare).

---

## 6. Middleware (`src/middleware.ts`)

```typescript
import { updateSession } from '@/lib/supabase/middleware'
import { type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2)$).*)',
  ],
}
```

**Что делает updateSession (из lib/supabase/middleware.ts):**
1. Создаёт `createServerClient` с cookie management (двойная запись)
2. `getClaims()` — refresh токена если истёк
3. Для `/admin/*` — проверка `auth_user_id` + `profiles.role === 'admin'`
4. Возвращает `supabaseResponse` (NextResponse) с обновлёнными cookie

---

## 7. Guest Cart State (аналог FavoritesSync)

**Текущий CartContext**: localStorage `tapla_cart`.

### 7.1 Гость (не авторизован)
- Всё хранится в localStorage (как сейчас)
- Никакого лимита (в отличие от favorites где 3)
- После оформления заказа — очистка корзины

### 7.2 Синхронизация при логине (CartContext.tsx)

```typescript
// В CartProvider добавляем:
const { user } = useAuth()  // зависит от AuthContext
const [hasSynced, setHasSynced] = useState(false)

useEffect(() => {
  if (!user || hasSynced) return

  const syncFromLocal = async () => {
    const stored = localStorage.getItem('tapla_cart')
    if (!stored) return

    const localItems = JSON.parse(stored)
    if (localItems.length === 0) return

    // Отправляем на сервер
    const result = await syncCartFromLocal(user.id, localItems)

    if (result.synced > 0) {
      // После синхронизации — перезагружаем корзину с сервера
      const serverCart = await getUserCart(user.id)
      if (serverCart) setCartItems(serverCart)
      localStorage.removeItem('tapla_cart')
    }
  }

  syncFromLocal()
  setHasSynced(true)
}, [user?.id, hasSynced])
```

**Важно:**
- `hasSynced` флаг — предотвращает повторную синхронизацию при ре-рендерах
- После синхронизации localStorage очищается
- Товары из localStorage ДОБАВЛЯЮТСЯ к товарам из DB (merge+dedup по product_id)

### 7.3 CartContext — обновлённая структура

```typescript
// Добавить в CartContextType:
isSyncing: boolean
```

### 7.4 Иерархия Provider'ов

```tsx
// AppProviders.tsx
<AuthProvider>
  <CartProvider>     {/* CartProvider вызывает useAuth() внутри */}
    {children}
  </CartProvider>
</AuthProvider>
```

**Важно**: `CartProvider` должен быть ДОЧЕРНИМ `AuthProvider`, потому что использует `useAuth()`.

---

## 8. Auth UI Components — детальная спецификация

### AuthModal (`components/auth/AuthModal.tsx`)
- Два таба: "Daxil ol" | "Qeydiyyat"
- Login: email + password + [Daxil ol]
- Register: email + password + confirm + firstName + lastName + phone (опц)
- Google кнопка "Google ilə daxil ol" — общая для обоих табов
- Разделитель "və ya" между Google и формой
- При OAuth: спиннер "Yönləndirilir..."

### PhonePrompt (`components/auth/PhonePrompt.tsx`)
- Модалка: "Hesabınızı tamamlamaq üçün nömrənizi daxil edin"
- Поле: phone (+994 формата)
- [Yadda saxla] → UPDATE profiles SET phone
- [Atla] → закрыть (но заказ оформить нельзя: переключить disabled на кнопке заказа)

### AuthButton (`components/auth/AuthButton.tsx`)
- Если не авторизован: кнопка "Daxil ol" → openLogin()
- Если авторизован: аватар/initials → dropdown (Profil, Çıxış)

### GuestUpgradeBanner (`components/auth/GuestUpgradeBanner.tsx`)
- Показывается в confirmation screen после заказа (если is_guest)
- "Sifarişlərinizi izləmək üçün hesab yaradın"
- [Qeydiyyatdan keç] → AuthModal (register tab)
- [Bağla] — скрыть навсегда (localStorage flag)

---

## 9. Guest Checkout — Server Action

```typescript
'use server'

export async function submitOrder(formData: CheckoutFormData, cartItems: CartItem[]) {
  // 1. Поиск/создание profile по phone
  const existingProfile = await getProfileByPhone(formData.phone)

  let profileId: string
  if (existingProfile) {
    profileId = existingProfile.id
    // Обновить данные если изменились
    await supabase.from('profiles').update({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email || existingProfile.email,
    }).eq('id', profileId)
  } else {
    const newProfile = await createGuestProfile({
      phone: formData.phone,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
    })
    profileId = newProfile.id
  }

  // 2. Создать заказ
  const order = await createOrder({
    profile_id: profileId,
    guest_profile_id: existingProfile?.is_guest ? profileId : null,
    customer_name: `${formData.firstName} ${formData.lastName}`,
    phone: formData.phone,
    email: formData.email,
    city: formData.city,
    address: formData.address,
    payment_method: formData.paymentMethod,
    total: cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    items: cartItems,
  })

  // 3. Если сессия есть — привязать auth_user_id
  const supabase = await createClient()  // server.ts
  const { data: { session } } = await supabase.auth.getSession()
  if (session?.user) {
    await supabase.from('orders').update({ auth_user_id: session.user.id }).eq('id', order.id)
    // Если профиль был guest — обновить
    if (existingProfile?.is_guest) {
      await supabase.from('profiles').update({
        auth_user_id: session.user.id,
        is_guest: false,
      }).eq('id', profileId)
    }
  }

  return { success: true, orderId: order.id }
}
```

---

## 10. Cart Sync — Server Action

```typescript
'use server'

export async function syncCartFromLocal(userId: string, items: CartItem[]) {
  const supabase = await createClient()

  // 1. Получить текущую корзину из DB
  const { data: existingCart } = await supabase
    .from('user_cart')
    .select('product_id, quantity, shade_name')
    .eq('auth_user_id', userId)

  const existingMap = new Map(
    existingCart?.map(item => [`${item.product_id}:${item.shade_name || ''}`, item.quantity]) || []
  )

  // 2. Мерж: localStorage items + DB items
  let synced = 0
  for (const item of items) {
    const key = `${item.product.id}:${item.selectedShade?.name || ''}`
    const existingQty = existingMap.get(key) || 0
    if (existingQty >= item.quantity) continue  // уже есть в DB

    await supabase.from('user_cart').upsert({
      auth_user_id: userId,
      product_id: item.product.id,
      shade_name: item.selectedShade?.name || null,
      quantity: existingQty + item.quantity,
    }, { onConflict: 'auth_user_id,product_id,shade_name' })
    synced++
  }

  return { synced }
}
```

---

## 11. Auth UI — Встраивание в Header

### Header.tsx (изменения)

```tsx
// Добавить импорт AuthButton
import { AuthButton } from '@/components/auth/AuthButton'

// В навигацию (рядом с корзиной):
<div className="flex items-center space-x-3">
  <AuthButton />
  <CartIcon />
</div>
```

### StickyMobileBar.tsx (изменения)

```tsx
// Иконка профиля (login/logout) вместо одной из текущих
// Если не авторизован → openLogin
// Если авторизован → /profile
```

---

## 12. Profile Page (`/profile`)

- Защищённая страница (middleware или requireAuth)
- Отображает: имя, телефон, email (из profiles)
- Список заказов (orders.where profile_id)
- Кнопка "Çıxış" (signOut)

---

## 13. Environment Variables

```env
# Есть (не менять):
NEXT_PUBLIC_SUPABASE_URL=https://nzkqorbyexisnbyjhvdf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SECRET_KEY=sb_secret_...

# Добавить:
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # Dev
# NEXT_PUBLIC_SITE_URL=https://shop.tapla.az   # Prod
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...               # Из Google Cloud Console
```

---

## 14. Supabase Cloud Setup

- [ ] Включить Google OAuth: Authentication → Providers → Google
- [ ] Client ID + Secret из Google Cloud Console
- [ ] Callback URL: `https://nzkqorbyexisnbyjhvdf.supabase.co/auth/v1/callback`
- [ ] Site URL: `https://shop.tapla.az` (prod) / `http://localhost:3000` (dev)
- [ ] Redirect URLs: `{SITE_URL}/auth/callback`
- [ ] Отключить email confirm для тестов

**Google Cloud Console:**
- Authorized JS origins: `https://shop.tapla.az`, `http://localhost:3000`
- Authorized redirect URIs: `https://nzkqorbyexisnbyjhvdf.supabase.co/auth/v1/callback`

---

## 15. Implementation Order (detall)

| Фаза | Что делать | Файлы | Время |
|------|-----------|-------|-------|
| **0. Setup** | `npm install @supabase/ssr`. Настроить Google OAuth в Supabase Cloud + Google Cloud Console | — | 20м |
| **1. DB** | Накатить миграции: profiles table + триггеры + ALTER orders/leads | `004_auth_profiles.sql`, `005_orders_auth.sql` | 15м |
| **2. Core Auth** | client.ts (ssr singleton), server.ts, middleware.ts, AuthContext, types | 5 файлов | 2ч |
| **3. Middleware** | root middleware.ts + lib/supabase/middleware.ts (updateSession + admin protection) | 2 файла | 30м |
| **4. Callback** | /auth/callback/route.ts (exchangeCodeForSession, returnTo, getExternalOrigin) | 1 файл | 20м |
| **5. Auth UI** | AuthModal, RegisterForm, LoginForm, AuthButton, PhonePrompt | 5 файлов | 3ч |
| **6. Cart Sync** | CartContext: sync from localStorage after login, merge with DB, hasSynced guard | CartContext.tsx, queries.ts | 1ч |
| **7. Guest Checkout** | Server Action submitOrder (findOrCreate profile, create order), GuestUpgradeBanner | actions.ts + checkout/page.tsx | 2ч |
| **8. Header Integration** | AuthButton в Header/StickyMobileBar, openLogin linkage | Header.tsx, StickyMobileBar.tsx | 30м |
| **9. Profile Page** | /profile — отображение данных + заказы | profile/page.tsx | 1.5ч |
| **10. Admin Hybrid** | Обновить admin/layout.tsx: роль admin через Supabase (опционально) | admin/layout.tsx | 30м |
| **11. Admin full migration** | (Опц.) Удалить jose JWT, перевести админку на Supabase Auth role | lib/auth.ts (удалить), actions.ts | 1ч |

**Итого MVP**: ~12 часов (фазы 0-9). С админ миграцией: ~13.5ч.

---

## 16. Карта передачи состояния Guest → Auth (по Vakansiya FavoritesSync)

```
Guest (user=null)
  ├─ Cart: localStorage('tapla_cart')
  ├─ Order history: только в БД (profile_id)
  └─ Phone: не сохранён (кроме как при чекауте)

  ↓ Логин / Регистрация

Auth (user≠null)
  ├─ Cart: localStorage → DB (merge+dedup) → localStorage очищен
  ├─ Profile: is_guest=false, auth_user_id=user.id
  ├─ Orders: UPDATE orders SET auth_user_id = user.id WHERE profile_id = profile.id
  └─ Phone: если в профиле нет → PhonePrompt
```

**Ключевой паттерн (Vakansiya):**
1. `useEffect` в провайдере следит за `user`
2. При появлении `user` (login/signup/Google callback) — срабатывает **один раз** (hasSynced)
3. Читает localStorage, отправляет на сервер (Server Action), очищает localStorage
4. `hasSynced` — prevent повторного вызова при ре-рендерах

---

## 17. Что было изучено в Vakansiya

| Паттерн | Vakansiya | TAPLA |
|---------|-----------|-------|
| Browser client singleton | `client.ts` (let client) | ✅ |
| Server client per-request | `server.ts` (cookies() + try/catch) | ✅ |
| Middleware updateSession | `middleware.ts` (double cookie set + getClaims) | ✅ |
| AuthContext init | `getSession()` + `onAuthStateChange` | ✅ |
| Google signIn | `signInWithOAuth` + `requestAnimationFrame` | ✅ |
| OAuth callback | `exchangeCodeForSession` + `returnTo` | ✅ |
| External origin (proxy) | `x-forwarded-host/proto` headers | ✅ |
| Admin protection (middleware) | `getUser()` + `profiles.role` check | ✅ |
| Guest state (localStorage) | Favorites: `tapla_favorites`, max 3 | ✅ (cart: `tapla_cart`, no limit) |
| Guest → Auth sync | FavoritesSync (localStorage → DB, then clear) | ✅ (CartSync) |
| hasSynced guard | `useState(false)` → `setHasSynced(true)` | ✅ |
| signOut + resetClient | `signOut()` → `resetClient()` → `window.location.href = '/'` | ✅ |
| Phone after Google | PhonePrompt modal (if phone is null) | ✅ |

---

## 18. Что НЕ входит в MVP

- ❌ SMS-верификация телефона
- ❌ Вход по SMS-коду (phone auth)
- ❌ Forget password / Reset password
- ❌ Избранное (Wishlist) с синхронизацией
- ❌ Адресная книга (несколько адресов)
- ❌ Google One Tap (безредиректный вход)
- ❌ OAuth через Apple/Telegram
- ❌ 2FA
- ❌ Уведомления о статусе заказа
- ❌ Админ: полная миграция на Supabase Auth (гибрид на старте)
