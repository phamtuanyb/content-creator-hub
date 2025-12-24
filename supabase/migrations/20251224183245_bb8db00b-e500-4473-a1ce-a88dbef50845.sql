-- Drop the old constraint
ALTER TABLE public.profiles DROP CONSTRAINT profiles_status_check;

-- Add new constraint that includes 'pending' status
ALTER TABLE public.profiles ADD CONSTRAINT profiles_status_check 
CHECK (status = ANY (ARRAY['pending'::text, 'active'::text, 'locked'::text]));