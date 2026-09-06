-- Publish the existing Zapiboo artwork on its matching selection cards.
UPDATE public.vehicle_categories
SET image_url = CASE name
  WHEN 'Car' THEN '/vehicle-cards/car.webp'
  WHEN 'Bike' THEN '/vehicle-cards/bike.webp'
  WHEN 'Scooter' THEN '/vehicle-cards/scooter.webp'
  WHEN 'Commercial' THEN '/vehicle-cards/commercial.webp'
  WHEN 'Commercial vehicle' THEN '/vehicle-cards/commercial.webp'
  ELSE image_url
END
WHERE name IN ('Car', 'Bike', 'Scooter', 'Commercial', 'Commercial vehicle');

UPDATE public.vehicle_subcategories AS vehicle_type
SET image_url = CASE
  WHEN vehicle_type.name = 'SUV' THEN '/vehicle-cards/suv.webp'
  WHEN vehicle_type.name = 'Electric' AND category.name = 'Car' THEN '/vehicle-cards/electric.webp'
  WHEN vehicle_type.name = 'Electric scooter' THEN '/vehicle-cards/electric.webp'
  ELSE vehicle_type.image_url
END
FROM public.vehicle_categories AS category
WHERE vehicle_type.category_id = category.id;

NOTIFY pgrst, 'reload schema';
