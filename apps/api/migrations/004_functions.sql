-- PostgreSQL functions to replace Supabase RPC functions

-- Function to replace project impact content (replaces replace_project_impact_content RPC)
CREATE OR REPLACE FUNCTION replace_project_impact_content(
    p_project_id UUID,
    p_impact_metrics JSONB,
    p_impact_details JSONB
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete existing metrics
    DELETE FROM project_impact_metrics WHERE project_id = p_project_id;

    -- Insert new metrics
    IF jsonb_typeof(p_impact_metrics) = 'array' THEN
        INSERT INTO project_impact_metrics (project_id, label, value, unit, reporting_period, measured_on, source, verification_status, display_order)
        SELECT
            p_project_id,
            (metric->>'label')::VARCHAR,
            (metric->>'value')::VARCHAR,
            (metric->>'unit')::VARCHAR,
            (metric->>'reporting_period')::VARCHAR,
            (metric->>'measured_on')::DATE,
            (metric->>'source')::VARCHAR,
            COALESCE((metric->>'verification_status')::VARCHAR, 'unverified'),
            COALESCE((metric->>'display_order')::INT, idx - 1)
        FROM jsonb_array_elements(p_impact_metrics) WITH ORDINALITY AS metric(metric, idx);
    END IF;

    -- Delete existing details
    DELETE FROM project_impact_details WHERE project_id = p_project_id;

    -- Insert new details
    IF jsonb_typeof(p_impact_details) = 'array' THEN
        INSERT INTO project_impact_details (project_id, title, description, display_order)
        SELECT
            p_project_id,
            (detail->>'title')::VARCHAR,
            (detail->>'description')::TEXT,
            COALESCE((detail->>'display_order')::INT, idx - 1)
        FROM jsonb_array_elements(p_impact_details) WITH ORDINALITY AS detail(detail, idx);
    END IF;
END;
$$;

-- Function to get project with all relations (for admin list)
CREATE OR REPLACE FUNCTION get_projects_with_relations()
RETURNS TABLE (
    id UUID,
    slug VARCHAR,
    title VARCHAR,
    summary TEXT,
    location VARCHAR,
    donor VARCHAR,
    period VARCHAR,
    total_budget VARCHAR,
    theme VARCHAR,
    background TEXT,
    status VARCHAR,
    publication_status VARCHAR,
    starts_on DATE,
    ends_on DATE,
    banner_url TEXT,
    banner_public_id VARCHAR,
    program_id UUID,
    program_name VARCHAR,
    program_slug VARCHAR,
    impact_metrics JSONB,
    impact_details JSONB,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.slug,
        p.title,
        p.summary,
        p.location,
        p.donor,
        p.period,
        p.total_budget,
        p.theme,
        p.background,
        p.status,
        p.publication_status,
        p.starts_on,
        p.ends_on,
        p.banner_url,
        p.banner_public_id,
        p.program_id,
        pr.name AS program_name,
        pr.slug AS program_slug,
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', m.id,
                'label', m.label,
                'value', m.value,
                'unit', m.unit,
                'reporting_period', m.reporting_period,
                'measured_on', m.measured_on,
                'source', m.source,
                'verification_status', m.verification_status,
                'display_order', m.display_order
            ) ORDER BY m.display_order)
            FROM project_impact_metrics m WHERE m.project_id = p.id
        ), '[]'::jsonb) AS impact_metrics,
        COALESCE((
            SELECT jsonb_agg(jsonb_build_object(
                'id', d.id,
                'title', d.title,
                'description', d.description,
                'display_order', d.display_order
            ) ORDER BY d.display_order)
            FROM project_impact_details d WHERE d.project_id = p.id
        ), '[]'::jsonb) AS impact_details,
        p.created_at,
        p.updated_at,
        p.published_at
    FROM projects p
    LEFT JOIN programs pr ON p.program_id = pr.id
    ORDER BY p.updated_at DESC;
END;
$$;

-- Function to get gallery items with project info
CREATE OR REPLACE FUNCTION get_gallery_with_projects()
RETURNS TABLE (
    id UUID,
    title VARCHAR,
    caption TEXT,
    media_type VARCHAR,
    media_url TEXT,
    media_public_id VARCHAR,
    thumbnail_url TEXT,
    alt_text TEXT,
    project_id UUID,
    project_slug VARCHAR,
    project_title VARCHAR,
    project_summary TEXT,
    project_banner_url TEXT,
    project_banner_public_id VARCHAR,
    project_publication_status VARCHAR,
    project_program_name VARCHAR,
    project_program_slug VARCHAR,
    publication_status VARCHAR,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        g.id,
        g.title,
        g.caption,
        g.media_type,
        g.media_url,
        g.media_public_id,
        g.thumbnail_url,
        g.alt_text,
        g.project_id,
        p.slug AS project_slug,
        p.title AS project_title,
        p.summary AS project_summary,
        p.banner_url AS project_banner_url,
        p.banner_public_id AS project_banner_public_id,
        p.publication_status AS project_publication_status,
        pr.name AS project_program_name,
        pr.slug AS project_program_slug,
        g.publication_status,
        g.published_at,
        g.created_at,
        g.updated_at
    FROM gallery_items g
    JOIN projects p ON g.project_id = p.id
    LEFT JOIN programs pr ON p.program_id = pr.id
    ORDER BY g.created_at DESC;
END;
$$;