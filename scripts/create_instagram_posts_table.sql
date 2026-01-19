-- Create Instagram posts table
CREATE TABLE IF NOT EXISTS instagram_posts (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active posts
CREATE POLICY "Anyone can view active instagram posts"
  ON instagram_posts
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can manage posts
CREATE POLICY "Authenticated users can manage instagram posts"
  ON instagram_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_instagram_posts_order 
  ON instagram_posts(display_order, created_at DESC);

-- Insert initial posts (based on existing hardcoded data)
INSERT INTO instagram_posts (id, url, image_url, caption, display_order) VALUES
  ('DNxVdvtWs_-', 'https://www.instagram.com/synnesdyreklinik/p/DNxVdvtWs_-/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/1.png', '🐾📞 Så er vi i gang igen!', 1),
  ('DNpmyK-N8_3', 'https://www.instagram.com/synnesdyreklinik/p/DNpmyK-N8_3/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/2.png', 'Klinikken oplever i øjeblikket telefonproblemer', 2),
  ('DNkpxxdgP0I', 'https://www.instagram.com/synnesdyreklinik/p/DNkpxxdgP0I/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/3.png', '🔬 Vi ser mere end det blotte øje kan! 🐾💡', 3),
  ('DNfnHPNocoQ', 'https://www.instagram.com/synnesdyreklinik/p/DNfnHPNocoQ/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/4.png', '🏆 Katten: 1🐱 – Musen: 0🐭', 4),
  ('DNVayE1V7do', 'https://www.instagram.com/synnesdyreklinik/p/DNVayE1V7do/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/5.png', '🌾👂 To genstridige græs-agnere – men Kima tog det i stiv pote! 🐾', 5),
  ('DNQMT00KDss', 'https://www.instagram.com/synnesdyreklinik/p/DNQMT00KDss/', 'https://sethupsgoqfwrdepecld.supabase.co/storage/v1/object/public/media/public/images/ig-test/6.png', '☀️🐾 Hot dog? Nej tak! 🌭', 6)
ON CONFLICT (id) DO NOTHING;
