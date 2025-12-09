-- Create price_categories table for grouping prices
CREATE TABLE IF NOT EXISTS price_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster ordering
CREATE INDEX IF NOT EXISTS idx_price_categories_sort_order ON price_categories(sort_order);

-- Create price_items table for individual services and their prices
CREATE TABLE IF NOT EXISTS price_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES price_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_from DECIMAL(10, 2),
  price_to DECIMAL(10, 2),
  price_note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_price_items_category_id ON price_items(category_id);
CREATE INDEX IF NOT EXISTS idx_price_items_sort_order ON price_items(sort_order);

-- Enable RLS
ALTER TABLE price_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to categories" ON price_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read access to price items" ON price_items
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to manage categories
CREATE POLICY "Allow authenticated insert categories" ON price_categories
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update categories" ON price_categories
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete categories" ON price_categories
  FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to manage price items
CREATE POLICY "Allow authenticated insert price items" ON price_items
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update price items" ON price_items
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete price items" ON price_items
  FOR DELETE TO authenticated USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_price_categories_updated_at 
  BEFORE UPDATE ON price_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_price_items_updated_at 
  BEFORE UPDATE ON price_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
