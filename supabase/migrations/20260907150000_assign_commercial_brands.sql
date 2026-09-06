-- Some existing projects call the fourth card "Commercial" while older
-- migrations call it "Commercial vehicle". Treat both names as the same card.
UPDATE public.vehicle_brands AS brand
SET category_id = category.id,
    subcategory_id = NULL
FROM public.vehicle_categories AS category
WHERE brand.vehicle_type = 'commercial'
  AND category.name IN ('Commercial', 'Commercial vehicle');

CREATE TEMP TABLE _zapiboo_commercial_brands ON COMMIT DROP AS
SELECT * FROM (VALUES
  ('Tata Motors', 'tata-commercial', 10),
  ('Ashok Leyland', 'ashok-leyland-commercial', 20),
  ('Mahindra Commercial', 'mahindra-commercial', 30),
  ('Eicher', 'eicher-commercial', 40),
  ('Force Motors', 'force-motors-commercial', 50),
  ('BharatBenz', 'bharatbenz-commercial', 60),
  ('SML Isuzu', 'sml-isuzu-commercial', 70),
  ('Piaggio Commercial', 'piaggio-commercial', 80),
  ('Swaraj Mazda', 'swaraj-mazda-commercial', 90)
) AS catalogue(name, slug, sort_order);

UPDATE public.vehicle_brands AS brand
SET slug = catalogue.slug,
    category_id = category.id,
    subcategory_id = NULL,
    sort_order = catalogue.sort_order,
    active = true
FROM _zapiboo_commercial_brands AS catalogue
JOIN public.vehicle_categories AS category ON category.name IN ('Commercial', 'Commercial vehicle')
WHERE brand.name = catalogue.name;

INSERT INTO public.vehicle_brands (name, slug, category_id, subcategory_id, sort_order, active)
SELECT catalogue.name, catalogue.slug, category.id, NULL, catalogue.sort_order, true
FROM _zapiboo_commercial_brands AS catalogue
JOIN public.vehicle_categories AS category ON category.name IN ('Commercial', 'Commercial vehicle')
WHERE NOT EXISTS (SELECT 1 FROM public.vehicle_brands AS existing WHERE existing.name = catalogue.name)
ON CONFLICT (slug) DO UPDATE
SET category_id = EXCLUDED.category_id,
    subcategory_id = NULL,
    sort_order = EXCLUDED.sort_order,
    active = true;

NOTIFY pgrst, 'reload schema';
