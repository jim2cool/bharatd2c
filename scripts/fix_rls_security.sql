-- 1. Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- CLEANUP: Remove permissive or duplicate policies if they exist
DROP POLICY IF EXISTS "allow read stores" ON stores;
DROP POLICY IF EXISTS "Users can insert stores" ON stores;

-- 2. Policy: Users can view their own stores
DROP POLICY IF EXISTS "Users can view own stores" ON stores;
CREATE POLICY "Users can view own stores"
ON stores FOR SELECT
USING (auth.uid() = owner_id);

-- 3. Policy: Users can update their own stores
DROP POLICY IF EXISTS "Users can update own stores" ON stores;
CREATE POLICY "Users can update own stores"
ON stores FOR UPDATE
USING (auth.uid() = owner_id);

-- 4. Policy: Users can insert stores (with themselves as owner)
DROP POLICY IF EXISTS "Users can create stores" ON stores;
CREATE POLICY "Users can create stores"
ON stores FOR INSERT
WITH CHECK (auth.uid() = owner_id);

-- 5. Policy: Users can delete their own stores
DROP POLICY IF EXISTS "Users can delete own stores" ON stores;
CREATE POLICY "Users can delete own stores"
ON stores FOR DELETE
USING (auth.uid() = owner_id);

-- 6. Super Admin Bypass (Optional - adjust if Super Admin role logic differs)
-- If you want super admins to see everything, add OR (auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin'))
-- However, for strict multi-tenant, separate queries are better. 
-- The "Super Admin Dashboard" uses the Service Role (admin client) or specific queries, 
-- but if using client-side super admin, we might need a policy.
-- For now, let's keep it strict for store owners.
