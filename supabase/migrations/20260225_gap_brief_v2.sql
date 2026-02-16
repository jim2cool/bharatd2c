-- Gap Brief v2 — DB Migrations
-- Apply this manually via Supabase SQL editor or supabase CLI (supabase db push)

-- Sprint 3H: motion_y_offset for per-card FadeIn depth
ALTER TABLE ob_design_tokens ADD COLUMN IF NOT EXISTS motion_y_offset TEXT DEFAULT '12';
UPDATE ob_design_tokens SET motion_y_offset = '24' WHERE mood_card_name IN ('Rooh aur Riwaz', 'Shaahi');

-- Sprint 9: content_seeds for dummy content system
ALTER TABLE stores ADD COLUMN IF NOT EXISTS content_seeds JSONB DEFAULT '{}'::jsonb;

-- Update vw_store_config_resolved to include motion_y_offset
-- (Run this AFTER the ALTER TABLE above)
-- Re-create the view with motion_y_offset added to the SELECT list:
-- Find the CREATE OR REPLACE VIEW vw_store_config_resolved statement in your existing migrations
-- and add: dt.motion_y_offset  to the SELECT clause, then rebuild.
-- Quick patch if the view is too large to inline here:
CREATE OR REPLACE VIEW vw_motion_y_offset AS
  SELECT s.id AS store_id, dt.motion_y_offset
  FROM stores s
  JOIN re_store_render_config rc ON rc.store_id = s.id
  JOIN ob_design_tokens dt ON dt.mood_card_name = rc.mood_card_name;
