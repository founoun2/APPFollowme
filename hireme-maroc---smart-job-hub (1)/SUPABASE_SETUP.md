# Supabase Database Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `hireme-maroc` (or your choice)
   - Database password: (create a strong password)
   - Region: Choose closest to Morocco (e.g., Europe West)
5. Click "Create new project"

## Step 2: Create Jobs Table

1. In your Supabase dashboard, go to **Table Editor**
2. Click "+ New table"
3. Configure the table:
   - Name: `jobs`
   - Enable **Row Level Security (RLS)**: No (for now, enable later for production)
4. Add columns:

| Column Name | Type | Default | Options |
|------------|------|---------|---------|
| id | int8 | - | Primary key, NOT NULL |
| title | text | - | NOT NULL |
| company | text | - | NOT NULL |
| city | text | - | NOT NULL |
| contract | text | - | NOT NULL |
| time | text | - | NOT NULL |
| isNew | bool | false | - |
| description | text | - | - |
| tasks | text[] | - | - |
| requirements | text[] | - | - |
| salary | text | - | - |
| email | text | - | - |
| contactPhone | text | - | - |
| url | text | - | NOT NULL |
| created_at | timestamptz | now() | NOT NULL |

5. Click "Save"

## Step 3: Get API Credentials

1. Go to **Project Settings** (gear icon)
2. Click **API** in the sidebar
3. Copy these values:
   - **Project URL** (under "Config")
   - **anon public** key (under "Project API keys")

## Step 4: Configure Your App

1. Create a `.env` file in your project root
2. Copy content from `.env.example`:
```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
API_KEY=your_gemini_api_key
```
3. Replace with your actual credentials

## Step 5: Test Connection

Restart your development server:
```bash
npm run dev
```

The app will now:
- ✅ Save new jobs to Supabase
- ✅ Load jobs from database on startup
- ✅ Auto-delete jobs older than 1 week
- ✅ Check job availability periodically

## Troubleshooting

**Error: "Invalid API key"**
- Check your `.env` file has correct VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
- Restart dev server after changing .env

**Jobs not saving**
- Check Supabase dashboard > Table Editor > jobs table
- Verify RLS is disabled for testing
- Check browser console for errors

**CORS errors**
- Go to Project Settings > API
- Add your localhost URL to allowed origins

## Next Steps (Optional)

### Enable Row Level Security
```sql
-- Allow public read access
CREATE POLICY "Allow public read" ON jobs
FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Allow public insert" ON jobs
FOR INSERT WITH CHECK (true);

-- Allow public delete
CREATE POLICY "Allow public delete" ON jobs
FOR DELETE USING (true);
```

### Add Indexes for Performance
```sql
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_city ON jobs(city);
CREATE INDEX idx_jobs_contract ON jobs(contract);
```
