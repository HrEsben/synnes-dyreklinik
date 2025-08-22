-- Simpler storage policies for the media bucket (if folder-based policies don't work)

-- Allow authenticated users to upload to media bucket
CREATE POLICY "Allow authenticated uploads to media" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'media');

-- Allow public read access to media bucket
CREATE POLICY "Allow public read access to media" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'media');

-- Allow authenticated users to update media bucket
CREATE POLICY "Allow authenticated updates to media" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'media');

-- Allow authenticated users to delete from media bucket
CREATE POLICY "Allow authenticated deletes from media" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'media');
