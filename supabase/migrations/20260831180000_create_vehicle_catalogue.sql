CREATE TABLE IF NOT EXISTS public.vehicle_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text UNIQUE,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vehicle_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES public.vehicle_brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, name)
);

CREATE TABLE IF NOT EXISTS public.vehicle_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id uuid NOT NULL REFERENCES public.vehicle_models(id) ON DELETE CASCADE,
  name text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (model_id, name)
);

CREATE INDEX IF NOT EXISTS vehicle_models_brand_id_idx ON public.vehicle_models (brand_id, sort_order, name);
CREATE INDEX IF NOT EXISTS vehicle_variants_model_id_idx ON public.vehicle_variants (model_id, sort_order, name);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS vehicle_brand_id uuid REFERENCES public.vehicle_brands(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vehicle_brand_name text,
  ADD COLUMN IF NOT EXISTS vehicle_model_id uuid REFERENCES public.vehicle_models(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vehicle_model_name text,
  ADD COLUMN IF NOT EXISTS vehicle_variant_id uuid REFERENCES public.vehicle_variants(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS vehicle_variant_name text;

ALTER TABLE public.vehicle_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_variants ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.vehicle_brands, public.vehicle_models, public.vehicle_variants TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.vehicle_brands, public.vehicle_models, public.vehicle_variants TO authenticated;
GRANT ALL ON public.vehicle_brands, public.vehicle_models, public.vehicle_variants TO service_role;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_brands' AND policyname = 'Public can view active vehicle brands') THEN
    CREATE POLICY "Public can view active vehicle brands" ON public.vehicle_brands FOR SELECT TO anon, authenticated USING (active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_brands' AND policyname = 'Admins manage vehicle brands') THEN
    CREATE POLICY "Admins manage vehicle brands" ON public.vehicle_brands FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_models' AND policyname = 'Public can view active vehicle models') THEN
    CREATE POLICY "Public can view active vehicle models" ON public.vehicle_models FOR SELECT TO anon, authenticated USING (active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_models' AND policyname = 'Admins manage vehicle models') THEN
    CREATE POLICY "Admins manage vehicle models" ON public.vehicle_models FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_variants' AND policyname = 'Public can view active vehicle variants') THEN
    CREATE POLICY "Public can view active vehicle variants" ON public.vehicle_variants FOR SELECT TO anon, authenticated USING (active = true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'vehicle_variants' AND policyname = 'Admins manage vehicle variants') THEN
    CREATE POLICY "Admins manage vehicle variants" ON public.vehicle_variants FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicle_brands_updated_at') THEN CREATE TRIGGER update_vehicle_brands_updated_at BEFORE UPDATE ON public.vehicle_brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicle_models_updated_at') THEN CREATE TRIGGER update_vehicle_models_updated_at BEFORE UPDATE ON public.vehicle_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_vehicle_variants_updated_at') THEN CREATE TRIGGER update_vehicle_variants_updated_at BEFORE UPDATE ON public.vehicle_variants FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); END IF;
END $$;
