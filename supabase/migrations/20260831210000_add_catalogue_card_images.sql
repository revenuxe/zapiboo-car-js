ALTER TABLE public.vehicle_categories ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE public.vehicle_subcategories ADD COLUMN IF NOT EXISTS image_url text;
NOTIFY pgrst, 'reload schema';
