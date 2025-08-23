-- Create site_images table for storing editable website images
CREATE TABLE IF NOT EXISTS site_images (
  id BIGSERIAL PRIMARY KEY,
  image_key TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE site_images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access to site_images" 
ON site_images FOR SELECT 
TO public 
USING (true);

CREATE POLICY "Allow authenticated users to insert site_images" 
ON site_images FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update site_images" 
ON site_images FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete site_images" 
ON site_images FOR DELETE 
TO authenticated 
USING (true);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_images_updated_at 
BEFORE UPDATE ON site_images 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default image entries for existing site images
INSERT INTO site_images (image_key, image_url, alt_text) VALUES
('hero-synne-dog', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/synneanddog.jpg', 'Synne og hund'),
('hero-synne-portrait', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/sideeye_synne.webp', 'Synne dyrlæge'),
('about-cat', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/katkigger.jpg', 'Kat kigger'),
('about-dog', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/hundligger.jpg', 'Hund ligger'),
('logo-icon', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/favicon-transparent-1024.png', 'Synnes Dyreklinik Icon'),
('logo-text', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/logo.svg', 'Synnes Dyreklinik Text')
ON CONFLICT (image_key) DO NOTHING;
