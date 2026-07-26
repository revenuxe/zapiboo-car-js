-- Public inserts on leads (anon + authenticated) currently accept anything, so
-- bots have been writing directly into the table via the REST API - bypassing
-- the site forms entirely - filling it with garbage names/emails/oversized
-- payloads. These constraints reject structurally-invalid or abusively large
-- submissions at the database level. They cannot detect "plausible-looking"
-- randomly generated text (e.g. a short mixed-case name), only malformed or
-- oversized data.

ALTER TABLE public.leads
  ADD CONSTRAINT leads_name_length_check
    CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  ADD CONSTRAINT leads_phone_length_check
    CHECK (char_length(btrim(phone)) BETWEEN 1 AND 40),
  ADD CONSTRAINT leads_email_format_check
    CHECK (
      email IS NULL
      OR email = ''
      OR (char_length(email) <= 254 AND email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')
    ),
  ADD CONSTRAINT leads_subject_length_check
    CHECK (subject IS NULL OR char_length(subject) <= 200),
  ADD CONSTRAINT leads_notes_length_check
    CHECK (notes IS NULL OR char_length(notes) <= 5000),
  ADD CONSTRAINT leads_address_length_check
    CHECK (address IS NULL OR char_length(address) <= 500),
  ADD CONSTRAINT leads_locality_length_check
    CHECK (locality IS NULL OR char_length(locality) <= 120),
  ADD CONSTRAINT leads_landmark_length_check
    CHECK (landmark IS NULL OR char_length(landmark) <= 200),
  ADD CONSTRAINT leads_pincode_format_check
    CHECK (pincode IS NULL OR pincode ~ '^[0-9]{6}$'),
  ADD CONSTRAINT leads_items_count_check
    CHECK (array_length(items, 1) IS NULL OR array_length(items, 1) <= 30);
