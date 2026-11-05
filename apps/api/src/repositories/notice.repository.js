import {
  findMany,
  findOne,
  insert,
  update,
  deleteById,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const NOTICE_COLUMNS = `
  id, slug, title, summary, body, attachment_url,
  image_url, image_public_id, publication_status,
  published_at, expires_at, created_at, updated_at
`;

function transformNotice(notice) {
  if (!notice) return null;
  return {
    ...notice,
    image_url: notice.image_public_id ? getPublicUrl(notice.image_public_id) : notice.image_url,
  };
}

function transformNoticeList(notices) {
  return notices.map(transformNotice);
}

export const noticeRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const notices = await findMany('notices', {
      columns: NOTICE_COLUMNS,
      filters: { publication_status: 'published' },
      orderBy: { column: 'published_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformNoticeList(notices);
  },

  async findPublishedBySlug(slug) {
    const notice = await findOne('notices', {
      columns: NOTICE_COLUMNS,
      filters: { publication_status: 'published', slug },
    });
    return transformNotice(notice);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const notices = await findMany('notices', {
      columns: NOTICE_COLUMNS,
      filters,
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformNoticeList(notices);
  },

  async findById(id) {
    const notice = await findOne('notices', {
      columns: NOTICE_COLUMNS,
      filters: { id },
    });
    return transformNotice(notice);
  },

  async create(data) {
    const notice = await insert('notices', {
      ...data,
      publication_status: data.publication_status || 'draft',
    });
    return transformNotice(notice);
  },

  async update(id, data) {
    const notice = await update('notices', id, data);
    return transformNotice(notice);
  },

  async delete(id) {
    const notice = await findById(id, 'image_public_id');
    const deleted = await deleteById('notices', id);
    return { deleted, imagePublicId: notice?.image_public_id };
  },
};