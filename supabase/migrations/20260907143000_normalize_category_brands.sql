-- Brands are selected by the top-level vehicle card in the pickup flow.
-- Keep model/variant rows for existing leads, but do not require them to manage brands.
UPDATE public.vehicle_brands AS brand
SET category_id = category.id,
    subcategory_id = NULL
FROM public.vehicle_categories AS category
WHERE brand.category_id IS NULL
  AND (
    (category.name = 'Car' AND brand.vehicle_type = 'car') OR
    (category.name = 'Bike' AND brand.vehicle_type = 'bike') OR
    (category.name = 'Scooter' AND brand.vehicle_type = 'scooter') OR
    (category.name = 'Commercial vehicle' AND brand.vehicle_type = 'commercial')
  );

-- Existing brands assigned through a vehicle subtype should be available for the
-- complete parent category, including the current selected subtype in a booking.
UPDATE public.vehicle_brands
SET subcategory_id = NULL
WHERE category_id IS NOT NULL;

CREATE TEMP TABLE _zapiboo_catalogue ON COMMIT DROP AS
SELECT * FROM (VALUES
    ('Car', 'Maruti Suzuki', 'maruti-suzuki-car', 10), ('Car', 'Hyundai', 'hyundai-car', 20), ('Car', 'Tata', 'tata-car', 30), ('Car', 'Mahindra', 'mahindra-car', 40), ('Car', 'Honda', 'honda-car', 50), ('Car', 'Toyota', 'toyota-car', 60), ('Car', 'Kia', 'kia-car', 70), ('Car', 'Renault', 'renault-car', 80), ('Car', 'Volkswagen', 'volkswagen-car', 90), ('Car', 'Skoda', 'skoda-car', 100), ('Car', 'MG', 'mg-car', 110), ('Car', 'Nissan', 'nissan-car', 120), ('Car', 'Ford', 'ford-car', 130), ('Car', 'Jeep', 'jeep-car', 140), ('Car', 'Citroen', 'citroen-car', 150), ('Car', 'BYD', 'byd-car', 160), ('Car', 'Lexus', 'lexus-car', 170), ('Car', 'Volvo', 'volvo-car', 180), ('Car', 'BMW', 'bmw-car', 190), ('Car', 'Mercedes-Benz', 'mercedes-benz-car', 200), ('Car', 'Audi', 'audi-car', 210), ('Car', 'Jaguar', 'jaguar-car', 220), ('Car', 'Land Rover', 'land-rover-car', 230), ('Car', 'Porsche', 'porsche-car', 240), ('Car', 'MINI', 'mini-car', 250), ('Car', 'Isuzu', 'isuzu-car', 260), ('Car', 'Fiat', 'fiat-car', 270), ('Car', 'Mitsubishi', 'mitsubishi-car', 280), ('Car', 'Datsun', 'datsun-car', 290),
    ('Bike', 'Hero MotoCorp', 'hero-motocorp-bike', 10), ('Bike', 'Honda 2-Wheeler', 'honda-2w-bike', 20), ('Bike', 'Bajaj', 'bajaj-bike', 30), ('Bike', 'TVS', 'tvs-bike', 40), ('Bike', 'Royal Enfield', 'royal-enfield-bike', 50), ('Bike', 'Yamaha', 'yamaha-bike', 60), ('Bike', 'Suzuki 2-Wheeler', 'suzuki-2w-bike', 70), ('Bike', 'KTM', 'ktm-bike', 80), ('Bike', 'Jawa', 'jawa-bike', 90), ('Bike', 'Yezdi', 'yezdi-bike', 100), ('Bike', 'Kawasaki', 'kawasaki-bike', 110), ('Bike', 'Triumph', 'triumph-bike', 120), ('Bike', 'Harley-Davidson', 'harley-davidson-bike', 130), ('Bike', 'Benelli', 'benelli-bike', 140), ('Bike', 'Ducati', 'ducati-bike', 150), ('Bike', 'BMW Motorrad', 'bmw-motorrad-bike', 160), ('Bike', 'Husqvarna', 'husqvarna-bike', 170), ('Bike', 'Aprilia Motorcycle', 'aprilia-motorcycle-bike', 180), ('Bike', 'CFMoto', 'cfmoto-bike', 190), ('Bike', 'Keeway', 'keeway-bike', 200), ('Bike', 'Revolt', 'revolt-bike', 210), ('Bike', 'Tork Motors', 'tork-motors-bike', 220), ('Bike', 'Ultraviolette', 'ultraviolette-bike', 230), ('Bike', 'Oben Electric', 'oben-electric-bike', 240),
    ('Scooter', 'Honda Scooter', 'honda-scooter', 10), ('Scooter', 'TVS Scooter', 'tvs-scooter', 20), ('Scooter', 'Suzuki Scooter', 'suzuki-scooter', 30), ('Scooter', 'Yamaha Scooter', 'yamaha-scooter', 40), ('Scooter', 'Hero Scooter', 'hero-scooter', 50), ('Scooter', 'Bajaj Scooter', 'bajaj-scooter', 60), ('Scooter', 'Vespa', 'vespa-scooter', 70), ('Scooter', 'Aprilia Scooter', 'aprilia-scooter', 80), ('Scooter', 'Ather', 'ather-scooter', 90), ('Scooter', 'Ola Electric', 'ola-electric-scooter', 100), ('Scooter', 'Vida', 'vida-scooter', 110), ('Scooter', 'Ampere', 'ampere-scooter', 120), ('Scooter', 'Simple Energy', 'simple-energy-scooter', 130), ('Scooter', 'River', 'river-scooter', 140), ('Scooter', 'Okinawa', 'okinawa-scooter', 150), ('Scooter', 'Hero Electric', 'hero-electric-scooter', 160), ('Scooter', 'Bounce', 'bounce-scooter', 170), ('Scooter', 'Kinetic Green', 'kinetic-green-scooter', 180), ('Scooter', 'BGauss', 'bgauss-scooter', 190), ('Scooter', 'Joy e-bike', 'joy-ebike-scooter', 200), ('Scooter', 'PURE EV', 'pure-ev-scooter', 210), ('Scooter', 'Gemopai', 'gemopai-scooter', 220),
    ('Commercial vehicle', 'Tata Motors', 'tata-commercial', 10), ('Commercial vehicle', 'Ashok Leyland', 'ashok-leyland-commercial', 20), ('Commercial vehicle', 'Mahindra Commercial', 'mahindra-commercial', 30), ('Commercial vehicle', 'Eicher', 'eicher-commercial', 40), ('Commercial vehicle', 'Force Motors', 'force-motors-commercial', 50), ('Commercial vehicle', 'BharatBenz', 'bharatbenz-commercial', 60), ('Commercial vehicle', 'SML Isuzu', 'sml-isuzu-commercial', 70), ('Commercial vehicle', 'Piaggio Commercial', 'piaggio-commercial', 80), ('Commercial vehicle', 'Swaraj Mazda', 'swaraj-mazda-commercial', 90)
)
AS catalogue(category_name, name, slug, sort_order);

-- Preserve the database's existing brand IDs (and the leads that reference
-- them) whenever a brand was already present under an older slug.
UPDATE public.vehicle_brands AS brand
SET slug = catalogue.slug,
    category_id = category.id,
    subcategory_id = NULL,
    sort_order = catalogue.sort_order,
    active = true
FROM _zapiboo_catalogue AS catalogue
JOIN public.vehicle_categories AS category ON category.name = catalogue.category_name
WHERE brand.name = catalogue.name;

INSERT INTO public.vehicle_brands (name, slug, category_id, subcategory_id, sort_order, active)
SELECT catalogue.name, catalogue.slug, category.id, NULL, catalogue.sort_order, true
FROM _zapiboo_catalogue AS catalogue
JOIN public.vehicle_categories AS category ON category.name = catalogue.category_name
WHERE NOT EXISTS (SELECT 1 FROM public.vehicle_brands AS existing WHERE existing.name = catalogue.name)
ON CONFLICT (slug) DO UPDATE
SET slug = EXCLUDED.slug,
    category_id = EXCLUDED.category_id,
    subcategory_id = NULL,
    sort_order = EXCLUDED.sort_order,
    active = true;

NOTIFY pgrst, 'reload schema';
