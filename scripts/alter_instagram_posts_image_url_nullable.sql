-- Make image_url nullable since we now use Instagram embeds
-- This migration allows posts to not have image_url (embeds don't need it)
ALTER TABLE instagram_posts 
  ALTER COLUMN image_url DROP NOT NULL;

-- Update existing posts with empty string to NULL (optional cleanup)
UPDATE instagram_posts 
  SET image_url = NULL 
  WHERE image_url = '';
