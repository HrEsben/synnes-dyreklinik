-- Storage policies for the media bucket

-- Allow authenticated users to upload files to images/team folder
CREATE POLICY "Allow authenticated uploads to team images" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'images' AND (storage.foldername(name))[2] = 'team');

-- Allow public read access to team images
CREATE POLICY "Allow public read access to team images" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'images' AND (storage.foldername(name))[2] = 'team');

-- Allow authenticated users to update team images (for editing team members)
CREATE POLICY "Allow authenticated updates to team images" 
ON storage.objects 
FOR UPDATE 
TO authenticated 
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'images' AND (storage.foldername(name))[2] = 'team');

-- Allow authenticated users to delete team images (for removing team members)
CREATE POLICY "Allow authenticated deletes of team images" 
ON storage.objects 
FOR DELETE 
TO authenticated 
USING (bucket_id = 'media' AND (storage.foldername(name))[1] = 'images' AND (storage.foldername(name))[2] = 'team');
