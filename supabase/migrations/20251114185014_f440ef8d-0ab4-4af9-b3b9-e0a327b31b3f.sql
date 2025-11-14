-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Create trigger function for profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign 'user' role by default
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Profiles RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- User roles RLS policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on customers
DROP POLICY IF EXISTS "Allow public delete on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public insert on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public read access on customers" ON public.customers;
DROP POLICY IF EXISTS "Allow public update on customers" ON public.customers;

-- Add user_id to customers table
ALTER TABLE public.customers ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing customers to have NULL user_id (admins can see all)
-- New customers will be linked to authenticated users

-- Customers RLS policies - authenticated users see their own, admins see all
CREATE POLICY "Users can view their own customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own customers"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete customers"
  ON public.customers FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on receipts
DROP POLICY IF EXISTS "Allow public delete on receipts" ON public.receipts;
DROP POLICY IF EXISTS "Allow public insert on receipts" ON public.receipts;
DROP POLICY IF EXISTS "Allow public read access on receipts" ON public.receipts;
DROP POLICY IF EXISTS "Allow public update on receipts" ON public.receipts;

-- Receipts RLS policies - admin only
CREATE POLICY "Admins can view all receipts"
  ON public.receipts FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert receipts"
  ON public.receipts FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update receipts"
  ON public.receipts FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete receipts"
  ON public.receipts FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on ev_info
DROP POLICY IF EXISTS "Allow public delete on ev_info" ON public.ev_info;
DROP POLICY IF EXISTS "Allow public insert on ev_info" ON public.ev_info;
DROP POLICY IF EXISTS "Allow public read access on ev_info" ON public.ev_info;
DROP POLICY IF EXISTS "Allow public update on ev_info" ON public.ev_info;

-- EV Info RLS policies - admin only
CREATE POLICY "Admins can view all ev_info"
  ON public.ev_info FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert ev_info"
  ON public.ev_info FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update ev_info"
  ON public.ev_info FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete ev_info"
  ON public.ev_info FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on companies
DROP POLICY IF EXISTS "Allow public delete on companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public insert on companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public read access on companies" ON public.companies;
DROP POLICY IF EXISTS "Allow public update on companies" ON public.companies;

-- Companies RLS policies - admin only
CREATE POLICY "Authenticated users can view companies"
  ON public.companies FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert companies"
  ON public.companies FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update companies"
  ON public.companies FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete companies"
  ON public.companies FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policies on charging_points
DROP POLICY IF EXISTS "Allow public delete on charging_points" ON public.charging_points;
DROP POLICY IF EXISTS "Allow public insert on charging_points" ON public.charging_points;
DROP POLICY IF EXISTS "Allow public read access on charging_points" ON public.charging_points;
DROP POLICY IF EXISTS "Allow public update on charging_points" ON public.charging_points;

-- Charging Points RLS policies - admin only
CREATE POLICY "Authenticated users can view charging_points"
  ON public.charging_points FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert charging_points"
  ON public.charging_points FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update charging_points"
  ON public.charging_points FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete charging_points"
  ON public.charging_points FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Drop existing public policy on audit_logs
DROP POLICY IF EXISTS "Allow public read access on audit_logs" ON public.audit_logs;

-- Audit Logs RLS policies - admin only
CREATE POLICY "Admins can view audit_logs"
  ON public.audit_logs FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Add update trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();