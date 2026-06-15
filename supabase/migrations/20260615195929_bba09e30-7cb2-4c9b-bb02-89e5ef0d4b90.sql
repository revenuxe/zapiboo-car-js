-- Scrap listings: items the admin lists for sale/showcase, browsable by the public
CREATE TABLE public.scrap_listings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  category_id uuid REFERENCES public.scrap_categories(id) ON DELETE SET NULL,
  subcategory text,
  condition text NOT NULL DEFAULT 'used',
  price text,
  unit text NOT NULL DEFAULT '/ kg',
  quantity text,
  location text,
  images text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.scrap_listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scrap_listings TO authenticated;
GRANT ALL ON public.scrap_listings TO service_role;

ALTER TABLE public.scrap_listings ENABLE ROW LEVEL SECURITY;

-- Public can read active listings; admins can read everything
CREATE POLICY "Public can view active listings"
ON public.scrap_listings
FOR SELECT
TO anon, authenticated
USING (active = true OR public.has_role(auth.uid(), 'admin'));

-- Only admins can create/update/delete listings
CREATE POLICY "Admins can insert listings"
ON public.scrap_listings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update listings"
ON public.scrap_listings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete listings"
ON public.scrap_listings
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_scrap_listings_updated_at
BEFORE UPDATE ON public.scrap_listings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_scrap_listings_active ON public.scrap_listings (active, sort_order);
CREATE INDEX idx_scrap_listings_category ON public.scrap_listings (category_id);