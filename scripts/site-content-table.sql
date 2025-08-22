-- Create table for storing editable website content
CREATE TABLE IF NOT EXISTS site_content (
    id BIGSERIAL PRIMARY KEY,
    content_key TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read content
CREATE POLICY "Anyone can read site content" ON site_content
    FOR SELECT USING (true);

-- Policy: Only authenticated users can modify content
CREATE POLICY "Authenticated users can modify site content" ON site_content
    FOR ALL USING (auth.role() = 'authenticated');

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_content_key ON site_content(content_key);
