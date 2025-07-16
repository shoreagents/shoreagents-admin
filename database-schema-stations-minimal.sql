-- Stations Table - MINIMAL VERSION
-- Essential queries only for basic station assignment functionality

-- ===== TABLE CREATION =====

-- Create stations table
CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_id VARCHAR(50) NOT NULL,
    employee_id VARCHAR(50), -- Nullable
    asset_id VARCHAR(50),    -- Nullable  
    floor_plan_id UUID REFERENCES floor_plans(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(station_id, floor_plan_id), -- One record per station per floor plan
    CHECK (employee_id IS NOT NULL OR asset_id IS NOT NULL) -- At least one assignment required
);

-- Essential indexes for performance
CREATE INDEX IF NOT EXISTS idx_stations_floor_plan_id ON stations(floor_plan_id);
CREATE INDEX IF NOT EXISTS idx_stations_station_id ON stations(station_id);

-- ===== ESSENTIAL CRUD OPERATIONS =====

-- 1. ADD/UPDATE station (upsert - insert or update if exists)
INSERT INTO stations (station_id, employee_id, asset_id, floor_plan_id)
VALUES ($1, $2, $3, $4)
ON CONFLICT (station_id, floor_plan_id)
DO UPDATE SET 
    employee_id = COALESCE(EXCLUDED.employee_id, stations.employee_id),
    asset_id = COALESCE(EXCLUDED.asset_id, stations.asset_id),
    updated_at = CURRENT_TIMESTAMP;

-- 2. GET all stations for a floor plan (for loading UI)
SELECT station_id, employee_id, asset_id, updated_at
FROM stations
WHERE floor_plan_id = $1
ORDER BY station_id;

-- 3. GET specific station (for checking current assignment)
SELECT station_id, employee_id, asset_id, updated_at
FROM stations
WHERE station_id = $1 AND floor_plan_id = $2;

-- 4. UPDATE employee assignment
UPDATE stations 
SET employee_id = $2, updated_at = CURRENT_TIMESTAMP
WHERE station_id = $1 AND floor_plan_id = $3;

-- 5. UPDATE asset assignment
UPDATE stations 
SET asset_id = $2, updated_at = CURRENT_TIMESTAMP
WHERE station_id = $1 AND floor_plan_id = $3;

-- 6. REMOVE employee (keep asset if exists, delete record if both become null)
UPDATE stations 
SET employee_id = NULL, updated_at = CURRENT_TIMESTAMP
WHERE station_id = $1 AND floor_plan_id = $2 AND asset_id IS NOT NULL;

DELETE FROM stations 
WHERE station_id = $1 AND floor_plan_id = $2 AND asset_id IS NULL;

-- 7. REMOVE asset (keep employee if exists, delete record if both become null)
UPDATE stations 
SET asset_id = NULL, updated_at = CURRENT_TIMESTAMP
WHERE station_id = $1 AND floor_plan_id = $2 AND employee_id IS NOT NULL;

DELETE FROM stations 
WHERE station_id = $1 AND floor_plan_id = $2 AND employee_id IS NULL;

-- 8. DELETE entire station (remove both assignments)
DELETE FROM stations
WHERE station_id = $1 AND floor_plan_id = $2;

-- ===== CLEANUP =====

-- Remove all stations for a floor plan (when floor plan is deleted)
DELETE FROM stations WHERE floor_plan_id = $1; 