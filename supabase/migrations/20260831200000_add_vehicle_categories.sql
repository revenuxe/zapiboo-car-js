CREATE TABLE IF NOT EXISTS public.vehicle_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.vehicle_subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.vehicle_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(category_id, name)
);
ALTER TABLE public.vehicle_brands ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.vehicle_categories(id) ON DELETE SET NULL;
ALTER TABLE public.vehicle_brands ADD COLUMN IF NOT EXISTS subcategory_id uuid REFERENCES public.vehicle_subcategories(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS vehicle_subcategories_category_id_idx ON public.vehicle_subcategories(category_id, sort_order, name);
CREATE INDEX IF NOT EXISTS vehicle_brands_category_id_idx ON public.vehicle_brands(category_id, subcategory_id, sort_order, name);
ALTER TABLE public.vehicle_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_subcategories ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.vehicle_categories, public.vehicle_subcategories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vehicle_categories, public.vehicle_subcategories TO authenticated;
GRANT ALL ON public.vehicle_categories, public.vehicle_subcategories TO service_role;
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vehicle_categories' AND policyname='Public can view active vehicle categories') THEN CREATE POLICY "Public can view active vehicle categories" ON public.vehicle_categories FOR SELECT TO anon, authenticated USING (active); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vehicle_categories' AND policyname='Admins manage vehicle categories') THEN CREATE POLICY "Admins manage vehicle categories" ON public.vehicle_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin')); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vehicle_subcategories' AND policyname='Public can view active vehicle subcategories') THEN CREATE POLICY "Public can view active vehicle subcategories" ON public.vehicle_subcategories FOR SELECT TO anon, authenticated USING (active); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='vehicle_subcategories' AND policyname='Admins manage vehicle subcategories') THEN CREATE POLICY "Admins manage vehicle subcategories" ON public.vehicle_subcategories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin')); END IF;
END $$;
INSERT INTO public.vehicle_categories (name, sort_order) VALUES ('Car', 1), ('Bike', 2), ('Scooter', 3), ('Commercial vehicle', 4) ON CONFLICT (name) DO NOTHING;
INSERT INTO public.vehicle_subcategories (category_id, name, sort_order)
SELECT id, 'All', 1 FROM public.vehicle_categories ON CONFLICT (category_id, name) DO NOTHING;
UPDATE public.vehicle_brands b SET category_id = c.id, subcategory_id = s.id FROM public.vehicle_categories c JOIN public.vehicle_subcategories s ON s.category_id=c.id AND s.name='All' WHERE b.category_id IS NULL AND ((c.name='Bike' AND b.name IN ('Hero MotoCorp','Honda 2-Wheeler','Bajaj','TVS')) OR (c.name='Car' AND b.name NOT IN ('Hero MotoCorp','Honda 2-Wheeler','Bajaj','TVS')));
NOTIFY pgrst, 'reload schema';
