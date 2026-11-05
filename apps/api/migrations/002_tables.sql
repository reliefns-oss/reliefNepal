-- Core tables for Relief Nepal API
-- This schema is based on the Supabase schema used previously

-- Admin users table (for JWT authentication)
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'editor', -- 'admin', 'editor'
    display_name VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    location VARCHAR(255),
    donor VARCHAR(255),
    period VARCHAR(100),
    total_budget VARCHAR(100),
    theme VARCHAR(255),
    background TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'planned', -- 'planned', 'ongoing', 'completed'
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    starts_on DATE,
    ends_on DATE,
    banner_url TEXT,
    banner_public_id VARCHAR(255), -- Format: relief-nepal/projects/uuid
    program_id UUID REFERENCES programs(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Project impact metrics
CREATE TABLE IF NOT EXISTS project_impact_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(60),
    reporting_period VARCHAR(80),
    measured_on DATE,
    source VARCHAR(500),
    verification_status VARCHAR(20) NOT NULL DEFAULT 'unverified', -- 'unverified', 'verified'
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project impact details
CREATE TABLE IF NOT EXISTS project_impact_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gallery items
CREATE TABLE IF NOT EXISTS gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    media_type VARCHAR(20) NOT NULL, -- 'photo', 'video', 'audio'
    media_url TEXT,
    media_public_id VARCHAR(255), -- Format: relief-nepal/gallery/uuid
    thumbnail_url TEXT,
    alt_text TEXT,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Network partners
CREATE TABLE IF NOT EXISTS network_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- 'local_district', 'resource_provider'
    short_description VARCHAR(280),
    description TEXT,
    location VARCHAR(255),
    website_url TEXT,
    public_contact_email VARCHAR(255),
    collaboration_context TEXT,
    collaboration_areas TEXT,
    display_order INT NOT NULL DEFAULT 0,
    logo_url TEXT,
    logo_public_id VARCHAR(255), -- Format: relief-nepal/partners/uuid
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    body TEXT,
    attachment_url TEXT,
    image_url TEXT,
    image_public_id VARCHAR(255), -- Format: relief-nepal/notices/uuid
    publication_status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'archived'
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Vacancies
CREATE TABLE IF NOT EXISTS vacancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(120) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    job_type VARCHAR(30) NOT NULL, -- 'full-time', 'part-time', 'contract', 'internship', 'consultancy', 'temporary'
    job_level VARCHAR(30) NOT NULL, -- 'entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'other'
    location VARCHAR(255) NOT NULL,
    number_of_vacancies INT NOT NULL DEFAULT 1,
    work_schedule VARCHAR(100),
    hours_per_week INT,
    duration VARCHAR(100),
    description TEXT NOT NULL,
    responsibilities TEXT,
    qualifications TEXT,
    benefits TEXT,
    application_instructions TEXT,
    application_email VARCHAR(255),
    application_url TEXT,
    application_deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'open', 'closed', 'archived'
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Board members
CREATE TABLE IF NOT EXISTS board_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sn INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    qualification VARCHAR(255) NOT NULL,
    expertise VARCHAR(255) NOT NULL,
    designation VARCHAR(255) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    experience INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Newsletter subscriptions
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gallery_items_updated_at BEFORE UPDATE ON gallery_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_network_partners_updated_at BEFORE UPDATE ON network_partners FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vacancies_updated_at BEFORE UPDATE ON vacancies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_board_members_updated_at BEFORE UPDATE ON board_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();