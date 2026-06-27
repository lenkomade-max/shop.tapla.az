-- Migration 010: Clean up profiles table
-- 1. Remove phone UNIQUE constraint (structural fix: two users can share default +994)
-- 2. Remove on_auth_user_created trigger (business logic moved to TypeScript lib/api/profile.ts)
--
-- Business logic (profile creation on signup) is now handled in:
--   src/lib/api/profile.ts — ensureProfile() Server Action
--   Called from: AuthContext.tsx (browser) and auth/callback/route.ts (server)

-- Drop phone UNIQUE constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phone_key;

-- Drop unique index on phone
DROP INDEX IF EXISTS idx_profiles_phone;

-- Non-unique index for phone lookups (checkout, profile search)
CREATE INDEX IF NOT EXISTS idx_profiles_phone_lookup ON profiles(phone);

-- Drop trigger and function — profile creation is now in TypeScript code
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_auth_user;
