import {
  findMany,
  findOne,
  insert,
  update,
  deleteById,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const GOVERNMENT_ACTION_COLUMNS = `
  id, slug, title, government_partner, action_date, summary, body,
  image_url, image_public_id, publication_status, published_at,
  created_at, updated_at
`;

function transformAction(action) {
  if (!action) return null;
  return {
    ...action,
    image_url: action.image_public_id
      ? getPublicUrl(action.image_public_id)
      : action.image_url,
  };
}

function transformActions(actions) {
  return actions.map(transformAction);
}

async function findActionById(id, columns = GOVERNMENT_ACTION_COLUMNS) {
  return findOne('government_actions', { columns, filters: { id } });
}

export const governmentActionRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const actions = await findMany('government_actions', {
      columns: GOVERNMENT_ACTION_COLUMNS,
      filters: { publication_status: 'published' },
      orderBy: [
        { column: 'action_date', direction: 'DESC' },
        { column: 'published_at', direction: 'DESC' },
      ],
      limit,
      offset,
    });
    return transformActions(actions);
  },

  async findPublishedBySlug(slug) {
    const action = await findOne('government_actions', {
      columns: GOVERNMENT_ACTION_COLUMNS,
      filters: { publication_status: 'published', slug },
    });
    return transformAction(action);
  },

  async findAllAdmin() {
    const actions = await findMany('government_actions', {
      columns: GOVERNMENT_ACTION_COLUMNS,
      orderBy: [
        { column: 'action_date', direction: 'DESC' },
        { column: 'created_at', direction: 'DESC' },
      ],
    });
    return transformActions(actions);
  },

  async findById(id) {
    return transformAction(await findActionById(id));
  },

  async create(data) {
    const action = await insert('government_actions', {
      ...data,
      publication_status: data.publication_status || 'draft',
    });
    return transformAction(action);
  },

  async update(id, data) {
    return transformAction(await update('government_actions', id, data));
  },

  async delete(id) {
    const action = await findActionById(id, 'image_public_id');
    const deleted = await deleteById('government_actions', id);
    return { deleted, imagePublicId: action?.image_public_id };
  },
};
