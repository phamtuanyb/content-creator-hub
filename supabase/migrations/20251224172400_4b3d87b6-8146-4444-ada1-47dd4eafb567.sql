-- Fix security issue: User Email Addresses Could Be Harvested
-- Problem: activation_requests table exposes user_email to users via SELECT policy
-- Solution: Make SELECT admin-only, create secure view for user status checks

-- Step 1: Drop the existing user SELECT policy that exposes sensitive data
DROP POLICY IF EXISTS "Users can view own activation request" ON public.activation_requests;

-- Step 2: Create new admin-only SELECT policy
CREATE POLICY "Admins can view all activation requests"
ON public.activation_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Step 3: Create a secure view for users to check their activation status
-- This view ONLY exposes safe columns (no email, no workflow details)
CREATE OR REPLACE VIEW public.user_activation_status AS
SELECT 
  user_id,
  status,
  created_at
FROM public.activation_requests
WHERE user_id = auth.uid();

-- Step 4: Grant access to the view for authenticated users
GRANT SELECT ON public.user_activation_status TO authenticated;

-- Step 5: Add comment explaining the security design
COMMENT ON VIEW public.user_activation_status IS 
'Secure view for users to check their own activation status. 
Does not expose email or sensitive workflow data. 
Users cannot enumerate or access other users data.';

-- Verify: The INSERT policy "Pending users can create activation request" 
-- already correctly restricts INSERT to user_id = auth.uid()
-- The UPDATE and DELETE policies are already admin-only