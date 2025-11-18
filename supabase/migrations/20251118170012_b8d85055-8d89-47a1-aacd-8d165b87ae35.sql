-- Drop and recreate views without SECURITY DEFINER to fix security warnings
DROP VIEW IF EXISTS public.company_summary CASCADE;
DROP VIEW IF EXISTS public.charging_point_details CASCADE;
DROP VIEW IF EXISTS public.ev_details CASCADE;
DROP VIEW IF EXISTS public.receipt_details CASCADE;
DROP VIEW IF EXISTS public.daily_revenue_summary CASCADE;
DROP VIEW IF EXISTS public.charging_point_utilization CASCADE;

-- Create view for company summary with aggregated data (SECURITY INVOKER)
CREATE VIEW public.company_summary WITH (security_invoker=true) AS
SELECT 
  c.id,
  c.company_name,
  c.branch,
  COUNT(DISTINCT cp.id) as total_charging_points,
  COUNT(DISTINCT e.num_plate) as total_vehicles,
  COUNT(DISTINCT r.receipt_number) as total_receipts,
  COALESCE(SUM(r.amount), 0) as total_revenue,
  SUM(CASE WHEN cp.availability = 'Available' THEN 1 ELSE 0 END) as available_points,
  SUM(CASE WHEN cp.availability = 'Occupied' THEN 1 ELSE 0 END) as occupied_points,
  SUM(CASE WHEN cp.availability = 'Maintenance' THEN 1 ELSE 0 END) as maintenance_points
FROM companies c
LEFT JOIN charging_points cp ON c.id = cp.company_id
LEFT JOIN ev_info e ON c.id = e.company_id
LEFT JOIN receipts r ON c.id = r.company_id
GROUP BY c.id, c.company_name, c.branch;

-- Create view for charging point details with company info
CREATE VIEW public.charging_point_details WITH (security_invoker=true) AS
SELECT 
  cp.id,
  cp.location,
  cp.num_of_points,
  cp.availability,
  cp.functionality,
  cp.max_voltage,
  c.company_name,
  c.branch,
  cp.created_at,
  cp.updated_at
FROM charging_points cp
LEFT JOIN companies c ON cp.company_id = c.id;

-- Create view for EV information with company details
CREATE VIEW public.ev_details WITH (security_invoker=true) AS
SELECT 
  e.num_plate,
  e.model,
  e.battery_time,
  e.volt_req,
  e.cost,
  e.specs,
  c.company_name,
  c.branch,
  e.created_at,
  e.updated_at
FROM ev_info e
LEFT JOIN companies c ON e.company_id = c.id;

-- Create view for receipt details with company info
CREATE VIEW public.receipt_details WITH (security_invoker=true) AS
SELECT 
  r.receipt_number,
  r.amount,
  r.date,
  r.time,
  c.company_name,
  c.branch,
  r.created_at
FROM receipts r
LEFT JOIN companies c ON r.company_id = c.id;

-- Create view for daily revenue summary
CREATE VIEW public.daily_revenue_summary WITH (security_invoker=true) AS
SELECT 
  r.date,
  COUNT(r.receipt_number) as transaction_count,
  SUM(r.amount) as total_revenue,
  AVG(r.amount) as average_transaction,
  MIN(r.amount) as min_transaction,
  MAX(r.amount) as max_transaction
FROM receipts r
GROUP BY r.date
ORDER BY r.date DESC;

-- Create view for charging point utilization
CREATE VIEW public.charging_point_utilization WITH (security_invoker=true) AS
SELECT 
  c.company_name,
  c.branch,
  COUNT(cp.id) as total_points,
  SUM(CASE WHEN cp.availability = 'Available' THEN 1 ELSE 0 END) as available,
  SUM(CASE WHEN cp.availability = 'Occupied' THEN 1 ELSE 0 END) as occupied,
  SUM(CASE WHEN cp.availability = 'Maintenance' THEN 1 ELSE 0 END) as maintenance,
  ROUND(
    (SUM(CASE WHEN cp.availability = 'Occupied' THEN 1 ELSE 0 END)::numeric / 
    NULLIF(COUNT(cp.id), 0) * 100), 2
  ) as utilization_percentage
FROM companies c
LEFT JOIN charging_points cp ON c.id = cp.company_id
GROUP BY c.id, c.company_name, c.branch;

-- Attach update_updated_at triggers to tables
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_charging_points_updated_at ON charging_points;
CREATE TRIGGER update_charging_points_updated_at
  BEFORE UPDATE ON charging_points
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ev_info_updated_at ON ev_info;
CREATE TRIGGER update_ev_info_updated_at
  BEFORE UPDATE ON ev_info
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_receipts_updated_at ON receipts;
CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Attach audit triggers
DROP TRIGGER IF EXISTS audit_companies ON companies;
CREATE TRIGGER audit_companies
  AFTER INSERT OR UPDATE OR DELETE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_customers ON customers;
CREATE TRIGGER audit_customers
  AFTER INSERT OR UPDATE OR DELETE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_charging_points ON charging_points;
CREATE TRIGGER audit_charging_points
  AFTER INSERT OR UPDATE OR DELETE ON charging_points
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_ev_info ON ev_info;
CREATE TRIGGER audit_ev_info
  AFTER INSERT OR UPDATE OR DELETE ON ev_info
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_receipts ON receipts;
CREATE TRIGGER audit_receipts
  AFTER INSERT OR UPDATE OR DELETE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION audit_trigger_function();

-- Attach validation triggers
DROP TRIGGER IF EXISTS validate_charging_point_availability_trigger ON charging_points;
CREATE TRIGGER validate_charging_point_availability_trigger
  BEFORE INSERT OR UPDATE ON charging_points
  FOR EACH ROW
  EXECUTE FUNCTION validate_charging_point_availability();

DROP TRIGGER IF EXISTS validate_receipt_amount_trigger ON receipts;
CREATE TRIGGER validate_receipt_amount_trigger
  BEFORE INSERT OR UPDATE ON receipts
  FOR EACH ROW
  EXECUTE FUNCTION validate_receipt_amount();