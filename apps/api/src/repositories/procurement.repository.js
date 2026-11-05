import {
  findMany,
  findOne,
  findById,
  insert,
  update,
  deleteById,
} from './base.repository.js';

const PROCUREMENT_COLUMNS = `
  id, slug, reference_number, title, category, description,
  requirements, submission_instructions, submission_email,
  submission_url, attachment_url, attachment_public_id,
  deadline, status, published_at, location, duration, work_schedule,
  created_at, updated_at
`;

function transformProcurement(procurement) {
  if (!procurement) return null;
  return procurement;
}

function transformProcurementList(procurements) {
  return procurements.map(transformProcurement);
}

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

function getDeadlineString(deadline) {
  if (!deadline) return null;
  // Deadline might be a Date object or ISO string from database
  if (deadline instanceof Date) {
    return deadline.toISOString().split('T')[0];
  }
  if (typeof deadline === 'string') {
    return deadline.split('T')[0];
  }
  return null;
}

export const procurementRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const today = nepalDate();
    const procurements = await findMany('procurements', {
      columns: PROCUREMENT_COLUMNS,
      filters: { status: 'open' },
    });
    // Filter by deadline in JS - compare date parts only
    const filtered = procurements.filter(
      (p) => !p.deadline || getDeadlineString(p.deadline) >= today,
    );
    return transformProcurementList(
      filtered.slice(offset || 0, (offset || 0) + (limit || filtered.length)),
    );
  },

  async findPublishedBySlug(slug) {
    const today = nepalDate();
    const procurement = await findOne('procurements', {
      columns: PROCUREMENT_COLUMNS,
      filters: { slug, status: 'open' },
    });
    if (!procurement) return null;
    if (procurement.deadline && getDeadlineString(procurement.deadline) < today) return null;
    return transformProcurement(procurement);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const procurements = await findMany('procurements', {
      columns: PROCUREMENT_COLUMNS,
      filters,
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformProcurementList(procurements);
  },

  async findById(id) {
    const procurement = await findOne('procurements', {
      columns: PROCUREMENT_COLUMNS,
      filters: { id },
    });
    return transformProcurement(procurement);
  },

  async create(data) {
    const procurement = await insert('procurements', {
      ...data,
      status: data.status || 'draft',
    });
    return transformProcurement(procurement);
  },

  async update(id, data) {
    const procurement = await update('procurements', id, data);
    return transformProcurement(procurement);
  },

  async delete(id) {
    return deleteById('procurements', id);
  },
};