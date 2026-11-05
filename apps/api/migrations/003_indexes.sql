-- Indexes for performance optimization

-- Programs
CREATE INDEX IF NOT EXISTS idx_programs_publication_status ON programs(publication_status);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);

-- Projects
CREATE INDEX IF NOT EXISTS idx_projects_publication_status ON projects(publication_status);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_program_id ON projects(program_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- Project impact metrics
CREATE INDEX IF NOT EXISTS idx_project_impact_metrics_project_id ON project_impact_metrics(project_id);
CREATE INDEX IF NOT EXISTS idx_project_impact_metrics_display_order ON project_impact_metrics(project_id, display_order);

-- Project impact details
CREATE INDEX IF NOT EXISTS idx_project_impact_details_project_id ON project_impact_details(project_id);
CREATE INDEX IF NOT EXISTS idx_project_impact_details_display_order ON project_impact_details(project_id, display_order);

-- Gallery items
CREATE INDEX IF NOT EXISTS idx_gallery_items_publication_status ON gallery_items(publication_status);
CREATE INDEX IF NOT EXISTS idx_gallery_items_project_id ON gallery_items(project_id);
CREATE INDEX IF NOT EXISTS idx_gallery_items_published_at ON gallery_items(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_media_type ON gallery_items(media_type);

-- Network partners
CREATE INDEX IF NOT EXISTS idx_network_partners_publication_status ON network_partners(publication_status);
CREATE INDEX IF NOT EXISTS idx_network_partners_slug ON network_partners(slug);
CREATE INDEX IF NOT EXISTS idx_network_partners_display_order ON network_partners(display_order, name);
CREATE INDEX IF NOT EXISTS idx_network_partners_relationship_type ON network_partners(relationship_type);

-- Notices
CREATE INDEX IF NOT EXISTS idx_notices_publication_status ON notices(publication_status);
CREATE INDEX IF NOT EXISTS idx_notices_slug ON notices(slug);
CREATE INDEX IF NOT EXISTS idx_notices_published_at ON notices(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_notices_expires_at ON notices(expires_at);

-- Vacancies
CREATE INDEX IF NOT EXISTS idx_vacancies_status ON vacancies(status);
CREATE INDEX IF NOT EXISTS idx_vacancies_slug ON vacancies(slug);
CREATE INDEX IF NOT EXISTS idx_vacancies_published_at ON vacancies(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_vacancies_application_deadline ON vacancies(application_deadline);
CREATE INDEX IF NOT EXISTS idx_vacancies_job_type ON vacancies(job_type);

-- Board members
CREATE INDEX IF NOT EXISTS idx_board_members_is_active ON board_members(is_active);
CREATE INDEX IF NOT EXISTS idx_board_members_display_order ON board_members(display_order, sn);

-- Newsletter subscriptions
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_created_at ON newsletter_subscriptions(created_at DESC);

-- Admin users
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_is_active ON admin_users(is_active);