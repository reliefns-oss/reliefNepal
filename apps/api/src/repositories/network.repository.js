import {
  findMany,
  findOne,
  insert,
  update,
  deleteById,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const NETWORK_COLUMNS = `
  id, name, slug, relationship_type, short_description, description,
  location, website_url, public_contact_email, collaboration_context,
  collaboration_areas, display_order, logo_url, logo_public_id,
  publication_status, created_at, updated_at
`;

function transformNetwork(network) {
  if (!network) return null;
  return {
    ...network,
    logo_url: network.logo_public_id ? getPublicUrl(network.logo_public_id) : network.logo_url,
  };
}

function transformNetworkList(networks) {
  return networks.map(transformNetwork);
}

export const networkRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const networks = await findMany('network_partners', {
      columns: NETWORK_COLUMNS,
      filters: { publication_status: 'published' },
      orderBy: [
        { column: 'display_order', direction: 'ASC' },
        { column: 'name', direction: 'ASC' },
      ],
      limit,
      offset,
    });
    return transformNetworkList(networks);
  },

  async findPublishedBySlug(slug) {
    const network = await findOne('network_partners', {
      columns: NETWORK_COLUMNS,
      filters: { publication_status: 'published', slug },
    });
    return transformNetwork(network);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const networks = await findMany('network_partners', {
      columns: NETWORK_COLUMNS,
      filters,
      orderBy: [
        { column: 'display_order', direction: 'ASC' },
        { column: 'name', direction: 'ASC' },
      ],
      limit,
      offset,
    });
    return transformNetworkList(networks);
  },

  async findById(id) {
    const network = await findOne('network_partners', {
      columns: NETWORK_COLUMNS,
      filters: { id },
    });
    return transformNetwork(network);
  },

  async create(data) {
    const network = await insert('network_partners', {
      ...data,
      publication_status: data.publication_status || 'draft',
      display_order: data.display_order ?? 0,
    });
    return transformNetwork(network);
  },

  async update(id, data) {
    const network = await update('network_partners', id, data);
    return transformNetwork(network);
  },

  async delete(id) {
    const network = await findById(id, 'logo_public_id');
    const deleted = await deleteById('network_partners', id);
    return { deleted, logoPublicId: network?.logo_public_id };
  },
};