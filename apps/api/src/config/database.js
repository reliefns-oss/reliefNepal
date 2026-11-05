import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

// Parse DATABASE_URL or use individual params
function createPoolConfig() {
  if (env.databaseUrl) {
    const url = new URL(env.databaseUrl);
    return {
      host: url.hostname,
      port: Number(url.port || 5432),
      database: url.pathname.slice(1),
      user: url.username,
      password: url.password,
      max: env.nodeEnv === 'production' ? 10 : 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };
  }

  return {
    host: env.pgHost,
    port: Number(env.pgPort || 5432),
    database: env.pgDatabase,
    user: env.pgUser,
    password: env.pgPassword,
    max: env.nodeEnv === 'production' ? 10 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };
}

const poolConfig = createPoolConfig();

export const pool = new Pool(poolConfig);

// Test connection on startup
pool.on('error', (err) => {
  console.error('Unexpected PostgreSQL pool error', err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Closing PostgreSQL pool...');
  await pool.end();
});

process.on('SIGINT', async () => {
  console.log('Closing PostgreSQL pool...');
  await pool.end();
});

// Helper to run queries with automatic retry for transient errors
export async function query(text, params, retries = 3) {
  const start = Date.now();
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await pool.query(text, params);
      const duration = Date.now() - start;
      if (env.nodeEnv !== 'production' || duration > 100) {
        console.log('Executed query', { duration, rows: result.rowCount });
      }
      return result;
    } catch (error) {
      lastError = error;
      // Don't retry on certain errors
      if (
        error.code === '23505' ||
        error.code === '23503' ||
        error.code === '42P01'
      ) {
        throw error;
      }
      if (attempt < retries) {
        const delay = Math.min(100 * attempt, 1000);
        console.warn(
          `Query failed (attempt ${attempt}/${retries}), retrying in ${delay}ms`,
          {
            code: error.code,
            message: error.message,
          },
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  throw lastError;
}

// Helper for transactions
export async function transaction(callback) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Health check
export async function checkConnection() {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch {
    return false;
  }
}
