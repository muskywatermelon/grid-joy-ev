-- Fix security warnings by setting search_path for all functions

-- Recreate update_updated_at_column with search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate audit_trigger_function with search_path
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- Recreate validate_charging_point_availability with search_path
CREATE OR REPLACE FUNCTION public.validate_charging_point_availability()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.availability NOT IN ('Available', 'Occupied', 'Maintenance') THEN
    RAISE EXCEPTION 'Invalid availability status. Must be Available, Occupied, or Maintenance';
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate validate_receipt_amount with search_path
CREATE OR REPLACE FUNCTION public.validate_receipt_amount()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.amount <= 0 THEN
    RAISE EXCEPTION 'Receipt amount must be greater than zero';
  END IF;
  RETURN NEW;
END;
$$;