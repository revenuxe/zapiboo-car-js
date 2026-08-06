CREATE POLICY "Admins can read all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));