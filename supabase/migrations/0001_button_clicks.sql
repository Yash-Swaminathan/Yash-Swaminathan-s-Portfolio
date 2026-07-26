-- Button click tracking schema for Supabase (Postgres).
--
-- This mirrors the working production schema used by the backend button API
-- (backend/src/controllers/buttonController.js) and the Vercel supabase-heartbeat
-- cron. It is written to be idempotent so it can be safely (re)run in the Supabase
-- SQL editor, e.g. after restoring a paused free-tier project.
--
-- The backend connects with the anon key, so the RPC is SECURITY DEFINER and the
-- relevant privileges are granted to the anon role.

-- Required for uuid_generate_v4(); Supabase ships this extension.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS button_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    button_name VARCHAR(100) NOT NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    last_clicked TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Unique index enables the ON CONFLICT (button_name) upsert below.
CREATE UNIQUE INDEX IF NOT EXISTS idx_button_clicks_button_name
    ON button_clicks (button_name);

-- Increment function ----------------------------------------------------------
-- SECURITY DEFINER so callers using the anon key can upsert under RLS.
CREATE OR REPLACE FUNCTION increment_button_click(button_name_param VARCHAR)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_count INTEGER;
BEGIN
    INSERT INTO button_clicks (button_name, click_count, last_clicked)
    VALUES (button_name_param, 1, CURRENT_TIMESTAMP)
    ON CONFLICT (button_name)
    DO UPDATE SET
        click_count = button_clicks.click_count + 1,
        last_clicked = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP;

    SELECT click_count INTO new_count
    FROM button_clicks
    WHERE button_name = button_name_param;

    RETURN new_count;
END;
$$;

-- Stats view ------------------------------------------------------------------
CREATE OR REPLACE VIEW button_click_stats AS
SELECT
    button_name,
    click_count,
    last_clicked,
    created_at,
    CASE
        WHEN last_clicked >= CURRENT_DATE THEN 'Today'
        WHEN last_clicked >= CURRENT_DATE - INTERVAL '7 days' THEN 'This Week'
        WHEN last_clicked >= CURRENT_DATE - INTERVAL '30 days' THEN 'This Month'
        ELSE 'Older'
    END AS recency
FROM button_clicks
ORDER BY click_count DESC, last_clicked DESC;

-- Row Level Security ----------------------------------------------------------
ALTER TABLE button_clicks ENABLE ROW LEVEL SECURITY;

-- Allow the anon role to read raw rows (used by GET /api/buttons/:buttonName).
DROP POLICY IF EXISTS "Allow anon read button_clicks" ON button_clicks;
CREATE POLICY "Allow anon read button_clicks"
    ON button_clicks
    FOR SELECT
    TO anon
    USING (true);

-- Grants ----------------------------------------------------------------------
-- Reads for the stats view and raw table via the anon key.
GRANT SELECT ON button_click_stats TO anon;
GRANT SELECT ON button_clicks TO anon;

-- Writes happen only through the SECURITY DEFINER RPC.
GRANT EXECUTE ON FUNCTION increment_button_click(VARCHAR) TO anon;

-- Seed the buttons the app references (no-op if they already exist).
INSERT INTO button_clicks (button_name, click_count) VALUES
    ('click-me', 0),
    ('keep_alive', 0)
ON CONFLICT (button_name) DO NOTHING;
