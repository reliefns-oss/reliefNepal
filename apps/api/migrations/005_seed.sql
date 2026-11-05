-- Seed data for development/testing

-- Insert default admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hash generated with bcryptjs: bcrypt.hashSync('admin123', 10)
INSERT INTO admin_users (email, password_hash, role, display_name, is_active)
VALUES (
    'admin@reliefnepal.org.np',
    '$2a$10$X7X7X7X7X7X7X7X7X7X7X.u7X7X7X7X7X7X7X7X7X7X7X7X7X7X7X',
    'admin',
    'System Administrator',
    true
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample programs
INSERT INTO programs (slug, name, description, publication_status, published_at)
VALUES
    ('psychosocial-health', 'Psychosocial Health and Protection', 'Programs focused on mental health and psychosocial support for disaster-affected communities.', 'published', NOW()),
    ('water-sanitation', 'Water, Sanitation and Hygiene (WASH)', 'Clean water access, sanitation facilities, and hygiene promotion.', 'published', NOW()),
    ('livelihood', 'Livelihood Recovery', 'Economic recovery and livelihood restoration for affected families.', 'published', NOW()),
    ('education', 'Education in Emergencies', 'Ensuring continuity of education during and after disasters.', 'draft', NULL)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample projects
WITH prog AS (SELECT id FROM programs WHERE slug = 'psychosocial-health' LIMIT 1)
INSERT INTO projects (slug, title, summary, location, donor, period, total_budget, theme, background, status, publication_status, starts_on, ends_on, program_id, published_at)
SELECT
    'community-healing-circles',
    'Community Healing Circles',
    'Establishing safe spaces for psychosocial support in earthquake-affected villages.',
    'Sindhuli District',
    'NATA Worldwide Disaster Relief',
    'April 2023 – December 2024',
    'USD 75,000',
    'Psychosocial Health',
    'After the 2023 earthquake, many communities in Sindhuli experienced trauma and loss. This project creates community healing circles led by trained facilitators to provide psychosocial first aid and ongoing support.',
    'ongoing',
    'published',
    '2023-04-01',
    '2024-12-31',
    prog.id,
    NOW()
FROM prog
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'community-healing-circles');

WITH prog AS (SELECT id FROM programs WHERE slug = 'water-sanitation' LIMIT 1)
INSERT INTO projects (slug, title, summary, location, donor, period, total_budget, theme, background, status, publication_status, starts_on, ends_on, program_id, published_at)
SELECT
    'clean-water-initiative',
    'Clean Water Initiative',
    'Installing water filtration systems and restoring water sources in remote communities.',
    'Ramechhap District',
    'UNICEF Nepal',
    'January 2024 – December 2025',
    'USD 120,000',
    'Water & Sanitation',
    'Many remote communities in Ramechhap lack access to safe drinking water. This project installs community-scale water filtration systems and protects natural spring sources.',
    'planned',
    'published',
    '2024-01-15',
    '2025-12-15',
    prog.id,
    NOW()
FROM prog
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE slug = 'clean-water-initiative');

-- Insert sample impact metrics for first project
WITH proj AS (SELECT id FROM projects WHERE slug = 'community-healing-circles' LIMIT 1)
INSERT INTO project_impact_metrics (project_id, label, value, unit, reporting_period, measured_on, source, verification_status, display_order)
SELECT
    proj.id,
    'Families reached with psychosocial support',
    '240',
    'families',
    '2024',
    '2024-06-30',
    'Mid-term monitoring report',
    'verified',
    0
FROM proj
WHERE NOT EXISTS (SELECT 1 FROM project_impact_metrics WHERE project_id = proj.id AND label = 'Families reached with psychosocial support');

WITH proj AS (SELECT id FROM projects WHERE slug = 'community-healing-circles' LIMIT 1)
INSERT INTO project_impact_metrics (project_id, label, value, unit, reporting_period, measured_on, source, verification_status, display_order)
SELECT
    proj.id,
    'Healing circles established',
    '12',
    'circles',
    '2024',
    '2024-06-30',
    'Project records',
    'verified',
    1
FROM proj
WHERE NOT EXISTS (SELECT 1 FROM project_impact_metrics WHERE project_id = proj.id AND label = 'Healing circles established');

-- Insert sample impact details for first project
WITH proj AS (SELECT id FROM projects WHERE slug = 'community-healing-circles' LIMIT 1)
INSERT INTO project_impact_details (project_id, title, description, display_order)
SELECT
    proj.id,
    'Safe Spaces for Healing',
    'Community members gather weekly in facilitated circles to share experiences, learn coping strategies, and rebuild social connections. Sessions incorporate local cultural practices.',
    0
FROM proj
WHERE NOT EXISTS (SELECT 1 FROM project_impact_details WHERE project_id = proj.id AND title = 'Safe Spaces for Healing');

WITH proj AS (SELECT id FROM projects WHERE slug = 'community-healing-circles' LIMIT 1)
INSERT INTO project_impact_details (project_id, title, description, display_order)
SELECT
    proj.id,
    'Youth Resilience Program',
    'Specialized sessions for adolescents addressing trauma, identity, and future planning. Includes art therapy and peer support activities.',
    1
FROM proj
WHERE NOT EXISTS (SELECT 1 FROM project_impact_details WHERE project_id = proj.id AND title = 'Youth Resilience Program');

-- Insert sample network partners
INSERT INTO network_partners (name, slug, relationship_type, short_description, description, location, display_order, publication_status)
VALUES
    ('Sindhuli District Government', 'sindhuli-district-gov', 'local_district', 'Local government partnership for program coordination.', 'Collaborating with Sindhuli District authorities for disaster response coordination and community program implementation.', 'Sindhuli, Nepal', 1, 'published'),
    ('NATA Worldwide Disaster Relief', 'nata-worldwide', 'resource_provider', 'International NGO providing funding and technical expertise.', 'NATA Worldwide Disaster Relief supports Relief Nepal with financial resources, technical guidance, and global best practices in disaster management.', 'Global', 2, 'published')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample board members
INSERT INTO board_members (sn, name, qualification, expertise, designation, contact, email, experience, display_order, is_active)
VALUES
    (1, 'Dr. Ram Sharma', 'PhD in Public Health', 'Disaster Health Management', 'Chairperson', '+977-1-XXXXXXX', 'chair@reliefnepal.org.np', 20, 1, true),
    (2, 'Ms. Sita Gurung', 'MA in Social Work', 'Community Development', 'Vice Chairperson', '+977-1-XXXXXXX', 'vicechair@reliefnepal.org.np', 15, 2, true),
    (3, 'Mr. Krishna Thapa', 'MBA', 'Organizational Management', 'Treasurer', '+977-1-XXXXXXX', 'treasurer@reliefnepal.org.np', 18, 3, true)
ON CONFLICT DO NOTHING;

-- Insert sample vacancies
INSERT INTO vacancies (slug, title, job_type, job_level, location, number_of_vacancies, description, responsibilities, qualifications, benefits, application_email, status)
VALUES
    ('program-coordinator', 'Program Coordinator', 'full-time', 'mid', 'Kathmandu, Nepal', 1,
     'Coordinate and monitor program implementation across project sites.',
     '["Oversee project activities", "Monitor progress and reporting", "Coordinate with partners"]',
     '["Master''s degree in Development Studies", "3+ years experience", "Nepali and English fluency"]',
     '["Competitive salary", "Health insurance", "Professional development"]',
     'hr@reliefnepal.org.np',
     'open')
ON CONFLICT (slug) DO NOTHING;