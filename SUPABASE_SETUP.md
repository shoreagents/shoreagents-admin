# Supabase Setup Guide

## 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 2. Database Schema

Create the following table in your Supabase database:

```sql
-- Create floor_plans table
CREATE TABLE floor_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    svg_url TEXT NOT NULL,
    svg_path TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public access (adjust as needed)
CREATE POLICY "Allow public access" ON floor_plans FOR ALL USING (true);
```

## 3. Storage Bucket

Create a storage bucket in Supabase:

1. Go to your Supabase dashboard
2. Navigate to Storage
3. Create a new bucket named `floor-plans`
4. Make it public or configure appropriate policies
5. Set the bucket policy:

```sql
-- Allow public access to floor-plans bucket
CREATE POLICY "Public Access" ON storage.objects FOR ALL USING (bucket_id = 'floor-plans');
```

## 4. Getting Your Credentials

1. **Project URL**: Found in your Supabase project settings
2. **Service Role Key**: Found in Settings > API > Service Role (secret)

## 5. File Upload Features

- SVG files are uploaded to `floor-plans/` folder in Supabase Storage
- Public URLs are generated automatically
- Database stores both the public URL and storage path
- File validation ensures only SVG files are accepted

## 6. API Endpoints

- `POST /api/floor-plans` - Create new floor plan with file upload
- `GET /api/floor-plans` - Retrieve all floor plans

The integration is now ready to work with Railway deployment and Supabase storage! 