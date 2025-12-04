-- Migration: Add route optimization tables and update jobs table
-- Description: Adds routes table and location fields to jobs table for route optimization

-- 1. Create routes table FIRST (before referencing it)
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Route metadata
    route_date DATE NOT NULL,
    worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),

    -- Route metrics
    total_distance_meters NUMERIC(12, 2),
    total_duration_seconds INTEGER,

    -- Optimized path data (array of coordinates)
    optimized_path JSONB,

    -- Additional metadata
    notes TEXT,

    -- Indexes
    UNIQUE(worker_id, route_date)
);

-- 2. Add location fields to jobs table (now routes table exists)
ALTER TABLE jobs
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS longitude NUMERIC(11, 8),
ADD COLUMN IF NOT EXISTS route_id UUID REFERENCES routes(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS route_order INTEGER;

-- 3. Add location fields to workers table (depot location)
ALTER TABLE workers
ADD COLUMN IF NOT EXISTS depot_address TEXT DEFAULT '1 City Hall Square, Boston, MA 02201',
ADD COLUMN IF NOT EXISTS depot_latitude NUMERIC(10, 8),
ADD COLUMN IF NOT EXISTS depot_longitude NUMERIC(11, 8);

-- 4. Create route_jobs junction table (for many-to-many relationship)
CREATE TABLE IF NOT EXISTS route_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_id UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    job_order INTEGER NOT NULL,

    -- Job location at time of route creation (for historical accuracy)
    location_lat NUMERIC(10, 8),
    location_lng NUMERIC(11, 8),

    -- Job completion tracking
    completed_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Indexes
    UNIQUE(route_id, job_id),
    UNIQUE(route_id, job_order)
);

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_routes_worker_id ON routes(worker_id);
CREATE INDEX IF NOT EXISTS idx_routes_date ON routes(route_date);
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_route_jobs_route_id ON route_jobs(route_id);
CREATE INDEX IF NOT EXISTS idx_route_jobs_job_id ON route_jobs(job_id);
CREATE INDEX IF NOT EXISTS idx_jobs_route_id ON jobs(route_id);

-- 6. Create updated_at trigger for routes table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_routes_updated_at
    BEFORE UPDATE ON routes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 7. Add comments for documentation
COMMENT ON TABLE routes IS 'Optimized routes for workers';
COMMENT ON TABLE route_jobs IS 'Junction table linking routes to jobs with order information';
COMMENT ON COLUMN jobs.address IS 'Street address of the job location';
COMMENT ON COLUMN jobs.latitude IS 'Latitude coordinate of job location';
COMMENT ON COLUMN jobs.longitude IS 'Longitude coordinate of job location';
COMMENT ON COLUMN jobs.route_id IS 'Associated route for this job (if assigned)';
COMMENT ON COLUMN jobs.route_order IS 'Order of this job in the route sequence';
COMMENT ON COLUMN routes.optimized_path IS 'Array of [lat, lng] coordinates representing the optimal path';
