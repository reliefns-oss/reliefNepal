import {
  findMany,
  findOne,
  findById,
  insert,
  update,
  deleteById,
} from './base.repository.js';

const VACANCY_COLUMNS = `
  id, slug, title, job_type, job_level, location, number_of_vacancies,
  work_schedule, hours_per_week, duration, description, responsibilities,
  qualifications, benefits, application_instructions, application_email,
  application_url, application_deadline, status, published_at,
  created_at, updated_at
`;

function transformVacancy(vacancy) {
  if (!vacancy) return null;
  return vacancy;
}

function transformVacancyList(vacancies) {
  return vacancies.map(transformVacancy);
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

export const vacancyRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const today = nepalDate();
    const vacancies = await findMany('vacancies', {
      columns: VACANCY_COLUMNS,
      filters: { status: 'open' },
      // Note: OR condition for deadline needs raw query
      // We'll handle this in a custom query below
    });
    // Filter by deadline in JS for simplicity (or use rawQuery)
    const filtered = vacancies.filter(
      (v) => !v.application_deadline || v.application_deadline >= today,
    );
    return transformVacancyList(filtered.slice(offset || 0, (offset || 0) + (limit || filtered.length)));
  },

  async findPublishedBySlug(slug) {
    const today = nepalDate();
    const vacancy = await findOne('vacancies', {
      columns: VACANCY_COLUMNS,
      filters: { slug, status: 'open' },
    });
    if (!vacancy) return null;
    if (vacancy.application_deadline && vacancy.application_deadline < today) return null;
    return transformVacancy(vacancy);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const vacancies = await findMany('vacancies', {
      columns: VACANCY_COLUMNS,
      filters,
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformVacancyList(vacancies);
  },

  async findById(id) {
    const vacancy = await findOne('vacancies', {
      columns: VACANCY_COLUMNS,
      filters: { id },
    });
    return transformVacancy(vacancy);
  },

  async create(data) {
    const vacancy = await insert('vacancies', {
      ...data,
      status: data.status || 'draft',
    });
    return transformVacancy(vacancy);
  },

  async update(id, data) {
    const vacancy = await update('vacancies', id, data);
    return transformVacancy(vacancy);
  },

  async delete(id) {
    return deleteById('vacancies', id);
  },
};