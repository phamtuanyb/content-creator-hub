-- Change default status from 'active' to 'pending' for new registrations
ALTER TABLE public.profiles 
ALTER COLUMN status SET DEFAULT 'pending';

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.status IS 'Account status: pending (awaiting activation), active (can access system), locked (blocked by admin)';