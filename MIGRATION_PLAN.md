# Migration Plan: Supabase/Cloudinary → cPanel PostgreSQL/Storage

## Overview
This document outlines the step-by-step migration from Supabase (PostgreSQL + Auth + Storage) and Cloudinary (Image CDN) to cPanel's native PostgreSQL database and file storage.

## Current Architecture
- **API**: Express.js on cPanel with Passenger
- **Database**: Supabase (PostgreSQL with RLS, Auth, Realtime)
- **Storage**: Cloudinary (image uploads, transformations, CDN)
- **Auth**: Supabase Auth (email/password for admin)
- **Frontend**: Next.js consuming API + direct Supabase Auth for admin

## Target Architecture
- **API**: Express.js on cPanel with Passenger (unchanged)
- **Database**: cPanel PostgreSQL (standard PostgreSQL, no RLS)
- **Storage**: cPanel local filesystem (`/home/reliefnepalorg/uploads/`) served via static route
- **Auth**: Custom JWT-based admin authentication (or keep Supabase Auth only for admin)
- **Frontend**: Next.js consuming API only

---

## Phase 1: Database Migration (Supabase → cPanel PostgreSQL)

### Step 1.1: Create PostgreSQL Database in cPanel
1. Log into cPanel → **PostgreSQL Databases**
2. Create database: `reliefnepal_api`
3. Create user: `reliefnepal_user` with strong password
4. Add user to database with ALL PRIVILEGES
5. Note connection details:
   - Host: `localhost` (or cPanel's PostgreSQL host)
   - Port: `5432`
   - Database: `reliefnepal_api`
   - User: `reliefnepal_user`
   - Password: `[your-password]`

### Step 1.2: Export Schema from Supabase
Run in Supabase SQL Editor:
```sql
-- Get complete schema
SELECT 'CREATE EXTENSION IF NOT EXISTS "uuid-ossp";' as schema
UNION ALL
SELECT pg_get_serial_sequence(quote_ident(tablename), 'id') FROM pg_tables WHERE schemaname = 'public';
```

Better: Use Supabase CLI or pg_dump:
```bash
# From local machine with Supabase CLI
supabase db dump --schema public -f supabase_schema.sql
```

### Step 1.3: Create Migration Scripts
Create SQL files for:
1. `001_extensions.sql` - Enable uuid-ossp, pgcrypto
2. `002_tables.sql` - All table definitions
3. `003_indexes.sql` - Indexes for performance
4. `004_functions.sql` - RPC functions (replace_project_impact_content, etc.)
5. `005_rls_policies.sql` - Convert RLS to application-level checks
6. `006_seed.sql` - Initial data (programs, etc.)

### Step 1.4: Apply Migrations to cPanel PostgreSQL
```bash
# SSH into cPanel
cd /home/reliefnepalorg/api.reliefnepal.org.np
psql -h localhost -U reliefnepal_user -d reliefnepal_api -f migrations/001_extensions.sql
psql -h localhost -U reliefnepal_user -d reliefnepal_api -f migrations/002_tables.sql
# ... etc
```

---

## Phase 2: Storage Migration (Cloudinary → cPanel Local Storage)

### Step 2.1: Create Upload Directory Structure
```bash
mkdir -p /home/reliefnepalorg/uploads/{projects,gallery,notices,partners}
chmod 755 /home/reliefnepalorg/uploads
```

### Step 2.2: Configure Static File Serving
Add to Express app:
```javascript
app.use('/uploads', express.static('/home/reliefnepalorg/uploads'));
```

### Step 2.3: Implement File Upload Handling
- Use `multer` for multipart/form-data handling
- Generate unique filenames (UUID + extension)
- Validate file types and sizes
- Store files in organized subdirectories

---

## Phase 3: API Code Changes

### 3.1: Replace Supabase Client with pg Pool
**Files to create:**
- `src/config/database.js` - PostgreSQL connection pool
- `src/repositories/*` - New repository implementations using pg

**Files to modify:**
- `src/config/env.js` - Add PostgreSQL env vars, remove Supabase/Cloudinary
- `src/config/supabase.js` → DELETE
- `src/services/cloudinary.js` → REPLACE with `src/services/storage.js`
- All repository files in `src/modules/*/repository.js`

### 3.2: Update Admin Routes
- Replace `req.admin.client` (Supabase client) with database pool
- Replace Cloudinary upload/sign/verify with local storage endpoints
- Update file validation to check local paths

### 3.3: Update Public Content Routes
- Replace Supabase queries with pg queries
- Update image URLs to point to `/uploads/...`

---

## Phase 4: Frontend Changes

### 4.1: Admin Page
- Remove Supabase Auth dependency
- Implement JWT-based auth flow with API
- Update image upload to use new API endpoints

### 4.2: Environment Variables
- Remove `NEXT_PUBLIC_SUPABASE_*`
- Remove `NEXT_PUBLIC_API_URL` (keep for API base)
- Add any new config if needed

---

## Phase 5: Deployment Configuration

### 5.1: Update .htaccess (Already done - Passenger config)
### 5.2: Update .env.example and production .env
### 5.3: Update package.json dependencies

---

## Detailed File Changes

### New Files to Create:
```
apps/api/
├── src/
│   ├── config/
│   │   └── database.js          # PostgreSQL connection pool
│   ├── services/
│   │   └── storage.js           # Local file storage service
│   ├── repositories/
│   │   ├── base.repository.js   # Base query helpers
│   │   ├── project.repository.js
│   │   ├── gallery.repository.js
│   │   ├── notice.repository.js
│   │   ├── network.repository.js
│   │   ├── program.repository.js
│   │   ├── vacancy.repository.js
│   │   ├── board.repository.js
│   │   └── newsletter.repository.js
│   └── middleware/
│       └── auth.js              # JWT admin authentication
├── migrations/
│   ├── 001_extensions.sql
│   ├── 002_tables.sql
│   ├── 003_indexes.sql
│   ├── 004_functions.sql
│   └── 005_seed.sql
└── uploads/                     # Created at runtime
```

### Files to Modify:
```
apps/api/
├── package.json                 # Add pg, multer, jsonwebtoken, bcryptjs; remove @supabase/supabase-js
├── .env.example                 # New env vars
├── src/
│   ├── config/
│   │   └── env.js               # New env structure
│   ├── app.js                   # Add static uploads, auth middleware
│   ├── server.js                # Unchanged (already Passenger-ready)
│   ├── middleware/
│   │   ├── require-admin.js     # Update to use JWT
│   │   └── error-handler.js     # Unchanged
│   └── modules/
│       ├── admin/
│       │   └── admin.routes.js  # Major rewrite - local storage + pg
│       ├── projects/
│       │   └── project.repository.js
│       ├── inquiries/
│       │   └── inquiry.repository.js
│       └── content/
│           └── content.routes.js
```

### Files to Delete:
```
apps/api/
├── src/config/supabase.js
├── src/services/cloudinary.js
```

---

## Environment Variables (New .env.example)

```env
# Server
PORT=4000
NODE_ENV=production
FRONTEND_ORIGINS=https://reliefnepal.org.np,https://www.reliefnepal.org.np

# PostgreSQL (cPanel)
DATABASE_URL=postgresql://reliefnepal_user:password@localhost:5432/reliefnepal_api
# Or individual params:
# PGHOST=localhost
# PGPORT=5432
# PGDATABASE=reliefnepal_api
# PGUSER=reliefnepal_user
# PGPASSWORD=your-password

# JWT for Admin Auth
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=8h

# File Storage (cPanel local)
UPLOAD_ROOT=/home/reliefnepalorg/uploads
UPLOAD_URL_PREFIX=/uploads
MAX_FILE_SIZE=8388608  # 8MB
ALLOWED_MIME_TYPES=image/jpeg,image/png,image/webp,image/avif
```

---

## Migration Order (Critical)

1. **Create cPanel PostgreSQL database** and get connection string
2. **Write and test migration SQL** locally against a test PostgreSQL
3. **Implement database.js and storage.js** services
4. **Rewrite all repositories** to use pg
5. **Rewrite admin.routes.js** for local storage + JWT auth
6. **Update content.routes.js** for pg queries
7. **Test API locally** with local PostgreSQL
8. **Deploy to cPanel** and run migrations
9. **Update frontend admin** for new auth + upload flow
10. **Test end-to-end**

---

## Rollback Plan
- Keep Supabase project active during migration
- Use feature flags in env to switch between Supabase/pg
- Deploy API changes first, then frontend
- Monitor logs for 48 hours before decommissioning Supabase/Cloudinary