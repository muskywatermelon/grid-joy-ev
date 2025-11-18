-- Create view for company summary with aggregated data
CREATE OR REPLACE VIEW public.company_summary AS
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
CREATE OR REPLACE VIEW public.charging_point_details AS
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
CREATE OR REPLACE VIEW public.ev_details AS
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
CREATE OR REPLACE VIEW public.receipt_details AS
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
CREATE OR REPLACE VIEW public.daily_revenue_summary AS
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
CREATE OR REPLACE VIEW public.charging_point_utilization AS
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

-- Grant SELECT permissions on views
GRANT SELECT ON public.company_summary TO authenticated, anon;
GRANT SELECT ON public.charging_point_details TO authenticated, anon;
GRANT SELECT ON public.ev_details TO authenticated, anon;
GRANT SELECT ON public.receipt_details TO authenticated, anon;
GRANT SELECT ON public.daily_revenue_summary TO authenticated, anon;
GRANT SELECT ON public.charging_point_utilization TO authenticated, anon;