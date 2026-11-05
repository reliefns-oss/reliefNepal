import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || process.env.DATABASE_URL?.split('/').pop()?.split('?')[0],
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD,
  max: 5,
});

async function runMigrations() {
  // Create migrations tracking table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const migrationsDir = join(__dirname, 'migrations');
  const files = readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();

  console.log(`Found ${files.length} migration files`);

  // Get already executed migrations
  const executedResult = await pool.query('SELECT filename FROM schema_migrations');
  const executed = new Set(executedResult.rows.map(r => r.filename));

  for (const file of files) {
    if (executed.has(file)) {
      console.log(`⏭️  Skipping ${file} (already executed)`);
      continue;
    }

    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf-8');

    console.log(`\n📦 Running ${file}...`);
    try {
      await pool.query('BEGIN');
      await pool.query(sql);
      await pool.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
      await pool.query('COMMIT');
      console.log(`✅ ${file} completed`);
    } catch (error) {
      await pool.query('ROLLBACK');
      console.error(`❌ ${file} failed:`, error.message);
      throw error;
    }
  }

  console.log('\n🎉 All migrations completed successfully!');
  await pool.end();
}

runMigrations().catch(async (err) => {
  console.error('Migration failed:', err);
  await pool.end();
  process.exit(1);
});