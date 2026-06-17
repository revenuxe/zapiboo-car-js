-- ============ TABLES ============
CREATE TABLE public.device_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.device_brands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.device_categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  logo text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

CREATE TABLE public.device_series (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id uuid NOT NULL REFERENCES public.device_brands(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (brand_id, slug)
);

CREATE TABLE public.device_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  series_id uuid NOT NULL REFERENCES public.device_series(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  base_price numeric NOT NULL DEFAULT 0,
  image text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (series_id, slug)
);

CREATE TABLE public.condition_groups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES public.device_categories(id) ON DELETE CASCADE,
  key text NOT NULL,
  title text NOT NULL,
  subtitle text,
  selection text NOT NULL DEFAULT 'single', -- 'single' | 'multi'
  step_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.condition_options (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid NOT NULL REFERENCES public.condition_groups(id) ON DELETE CASCADE,
  label text NOT NULL,
  description text,
  kind text NOT NULL DEFAULT 'deduct_fixed', -- 'deduct_fixed' | 'deduct_percent' | 'bonus_fixed'
  value numeric NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.device_orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.device_categories(id) ON DELETE SET NULL,
  model_id uuid REFERENCES public.device_models(id) ON DELETE SET NULL,
  category_name text,
  brand_name text,
  series_name text,
  model_name text,
  base_price numeric NOT NULL DEFAULT 0,
  final_price numeric NOT NULL DEFAULT 0,
  selections jsonb NOT NULL DEFAULT '[]'::jsonb,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  address text,
  pincode text,
  preferred_date text,
  slot text,
  notes text,
  status text NOT NULL DEFAULT 'new',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ GRANTS ============
GRANT SELECT ON public.device_categories TO anon, authenticated;
GRANT ALL ON public.device_categories TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.device_categories TO authenticated;

GRANT SELECT ON public.device_brands TO anon, authenticated;
GRANT ALL ON public.device_brands TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.device_brands TO authenticated;

GRANT SELECT ON public.device_series TO anon, authenticated;
GRANT ALL ON public.device_series TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.device_series TO authenticated;

GRANT SELECT ON public.device_models TO anon, authenticated;
GRANT ALL ON public.device_models TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.device_models TO authenticated;

GRANT SELECT ON public.condition_groups TO anon, authenticated;
GRANT ALL ON public.condition_groups TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.condition_groups TO authenticated;

GRANT SELECT ON public.condition_options TO anon, authenticated;
GRANT ALL ON public.condition_options TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.condition_options TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.device_orders TO authenticated;
GRANT INSERT ON public.device_orders TO anon;
GRANT ALL ON public.device_orders TO service_role;

-- ============ RLS ============
ALTER TABLE public.device_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.condition_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_orders ENABLE ROW LEVEL SECURITY;

-- categories
CREATE POLICY "Public can view active categories" ON public.device_categories FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage categories" ON public.device_categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- brands
CREATE POLICY "Public can view active brands" ON public.device_brands FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage brands" ON public.device_brands FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- series
CREATE POLICY "Public can view active series" ON public.device_series FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage series" ON public.device_series FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- models
CREATE POLICY "Public can view active models" ON public.device_models FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage models" ON public.device_models FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- condition_groups
CREATE POLICY "Public can view active condition groups" ON public.condition_groups FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Admins manage condition groups" ON public.condition_groups FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- condition_options
CREATE POLICY "Public can view condition options" ON public.condition_options FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage condition options" ON public.condition_options FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- device_orders
CREATE POLICY "Anyone can create orders" ON public.device_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Users view own orders" ON public.device_orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users delete own orders" ON public.device_orders FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.device_orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS ============
CREATE TRIGGER update_device_categories_updated_at BEFORE UPDATE ON public.device_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_device_brands_updated_at BEFORE UPDATE ON public.device_brands FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_device_series_updated_at BEFORE UPDATE ON public.device_series FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_device_models_updated_at BEFORE UPDATE ON public.device_models FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_condition_groups_updated_at BEFORE UPDATE ON public.condition_groups FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_condition_options_updated_at BEFORE UPDATE ON public.condition_options FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_device_orders_updated_at BEFORE UPDATE ON public.device_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- auto-set user_id on orders (reuse pattern)
CREATE TRIGGER set_device_order_user_id BEFORE INSERT ON public.device_orders FOR EACH ROW EXECUTE FUNCTION public.set_lead_user_id();

-- ============ SEED: Laptop category ============
INSERT INTO public.device_categories (id, name, slug, icon, sort_order)
VALUES ('11111111-1111-1111-1111-111111111111', 'Laptop', 'laptops', 'Laptop', 1);

-- Condition groups for Laptop
INSERT INTO public.condition_groups (id, category_id, key, title, subtitle, selection, step_order) VALUES
('a1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'power', 'Is your laptop turning on?', 'Does it boot up to the home screen?', 'single', 1),
('a1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'grade', 'Overall physical condition', 'How does the body & screen look?', 'single', 2),
('a1111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'issues', 'Any functional issues?', 'Select all that apply', 'multi', 3),
('a1111111-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'age', 'How old is your laptop?', 'Time since purchase', 'single', 4),
('a1111111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'accessories', 'What accessories do you have?', 'Original items boost your price', 'multi', 5);

-- Power options
INSERT INTO public.condition_options (group_id, label, description, kind, value, sort_order) VALUES
('a1111111-0000-0000-0000-000000000001', 'Yes, turns on & works', 'Boots to home screen normally', 'deduct_fixed', 0, 1),
('a1111111-0000-0000-0000-000000000001', 'No, dead or won''t boot', 'Does not power on / no display', 'deduct_percent', 60, 2);

-- Grade options
INSERT INTO public.condition_options (group_id, label, description, kind, value, sort_order) VALUES
('a1111111-0000-0000-0000-000000000002', 'Like new', 'No scratches or dents, spotless', 'deduct_fixed', 0, 1),
('a1111111-0000-0000-0000-000000000002', 'Good', 'Minor scratches, fully functional', 'deduct_percent', 10, 2),
('a1111111-0000-0000-0000-000000000002', 'Average', 'Visible wear & scratches', 'deduct_percent', 25, 3),
('a1111111-0000-0000-0000-000000000002', 'Below average', 'Dents, heavy wear or cracks', 'deduct_percent', 40, 4);

-- Issues options
INSERT INTO public.condition_options (group_id, label, description, kind, value, sort_order) VALUES
('a1111111-0000-0000-0000-000000000003', 'Screen lines / spots', 'Display has lines, spots or dead pixels', 'deduct_percent', 25, 1),
('a1111111-0000-0000-0000-000000000003', 'Weak / dead battery', 'Battery drains fast or not charging', 'deduct_fixed', 2000, 2),
('a1111111-0000-0000-0000-000000000003', 'Keyboard / trackpad issue', 'Keys or trackpad not working', 'deduct_fixed', 1500, 3),
('a1111111-0000-0000-0000-000000000003', 'Speaker / audio issue', 'No sound or distorted audio', 'deduct_fixed', 800, 4),
('a1111111-0000-0000-0000-000000000003', 'Ports not working', 'USB / HDMI / charging port faults', 'deduct_fixed', 1000, 5),
('a1111111-0000-0000-0000-000000000003', 'Hinge / body damage', 'Loose hinge or broken body', 'deduct_fixed', 1500, 6);

-- Age options
INSERT INTO public.condition_options (group_id, label, description, kind, value, sort_order) VALUES
('a1111111-0000-0000-0000-000000000004', 'Under 1 year', 'Recently purchased', 'deduct_fixed', 0, 1),
('a1111111-0000-0000-0000-000000000004', '1 - 2 years', '', 'deduct_percent', 10, 2),
('a1111111-0000-0000-0000-000000000004', '2 - 3 years', '', 'deduct_percent', 20, 3),
('a1111111-0000-0000-0000-000000000004', 'More than 3 years', '', 'deduct_percent', 35, 4);

-- Accessories options (bonuses)
INSERT INTO public.condition_options (group_id, label, description, kind, value, sort_order) VALUES
('a1111111-0000-0000-0000-000000000005', 'Original bill / invoice', 'Proof of purchase', 'bonus_fixed', 800, 1),
('a1111111-0000-0000-0000-000000000005', 'Original box', 'Retail packaging', 'bonus_fixed', 300, 2),
('a1111111-0000-0000-0000-000000000005', 'Original charger', 'Genuine power adapter', 'bonus_fixed', 500, 3);

-- Demo brands
INSERT INTO public.device_brands (id, category_id, name, slug, sort_order) VALUES
('b1111111-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Apple', 'apple', 1),
('b1111111-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Dell', 'dell', 2),
('b1111111-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'HP', 'hp', 3),
('b1111111-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'Lenovo', 'lenovo', 4),
('b1111111-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'Asus', 'asus', 5);

-- Demo series
INSERT INTO public.device_series (id, brand_id, name, slug, sort_order) VALUES
('c1111111-0000-0000-0000-000000000001', 'b1111111-0000-0000-0000-000000000001', 'MacBook Air', 'macbook-air', 1),
('c1111111-0000-0000-0000-000000000002', 'b1111111-0000-0000-0000-000000000001', 'MacBook Pro', 'macbook-pro', 2),
('c1111111-0000-0000-0000-000000000003', 'b1111111-0000-0000-0000-000000000002', 'XPS', 'xps', 1),
('c1111111-0000-0000-0000-000000000004', 'b1111111-0000-0000-0000-000000000002', 'Inspiron', 'inspiron', 2),
('c1111111-0000-0000-0000-000000000005', 'b1111111-0000-0000-0000-000000000003', 'Pavilion', 'pavilion', 1),
('c1111111-0000-0000-0000-000000000006', 'b1111111-0000-0000-0000-000000000004', 'ThinkPad', 'thinkpad', 1),
('c1111111-0000-0000-0000-000000000007', 'b1111111-0000-0000-0000-000000000005', 'ZenBook', 'zenbook', 1);

-- Demo models
INSERT INTO public.device_models (series_id, name, slug, base_price, sort_order) VALUES
('c1111111-0000-0000-0000-000000000001', 'MacBook Air M1 (2020)', 'macbook-air-m1-2020', 42000, 1),
('c1111111-0000-0000-0000-000000000001', 'MacBook Air M2 (2022)', 'macbook-air-m2-2022', 58000, 2),
('c1111111-0000-0000-0000-000000000002', 'MacBook Pro 14" M2 (2023)', 'macbook-pro-14-m2-2023', 95000, 1),
('c1111111-0000-0000-0000-000000000002', 'MacBook Pro 13" M1 (2020)', 'macbook-pro-13-m1-2020', 62000, 2),
('c1111111-0000-0000-0000-000000000003', 'XPS 13 (2022)', 'xps-13-2022', 38000, 1),
('c1111111-0000-0000-0000-000000000004', 'Inspiron 15 (2021)', 'inspiron-15-2021', 16000, 1),
('c1111111-0000-0000-0000-000000000005', 'Pavilion 14 (2021)', 'pavilion-14-2021', 18000, 1),
('c1111111-0000-0000-0000-000000000006', 'ThinkPad X1 Carbon (2022)', 'thinkpad-x1-carbon-2022', 34000, 1),
('c1111111-0000-0000-0000-000000000007', 'ZenBook 14 (2022)', 'zenbook-14-2022', 28000, 1);