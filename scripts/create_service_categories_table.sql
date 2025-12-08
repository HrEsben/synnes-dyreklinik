-- Create service_categories table for managing service categories
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_service_categories_sort_order ON service_categories(sort_order);

-- Enable RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON service_categories
  FOR SELECT USING (true);

-- Allow authenticated users to manage categories
CREATE POLICY "Allow authenticated insert" ON service_categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON service_categories
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete" ON service_categories
  FOR DELETE TO authenticated USING (true);

-- Insert default categories
INSERT INTO service_categories (slug, label, sort_order) VALUES
  ('basis', 'Basis ydelser', 1),
  ('kirurgi', 'Kirurgi', 2),
  ('klinisk', 'Kliniske ydelser', 3),
  ('diagnostik', 'Diagnostik', 4),
  ('special', 'Specialydelser', 5)
ON CONFLICT (slug) DO NOTHING;
