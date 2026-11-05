import { query, transaction } from '../config/database.js';

export function buildWhereClause(filters, paramIndex = 1) {
  const conditions = [];
  const values = [];
  let idx = paramIndex;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      const placeholders = value.map(() => `$${idx++}`).join(', ');
      conditions.push(`${key} IN (${placeholders})`);
      values.push(...value);
    } else if (typeof value === 'object' && value.operator) {
      // Support for complex filters: { operator: 'gte', value: '2024-01-01' }
      conditions.push(`${key} ${value.operator} $${idx++}`);
      values.push(value.value);
    } else {
      conditions.push(`${key} = $${idx++}`);
      values.push(value);
    }
  }

  return { clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values };
}

export function buildOrderBy(orderBy, defaultOrder = 'created_at DESC') {
  if (!orderBy) return `ORDER BY ${defaultOrder}`;
  if (Array.isArray(orderBy)) {
    return `ORDER BY ${orderBy.map((o) => `${o.column} ${o.direction || 'ASC'}`).join(', ')}`;
  }
  return `ORDER BY ${orderBy.column} ${orderBy.direction || 'ASC'}`;
}

export function buildLimitOffset(limit, offset) {
  const parts = [];
  if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) {
    parts.push(`LIMIT ${Number(limit)}`);
  }
  if (offset && Number.isInteger(Number(offset)) && Number(offset) >= 0) {
    parts.push(`OFFSET ${Number(offset)}`);
  }
  return parts.join(' ');
}

export function buildSelect(columns = '*') {
  if (Array.isArray(columns)) {
    return columns.join(', ');
  }
  return columns;
}

export async function findMany(table, options = {}) {
  const {
    columns = '*',
    filters = {},
    orderBy,
    limit,
    offset,
  } = options;

  const { clause, values } = buildWhereClause(filters);
  const order = buildOrderBy(orderBy);
  const pagination = buildLimitOffset(limit, offset);
  const selectCols = buildSelect(columns);

  const sql = `SELECT ${selectCols} FROM ${table} ${clause} ${order} ${pagination}`;
  const result = await query(sql, values);
  return result.rows;
}

export async function findOne(table, options = {}) {
  const { columns = '*', filters = {} } = options;
  const { clause, values } = buildWhereClause(filters);
  const selectCols = buildSelect(columns);
  const sql = `SELECT ${selectCols} FROM ${table} ${clause} LIMIT 1`;
  const result = await query(sql, values);
  return result.rows[0] || null;
}

export async function findById(table, id, columns = '*') {
  const selectCols = buildSelect(columns);
  const sql = `SELECT ${selectCols} FROM ${table} WHERE id = $1 LIMIT 1`;
  const result = await query(sql, [id]);
  return result.rows[0] || null;
}

export async function insert(table, data, returning = '*') {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const selectCols = buildSelect(returning);
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING ${selectCols}`;
  const result = await query(sql, values);
  return result.rows[0];
}

export async function update(table, id, data, returning = '*') {
  const keys = Object.keys(data);
  if (keys.length === 0) return null;
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 2}`).join(', ');
  const selectCols = buildSelect(returning);
  const sql = `UPDATE ${table} SET ${setClause} WHERE id = $1 RETURNING ${selectCols}`;
  const result = await query(sql, [id, ...values]);
  return result.rows[0] || null;
}

export async function deleteById(table, id) {
  const sql = `DELETE FROM ${table} WHERE id = $1`;
  const result = await query(sql, [id]);
  return result.rowCount > 0;
}

export async function count(table, filters = {}) {
  const { clause, values } = buildWhereClause(filters);
  const sql = `SELECT COUNT(*) FROM ${table} ${clause}`;
  const result = await query(sql, values);
  return Number(result.rows[0].count);
}

export async function exists(table, filters = {}) {
  const { clause, values } = buildWhereClause(filters);
  const sql = `SELECT 1 FROM ${table} ${clause} LIMIT 1`;
  const result = await query(sql, values);
  return result.rowCount > 0;
}

// For complex queries that need JOINs
export async function rawQuery(sql, params = []) {
  const result = await query(sql, params);
  return result.rows;
}

export { query, transaction };