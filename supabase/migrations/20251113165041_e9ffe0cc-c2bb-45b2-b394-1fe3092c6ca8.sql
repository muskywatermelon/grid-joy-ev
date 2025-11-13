-- Create companies table
CREATE TABLE public.companies (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  branch TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  phone_no TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create ev_info table
CREATE TABLE public.ev_info (
  num_plate TEXT PRIMARY KEY,
  company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  specs TEXT NOT NULL,
  model TEXT NOT NULL,
  battery_time TEXT NOT NULL,
  volt_req DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create charging_points table
CREATE TABLE public.charging_points (
  id BIGSERIAL PRIMARY KEY,
  company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  location TEXT NOT NULL UNIQUE,
  num_of_points INTEGER NOT NULL,
  availability TEXT NOT NULL CHECK (availability IN ('Available', 'Occupied', 'Maintenance')),
  functionality TEXT NOT NULL,
  max_voltage DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create receipts table
CREATE TABLE public.receipts (
  receipt_number TEXT PRIMARY KEY,
  company_id BIGINT REFERENCES public.companies(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ev_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charging_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;

-- Create public access policies (no authentication required for this demo)
CREATE POLICY "Allow public read access on companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Allow public insert on companies" ON public.companies FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on companies" ON public.companies FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on companies" ON public.companies FOR DELETE USING (true);

CREATE POLICY "Allow public read access on customers" ON public.customers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on customers" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on customers" ON public.customers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on customers" ON public.customers FOR DELETE USING (true);

CREATE POLICY "Allow public read access on ev_info" ON public.ev_info FOR SELECT USING (true);
CREATE POLICY "Allow public insert on ev_info" ON public.ev_info FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ev_info" ON public.ev_info FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on ev_info" ON public.ev_info FOR DELETE USING (true);

CREATE POLICY "Allow public read access on charging_points" ON public.charging_points FOR SELECT USING (true);
CREATE POLICY "Allow public insert on charging_points" ON public.charging_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on charging_points" ON public.charging_points FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on charging_points" ON public.charging_points FOR DELETE USING (true);

CREATE POLICY "Allow public read access on receipts" ON public.receipts FOR SELECT USING (true);
CREATE POLICY "Allow public insert on receipts" ON public.receipts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on receipts" ON public.receipts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on receipts" ON public.receipts FOR DELETE USING (true);

-- Insert initial data
INSERT INTO public.companies (id, company_name, branch) VALUES
  (0, 'Honda', 'Mumbai'),
  (1, 'Toyota', 'Bengaluru'),
  (2, 'Tesla', 'Delhi'),
  (3, 'Ather', 'Chennai'),
  (4, 'Tata', 'Goa');

INSERT INTO public.customers (id, name, phone_no, address) VALUES
  (101, 'David', '9876543210', 'Mumbai'),
  (102, 'Sam', '9876543211', 'Bengaluru'),
  (103, 'Alicia', '9876543212', 'Delhi'),
  (104, 'Alex', '9876543213', 'Chennai'),
  (105, 'Robbi', '9876543214', 'Goa'),
  (106, 'Jack', '9876543215', 'Pune'),
  (107, 'Tom', '9876543216', 'Lucknow');

INSERT INTO public.ev_info (num_plate, company_id, specs, model, battery_time, volt_req, cost) VALUES
  ('ABC1234', 0, 'Scooter', 'VX2024', '8 hours', 400.0, 35000.0),
  ('DEF5678', 1, 'Car', 'SRX-E', '6 hours', 350.5, 28000.0),
  ('GHI9012', 2, 'SUV', 'AMP-SUV', '10 hours', 420.0, 45000.0),
  ('JKL3456', 3, 'Sedan', 'EF2023', '7 hours', 380.0, 32000.0),
  ('MNO7890', 4, 'Scooter', 'CB-2024', '5 hours', 360.0, 27000.0);

INSERT INTO public.charging_points (company_id, location, num_of_points, availability, functionality, max_voltage) VALUES
  (1, 'Downtown Plaza', 8, 'Available', 'Fast Charging', 400.0),
  (2, 'Airport Terminal', 12, 'Occupied', 'Normal', 220.0),
  (3, 'Mall Parking', 5, 'Available', 'Fast Charging', 350.0),
  (4, 'City Center', 10, 'Maintenance', 'Normal', 240.0),
  (0, 'Highway Stop', 3, 'Occupied', 'Fast Charging', 400.0);

INSERT INTO public.receipts (receipt_number, company_id, amount, date, time) VALUES
  ('R001', 1, 150.75, '2025-08-21', '14:35:00'),
  ('R002', 2, 320.0, '2025-08-22', '09:15:00'),
  ('R003', 3, 100.5, '2025-08-22', '11:45:00'),
  ('R004', 4, 450.0, '2025-08-23', '16:00:00'),
  ('R009', 0, 90.0, '2025-08-27', '15:00:00');