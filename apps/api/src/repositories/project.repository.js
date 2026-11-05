import {
  findMany,
  insert,
  update,
  deleteById,
  rawQuery,
  transaction,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const PROJECT_COLUMNS = `
  id, slug, title, summary, location, donor, period, total_budget,
  theme, background, status, publication_status, starts_on, ends_on,
  banner_url, banner_public_id, program_id,
  created_at, updated_at, published_at
`;

const PROJECT_WITH_RELATIONS_SQL = `
  SELECT
    p.id, p.slug, p.title, p.summary, p.location, p.donor, p.period, p.total_budget,
    p.theme, p.background, p.status, p.publication_status, p.starts_on, p.ends_on,
    p.banner_url, p.banner_public_id, p.program_id,
    p.created_at, p.updated_at, p.published_at,
    pr.id as program_id, pr.name as program_name, pr.slug as program_slug,
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
    ), '[]'::jsonb) AS impact_details
  FROM projects p
  LEFT JOIN programs pr ON p.program_id = pr.id
`;

function transformProject(project) {
  if (!project) return null;
  return {
    ...project,
    banner_url: project.banner_public_id ? getPublicUrl(project.banner_public_id) : project.banner_url,
    impact_metrics: project.impact_metrics || [],
    impact_details: project.impact_details || [],
    program: project.program_name ? {
      id: project.program_id,
      name: project.program_name,
      slug: project.program_slug,
    } : null,
  };
}

function transformProjectList(projects) {
  return projects.map(transformProject);
}

// Local findById for internal use (e.g., in delete)
async function findProjectById(id) {
  const sql = `${PROJECT_WITH_RELATIONS_SQL} WHERE p.id = $1`;
  const result = await rawQuery(sql, [id]);
  return transformProject(result[0]);
}

export const projectRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const projects = await findMany('projects', {
      columns: PROJECT_COLUMNS,
      filters: { publication_status: 'published' },
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformProjectList(projects);
  },

  async findPublishedBySlug(slug) {
    const sql = `${PROJECT_WITH_RELATIONS_SQL} WHERE p.publication_status = 'published' AND p.slug = $1`;
    const result = await rawQuery(sql, [slug]);
    return transformProject(result[0]);
  },

  async findById(id) {
    const sql = `${PROJECT_WITH_RELATIONS_SQL} WHERE p.id = $1`;
    const result = await rawQuery(sql, [id]);
    return transformProject(result[0]);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset } = options;
    const sql = `${PROJECT_WITH_RELATIONS_SQL} ORDER BY p.updated_at DESC ${limit ? `LIMIT ${Number(limit)}` : ''} ${offset ? `OFFSET ${Number(offset)}` : ''}`;
    const projects = await rawQuery(sql, []);
    return transformProjectList(projects);
  },

  async create(data) {
    const project = await insert('projects', {
      ...data,
      publication_status: data.publication_status || 'draft',
      status: data.status || 'planned',
    });
    return transformProject(project);
  },

  async update(id, data) {
    const project = await update('projects', id, data);
    return transformProject(project);
  },

  async delete(id) {
    // Get banner_public_id before deleting
    const project = await findProjectById(id);
    const deleted = await deleteById('projects', id);
    return { deleted, bannerPublicId: project?.banner_public_id };
  },

  async replaceImpactContent(projectId, { metrics, details }) {
    return transaction(async (client) => {
      // Delete existing
      await client.query('DELETE FROM project_impact_metrics WHERE project_id = $1', [projectId]);
      await client.query('DELETE FROM project_impact_details WHERE project_id = $1', [projectId]);

      // Insert metrics
      if (metrics?.length) {
        for (let i = 0; i < metrics.length; i++) {
          const m = metrics[i];
          await client.query(
            `INSERT INTO project_impact_metrics
              (project_id, label, value, unit, reporting_period, measured_on, source, verification_status, display_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
              projectId,
              m.label,
              m.value,
              m.unit || null,
              m.reporting_period || null,
              m.measured_on || null,
              m.source || null,
              m.verification_status || 'unverified',
              m.display_order ?? i,
            ],
          );
        }
      }

      // Insert details
      if (details?.length) {
        for (let i = 0; i < details.length; i++) {
          const d = details[i];
          await client.query(
            `INSERT INTO project_impact_details
              (project_id, title, description, display_order)
             VALUES ($1, $2, $3, $4)`,
            [projectId, d.title, d.description, d.display_order ?? i],
          );
        }
      }

      return { success: true };
    });
  },

  async getImpactContent(projectId) {
    const [metrics, details] = await Promise.all([
      rawQuery(
        `SELECT id, label, value, unit, reporting_period, measured_on, source, verification_status, display_order
         FROM project_impact_metrics WHERE project_id = $1 ORDER BY display_order`,
        [projectId],
      ),
      rawQuery(
        `SELECT id, title, description, display_order
         FROM project_impact_details WHERE project_id = $1 ORDER BY display_order`,
        [projectId],
      ),
    ]);
    return { metrics, details };
  },
};