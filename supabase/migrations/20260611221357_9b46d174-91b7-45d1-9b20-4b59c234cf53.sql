-- Link pickup leads to the user who booked them (nullable: anonymous bookings still allowed)
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS user_id uuid;

-- Auto-attach the authenticated user's id on insert (anonymous inserts keep null)
CREATE OR REPLACE FUNCTION public.set_lead_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_lead_user_id ON public.leads;
CREATE TRIGGER trg_set_lead_user_id
BEFORE INSERT ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.set_lead_user_id();

-- Let signed-in users read and cancel (delete) their own bookings
DROP POLICY IF EXISTS "Users can view their own leads" ON public.leads;
CREATE POLICY "Users can view their own leads"
ON public.leads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own leads" ON public.leads;
CREATE POLICY "Users can delete their own leads"
ON public.leads FOR DELETE
TO authenticated
USING (auth.uid() = user_id);