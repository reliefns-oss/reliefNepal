import 'dotenv/config';

const origins = (process.env.FRONTEND_ORIGINS || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendOrigins: origins,

  // PostgreSQL (cPanel)
  databaseUrl: process.env.DATABASE_URL || '',
  pgHost: process.env.PGHOST || 'localhost',
  pgPort: Number(process.env.PGPORT || 5432),
  pgDatabase: process.env.PGDATABASE || '',
  pgUser: process.env.PGUSER || '',
  pgPassword: process.env.PGPASSWORD || '',

  // JWT for Admin Authentication
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '8h',

  // File Storage (cPanel local)
  uploadRoot: process.env.UPLOAD_ROOT || '/home/reliefnepalorg/uploads',
  uploadUrlPrefix: process.env.UPLOAD_URL_PREFIX || '/uploads',
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${Number(process.env.PORT || 4000)}`,
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 8388608), // 8MB
  allowedMimeTypes: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/webp,image/avif')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean),

  get databaseConfigured() {
    return Boolean(this.databaseUrl || (this.pgHost && this.pgDatabase && this.pgUser));
  },

  get jwtConfigured() {
    return Boolean(this.jwtSecret && this.jwtSecret.length >= 32);
  },
};