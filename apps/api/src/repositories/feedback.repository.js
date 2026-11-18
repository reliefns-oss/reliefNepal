import {
  findMany,
  findOne,
  insert,
  update,
  count,
} from './base.repository.js';

export const feedbackRepository = {
  async create(data) {
    return insert('feedback_submissions', {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, 'id, feedback, is_confidential, name, gender, district, municipality, ward_no, village, wants_response, mobile_no, email, status, ip_address, user_agent, created_at');
  },

  async findAllAdmin(options = {}) {
    const {
      limit = 50,
      offset = 0,
      status,
      search,
      startDate,
      endDate,
    } = options;

    const filters = {};
    if (status) filters.status = status;

    let extraWhere = '';
    const extraValues = [];
    let paramIndex = 1;

    if (search) {
      extraWhere = ` AND (feedback ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR mobile_no ILIKE $${paramIndex})`;
      extraValues.push(`%${search}%`);
      paramIndex++;
    }
    if (startDate) {
      extraWhere += ` AND created_at >= $${paramIndex}`;
      extraValues.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      extraWhere += ` AND created_at <= $${paramIndex}`;
      extraValues.push(endDate);
      paramIndex++;
    }

    const { clause, values } = buildWhereClause(filters, paramIndex);
    const allValues = [...extraValues, ...values];
    const whereClause = clause ? clause.replace('WHERE', 'WHERE 1=1') + extraWhere : `WHERE 1=1${extraWhere}`;

    const sql = `
      SELECT
        id,
        feedback,
        is_confidential,
        name,
        gender,
        district,
        municipality,
        ward_no,
        village,
        wants_response,
        mobile_no,
        email,
        status,
        admin_notes,
        reviewed_by,
        reviewed_at,
        created_at,
        updated_at
      FROM feedback_submissions
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${Number(limit)} OFFSET ${Number(offset)}
    `;
    const result = await query(sql, allValues);
    return result.rows;
  },

  async countAdmin(options = {}) {
    const { status, search, startDate, endDate } = options;

    const filters = {};
    if (status) filters.status = status;

    let extraWhere = '';
    const extraValues = [];
    let paramIndex = 1;

    if (search) {
      extraWhere = ` AND (feedback ILIKE $${paramIndex} OR name ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR mobile_no ILIKE $${paramIndex})`;
      extraValues.push(`%${search}%`);
      paramIndex++;
    }
    if (startDate) {
      extraWhere += ` AND created_at >= $${paramIndex}`;
      extraValues.push(startDate);
      paramIndex++;
    }
    if (endDate) {
      extraWhere += ` AND created_at <= $${paramIndex}`;
      extraValues.push(endDate);
      paramIndex++;
    }

    const { clause, values } = buildWhereClause(filters, paramIndex);
    const allValues = [...extraValues, ...values];
    const whereClause = clause ? clause.replace('WHERE', 'WHERE 1=1') + extraWhere : `WHERE 1=1${extraWhere}`;

    const sql = `SELECT COUNT(*) FROM feedback_submissions ${whereClause}`;
    const result = await query(sql, allValues);
    return Number(result.rows[0].count);
  },

  async findById(id) {
    return findOne('feedback_submissions', {
      columns: 'id, feedback, is_confidential, name, gender, district, municipality, ward_no, village, wants_response, mobile_no, email, status, admin_notes, reviewed_by, reviewed_at, created_at, updated_at',
      filters: { id },
    });
  },

  async updateStatus(id, status, adminNotes = null, adminId = null) {
    const data = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (adminNotes !== null) data.admin_notes = adminNotes;
    if (adminId) {
      data.reviewed_by = adminId;
      data.reviewed_at = new Date().toISOString();
    }
    return update('feedback_submissions', id, data, 'id, status, admin_notes, reviewed_by, reviewed_at, updated_at');
  },

  async getStats() {
    const sql = `
      SELECT
        status,
        COUNT(*) as count
      FROM feedback_submissions
      GROUP BY status
    `;
    const result = await query(sql);
    return result.rows;
  },
};

import { query, buildWhereClause } from './base.repository.js';