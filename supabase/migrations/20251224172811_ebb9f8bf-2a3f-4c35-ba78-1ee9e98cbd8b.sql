-- Fix SECURITY DEFINER VIEW issue
-- The view should use SECURITY INVOKER (default) to respect the calling user's permissions

-- Drop and recreate the view with explicit SECURITY INVOKER
DROP VIEW IF EXISTS public.user_activation_status;

CREATE VIEW public.user_activation_status 
WITH (security_invoker = true) AS
SELECT 
  user_id,
  status,
  created_at
FROM public.activation_requests
WHERE user_id = auth.uid();

-- Re-grant access to authenticated users
GRANT SELECT ON public.user_activation_status TO authenticated;

COMMENT ON VIEW public.user_activation_status IS 
'Secure view (SECURITY INVOKER) for users to check their own activation status. 
Does not expose email or sensitive workflow data. 
Users cannot enumerate or access other users data.';