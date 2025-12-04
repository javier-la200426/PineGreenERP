# Database Migrations

## Running Migrations

### Option 1: Supabase Dashboard (Recommended for now)

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `001_add_routes_tables.sql`
4. Click "Run" to execute the migration

### Option 2: Supabase CLI (For production)

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase in your project (if not done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

## Migration Files

### 001_add_routes_tables.sql

Adds route optimization functionality:

**Tables Created:**
- `routes` - Stores optimized routes for workers
- `route_jobs` - Junction table linking routes to jobs

**Tables Modified:**
- `jobs` - Adds `address`, `latitude`, `longitude`, `route_id`, `route_order`
- `workers` - Adds `depot_address`, `depot_latitude`, `depot_longitude`

**Indexes Created:**
- Performance indexes on route queries
- Junction table indexes

## Schema Overview

### routes table
```sql
id              UUID (PK)
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
route_date      DATE
worker_id       UUID (FK -> workers)
status          TEXT ('pending', 'in_progress', 'completed', 'cancelled')
total_distance_meters  NUMERIC
total_duration_seconds INTEGER
optimized_path  JSONB (array of coordinates)
notes           TEXT
```

### route_jobs table
```sql
id              UUID (PK)
route_id        UUID (FK -> routes)
job_id          UUID (FK -> jobs)
job_order       INTEGER
location_lat    NUMERIC
location_lng    NUMERIC
completed_at    TIMESTAMPTZ
created_at      TIMESTAMPTZ
```

## Rollback

If you need to rollback the migration:

```sql
-- Drop new tables
DROP TABLE IF EXISTS route_jobs CASCADE;
DROP TABLE IF EXISTS routes CASCADE;

-- Remove new columns from jobs
ALTER TABLE jobs
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS latitude,
DROP COLUMN IF EXISTS longitude,
DROP COLUMN IF EXISTS route_id,
DROP COLUMN IF EXISTS route_order;

-- Remove new columns from workers
ALTER TABLE workers
DROP COLUMN IF EXISTS depot_address,
DROP COLUMN IF EXISTS depot_latitude,
DROP COLUMN IF EXISTS depot_longitude;

-- Drop trigger function
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
```
