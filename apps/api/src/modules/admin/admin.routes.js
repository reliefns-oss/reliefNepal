import { Router } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { existsSync } from 'node:fs';
import { env } from '../../config/env.js';
import { requireAdmin } from '../../middleware/require-admin.js';
import {
  validateFileType,
  validateFileSize,
  getExtension,
  generatePublicId,
  getPublicUrl,
  handleDirectUpload,
  deleteFile,
  getFilePath,
} from '../../services/storage.js';
import {
  projectRepository,
  galleryRepository,
  noticeRepository,
  networkRepository,
  programRepository,
  vacancyRepository,
  procurementRepository,
  boardRepository,
  newsletterRepository,
} from '../../repositories/index.js';

export const adminRoutes = Router();

// Login endpoint - must be before requireAdmin middleware
adminRoutes.post('/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required' } });
    }

    // Query admin user from database
    const { query } = await import('../../config/database.js');
    const { verifyToken, generateToken } = await import('../../middleware/auth.js');

    const result = await query('SELECT id, email, password_hash, role, display_name, is_active FROM admin_users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const admin = result.rows[0];
    if (!admin.is_active) {
      return res.status(401).json({ error: { code: 'ACCOUNT_DISABLED', message: 'Account is disabled' } });
    }

    // Verify password with bcrypt
    const bcrypt = (await import('bcryptjs')).default;
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    // Generate JWT token
    const token = generateToken({ adminId: admin.id, email: admin.email, role: admin.role });

    res.json({
      data: {
        token,
        user: {
          id: admin.id,
          email: admin.email,
          role: admin.role,
          display_name: admin.display_name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

// Token verification endpoint
adminRoutes.get('/auth/verify', requireAdmin, (req, res) => {
  res.json({
    data: {
      user: {
        id: req.admin.user.id,
        email: req.admin.user.email,
        role: req.admin.user.role,
        display_name: req.admin.user.display_name,
      },
    },
  });
});

// Dashboard stats endpoint
adminRoutes.get('/dashboard/stats', requireAdmin, async (req, res, next) => {
  try {
    const { query } = await import('../../config/database.js');

    const [
      projectsResult,
      programsResult,
      partnersResult,
      storiesResult,
      messagesResult,
      beneficiariesResult,
      storageResult,
      reviewsResult,
    ] = await Promise.all([
      query('SELECT COUNT(*) as count FROM projects'),
      query("SELECT COUNT(*) as count FROM programs WHERE publication_status = 'published'"),
      query("SELECT COUNT(*) as count FROM network_partners WHERE publication_status = 'published'"),
      query("SELECT COUNT(*) as count FROM notices WHERE publication_status = 'published'"),
      query("SELECT COUNT(*) as count FROM inquiries WHERE status = 'new'"),
      query('SELECT COALESCE(SUM((impact_metrics->0->>\'value\')::int), 0) as total FROM projects, jsonb_array_elements(impact_metrics) WHERE impact_metrics IS NOT NULL'),
      query('SELECT pg_size_pretty(pg_database_size(current_database())) as size'),
      query("SELECT COUNT(*) as count FROM projects WHERE publication_status = 'draft'"),
    ]);

    res.json({
      data: {
        total_projects: parseInt(projectsResult.rows[0]?.count || 0),
        active_programs: parseInt(programsResult.rows[0]?.count || 0),
        network_partners: parseInt(partnersResult.rows[0]?.count || 0),
        published_stories: parseInt(storiesResult.rows[0]?.count || 0),
        pending_messages: parseInt(messagesResult.rows[0]?.count || 0),
        total_beneficiaries: parseInt(beneficiariesResult.rows[0]?.total || 0),
        storage_usage: storageResult.rows[0]?.size || 'Unknown',
        pending_reviews: parseInt(reviewsResult.rows[0]?.count || 0),
      },
    });
  } catch (error) {
    return next(error);
  }
});

// Dashboard activity endpoint
adminRoutes.get('/dashboard/activity', requireAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const { query } = await import('../../config/database.js');

    const result = await query(
      `SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT $1`,
      [limit]
    );

    res.json({ data: result.rows });
  } catch (error) {
    return next(error);
  }
});

adminRoutes.use(requireAdmin);

function normalizeImpactContent(metrics, details) {
  if (!Array.isArray(metrics) || !Array.isArray(details))
    return { error: 'Impact figures and impact details must be lists.' };
  if (metrics.length > 50 || details.length > 50)
    return { error: 'Add no more than 50 impact entries in each section.' };

  const normalizedMetrics = [];
  for (const [index, item] of metrics.entries()) {
    if (!item || typeof item !== 'object')
      return { error: `Impact figure ${index + 1} is not valid.` };
    const label = typeof item.label === 'string' ? item.label.trim() : '';
    const value =
      typeof item.value === 'string'
        ? item.value.trim()
        : String(item.value ?? '').trim();
    if (!label || !value)
      return {
        error: `Add both a result name and value for impact figure ${index + 1}.`,
      };
    if (label.length > 180 || value.length > 80)
      return {
        error: `Keep the result name under 180 characters and its value under 80 characters (figure ${index + 1}).`,
      };
    if (
      !['unverified', 'verified'].includes(
        item.verification_status || 'unverified',
      )
    )
      return {
        error: `Choose a verification status for impact figure ${index + 1}.`,
      };
    const unit = typeof item.unit === 'string' ? item.unit.trim() : '';
    const reportingPeriod =
      typeof item.reporting_period === 'string'
        ? item.reporting_period.trim()
        : '';
    const source = typeof item.source === 'string' ? item.source.trim() : '';
    if (unit.length > 60 || reportingPeriod.length > 80 || source.length > 500)
      return {
        error: `Shorten the unit, reporting period, or source for impact figure ${index + 1}.`,
      };
    normalizedMetrics.push({
      label,
      value,
      unit,
      reporting_period: reportingPeriod,
      measured_on: item.measured_on || null,
      source,
      verification_status: item.verification_status || 'unverified',
      display_order: item.display_order ?? index,
    });
  }

  const normalizedDetails = [];
  for (const [index, item] of details.entries()) {
    if (!item || typeof item !== 'object')
      return { error: `Impact detail ${index + 1} is not valid.` };
    const title = typeof item.title === 'string' ? item.title.trim() : '';
    const description =
      typeof item.description === 'string' ? item.description.trim() : '';
    if (!title || !description)
      return {
        error: `Add a heading and description for impact detail ${index + 1}.`,
      };
    if (title.length > 180 || description.length > 5000)
      return {
        error: `Keep the heading under 180 characters and description under 5,000 characters (detail ${index + 1}).`,
      };
    normalizedDetails.push({ title, description, display_order: item.display_order ?? index });
  }
  return { metrics: normalizedMetrics, details: normalizedDetails };
}

adminRoutes.get('/me', (req, res) =>
  res.json({
    data: {
      id: req.admin.user.id,
      email: req.admin.user.email,
      role: req.admin.user.role,
      display_name: req.admin.user.display_name,
    },
  }),
);

// Upload signature endpoint - now returns local upload info
adminRoutes.post('/uploads/sign', (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const collections = {
    'gallery-photo': 'gallery',
    'notice-photo': 'notices',
    'partner-logo': 'partners',
    'procurement-attachment': 'procurement',
    'board-photo': 'board',
  };
  const collection = collections[req.body?.purpose] || 'projects';
  const mimeType = req.body?.mime_type;
  const publicId = generatePublicId(collection, mimeType);
  const uploadUrl = `/api/v1/admin/uploads/direct`;

  return res.json({
    data: {
      upload_url: uploadUrl,
      public_id: publicId,
      timestamp,
      max_file_size: env.maxFileSize,
      allowed_types: env.allowedMimeTypes,
    },
  });
});

// Direct upload endpoint (receives file buffer)
adminRoutes.post('/uploads/direct', async (req, res) => {
  try {
    // This would typically use multer for multipart/form-data
    // For simplicity, we'll expect the file as base64 in JSON
    // In production, use multipart/form-data with multer
    const { public_id: publicId, file_base64, mime_type } = req.body || {};

    if (!publicId || !file_base64 || !mime_type) {
      return res.status(400).json({
        error: { code: 'MISSING_FIELDS', message: 'public_id, file_base64, and mime_type are required' },
      });
    }

    if (!validateFileType(mime_type)) {
      return res.status(400).json({
        error: { code: 'INVALID_TYPE', message: `Unsupported file type: ${mime_type}` },
      });
    }

    const buffer = Buffer.from(file_base64, 'base64');
    if (!validateFileSize(buffer.length)) {
      return res.status(400).json({
        error: { code: 'FILE_TOO_LARGE', message: `File size exceeds ${env.maxFileSize} bytes` },
      });
    }

    const url = await handleDirectUpload(buffer, publicId, mime_type);

    return res.json({
      data: {
        media_url: url,
        media_public_id: publicId,
        image_url: url,
        image_public_id: publicId,
        logo_url: url,
        logo_public_id: publicId,
        banner_url: url,
        banner_public_id: publicId,
      },
    });
  } catch (error) {
    console.error('Direct upload error:', error);
    return res.status(500).json({
      error: { code: 'UPLOAD_FAILED', message: error.message },
    });
  }
});

// Verify upload (for compatibility with existing frontend)
adminRoutes.post('/uploads/verify', (req, res) => {
  const { public_id: publicId, version, signature, secure_url: secureUrl } = req.body || {};

  // With local storage, we just verify the file exists
  if (!publicId || typeof publicId !== 'string') {
    return res.status(400).json({
      error: { code: 'INVALID_UPLOAD', message: 'Invalid public_id' },
    });
  }

  // Check if file exists using proper path resolution
  const filePath = getFilePath(publicId);

  if (!filePath || !existsSync(filePath)) {
    return res.status(400).json({
      error: { code: 'INVALID_UPLOAD', message: 'File not found' },
    });
  }

  const expectedUrl = getPublicUrl(publicId);
  if (secureUrl && secureUrl !== expectedUrl) {
    return res.status(400).json({
      error: { code: 'INVALID_UPLOAD', message: 'URL mismatch' },
    });
  }

  return res.json({
    data: publicId.startsWith('relief-nepal/gallery/')
      ? { media_url: expectedUrl, media_public_id: publicId }
      : publicId.startsWith('relief-nepal/notices/')
        ? { image_url: expectedUrl, image_public_id: publicId }
        : publicId.startsWith('relief-nepal/partners/')
          ? { logo_url: expectedUrl, logo_public_id: publicId }
          : publicId.startsWith('relief-nepal/procurement/')
            ? { attachment_url: expectedUrl, attachment_public_id: publicId }
            : publicId.startsWith('relief-nepal/board/')
              ? { photo_url: expectedUrl, photo_public_id: publicId }
              : { banner_url: expectedUrl, banner_public_id: publicId },
  });
});

adminRoutes.get('/programs', async (req, res, next) => {
  try {
    const programs = await programRepository.findAllAdmin();
    return res.json({ data: programs });
  } catch (error) {
    return next(error);
  }
});

adminRoutes.get('/projects', async (req, res, next) => {
  try {
    const projects = await projectRepository.findAllAdmin();
    return res.json({ data: projects });
  } catch (error) {
    return next(error);
  }
});

adminRoutes.post('/projects', async (req, res, next) => {
  try {
    const {
      slug,
      title,
      summary,
      location,
      donor,
      period,
      total_budget,
      theme,
      background,
      impact_metrics = [],
      impact_details = [],
      status = 'planned',
      publication_status = 'draft',
      starts_on = null,
      ends_on = null,
      banner_url = null,
      banner_public_id = null,
      program_id = null,
    } = req.body || {};

    const impactContent = normalizeImpactContent(impact_metrics, impact_details);
    if (impactContent.error)
      return res.status(400).json({
        error: { code: 'INVALID_IMPACT_CONTENT', message: impactContent.error },
      });

    if (
      !slug ||
      !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug) ||
      !title?.trim() ||
      !['planned', 'ongoing', 'completed'].includes(status) ||
      !['draft', 'published', 'archived'].includes(publication_status)
    )
      return res.status(400).json({
        error: {
          code: 'INVALID_PROJECT',
          message: 'Provide a valid title, URL slug, project status, and publication status.',
        },
      });

    // Validate banner
    if (banner_public_id && (!validateFileType('image/jpeg'))) {
      // Just check it's a valid public_id format
      if (typeof banner_public_id !== 'string' || !banner_public_id.startsWith('relief-nepal/projects/')) {
        return res.status(400).json({
          error: { code: 'INVALID_BANNER', message: 'Upload a project banner before saving.' },
        });
      }
    }

    const project = await projectRepository.create({
      slug,
      title: title.trim(),
      summary: summary?.trim() || null,
      location: location?.trim() || null,
      donor: donor?.trim() || null,
      period: period?.trim() || null,
      total_budget: total_budget?.trim() || null,
      theme: theme?.trim() || null,
      background: background?.trim() || null,
      status,
      publication_status,
      starts_on: starts_on || null,
      ends_on: ends_on || null,
      banner_url,
      banner_public_id,
      program_id: program_id || null,
    });

    if (impactContent.metrics.length || impactContent.details.length) {
      await projectRepository.replaceImpactContent(project.id, impactContent);
    }

    res.status(201).json({ data: project });
  } catch (error) {
    return next(error);
  }
});

adminRoutes.patch('/projects/:id', async (req, res, next) => {
  try {
    const body = req.body || {};
    const hasImpactContent =
      Object.hasOwn(body, 'impact_metrics') ||
      Object.hasOwn(body, 'impact_details');
    const impactContent = hasImpactContent
      ? normalizeImpactContent(body.impact_metrics, body.impact_details)
      : null;
    if (impactContent?.error)
      return res.status(400).json({
        error: { code: 'INVALID_IMPACT_CONTENT', message: impactContent.error },
      });

    const allowed = [
      'slug',
      'title',
      'summary',
      'location',
      'donor',
      'period',
      'total_budget',
      'theme',
      'background',
      'status',
      'publication_status',
      'starts_on',
      'ends_on',
      'banner_url',
      'banner_public_id',
      'program_id',
    ];
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => allowed.includes(key)),
    );

    if (updates.slug && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(updates.slug))
      return res.status(400).json({
        error: {
          code: 'INVALID_SLUG',
          message: 'Use lowercase letters, numbers, and single hyphens in the URL slug.',
        },
      });

    // Validate banner
    if (
      'banner_public_id' in updates &&
      updates.banner_public_id &&
      (typeof updates.banner_public_id !== 'string' ||
        !updates.banner_public_id.startsWith('relief-nepal/projects/'))
    )
      return res.status(400).json({
        error: { code: 'INVALID_BANNER', message: 'Upload a project banner before saving.' },
      });

    if (!Object.keys(updates).length && !hasImpactContent)
      return res.status(400).json({
        error: { code: 'EMPTY_UPDATE', message: 'Change at least one project field.' },
      });

    const prior = await projectRepository.findById(req.params.id);
    if (!prior)
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });

    let project = prior;
    if (Object.keys(updates).length) {
      project = await projectRepository.update(req.params.id, updates);
    }

    if (hasImpactContent) {
      await projectRepository.replaceImpactContent(req.params.id, impactContent);
    }

    // Delete old banner if changed
    if (prior?.banner_public_id && prior.banner_public_id !== project.banner_public_id) {
      deleteFile(prior.banner_public_id);
    }

    res.json({ data: project });
  } catch (error) {
    return next(error);
  }
});

adminRoutes.delete('/projects/:id', async (req, res, next) => {
  try {
    const { deleted, bannerPublicId } = await projectRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Project not found.' } });
    }
    if (bannerPublicId) deleteFile(bannerPublicId);
    res.status(204).end();
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        error: {
          code: 'PROJECT_HAS_GALLERY',
          message: 'Delete or move this project\'s gallery items before deleting the project.',
        },
      });
    }
    return next(error);
  }
});

adminRoutes.get('/newsletter', async (req, res, next) => {
  try {
    const subscriptions = await newsletterRepository.findAllAdmin();
    res.json({ data: subscriptions });
  } catch (error) {
    return next(error);
  }
});

function registerEditorCollection(
  path,
  repository,
  columns,
  fields,
  validate,
  options = {},
) {
  const statusField = options.statusField || 'publication_status';
  const publishedValue = options.publishedValue || 'published';
  const transform = options.transform || ((_field, value) => value);
  const mediaIdField = options.mediaIdField;

  adminRoutes.get(`/${path}`, async (req, res, next) => {
    try {
      const data = await repository.findAllAdmin();
      return res.json({ data });
    } catch (error) {
      return next(error);
    }
  });

  adminRoutes.post(`/${path}`, async (req, res, next) => {
    try {
      const input = req.body || {};
      const invalid = validate(input);
      if (invalid)
        return res.status(400).json({ error: { code: 'INVALID_CONTENT', message: invalid } });

      const record = Object.fromEntries(
        fields
          .filter((field) => field in input)
          .map((field) => [field, transform(field, input[field])]),
      );

      if (statusField in record && record[statusField] === publishedValue && 'published_at' in fields && !record.published_at) {
        record.published_at = new Date().toISOString();
      }

      const data = await repository.create(record);
      return res.status(201).json({ data });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          error: { code: 'DUPLICATE', message: 'A record with this value already exists.' },
        });
      }
      return next(error);
    }
  });

  adminRoutes.patch(`/${path}/:id`, async (req, res, next) => {
    try {
      const input = req.body || {};
      const invalid = validate(input, true);
      if (invalid)
        return res.status(400).json({ error: { code: 'INVALID_CONTENT', message: invalid } });

      // Special handling for gallery project_id requirement
      if (path === 'gallery' && !('project_id' in input)) {
        const current = await repository.findById(req.params.id);
        if (!current) {
          return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Gallery item not found.' } });
        }
        if (!current.project_id) {
          return res.status(400).json({
            error: { code: 'PROJECT_REQUIRED', message: 'Assign this gallery item to a project before updating it.' },
          });
        }
      }

      const updates = Object.fromEntries(
        fields
          .filter((field) => field in input)
          .map((field) => [field, transform(field, input[field])]),
      );

      if (statusField in updates && updates[statusField] === publishedValue && 'published_at' in fields && !updates.published_at) {
        updates.published_at = new Date().toISOString();
      }

      if (!Object.keys(updates).length)
        return res.status(400).json({ error: { code: 'EMPTY_UPDATE', message: 'Change at least one field.' } });

      let priorMediaId = null;
      if (mediaIdField) {
        const prior = await repository.findById(req.params.id);
        if (prior) priorMediaId = prior[mediaIdField];
      }

      const data = await repository.update(req.params.id, updates);
      if (!data) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content item not found.' } });
      }

      if (mediaIdField && priorMediaId && priorMediaId !== data[mediaIdField]) {
        deleteFile(priorMediaId);
      }

      return res.json({ data });
    } catch (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          error: { code: 'DUPLICATE', message: 'A record with this value already exists.' },
        });
      }
      return next(error);
    }
  });

  adminRoutes.delete(`/${path}/:id`, async (req, res, next) => {
    try {
      let priorMediaId = null;
      if (mediaIdField) {
        const prior = await repository.findById(req.params.id);
        if (prior) priorMediaId = prior[mediaIdField];
      }

      const deleted = await repository.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'Content item not found.' } });
      }

      if (mediaIdField && priorMediaId) {
        deleteFile(priorMediaId);
      }

      return res.status(204).end();
    } catch (error) {
      return next(error);
    }
  });
}

const publicationStatusIsValid = (value) => ['draft', 'published', 'archived'].includes(value);

registerEditorCollection(
  'gallery',
  galleryRepository,
  'id,title,caption,media_type,media_url,media_public_id,thumbnail_url,alt_text,project_id,project:projects(id,slug,title,summary,banner_url,publication_status,program:programs(name,slug)),publication_status,published_at,created_at',
  [
    'title',
    'caption',
    'media_type',
    'media_url',
    'media_public_id',
    'project_id',
    'thumbnail_url',
    'alt_text',
    'publication_status',
    'published_at',
  ],
  (item, patch = false) => {
    if ((!patch || 'title' in item) && (typeof item.title !== 'string' || item.title.trim().length < 2))
      return 'Enter a title with at least two characters.';
    if ((!patch || 'media_url' in item) && !/^https?:\/\//i.test(item.media_url || ''))
      return 'Media URL must start with http:// or https://.';
    if ((!patch || 'media_type' in item) && !['photo', 'video', 'audio'].includes(item.media_type))
      return 'Choose photo, video, or audio.';
    if (
      (!patch || 'project_id' in item) &&
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(item.project_id || '')
    )
      return 'Choose an existing project for this gallery item.';
    if (
      item.media_type === 'video' &&
      'media_url' in item &&
      !/^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?&].*)?$/i.test(item.media_url)
    )
      return 'Video gallery items must use a valid YouTube video link.';
    if (
      item.media_public_id &&
      (typeof item.media_public_id !== 'string' ||
        !item.media_public_id.startsWith('relief-nepal/gallery/'))
    )
      return 'Use a verified upload for uploaded gallery photos.';
    if ('publication_status' in item && !publicationStatusIsValid(item.publication_status))
      return 'Choose draft, published, or archived.';
    return null;
  },
  {
    transform: (field, value) => (field === 'project_id' ? value || null : value),
    mediaIdField: 'media_public_id',
  },
);

registerEditorCollection(
  'networks',
  networkRepository,
  'id,name,slug,relationship_type,short_description,description,location,website_url,public_contact_email,collaboration_context,collaboration_areas,display_order,logo_url,logo_public_id,publication_status,created_at,updated_at',
  [
    'name',
    'slug',
    'relationship_type',
    'short_description',
    'description',
    'location',
    'website_url',
    'public_contact_email',
    'collaboration_context',
    'collaboration_areas',
    'display_order',
    'logo_url',
    'logo_public_id',
    'publication_status',
  ],
  (item, patch = false) => {
    if ((!patch || 'name' in item) && (typeof item.name !== 'string' || item.name.trim().length < 2 || item.name.trim().length > 180))
      return 'Enter an organization name between 2 and 180 characters.';
    if ((!patch || 'slug' in item) && (typeof item.slug !== 'string' || item.slug.length > 120 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug)))
      return 'Use a profile slug up to 120 characters with lowercase letters, numbers, and single hyphens.';
    if ((!patch || 'relationship_type' in item) && !['local_district', 'resource_provider'].includes(item.relationship_type))
      return 'Choose a network type.';
    if ((!patch || 'short_description' in item) && (typeof item.short_description !== 'string' || item.short_description.trim().length < 10 || item.short_description.trim().length > 280))
      return 'Add a short description between 10 and 280 characters.';
    if ((!patch || 'description' in item) && (typeof item.description !== 'string' || !item.description.trim() || item.description.trim().length > 20000))
      return 'Add a full partner description under 20,000 characters.';
    if ('website_url' in item && item.website_url && !/^https?:\/\//i.test(item.website_url.trim()))
      return 'Enter a website address beginning with https://.';
    if ('public_contact_email' in item && item.public_contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.public_contact_email.trim()))
      return 'Enter a valid public contact email address.';
    if ('display_order' in item && (!Number.isInteger(Number(item.display_order)) || Number(item.display_order) < 0))
      return 'Display order must be a zero or positive whole number.';
    if (
      'logo_public_id' in item && item.logo_public_id &&
      (typeof item.logo_public_id !== 'string' || !item.logo_public_id.startsWith('relief-nepal/partners/'))
    )
      return 'Upload the logo through the secure image upload field.';
    if ('logo_url' in item && item.logo_url && !/^https?:\/\//i.test(item.logo_url))
      return 'Enter a valid logo URL or upload the logo.';
    if ('publication_status' in item && !publicationStatusIsValid(item.publication_status))
      return 'Choose draft, published, or archived.';
    return null;
  },
  {
    transform: (field, value) => {
      if (['website_url', 'public_contact_email', 'location', 'collaboration_context', 'collaboration_areas'].includes(field))
        return typeof value === 'string' && value.trim() ? value.trim() : null;
      if (field === 'logo_url' || field === 'logo_public_id')
        return typeof value === 'string' && value.trim() ? value.trim() : null;
      if (field === 'display_order') return Number(value || 0);
      return value;
    },
    mediaIdField: 'logo_public_id',
  },
);

registerEditorCollection(
  'notices',
  noticeRepository,
  'id,slug,title,summary,body,attachment_url,image_url,image_public_id,publication_status,published_at,expires_at,created_at',
  [
    'slug',
    'title',
    'summary',
    'body',
    'attachment_url',
    'image_url',
    'image_public_id',
    'publication_status',
    'published_at',
    'expires_at',
  ],
  (item, patch = false) => {
    if ((!patch || 'slug' in item) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || ''))
      return 'Use a lowercase URL slug with single hyphens.';
    if ((!patch || 'title' in item) && (typeof item.title !== 'string' || item.title.trim().length < 2))
      return 'Enter a notice title with at least two characters.';
    if ('image_url' in item !== 'image_public_id' in item)
      return 'Upload or remove the notice photo before saving.';
    if (
      item.image_public_id &&
      (typeof item.image_public_id !== 'string' || !item.image_public_id.startsWith('relief-nepal/notices/'))
    )
      return 'Upload the notice photo through the upload field.';
    if ('publication_status' in item && !publicationStatusIsValid(item.publication_status))
      return 'Choose draft, published, or archived.';
    return null;
  },
  {
    mediaIdField: 'image_public_id',
  },
);

const vacancyTypes = ['full-time', 'part-time', 'contract', 'internship', 'consultancy', 'temporary'];
const vacancyLevels = ['entry', 'junior', 'mid', 'senior', 'lead', 'manager', 'director', 'other'];

const procurementCategories = ['goods', 'services', 'works', 'general'];

registerEditorCollection(
  'vacancies',
  vacancyRepository,
  'id,slug,title,job_type,job_level,location,number_of_vacancies,work_schedule,hours_per_week,duration,description,responsibilities,qualifications,benefits,application_instructions,application_email,application_url,application_deadline,status,published_at,created_at,updated_at',
  [
    'slug',
    'title',
    'job_type',
    'job_level',
    'location',
    'number_of_vacancies',
    'work_schedule',
    'hours_per_week',
    'duration',
    'description',
    'responsibilities',
    'qualifications',
    'benefits',
    'application_instructions',
    'application_email',
    'application_url',
    'application_deadline',
    'status',
    'published_at',
  ],
  (item, patch = false) => {
    if ((!patch || 'slug' in item) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || ''))
      return 'Use a lowercase URL slug with single hyphens.';
    if ((!patch || 'title' in item) && (typeof item.title !== 'string' || item.title.trim().length < 2))
      return 'Enter a job title with at least two characters.';
    // job_type is required on create
    if (!patch && (!('job_type' in item) || !item.job_type))
      return 'Job type is required.';
    if ('job_type' in item && !vacancyTypes.includes(item.job_type))
      return 'Choose a valid job type.';
    // job_level is required on create
    if (!patch && (!('job_level' in item) || !item.job_level))
      return 'Job level is required.';
    if ('job_level' in item && !vacancyLevels.includes(item.job_level))
      return 'Choose a valid job level.';
    if ((!patch || 'location' in item) && (typeof item.location !== 'string' || !item.location.trim()))
      return 'Enter the job location.';
    if ('number_of_vacancies' in item && (!Number.isInteger(Number(item.number_of_vacancies)) || Number(item.number_of_vacancies) < 1))
      return 'Number of vacancies must be a positive whole number.';
    if ('hours_per_week' in item && item.hours_per_week !== '' && item.hours_per_week !== null && (!Number.isFinite(Number(item.hours_per_week)) || Number(item.hours_per_week) < 0))
      return 'Weekly hours must be zero or a positive number.';
    if ((!patch || 'description' in item) && (typeof item.description !== 'string' || item.description.trim().length < 10))
      return 'Add a job description with at least 10 characters.';
    if ((!patch || 'qualifications' in item) && (typeof item.qualifications !== 'string' || !item.qualifications.trim()))
      return 'Add the required qualifications for applicants.';
    if ('application_email' in item && item.application_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.application_email))
      return 'Enter a valid application email address.';
    if ('application_url' in item && item.application_url && !/^https:\/\//i.test(item.application_url))
      return 'Application URL must start with https://.';
    if ('status' in item && !['draft', 'open', 'closed', 'archived'].includes(item.status))
      return 'Choose draft, open, closed, or archived.';
    if ('status' in item && item.status === 'open' && !item.application_email && !item.application_url)
      return 'Add an application email or URL before opening this vacancy.';
    return null;
  },
  { statusField: 'status', publishedValue: 'open' },
);

registerEditorCollection(
  'procurement',
  procurementRepository,
  'id,slug,reference_number,title,category,description,requirements,submission_instructions,submission_email,submission_url,attachment_url,attachment_public_id,deadline,status,published_at,location,duration,work_schedule,created_at,updated_at',
  [
    'slug',
    'reference_number',
    'title',
    'category',
    'description',
    'requirements',
    'submission_instructions',
    'submission_email',
    'submission_url',
    'attachment_url',
    'attachment_public_id',
    'deadline',
    'status',
    'published_at',
    'location',
    'duration',
    'work_schedule',
  ],
  (item, patch = false) => {
    if ((!patch || 'slug' in item) && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(item.slug || ''))
      return 'Use a lowercase URL slug with single hyphens.';
    if ((!patch || 'title' in item) && (typeof item.title !== 'string' || item.title.trim().length < 2))
      return 'Enter a procurement title with at least two characters.';
    if ('category' in item && !procurementCategories.includes(item.category))
      return 'Choose a valid category: goods, services, works, or general.';
    if ((!patch || 'description' in item) && (typeof item.description !== 'string' || item.description.trim().length < 10))
      return 'Add a description with at least 10 characters.';
    if ('requirements' in item && item.requirements && typeof item.requirements !== 'string')
      return 'Requirements must be text.';
    if ('submission_instructions' in item && item.submission_instructions && typeof item.submission_instructions !== 'string')
      return 'Submission instructions must be text.';
    if ('submission_email' in item && item.submission_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.submission_email))
      return 'Enter a valid submission email address.';
    if ('submission_url' in item && item.submission_url && !/^https:\/\//i.test(item.submission_url))
      return 'Submission URL must start with https://.';
    if ('status' in item && !['draft', 'open', 'closed', 'archived', 'cancelled'].includes(item.status))
      return 'Choose draft, open, closed, archived, or cancelled.';
    if ('status' in item && item.status === 'open' && !item.submission_email && !item.submission_url && !item.attachment_url)
      return 'Add submission details (email, URL, or attachment) before opening this procurement.';
    if ('deadline' in item && item.deadline && isNaN(Date.parse(item.deadline)))
      return 'Enter a valid deadline date.';
    if ('attachment_public_id' in item && item.attachment_public_id &&
        (typeof item.attachment_public_id !== 'string' || !item.attachment_public_id.startsWith('relief-nepal/procurement/')))
      return 'Upload the attachment through the secure upload field.';
    if ('attachment_url' in item && item.attachment_url && !/^https?:\/\//i.test(item.attachment_url))
      return 'Enter a valid attachment URL or upload the attachment.';
    return null;
  },
  {
    statusField: 'status',
    publishedValue: 'open',
    mediaIdField: 'attachment_public_id',
  },
);

// Board Members
function validateBoardMember(input, patch = false) {
  if ((!patch || 'sn' in input) && (!Number.isInteger(Number(input.sn)) || Number(input.sn) < 1))
    return 'Serial number must be a positive whole number.';
  if ((!patch || 'name' in input) && (typeof input.name !== 'string' || input.name.trim().length < 2))
    return 'Enter a name with at least two characters.';
  if ((!patch || 'qualification' in input) && (typeof input.qualification !== 'string' || input.qualification.trim().length < 1))
    return 'Enter a qualification.';
  if ((!patch || 'expertise' in input) && (typeof input.expertise !== 'string' || input.expertise.trim().length < 1))
    return 'Enter sectoral expertise.';
  if ((!patch || 'designation' in input) && (typeof input.designation !== 'string' || input.designation.trim().length < 1))
    return 'Enter a designation.';
  if ((!patch || 'contact' in input) && (typeof input.contact !== 'string' || input.contact.trim().length < 10))
    return 'Enter a valid contact number.';
  if ((!patch || 'email' in input) && (typeof input.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)))
    return 'Enter a valid email address.';
  if ((!patch || 'experience' in input) && (!Number.isInteger(Number(input.experience)) || Number(input.experience) < 0))
    return 'Experience must be a non-negative whole number.';
  if ('is_active' in input) {
    const val = input.is_active;
    if (typeof val === 'string') {
      if (!['true', 'false'].includes(val)) return 'Active status must be true or false.';
    } else if (typeof val !== 'boolean') {
      return 'Active status must be true or false.';
    }
  }
  return null;
}

registerEditorCollection(
  'board-members',
  boardRepository,
  'id,sn,name,qualification,expertise,designation,contact,email,experience,display_order,is_active,photo_url,photo_public_id,created_at,updated_at',
  [
    'sn',
    'name',
    'qualification',
    'expertise',
    'designation',
    'contact',
    'email',
    'experience',
    'display_order',
    'is_active',
    'photo_url',
    'photo_public_id',
  ],
  validateBoardMember,
  {
    statusField: 'is_active',
    publishedValue: true,
    mediaIdField: 'photo_public_id',
    transform: (field, value) => {
      if (value === '' || value === null || value === undefined) return null;
      if (['sn', 'experience', 'display_order'].includes(field)) return Number(value);
      if (field === 'is_active') {
        if (typeof value === 'string') return value === 'true';
        return Boolean(value);
      }
      if (field === 'photo_url' || field === 'photo_public_id')
        return typeof value === 'string' && value.trim() ? value.trim() : null;
      return value;
    },
  },
);

// Programs
function validateProgram(input, patch = false) {
  if ((!patch || 'slug' in input) && (!input.slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(input.slug)))
    return 'Use a lowercase URL slug with single hyphens.';
  if ((!patch || 'name' in input) && (typeof input.name !== 'string' || input.name.trim().length < 2))
    return 'Enter a program name with at least two characters.';
  if ('description' in input && typeof input.description !== 'string')
    return 'Description must be text.';
  if ('publication_status' in input && !['draft', 'published', 'archived'].includes(input.publication_status))
    return 'Choose draft, published, or archived.';
  return null;
}

registerEditorCollection(
  'programs',
  programRepository,
  'id,slug,name,description,publication_status,created_at,updated_at',
  ['slug', 'name', 'description', 'publication_status'],
  validateProgram,
);