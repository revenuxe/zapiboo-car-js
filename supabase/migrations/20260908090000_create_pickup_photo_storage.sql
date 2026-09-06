-- Customer-uploaded vehicle photos. Files are compressed in the browser to
-- WebP before upload; the lead stores only the resulting public URL.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pickup-photos',
  'pickup-photos',
  true,
  2097152,
  ARRAY['image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Authenticated users upload their pickup photos" ON storage.objects;
CREATE POLICY "Authenticated users upload their pickup photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pickup-photos'
  AND (storage.foldername(name))[1] = (select auth.uid()::text)
);

DROP POLICY IF EXISTS "Anyone can view pickup photos" ON storage.objects;
CREATE POLICY "Anyone can view pickup photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'pickup-photos');
