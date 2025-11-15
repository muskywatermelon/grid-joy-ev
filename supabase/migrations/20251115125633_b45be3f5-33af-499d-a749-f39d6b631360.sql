-- Update RLS policies to allow public viewing of data

-- Companies: Already allows authenticated users with true expression
-- But we need to allow unauthenticated access
DROP POLICY IF EXISTS "Authenticated users can view companies" ON companies;
CREATE POLICY "Anyone can view companies" ON companies FOR SELECT USING (true);

-- Customers: Currently restricted to owner or admin
DROP POLICY IF EXISTS "Users can view their own customers" ON customers;
CREATE POLICY "Anyone can view customers" ON customers FOR SELECT USING (true);

-- EV Info: Currently only admins can view
DROP POLICY IF EXISTS "Admins can view all ev_info" ON ev_info;
CREATE POLICY "Anyone can view ev_info" ON ev_info FOR SELECT USING (true);

-- Charging Points: Already allows authenticated users with true expression
-- But we need to allow unauthenticated access
DROP POLICY IF EXISTS "Authenticated users can view charging_points" ON charging_points;
CREATE POLICY "Anyone can view charging_points" ON charging_points FOR SELECT USING (true);

-- Receipts: Currently only admins can view
DROP POLICY IF EXISTS "Admins can view all receipts" ON receipts;
CREATE POLICY "Anyone can view receipts" ON receipts FOR SELECT USING (true);