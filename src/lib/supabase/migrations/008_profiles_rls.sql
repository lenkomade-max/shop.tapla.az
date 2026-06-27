ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "users_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

CREATE POLICY "users_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);
