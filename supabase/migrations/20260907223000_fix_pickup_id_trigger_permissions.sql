-- Booking inserts run as the authenticated customer. Generate the ID inside a
-- controlled definer function so customers do not need direct sequence access.
CREATE OR REPLACE FUNCTION public.assign_pickup_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.lead_type IS DISTINCT FROM 'query' AND NEW.pickup_id IS NULL THEN
    NEW.pickup_id := 'ZPB-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('public.pickup_order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON SEQUENCE public.pickup_order_number_seq FROM PUBLIC;
GRANT USAGE ON SEQUENCE public.pickup_order_number_seq TO authenticated;
