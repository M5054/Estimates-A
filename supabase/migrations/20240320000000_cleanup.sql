-- Drop existing triggers
DROP TRIGGER IF EXISTS set_estimate_number ON estimates;

-- Drop existing functions
DROP FUNCTION IF EXISTS generate_estimate_number();

-- Drop existing tables
DROP TABLE IF EXISTS public.appointments CASCADE;
DROP TABLE IF EXISTS public.estimates CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view own estimates" ON public.estimates;
DROP POLICY IF EXISTS "Users can insert own estimates" ON public.estimates;
DROP POLICY IF EXISTS "Users can update own estimates" ON public.estimates;
DROP POLICY IF EXISTS "Users can delete own estimates" ON public.estimates;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can insert own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can delete own appointments" ON public.appointments;

-- Drop storage policies
DROP POLICY IF EXISTS "Users can upload their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own logos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view all logos" ON storage.objects;