-- Platform on brands: drives which processor/config specs apply (apple vs windows)
ALTER TABLE public.device_brands
  ADD COLUMN IF NOT EXISTS platform text NOT NULL DEFAULT 'windows';

-- Manufacturing year on models to power age-based depreciation
ALTER TABLE public.device_models
  ADD COLUMN IF NOT EXISTS year integer;

-- ============ spec_groups: configuration questions (processor, RAM, storage, GPU) ============
CREATE TABLE IF NOT EXISTS public.spec_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.device_categories(id) ON DELETE CASCADE,
  platform text,                                   -- null = all platforms, else 'apple' | 'windows'
  key text NOT NULL,
  title text NOT NULL,
  subtitle text,
  selection text NOT NULL DEFAULT 'single',        -- 'single' | 'multi'
  step_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.spec_groups TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spec_groups TO authenticated;
GRANT ALL ON public.spec_groups TO service_role;

ALTER TABLE public.spec_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active spec groups"
  ON public.spec_groups FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins manage spec groups"
  ON public.spec_groups FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_spec_groups_updated_at
  BEFORE UPDATE ON public.spec_groups
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ spec_options: choices per spec group with price impact ============
CREATE TABLE IF NOT EXISTS public.spec_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES public.spec_groups(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'deduct_fixed',       -- 'deduct_fixed' | 'deduct_percent' | 'bonus_fixed'
  value numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.spec_options TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spec_options TO authenticated;
GRANT ALL ON public.spec_options TO service_role;

ALTER TABLE public.spec_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view spec options"
  ON public.spec_options FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins manage spec options"
  ON public.spec_options FOR ALL
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_spec_options_updated_at
  BEFORE UPDATE ON public.spec_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_spec_groups_category ON public.spec_groups(category_id);
CREATE INDEX IF NOT EXISTS idx_spec_options_group ON public.spec_options(group_id);