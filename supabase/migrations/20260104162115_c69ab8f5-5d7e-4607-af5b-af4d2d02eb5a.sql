-- Drop the restrictive policy and create a permissive one
DROP POLICY IF EXISTS "Anyone can view published content" ON public.content;

-- Create a permissive policy that allows viewing published content
CREATE POLICY "Anyone can view published content" 
ON public.content 
FOR SELECT 
USING ((status = 'published'::text) OR (owner_id = auth.uid()) OR has_role(auth.uid(), 'admin'::app_role));