ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS lead_type text NOT NULL DEFAULT 'pickup',
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS subject text;

UPDATE public.leads
SET lead_type = 'pickup'
WHERE lead_type IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'leads_lead_type_check'
      AND conrelid = 'public.leads'::regclass
  ) THEN
    ALTER TABLE public.leads
      ADD CONSTRAINT leads_lead_type_check
      CHECK (lead_type IN ('pickup', 'query'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_leads_lead_type_created_at
  ON public.leads (lead_type, created_at DESC);
