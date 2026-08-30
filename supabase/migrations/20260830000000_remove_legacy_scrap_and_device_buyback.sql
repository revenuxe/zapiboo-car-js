-- Retain historic lead information while removing the retired scrap workflow.
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS vehicle_type text;
UPDATE public.leads
SET vehicle_type = CASE
  WHEN lead_type = 'query' THEN 'query'
  ELSE COALESCE(scrap_mode, 'vehicle')
END
WHERE vehicle_type IS NULL;
ALTER TABLE public.leads ALTER COLUMN vehicle_type SET NOT NULL;
ALTER TABLE public.leads DROP COLUMN IF EXISTS scrap_mode;
ALTER TABLE public.leads DROP COLUMN IF EXISTS size_tier;

DROP TABLE IF EXISTS public.scrap_listings;
DROP TABLE IF EXISTS public.scrap_rates;
DROP TABLE IF EXISTS public.scrap_categories;

DROP TABLE IF EXISTS public.device_orders;
DROP TABLE IF EXISTS public.device_prices;
DROP TABLE IF EXISTS public.device_models;
DROP TABLE IF EXISTS public.device_series;
DROP TABLE IF EXISTS public.device_brands;
DROP TABLE IF EXISTS public.device_categories;
