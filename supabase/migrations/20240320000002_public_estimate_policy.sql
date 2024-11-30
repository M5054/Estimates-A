-- Create policy to allow public access to estimates
CREATE POLICY "Allow public access to estimates"
ON public.estimates
FOR SELECT
USING (true);

-- Create policy to allow public access to clients
CREATE POLICY "Allow public access to clients"
ON public.clients
FOR SELECT
USING (true);

-- Create policy to allow public access to profiles
CREATE POLICY "Allow public access to profiles"
ON public.profiles
FOR SELECT
USING (true);