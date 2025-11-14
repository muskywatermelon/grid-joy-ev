-- Add updated_at column to all tables and create triggers for automatic timestamp updates

-- Add updated_at columns
ALTER TABLE public.companies ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.ev_info ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.charging_points ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
ALTER TABLE public.receipts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for all tables
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ev_info_updated_at
  BEFORE UPDATE ON public.ev_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_charging_points_updated_at
  BEFORE UPDATE ON public.charging_points
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create audit log table for tracking changes
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id BIGSERIAL PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  record_id TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access on audit_logs
CREATE POLICY "Allow public read access on audit_logs"
ON public.audit_logs
FOR SELECT
USING (true);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data)
    VALUES (TG_TABLE_NAME, TG_OP, OLD.id::TEXT, row_to_json(OLD)::JSONB);
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, old_data, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id::TEXT, row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB);
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_logs (table_name, operation, record_id, new_data)
    VALUES (TG_TABLE_NAME, TG_OP, NEW.id::TEXT, row_to_json(NEW)::JSONB);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for companies
CREATE TRIGGER audit_companies_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Create audit triggers for customers
CREATE TRIGGER audit_customers_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_trigger_function();

-- Create trigger to validate charging point availability
CREATE OR REPLACE FUNCTION public.validate_charging_point_availability()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.availability NOT IN ('Available', 'Occupied', 'Maintenance') THEN
    RAISE EXCEPTION 'Invalid availability status. Must be Available, Occupied, or Maintenance';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_charging_availability_trigger
  BEFORE INSERT OR UPDATE ON public.charging_points
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_charging_point_availability();

-- Create trigger to auto-calculate receipt totals and validate amounts
CREATE OR REPLACE FUNCTION public.validate_receipt_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Receipt amount must be greater than zero';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_receipt_trigger
  BEFORE INSERT OR UPDATE ON public.receipts
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_receipt_amount();