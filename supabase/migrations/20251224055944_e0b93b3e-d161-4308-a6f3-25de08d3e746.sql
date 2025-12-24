-- Create activation_requests table
CREATE TABLE public.activation_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent',
  processed_at TIMESTAMP WITH TIME ZONE,
  processed_by UUID
);

-- Enable RLS
ALTER TABLE public.activation_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own activation request
CREATE POLICY "Users can view own activation request"
ON public.activation_requests
FOR SELECT
USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role));

-- Only pending users can insert their own activation request
CREATE POLICY "Pending users can create activation request"
ON public.activation_requests
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Only admins can update activation requests
CREATE POLICY "Admins can update activation requests"
ON public.activation_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete activation requests
CREATE POLICY "Admins can delete activation requests"
ON public.activation_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create unique constraint to prevent duplicate requests per user
CREATE UNIQUE INDEX activation_requests_user_id_unique ON public.activation_requests (user_id);