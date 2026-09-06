-- A stable, human-readable reference shared by the customer and the admin team.
CREATE SEQUENCE IF NOT EXISTS public.pickup_order_number_seq;

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS pickup_id text;

CREATE OR REPLACE FUNCTION public.assign_pickup_id()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.lead_type IS DISTINCT FROM 'query' AND NEW.pickup_id IS NULL THEN
    NEW.pickup_id := 'ZPB-' || to_char(CURRENT_DATE, 'YYYYMMDD') || '-' || lpad(nextval('public.pickup_order_number_seq')::text, 6, '0');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_pickup_id ON public.leads;
CREATE TRIGGER trg_assign_pickup_id
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.assign_pickup_id();

UPDATE public.leads
SET pickup_id = 'ZPB-' || to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYYMMDD') || '-' || lpad(nextval('public.pickup_order_number_seq')::text, 6, '0')
WHERE pickup_id IS NULL AND lead_type IS DISTINCT FROM 'query';

CREATE UNIQUE INDEX IF NOT EXISTS leads_pickup_id_unique_idx
  ON public.leads (pickup_id)
  WHERE pickup_id IS NOT NULL;

DROP POLICY IF EXISTS "Users can cancel their own pending pickups" ON public.leads;
CREATE POLICY "Users can cancel their own pending pickups"
ON public.leads FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status IN ('new', 'contacted', 'scheduled'))
WITH CHECK (auth.uid() = user_id AND status = 'cancelled');
