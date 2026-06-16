DROP POLICY IF EXISTS "Public can view active listings" ON public.scrap_listings;

CREATE POLICY "Public can view active listings"
ON public.scrap_listings
FOR SELECT
TO anon, authenticated
USING (active = true);

CREATE POLICY "Admins can view all listings"
ON public.scrap_listings
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));