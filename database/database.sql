-- ============================================
-- Database Schema with Sequential IDs
-- ============================================

-- Create ENUM types
CREATE TYPE public."gender_enum" AS ENUM (
    'Male',
    'Female',
    'Other',
    'Prefer not to say'
);

CREATE TYPE public."user_type_enum" AS ENUM (
    'Agent',
    'Client',
    'Internal'
);

CREATE TYPE public."member_status_enum" AS ENUM (
    'Current Client',
    'Lost Client'
);

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create tables in dependency order

-- 1. Main users table
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    user_type user_type_enum NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Personal info (child of users)
CREATE TABLE public.personal_info (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    middle_name TEXT,
    last_name TEXT NOT NULL,
    nickname TEXT,
    profile_picture TEXT,
    phone TEXT,
    birthday DATE,
    city TEXT,
    address TEXT,
    gender gender_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Members (independent)
CREATE TABLE public.members (
    id SERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    logo TEXT,
    service TEXT,
    status member_status_enum,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    badge_color TEXT NULL,
);

-- 4. Departments (child of members)
CREATE TABLE public.departments (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Internal users (child of users)
CREATE TABLE public.internal (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Roles (independent)
CREATE TABLE public.roles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Internal roles (junction table)
CREATE TABLE public.internal_roles (
    id SERIAL PRIMARY KEY,
    internal_user_id INT NOT NULL REFERENCES internal(user_id) ON DELETE CASCADE,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Floor plans (independent)
CREATE TABLE public.floor_plans (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT,
    svg_url TEXT,
    svg_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Stations (child of floor_plans, references users)
CREATE TABLE public.stations (
    id SERIAL PRIMARY KEY,
    station_id VARCHAR(50) NOT NULL UNIQUE,
    assigned_user_id INT REFERENCES users(id) ON DELETE SET NULL,
    asset_id VARCHAR(50),
    floor_plan_id INT REFERENCES floor_plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Agents (child of users, references members and departments)
CREATE TABLE public.agents (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    exp_points INT DEFAULT 0,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Clients (child of users, references members and departments)
CREATE TABLE public.clients (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. Job info (references agents and internal)
CREATE TABLE public.job_info (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    agent_user_id INT REFERENCES agents(user_id) ON DELETE CASCADE,
    internal_user_id INT REFERENCES internal(user_id) ON DELETE CASCADE,
    job_title TEXT,
    shift_period TEXT,
    shift_schedule TEXT,
    shift_time TEXT,
    work_setup TEXT,
    employment_status TEXT,
    hire_type TEXT,
    staff_source TEXT,
    start_date DATE,
    exit_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add constraints after table creation

-- Unique constraints
ALTER TABLE departments ADD CONSTRAINT unique_department_per_member UNIQUE (name, member_id);
ALTER TABLE departments ADD CONSTRAINT unique_department_id_member UNIQUE (id, member_id);
ALTER TABLE internal_roles ADD CONSTRAINT unique_internal_role_assignment UNIQUE (internal_user_id, role_id);
ALTER TABLE stations ADD CONSTRAINT unique_user_per_station UNIQUE (assigned_user_id);

-- Check constraints
ALTER TABLE job_info ADD CONSTRAINT chk_job_info_employee_type
CHECK ((agent_user_id IS NOT NULL AND internal_user_id IS NULL) OR
       (agent_user_id IS NULL AND internal_user_id IS NOT NULL));

-- Composite foreign key constraints
ALTER TABLE agents ADD CONSTRAINT fk_agent_department_member
FOREIGN KEY (department_id, member_id) REFERENCES departments (id, member_id);

ALTER TABLE clients ADD CONSTRAINT fk_client_department_member
FOREIGN KEY (department_id, member_id) REFERENCES departments (id, member_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON personal_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internal_updated_at BEFORE UPDATE ON internal FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internal_roles_updated_at BEFORE UPDATE ON internal_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_floor_plans_updated_at BEFORE UPDATE ON floor_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stations_updated_at BEFORE UPDATE ON stations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_info_updated_at BEFORE UPDATE ON job_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();