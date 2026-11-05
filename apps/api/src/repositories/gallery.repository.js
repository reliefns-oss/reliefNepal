import {
  insert,
  update,
  deleteById,
  rawQuery,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const GALLERY_WITH_PROJECT_SQL = `
  SELECT
    g.id, g.title, g.caption, g.media_type, g.media_url, g.media_public_id,
    g.thumbnail_url, g.alt_text, g.project_id, g.publication_status,
    g.published_at, g.created_at, g.updated_at,
    p.id as project_id, p.slug as project_slug, p.title as project_title,
    p.summary as project_summary, p.banner_url as project_banner_url,
    p.banner_public_id as project_banner_public_id,
    p.publication_status as project_publication_status,
    pr.name as project_program_name, pr.slug as project_program_slug
  FROM gallery_items g
  JOIN projects p ON g.project_id = p.id
  LEFT JOIN programs pr ON p.program_id = pr.id
`;

function transformGalleryItem(item) {
  if (!item) return null;
  return {
    ...item,
    media_url: item.media_public_id ? getPublicUrl(item.media_public_id) : item.media_url,
    thumbnail_url: item.thumbnail_url,
    project: item.project_id
      ? {
          id: item.project_id,
          slug: item.project_slug,
          title: item.project_title,
          summary: item.project_summary,
          banner_url: item.project_banner_public_id
            ? getPublicUrl(item.project_banner_public_id)
            : item.project_banner_url,
          publication_status: item.project_publication_status,
          program: item.project_program_name
            ? {
                name: item.project_program_name,
                slug: item.project_program_slug,
              }
            : null,
        }
      : null,
  };
}

function transformGalleryList(items) {
  return items.map(transformGalleryItem);
}

// Local findById for internal use
async function findGalleryItemById(id) {
  const sql = `${GALLERY_WITH_PROJECT_SQL} WHERE g.id = $1`;
  const result = await rawQuery(sql, [id]);
  return transformGalleryItem(result[0]);
}

const isYoutubeVideoUrl = (value) =>
  /^https:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtube-nocookie\.com\/embed\/|youtu\.be\/)[A-Za-z0-9_-]{11}(?:[?&].*)?$/i.test(value || '');

export const galleryRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const sql = `${GALLERY_WITH_PROJECT_SQL} WHERE g.publication_status = 'published' ORDER BY g.published_at DESC ${limit ? `LIMIT ${Number(limit)}` : ''} ${offset ? `OFFSET ${Number(offset)}` : ''}`;
    const items = await rawQuery(sql, []);
    return transformGalleryList(items).filter(
      (item) =>
        item.project_id &&
        item.project &&
        (item.media_type !== 'video' || isYoutubeVideoUrl(item.media_url)),
    );
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    let sql = GALLERY_WITH_PROJECT_SQL;
    const conditions = [];
    const params = [];

    if (filters.publication_status) {
      conditions.push(`g.publication_status = $${params.length + 1}`);
      params.push(filters.publication_status);
    }

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ` ORDER BY g.created_at DESC ${limit ? `LIMIT ${Number(limit)}` : ''} ${offset ? `OFFSET ${Number(offset)}` : ''}`;

    const items = await rawQuery(sql, params);
    return transformGalleryList(items);
  },

  async findById(id) {
    const sql = `${GALLERY_WITH_PROJECT_SQL} WHERE g.id = $1`;
    const result = await rawQuery(sql, [id]);
    return transformGalleryItem(result[0]);
  },

  async create(data) {
    const item = await insert('gallery_items', {
      ...data,
      publication_status: data.publication_status || 'draft',
    });
    return transformGalleryItem(item);
  },

  async update(id, data) {
    const item = await update('gallery_items', id, data);
    return transformGalleryItem(item);
  },

  async delete(id) {
    const item = await findGalleryItemById(id);
    const deleted = await deleteById('gallery_items', id);
    return { deleted, mediaPublicId: item?.media_public_id };
  },
};