ALTER TABLE orders ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE leads ADD COLUMN profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_orders_profile ON orders(profile_id);
CREATE INDEX idx_orders_auth_user ON orders(auth_user_id);
