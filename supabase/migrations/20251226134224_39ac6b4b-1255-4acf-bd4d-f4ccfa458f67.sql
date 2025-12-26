-- Allow users to view their own activation requests
CREATE POLICY "Users can view own activation requests"
ON public.activation_requests
FOR SELECT
USING (user_id = auth.uid());