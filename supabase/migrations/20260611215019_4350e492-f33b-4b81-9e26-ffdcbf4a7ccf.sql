-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Leads
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scrap_mode text NOT NULL DEFAULT 'mixed',
  items text[] NOT NULL DEFAULT '{}',
  size_tier text,
  has_photo boolean NOT NULL DEFAULT false,
  locality text,
  pincode text,
  address text,
  landmark text,
  name text NOT NULL,
  phone text NOT NULL,
  preferred_date date,
  slot text,
  lat double precision,
  lng double precision,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "Admins can view leads"
  ON public.leads FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete leads"
  ON public.leads FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Scrap categories
CREATE TABLE public.scrap_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scrap_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scrap_categories TO authenticated;
GRANT ALL ON public.scrap_categories TO service_role;
ALTER TABLE public.scrap_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view categories"
  ON public.scrap_categories FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins manage categories"
  ON public.scrap_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_scrap_categories_updated_at BEFORE UPDATE ON public.scrap_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Scrap rates
CREATE TABLE public.scrap_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES public.scrap_categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  price text NOT NULL,
  unit text NOT NULL DEFAULT '/ kg',
  note text,
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scrap_rates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scrap_rates TO authenticated;
GRANT ALL ON public.scrap_rates TO service_role;
ALTER TABLE public.scrap_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view rates"
  ON public.scrap_rates FOR SELECT TO anon, authenticated
  USING (true);
CREATE POLICY "Admins manage rates"
  ON public.scrap_rates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_scrap_rates_updated_at BEFORE UPDATE ON public.scrap_rates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();