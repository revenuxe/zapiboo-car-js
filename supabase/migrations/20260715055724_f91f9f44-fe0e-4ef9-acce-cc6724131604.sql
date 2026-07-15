-- 1) New columns: option "family" (intel/amd) + group dependency on a family
ALTER TABLE public.spec_groups ADD COLUMN IF NOT EXISTS depends_family text;
ALTER TABLE public.spec_options ADD COLUMN IF NOT EXISTS family text;

-- 2) Tag Windows processor options with their family so generation steps can branch
UPDATE public.spec_options SET family = 'intel'
WHERE group_id IN (SELECT id FROM public.spec_groups WHERE key = 'processor' AND platform = 'windows')
  AND label ILIKE 'Intel%';
UPDATE public.spec_options SET family = 'amd'
WHERE group_id IN (SELECT id FROM public.spec_groups WHERE key = 'processor' AND platform = 'windows')
  AND label ILIKE 'AMD%';

-- 3) Remove the old merged Intel/AMD generation question (options cascade)
DELETE FROM public.spec_groups WHERE key = 'generation' AND platform = 'windows';

-- 4a) Intel generation question (only shown when an Intel processor was picked)
WITH gi AS (
  INSERT INTO public.spec_groups
    (category_id, platform, key, title, subtitle, selection, step_order, active, depends_family)
  SELECT category_id, 'windows', 'generation_intel', 'Which Intel Core generation?',
         'Newer generations keep more value.', 'single', 2, true, 'intel'
  FROM public.spec_groups WHERE key = 'processor' AND platform = 'windows' LIMIT 1
  RETURNING id
)
INSERT INTO public.spec_options (group_id, label, description, kind, value, sort_order)
SELECT gi.id, x.label, x.description, x.kind, x.value, x.sort_order
FROM gi, (VALUES
  ('13th / 14th Gen (latest)', 'Core i-series 13xxx / 14xxx', 'deduct_fixed', 0, 1),
  ('12th Gen',                 'Core i-series 12xxx',         'deduct_percent', 5, 2),
  ('11th Gen',                 'Core i-series 11xxx',         'deduct_percent', 9, 3),
  ('10th Gen',                 'Core i-series 10xxx',         'deduct_percent', 14, 4),
  ('8th / 9th Gen',            'Core i-series 8xxx / 9xxx',   'deduct_percent', 20, 5),
  ('6th / 7th Gen',            'Core i-series 6xxx / 7xxx',   'deduct_percent', 28, 6),
  ('5th Gen or older',         'Anything before 6th Gen',     'deduct_percent', 36, 7)
) AS x(label, description, kind, value, sort_order);

-- 4b) AMD Ryzen generation question (only shown when an AMD processor was picked)
WITH ga AS (
  INSERT INTO public.spec_groups
    (category_id, platform, key, title, subtitle, selection, step_order, active, depends_family)
  SELECT category_id, 'windows', 'generation_amd', 'Which AMD Ryzen generation?',
         'Newer Ryzen series keep more value.', 'single', 2, true, 'amd'
  FROM public.spec_groups WHERE key = 'processor' AND platform = 'windows' LIMIT 1
  RETURNING id
)
INSERT INTO public.spec_options (group_id, label, description, kind, value, sort_order)
SELECT ga.id, x.label, x.description, x.kind, x.value, x.sort_order
FROM ga, (VALUES
  ('Ryzen 7000 / 8000 (latest)', 'Ryzen 7xxx / 8xxx',        'deduct_fixed', 0, 1),
  ('Ryzen 6000',                 'Ryzen 6xxx',               'deduct_percent', 6, 2),
  ('Ryzen 5000',                 'Ryzen 5xxx',               'deduct_percent', 10, 3),
  ('Ryzen 4000',                 'Ryzen 4xxx',               'deduct_percent', 15, 4),
  ('Ryzen 3000',                 'Ryzen 3xxx',               'deduct_percent', 22, 5),
  ('Ryzen 2000 or older',        'Ryzen 2xxx or earlier',    'deduct_percent', 32, 6)
) AS x(label, description, kind, value, sort_order);

-- 5) Split graphics into specific cards with distinct pricing
UPDATE public.spec_groups
SET title = 'Which graphics card does it have?',
    subtitle = 'Dedicated GPUs add to your price.'
WHERE key = 'graphics';

DELETE FROM public.spec_options WHERE group_id IN (SELECT id FROM public.spec_groups WHERE key = 'graphics');

INSERT INTO public.spec_options (group_id, label, description, kind, value, sort_order)
SELECT g.id, x.label, x.description, x.kind, x.value, x.sort_order
FROM (SELECT id FROM public.spec_groups WHERE key = 'graphics' LIMIT 1) g, (VALUES
  ('Integrated / no graphics', 'Intel Iris / UHD or AMD Radeon Graphics', 'deduct_fixed', 0, 1),
  ('NVIDIA MX series',         'MX150 / MX250 / MX350 / MX450',           'bonus_fixed', 1000, 2),
  ('NVIDIA GTX 10 series',     'GTX 1050 / 1060 / 1070',                  'bonus_fixed', 2000, 3),
  ('NVIDIA GTX 16 series',     'GTX 1650 / 1660',                         'bonus_fixed', 3000, 4),
  ('NVIDIA RTX 20 series',     'RTX 2050 / 2060 / 2070 / 2080',           'bonus_fixed', 5000, 5),
  ('NVIDIA RTX 30 series',     'RTX 3050 / 3060 / 3070 / 3080',           'bonus_fixed', 7000, 6),
  ('NVIDIA RTX 40 series',     'RTX 4050 / 4060 / 4070 / 4080 / 4090',    'bonus_fixed', 10000, 7),
  ('AMD Radeon RX series',     'RX 5000 / 6000 / 7000 mobile',            'bonus_fixed', 3000, 8),
  ('Other dedicated GPU',      'Any other discrete graphics card',        'bonus_fixed', 1500, 9)
) AS x(label, description, kind, value, sort_order);

-- 6) Single round-trip resolver for the sell funnel (fixes slow client-side waterfall)
CREATE OR REPLACE FUNCTION public.resolve_device_path(
  _category text, _brand text, _series text, _model text
) RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH cat AS (
    SELECT * FROM public.device_categories WHERE slug = _category AND active = true LIMIT 1
  ), br AS (
    SELECT * FROM public.device_brands
    WHERE slug = _brand AND active = true AND category_id = (SELECT id FROM cat) LIMIT 1
  ), se AS (
    SELECT * FROM public.device_series
    WHERE slug = _series AND active = true AND brand_id = (SELECT id FROM br) LIMIT 1
  ), mo AS (
    SELECT * FROM public.device_models
    WHERE slug = _model AND active = true AND series_id = (SELECT id FROM se) LIMIT 1
  )
  SELECT jsonb_build_object(
    'category', (SELECT to_jsonb(c) FROM cat c),
    'brand',    (SELECT to_jsonb(b) FROM br b),
    'series',   (SELECT to_jsonb(s) FROM se s),
    'model',    (SELECT to_jsonb(m) FROM mo m),
    'spec_groups', COALESCE((
      SELECT jsonb_agg(sg ORDER BY sg.step_order) FROM (
        SELECT g.id, g.category_id, g.platform, g.key, g.title, g.subtitle,
               g.selection, g.step_order, g.active, g.depends_family,
               COALESCE((
                 SELECT jsonb_agg(o ORDER BY o.sort_order) FROM (
                   SELECT id, group_id, label, description, kind, value, sort_order, family
                   FROM public.spec_options WHERE group_id = g.id
                 ) o
               ), '[]'::jsonb) AS options
        FROM public.spec_groups g
        WHERE g.category_id = (SELECT id FROM cat) AND g.active = true
          AND (g.platform IS NULL OR g.platform = (SELECT platform FROM br))
      ) sg
    ), '[]'::jsonb),
    'condition_groups', COALESCE((
      SELECT jsonb_agg(cg ORDER BY cg.step_order) FROM (
        SELECT g.id, g.category_id, g.key, g.title, g.subtitle,
               g.selection, g.step_order, g.active,
               COALESCE((
                 SELECT jsonb_agg(o ORDER BY o.sort_order) FROM (
                   SELECT id, group_id, label, description, kind, value, sort_order
                   FROM public.condition_options WHERE group_id = g.id
                 ) o
               ), '[]'::jsonb) AS options
        FROM public.condition_groups g
        WHERE g.category_id = (SELECT id FROM cat) AND g.active = true
      ) cg
    ), '[]'::jsonb)
  );
$$;

GRANT EXECUTE ON FUNCTION public.resolve_device_path(text, text, text, text) TO anon, authenticated, service_role;