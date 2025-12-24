-- Fix: Drop the view and use a SECURITY DEFINER function instead
-- This allows users to query their own activation status without needing SELECT on the base table

-- Step 1: Drop the problematic view
DROP VIEW IF EXISTS public.user_activation_status;

-- Step 2: Create a secure function to get user's own activation status
-- Uses SECURITY DEFINER to bypass RLS, but only returns the calling user's own data
CREATE OR REPLACE FUNCTION public.get_my_activation_status()
RETURNS TABLE (
  user_id uuid,
  status text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    ar.user_id,
    ar.status,
    ar.created_at
  FROM public.activation_requests ar
  WHERE ar.user_id = auth.uid()
  LIMIT 1;
$$;

-- Step 3: Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_my_activation_status() TO authenticated;

-- Add comment explaining the security design
COMMENT ON FUNCTION public.get_my_activation_status() IS 
'Secure function for users to check their own activation status. 
Uses SECURITY DEFINER but only returns data where user_id = auth.uid().
Does not expose email or sensitive workflow data to users.';