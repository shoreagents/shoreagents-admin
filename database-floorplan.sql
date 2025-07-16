-- Migration: Add updated_at column to existing floor_plans table
-- Run this if you already have a floor_plans table without the updated_at column

-- Add updated_at column
ALTER TABLE floor_plans 
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Update existing records to have the same updated_at as created_at
UPDATE floor_plans 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Verify the migration
SELECT id, name, created_at, updated_at FROM floor_plans LIMIT 5; 