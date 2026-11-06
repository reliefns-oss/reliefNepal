import {
  findMany,
  findOne,
  findById,
  insert,
  update,
  deleteById,
} from './base.repository.js';
import { getPublicUrl } from '../services/storage.js';

const BOARD_COLUMNS = `
  id, sn, name, qualification, expertise, designation,
  contact, email, experience, display_order, is_active,
  photo_url, photo_public_id,
  created_at, updated_at
`;

function transformBoard(board) {
  if (!board) return null;
  return {
    ...board,
    photo_url: board.photo_public_id ? getPublicUrl(board.photo_public_id) : board.photo_url,
  };
}

function transformBoardList(boards) {
  return boards.map(transformBoard);
}

export const boardRepository = {
  async findPublished(options = {}) {
    const { limit, offset } = options;
    const boards = await findMany('board_members', {
      columns: BOARD_COLUMNS,
      filters: { is_active: true },
      orderBy: [
        { column: 'display_order', direction: 'ASC' },
        { column: 'sn', direction: 'ASC' },
      ],
      limit,
      offset,
    });
    return transformBoardList(boards);
  },

  async findAllAdmin(options = {}) {
    const { limit, offset, filters = {} } = options;
    const boards = await findMany('board_members', {
      columns: BOARD_COLUMNS,
      filters,
      orderBy: [
        { column: 'display_order', direction: 'ASC' },
        { column: 'sn', direction: 'ASC' },
      ],
      limit,
      offset,
    });
    return transformBoardList(boards);
  },

  async findById(id) {
    const board = await findOne('board_members', {
      columns: BOARD_COLUMNS,
      filters: { id },
    });
    return transformBoard(board);
  },

  async create(data) {
    const board = await insert('board_members', {
      ...data,
      is_active: data.is_active ?? true,
      display_order: data.display_order ?? 0,
    });
    return transformBoard(board);
  },

  async update(id, data) {
    const board = await update('board_members', id, data);
    return transformBoard(board);
  },

  async delete(id) {
    return deleteById('board_members', id);
  },
};