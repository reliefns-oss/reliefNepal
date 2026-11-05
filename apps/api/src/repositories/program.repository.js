import {
  findMany,
  findOne,
  findById,
  insert,
  update,
  deleteById,
} from './base.repository.js';

const PROGRAM_COLUMNS = `
  id, slug, name, description, publication_status, created_at, updated_at
`;

function transformProgram(program) {
  if (!program) return null;
  return program;
}

function transformProgramList(programs) {
  return programs.map(transformProgram);
}

export const programRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const programs = await findMany('programs', {
      columns: PROGRAM_COLUMNS,
      filters: { publication_status: 'published' },
      orderBy: { column: 'name', direction: 'ASC' },
      limit,
      offset,
    });
    return transformProgramList(programs);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const programs = await findMany('programs', {
      columns: PROGRAM_COLUMNS,
      filters,
      orderBy: { column: 'created_at', direction: 'DESC' },
      limit,
      offset,
    });
    return transformProgramList(programs);
  },

  async findById(id) {
    const program = await findOne('programs', {
      columns: PROGRAM_COLUMNS,
      filters: { id },
    });
    return transformProgram(program);
  },

  async create(data) {
    const program = await insert('programs', {
      ...data,
      publication_status: data.publication_status || 'draft',
    });
    return transformProgram(program);
  },

  async update(id, data) {
    const program = await update('programs', id, data);
    return transformProgram(program);
  },

  async delete(id) {
    return deleteById('programs', id);
  },
};