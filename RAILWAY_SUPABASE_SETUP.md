# Hybrid Setup: Railway PostgreSQL + Supabase Storage

## 🏗️ Architecture Overview

```
Railway App → Railway PostgreSQL (metadata) + Supabase Storage (SVG files)
```

## 1. Railway PostgreSQL Setup

### Add PostgreSQL to Railway:
1. Go to your Railway project dashboard
2. Click "New Service" → "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database and provide connection string

### Get Database URL:
```
DATABASE_URL=postgresql://username:password@host:port/database
```

## 2. Create Database Schema in Railway

Connect to your Railway PostgreSQL and run:

```sql
CREATE TABLE floor_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    address TEXT,
    svg_url TEXT,         -- Public URL from Supabase Storage
    svg_path TEXT,        -- Storage path for file management
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If you already have the table without updated_at, run this:
-- ALTER TABLE floor_plans ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
```

## 3. Supabase Storage Setup (Files Only)

### Create Supabase Project:
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. We'll ONLY use Storage, not the database

### Create Storage Bucket:
1. Navigate to Storage in Supabase dashboard
2. Create bucket named `floor-plans`
3. Make it public with this policy:

```sql
CREATE POLICY "Public Access" ON storage.objects 
FOR ALL USING (bucket_id = 'floor-plans');
```

## 4. Environment Variables

Create `.env.local` file:

```env
# Railway PostgreSQL
DATABASE_URL=postgresql://username:password@host:port/database

# Supabase Storage (for files only)
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## 5. Railway Environment Variables

In your Railway dashboard, add:
- `DATABASE_URL` (automatically provided by Railway PostgreSQL)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 6. How It Works

### File Upload Process:
1. **User uploads SVG** → Railway app receives file
2. **File stored** → Supabase Storage (gets public URL)
3. **Metadata saved** → Railway PostgreSQL (name, address, URLs)

### Data Flow:
```
Modal Form → Railway API → Supabase Storage (file) + Railway DB (metadata)
```

## 7. Benefits of This Hybrid Approach

✅ **Railway PostgreSQL**: 
- Managed database with your app
- No external database dependency
- Better integration with Railway services

✅ **Supabase Storage**: 
- Excellent file handling with CDN
- Public URLs generated automatically
- Better than storing files in database

✅ **Best of Both Worlds**:
- Database close to your app (Railway)
- Files optimized for web delivery (Supabase)

## 8. Testing

1. Upload an SVG through the modal
2. Check Railway PostgreSQL for metadata
3. Check Supabase Storage for the actual file
4. Verify public URL works

Your hybrid setup is ready! 🚀 