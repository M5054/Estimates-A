-- Add expires_at column to estimates table
ALTER TABLE estimates
ADD COLUMN expires_at TIMESTAMPTZ;

-- Add enabled column to control public access
ALTER TABLE estimates
ADD COLUMN public_enabled BOOLEAN DEFAULT true;

-- Update public access policy to check expiration and enabled status
DROP POLICY IF EXISTS "Allow public access to estimates" ON public.estimates;

CREATE POLICY "Allow public access to estimates"
ON public.estimates
FOR SELECT
USING (
  public_enabled = true 
  AND (
    expires_at IS NULL 
    OR expires_at > CURRENT_TIMESTAMP
  )
);