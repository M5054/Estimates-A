-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT,
    business_email TEXT,
    business_phone TEXT,
    business_address TEXT,
    business_city TEXT,
    business_state TEXT,
    business_zip TEXT,
    business_country TEXT,
    business_website TEXT,
    business_tax_id TEXT,
    business_logo TEXT,
    CONSTRAINT profiles_email_key UNIQUE (email)
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    CONSTRAINT clients_email_user_key UNIQUE (email, user_id)
);

-- Create estimates table
CREATE TABLE IF NOT EXISTS public.estimates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    estimate_number TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    total DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected')),
    valid_until DATE NOT NULL,
    notes TEXT,
    terms TEXT,
    CONSTRAINT estimates_number_user_key UNIQUE (estimate_number, user_id)
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location TEXT,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    measurements JSONB DEFAULT '[]'::jsonb
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Create policies for clients
CREATE POLICY "Users can view own clients"
    ON public.clients FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
    ON public.clients FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clients"
    ON public.clients FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clients"
    ON public.clients FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for estimates
CREATE POLICY "Users can view own estimates"
    ON public.estimates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own estimates"
    ON public.estimates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own estimates"
    ON public.estimates FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own estimates"
    ON public.estimates FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for appointments
CREATE POLICY "Users can view own appointments"
    ON public.appointments FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own appointments"
    ON public.appointments FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own appointments"
    ON public.appointments FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own appointments"
    ON public.appointments FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS clients_user_id_idx ON public.clients(user_id);
CREATE INDEX IF NOT EXISTS clients_email_idx ON public.clients(email);
CREATE INDEX IF NOT EXISTS estimates_user_id_idx ON public.estimates(user_id);
CREATE INDEX IF NOT EXISTS estimates_client_id_idx ON public.estimates(client_id);
CREATE INDEX IF NOT EXISTS estimates_status_idx ON public.estimates(status);
CREATE INDEX IF NOT EXISTS estimates_created_at_idx ON public.estimates(created_at);
CREATE INDEX IF NOT EXISTS appointments_user_id_idx ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS appointments_client_id_idx ON public.appointments(client_id);
CREATE INDEX IF NOT EXISTS appointments_date_idx ON public.appointments(date);
CREATE INDEX IF NOT EXISTS appointments_status_idx ON public.appointments(status);
CREATE INDEX IF NOT EXISTS appointments_measurements_idx ON public.appointments USING gin(measurements);

-- Create function to auto-increment estimate numbers
CREATE OR REPLACE FUNCTION generate_estimate_number()
RETURNS TRIGGER AS $$
DECLARE
    year_prefix TEXT;
    next_number INTEGER;
BEGIN
    -- Get the current year as prefix (e.g., '2024')
    year_prefix := to_char(CURRENT_DATE, 'YYYY');
    
    -- Get the next number for this user and year
    SELECT COALESCE(MAX(NULLIF(regexp_replace(estimate_number, '^' || year_prefix || '-', ''), '')::INTEGER), 0) + 1
    INTO next_number
    FROM estimates
    WHERE user_id = NEW.user_id
    AND estimate_number LIKE year_prefix || '-%';
    
    -- Set the new estimate number
    NEW.estimate_number := year_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-incrementing estimate numbers
DROP TRIGGER IF EXISTS set_estimate_number ON estimates;
CREATE TRIGGER set_estimate_number
    BEFORE INSERT ON estimates
    FOR EACH ROW
    EXECUTE FUNCTION generate_estimate_number();

-- Create storage bucket for business logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-logos', 'business-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for business logos
CREATE POLICY "Users can upload their own logos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'business-logos' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own logos"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'business-logos' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own logos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'business-logos' AND
    auth.role() = 'authenticated' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Public can view all logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'business-logos');