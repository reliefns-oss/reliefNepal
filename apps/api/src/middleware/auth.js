import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { pool } from '../config/database.js';

export function generateToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}

export async function authenticateAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    });
  }

  const token = authHeader.slice(7);
  const decoded = verifyToken(token);

  if (!decoded || !decoded.adminId) {
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
  }

  // Verify admin exists in database
  try {
    const result = await pool.query(
      'SELECT id, email, role, display_name FROM admin_users WHERE id = $1 AND is_active = true',
      [decoded.adminId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: { code: 'ADMIN_NOT_FOUND', message: 'Admin user not found' },
      });
    }

    req.admin = {
      user: result.rows[0],
      // Provide a database client interface compatible with old Supabase code
      client: {
        from: (table) => createQueryBuilder(table, pool),
        rpc: (fnName, params) => callRpc(fnName, params, pool),
      },
    };
    next();
  } catch (error) {
    console.error('Admin auth error:', error);
    return res.status(500).json({
      error: { code: 'AUTH_ERROR', message: 'Authentication failed' },
    });
  }
}

function createQueryBuilder(table, pool) {
  const queryBuilder = {
    _table: table,
    _select: '*',
    _where: [],
    _params: [],
    _order: null,
    _limit: null,
    _offset: null,
    _single: false,
    _maybeSingle: false,

    select(columns) {
      this._select = columns;
      return this;
    },

    eq(column, value) {
      this._where.push(`${column} = $${this._params.length + 1}`);
      this._params.push(value);
      return this;
    },

    neq(column, value) {
      this._where.push(`${column} != $${this._params.length + 1}`);
      this._params.push(value);
      return this;
    },

    in(column, values) {
      if (!values?.length) return this;
      const placeholders = values.map(() => `$${this._params.length + 1}`).join(', ');
      this._params.push(...values);
      this._where.push(`${column} IN (${placeholders})`);
      return this;
    },

    or(condition) {
      this._where.push(`(${condition})`);
      return this;
    },

    order(column, options = {}) {
      this._order = `${column} ${options.ascending ? 'ASC' : 'DESC'}`;
      return this;
    },

    limit(count) {
      this._limit = count;
      return this;
    },

    offset(count) {
      this._offset = count;
      return this;
    },

    single() {
      this._single = true;
      return this;
    },

    maybeSingle() {
      this._maybeSingle = true;
      return this;
    },

    async then(resolve, reject) {
      try {
        const result = await this.execute();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    },

    async execute() {
      let sql = `SELECT ${this._select} FROM ${this._table}`;
      if (this._where.length) {
        sql += ` WHERE ${this._where.join(' AND ')}`;
      }
      if (this._order) {
        sql += ` ORDER BY ${this._order}`;
      }
      if (this._limit) {
        sql += ` LIMIT ${this._limit}`;
      }
      if (this._offset) {
        sql += ` OFFSET ${this._offset}`;
      }

      const result = await pool.query(sql, this._params);

      if (this._single) {
        if (result.rows.length === 0) {
          return { data: null, error: { code: 'PGRST116', message: 'Row not found' } };
        }
        return { data: result.rows[0], error: null };
      }

      if (this._maybeSingle) {
        return { data: result.rows[0] || null, error: null };
      }

      return { data: result.rows, error: null };
    },

    // For INSERT
    async insert(data, options = {}) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const returning = options.returning || '*';

      let sql = `INSERT INTO ${this._table} (${keys.join(', ')}) VALUES (${placeholders})`;
      if (returning) {
        sql += ` RETURNING ${returning}`;
      }

      const result = await pool.query(sql, values);
      return { data: result.rows[0] || null, error: null };
    },

    // For UPDATE
    async update(data, options = {}) {
      const keys = Object.keys(data);
      if (keys.length === 0) return { data: null, error: null };
      const values = Object.values(data);
      const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
      const returning = options.returning || '*';

      let sql = `UPDATE ${this._table} SET ${setClause}`;
      if (this._where.length) {
        sql += ` WHERE ${this._where.join(' AND ')}`;
      }
      if (returning) {
        sql += ` RETURNING ${returning}`;
      }

      const allParams = [...values, ...this._params];
      const result = await pool.query(sql, allParams);
      return { data: result.rows[0] || null, error: null };
    },

    // For DELETE
    async delete() {
      let sql = `DELETE FROM ${this._table}`;
      if (this._where.length) {
        sql += ` WHERE ${this._where.join(' AND ')}`;
      }

      const result = await pool.query(sql, this._params);
      return { data: null, error: result.rowCount === 0 ? { code: 'NOT_FOUND' } : null };
    },

    // For UPSERT (PostgreSQL ON CONFLICT)
    async upsert(data, options = {}) {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const onConflict = options.onConflict || 'id';
      const ignoreDuplicates = options.ignoreDuplicates || false;

      let sql = `INSERT INTO ${this._table} (${keys.join(', ')}) VALUES (${placeholders})`;
      if (ignoreDuplicates) {
        sql += ` ON CONFLICT (${onConflict}) DO NOTHING`;
      } else {
        const updateClause = keys.filter((k) => k !== onConflict).map((k) => `${k} = EXCLUDED.${k}`).join(', ');
        sql += ` ON CONFLICT (${onConflict}) DO UPDATE SET ${updateClause}`;
      }
      sql += ` RETURNING *`;

      const result = await pool.query(sql, values);
      return { data: result.rows[0] || null, error: null };
    },

    // For RPC calls
    async rpc(fnName, params) {
      const paramNames = Object.keys(params || {});
      const paramValues = Object.values(params || {});
      const placeholders = paramNames.map((_, i) => `$${i + 1}`).join(', ');
      const sql = `SELECT * FROM ${fnName}(${placeholders})`;
      const result = await pool.query(sql, paramValues);
      return { data: result.rows, error: null };
    },
  };

  return queryBuilder;
}

async function callRpc(fnName, params, pool) {
  const paramNames = Object.keys(params || {});
  const paramValues = Object.values(params || {});
  const placeholders = paramNames.map((_, i) => `$${i + 1}`).join(', ');
  const sql = `SELECT * FROM ${fnName}(${placeholders})`;
  const result = await pool.query(sql, paramValues);
  return { data: result.rows, error: null };
}