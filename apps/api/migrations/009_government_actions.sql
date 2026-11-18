-- PostgreSQL SQL migration; safe to run directly in pgAdmin.

CREATE TABLE IF NOT EXISTS government_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    government_partner VARCHAR(180) NOT NULL,
    action_date DATE NOT NULL,
    summary VARCHAR(600) NOT NULL,
    body TEXT NOT NULL,
    image_url TEXT,
    image_public_id VARCHAR(255),
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_government_actions_publication_date
    ON government_actions (publication_status, action_date DESC);

CREATE OR REPLACE FUNCTION update_government_actions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_government_actions_updated_at
    ON government_actions;

CREATE TRIGGER update_government_actions_updated_at
    BEFORE UPDATE ON government_actions
    FOR EACH ROW EXECUTE FUNCTION update_government_actions_updated_at();

