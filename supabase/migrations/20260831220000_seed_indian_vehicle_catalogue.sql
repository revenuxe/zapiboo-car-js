INSERT INTO public.vehicle_subcategories (category_id, name, sort_order)
SELECT c.id, v.name, v.sort_order
FROM public.vehicle_categories c
CROSS JOIN (VALUES
  ('Hatchback', 10), ('Sedan', 20), ('SUV', 30), ('MUV', 40), ('Electric', 50)
) AS v(name, sort_order)
WHERE c.name = 'Car'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.vehicle_subcategories (category_id, name, sort_order)
SELECT c.id, v.name, v.sort_order
FROM public.vehicle_categories c
CROSS JOIN (VALUES
  ('Commuter', 10), ('Sports bike', 20), ('Cruiser', 30), ('Adventure', 40), ('Electric', 50)
) AS v(name, sort_order)
WHERE c.name = 'Bike'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.vehicle_subcategories (category_id, name, sort_order)
SELECT c.id, v.name, v.sort_order
FROM public.vehicle_categories c
CROSS JOIN (VALUES
  ('Petrol scooter', 10), ('Electric scooter', 20), ('Maxi scooter', 30)
) AS v(name, sort_order)
WHERE c.name = 'Scooter'
ON CONFLICT (category_id, name) DO NOTHING;

INSERT INTO public.vehicle_subcategories (category_id, name, sort_order)
SELECT c.id, v.name, v.sort_order
FROM public.vehicle_categories c
CROSS JOIN (VALUES
  ('Pickup', 10), ('Truck', 20), ('Tempo / van', 30), ('Auto rickshaw', 40), ('Bus', 50)
) AS v(name, sort_order)
WHERE c.name = 'Commercial vehicle'
ON CONFLICT (category_id, name) DO NOTHING;

WITH catalogue(category_name, brand_name, slug, sort_order) AS (
  VALUES
  ('Car','Maruti Suzuki','maruti-suzuki-car',1),('Car','Hyundai','hyundai-car',2),('Car','Tata','tata-car',3),('Car','Mahindra','mahindra-car',4),('Car','Honda','honda-car',5),('Car','Toyota','toyota-car',6),('Car','Kia','kia-car',7),('Car','Renault','renault-car',8),('Car','Volkswagen','volkswagen-car',9),('Car','Skoda','skoda-car',10),('Car','MG','mg-car',11),('Car','Nissan','nissan-car',12),('Car','BMW','bmw-car',13),('Car','Mercedes-Benz','mercedes-benz-car',14),('Car','Audi','audi-car',15),
  ('Bike','Hero MotoCorp','hero-motocorp-bike',1),('Bike','Honda 2-Wheeler','honda-2w-bike',2),('Bike','Bajaj','bajaj-bike',3),('Bike','TVS','tvs-bike',4),('Bike','Royal Enfield','royal-enfield-bike',5),('Bike','Yamaha','yamaha-bike',6),('Bike','Suzuki','suzuki-bike',7),('Bike','KTM','ktm-bike',8),('Bike','Jawa','jawa-bike',9),('Bike','Kawasaki','kawasaki-bike',10),('Bike','Triumph','triumph-bike',11),('Bike','Revolt','revolt-bike',12),
  ('Scooter','Honda Scooter','honda-scooter',1),('Scooter','TVS Scooter','tvs-scooter',2),('Scooter','Suzuki Scooter','suzuki-scooter',3),('Scooter','Yamaha Scooter','yamaha-scooter',4),('Scooter','Hero Scooter','hero-scooter',5),('Scooter','Bajaj Scooter','bajaj-scooter',6),('Scooter','Ola Electric','ola-electric-scooter',7),('Scooter','Ather','ather-scooter',8),('Scooter','Vida','vida-scooter',9),('Scooter','Ampere','ampere-scooter',10),
  ('Commercial vehicle','Tata Motors','tata-commercial',1),('Commercial vehicle','Ashok Leyland','ashok-leyland',2),('Commercial vehicle','Mahindra Commercial','mahindra-commercial',3),('Commercial vehicle','Eicher','eicher',4),('Commercial vehicle','Force Motors','force-motors',5),('Commercial vehicle','BharatBenz','bharatbenz',6),('Commercial vehicle','Piaggio Commercial','piaggio-commercial',7)
)
INSERT INTO public.vehicle_brands (name, slug, category_id, subcategory_id, sort_order)
SELECT catalogue.brand_name, catalogue.slug, c.id, s.id, catalogue.sort_order
FROM catalogue
JOIN public.vehicle_categories c ON c.name = catalogue.category_name
JOIN public.vehicle_subcategories s ON s.category_id = c.id AND s.name = 'All'
ON CONFLICT DO NOTHING;

NOTIFY pgrst, 'reload schema';
