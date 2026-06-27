-- Fix: phone UNIQUE constraint causes conflicts when multiple users
-- have the default '+994' or NULL phone value.
-- Phone is not a reliable unique identifier — customers may share numbers
-- (family members) or leave it blank.

-- Drop the unique constraint on phone
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_phone_key;

-- Drop the unique index created alongside the constraint
DROP INDEX IF EXISTS idx_profiles_phone;

-- Replace with a non-unique index for lookup performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone_lookup ON profiles(phone);
