-- Procurement table
CREATE TABLE IF NOT EXISTS procurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    reference_number VARCHAR(100) UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'goods', 'services', 'works', 'general'
    description TEXT,
    requirements TEXT,
    submission_instructions TEXT,
    submission_email VARCHAR(255),
    submission_url TEXT,
    attachment_url TEXT,
    attachment_public_id VARCHAR(255), -- Format: relief-nepal/procurement/uuid
    deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'open', 'closed', 'archived', 'cancelled'
    published_at TIMESTAMPTZ,
    location VARCHAR(255),
    duration VARCHAR(100),
    work_schedule VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Apply updated_at trigger
CREATE TRIGGER update_procurements_updated_at BEFORE UPDATE ON procurements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_procurements_status ON procurements(status);
CREATE INDEX IF NOT EXISTS idx_procurements_category ON procurements(category);
CREATE INDEX IF NOT EXISTS idx_procurements_deadline ON procurements(deadline);
CREATE INDEX IF NOT EXISTS idx_procurements_published_at ON procurements(published_at);