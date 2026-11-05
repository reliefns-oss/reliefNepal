import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || 'reliefnepal',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'yogesh@552',
});

async function run() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const files = [
    '001_extensions.sql',
    '002_tables.sql',
    '003_indexes.sql',
    '004_functions.sql',
    '005_seed.sql',
    '006_procurement.sql',
    '007_board_member_photos.sql',
  ];

  for (const f of files) {
    await pool.query('INSERT INTO schema_migrations (filename) VALUES ($1) ON CONFLICT DO NOTHING', [f]);
  }

  console.log('Migration tracking table populated');
  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });