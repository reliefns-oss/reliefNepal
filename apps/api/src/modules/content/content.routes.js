import { Router } from 'express';
import {
  projectRepository,
  galleryRepository,
  networkRepository,
  noticeRepository,
  vacancyRepository,
  procurementRepository,
  boardRepository,
  programRepository,
} from '../../repositories/index.js';

export const contentRoutes = Router();

const isYoutubeVideoUrl = (value) =>
  /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?&].*)?$/i.test(value || '');

function nepalDate() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .formatToParts(new Date())
    .reduce((result, part) => ({ ...result, [part.type]: part.value }), {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

contentRoutes.get('/health', (_req, res) =>
  res.json({ data: { status: 'ok', timestamp: new Date().toISOString() } }),
);

contentRoutes.get('/programs', async (_req, res, next) => {
  try {
    const programs = await programRepository.findPublished();
    return res.json({ data: programs });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/projects', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const projects = await projectRepository.findPublished({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return res.json({ data: projects });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/projects/:slug', async (req, res, next) => {
  try {
    const project = await projectRepository.findPublishedBySlug(req.params.slug);
    if (!project) {
      return res.status(404).json({ error: { code: 'PROJECT_NOT_FOUND', message: 'Project not found' } });
    }
    return res.json({ data: project });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/gallery', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const items = await galleryRepository.findPublished({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return res.json({ data: items });
  } catch (error) {
    return next(error);
  }
});

const networkColumns = 'id,name,slug,relationship_type,short_description,description,location,website_url,public_contact_email,collaboration_context,collaboration_areas,display_order,logo_url,publication_status,created_at,updated_at';

contentRoutes.get('/networks', async (_req, res, next) => {
  try {
    const networks = await networkRepository.findPublished();
    return res.json({ data: networks });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/networks/:slug', async (req, res, next) => {
  try {
    const network = await networkRepository.findPublishedBySlug(req.params.slug);
    if (!network) {
      return res.status(404).json({ error: { code: 'PARTNER_NOT_FOUND', message: 'Partner not found.' } });
    }
    return res.json({ data: network });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/notices', async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const notices = await noticeRepository.findPublished({
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    return res.json({ data: notices });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/notices/:slug', async (req, res, next) => {
  try {
    const notice = await noticeRepository.findPublishedBySlug(req.params.slug);
    if (!notice) {
      return res.status(404).json({ error: { code: 'NOTICE_NOT_FOUND', message: 'Notice not found.' } });
    }
    return res.json({ data: notice });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/vacancies', async (_req, res, next) => {
  try {
    const vacancies = await vacancyRepository.findPublished();
    return res.json({ data: vacancies });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/vacancies/:slug', async (req, res, next) => {
  try {
    const vacancy = await vacancyRepository.findPublishedBySlug(req.params.slug);
    if (!vacancy) {
      return res.status(404).json({ error: { code: 'VACANCY_NOT_FOUND', message: 'Vacancy not found.' } });
    }
    return res.json({ data: vacancy });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/procurement', async (_req, res, next) => {
  try {
    const procurements = await procurementRepository.findPublished();
    return res.json({ data: procurements });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/procurement/:slug', async (req, res, next) => {
  try {
    const procurement = await procurementRepository.findPublishedBySlug(req.params.slug);
    if (!procurement) {
      return res.status(404).json({ error: { code: 'PROCUREMENT_NOT_FOUND', message: 'Procurement not found.' } });
    }
    return res.json({ data: procurement });
  } catch (error) {
    return next(error);
  }
});

contentRoutes.get('/board-members', async (_req, res, next) => {
  try {
    const members = await boardRepository.findPublished();
    return res.json({ data: members });
  } catch (error) {
    return next(error);
  }
});