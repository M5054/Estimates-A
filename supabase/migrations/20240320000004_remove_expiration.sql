-- Remove expiration-related columns and update policy
ALTER TABLE estimates
DROP COLUMN IF EXISTS expires_at;

-- Update public access policy
DROP POLICY IF EXISTS "Allow public access to estimates" ON public.estimates;

CREATE POLICY "Allow public access to estimates"
ON public.estimates
FOR SELECT
USING (true);