-- Create site_alerts table for managing site-wide alert messages
CREATE TABLE IF NOT EXISTS site_alerts (
  id SERIAL PRIMARY KEY,
  message TEXT,
  is_active BOOLEAN DEFAULT false,
  alert_type TEXT DEFAULT 'info' CHECK (alert_type IN ('info', 'warning', 'error', 'success')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create an index on is_active for faster queries
CREATE INDEX IF NOT EXISTS idx_site_alerts_is_active ON site_alerts(is_active);

-- Create an index on updated_at for ordering
CREATE INDEX IF NOT EXISTS idx_site_alerts_updated_at ON site_alerts(updated_at);

-- Create a function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_site_alerts_updated_at 
    BEFORE UPDATE ON site_alerts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS)
ALTER TABLE site_alerts ENABLE ROW LEVEL SECURITY;

-- Policy for anyone to view active alerts (no authentication required)
CREATE POLICY "Anyone can view active alerts" ON site_alerts
    FOR SELECT USING (is_active = true);

-- Policy for authenticated users to manage alerts
CREATE POLICY "Authenticated users can manage alerts" ON site_alerts
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert a sample alert (optional)
-- INSERT INTO site_alerts (message, is_active, alert_type) 
-- VALUES ('Velkommen til vores nye hjemmeside!', false, 'info');
