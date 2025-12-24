-- Add policy for admins to view all banners (including inactive)
CREATE POLICY "Admins can view all banners"
ON public.program_banners
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));