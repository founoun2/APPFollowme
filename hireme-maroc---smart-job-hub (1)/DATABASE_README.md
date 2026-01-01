# Supabase Integration - Quick Start

## ✅ What's Been Set Up

I've integrated Supabase as your database for job offers management. The system now:

1. **Saves all job offers** to Supabase database
2. **Loads jobs** from database on startup
3. **Auto-deletes** jobs older than 1 week
4. **Prevents duplicates** using upsert strategy

## 🚀 Next Steps

### 1. Create Supabase Account & Project

Follow the detailed guide in `SUPABASE_SETUP.md`

**Quick version:**
1. Go to https://supabase.com and sign up
2. Create a new project
3. Create the `jobs` table (see SUPABASE_SETUP.md for schema)
4. Get your API credentials

### 2. Configure Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` and add your credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   API_KEY=your-gemini-api-key
   ```

### 3. Restart Development Server

```bash
npm run dev
```

## 📁 New Files Created

- `services/supabaseClient.ts` - Supabase connection
- `services/jobService.ts` - Job database operations
- `SUPABASE_SETUP.md` - Detailed setup guide
- `.env.example` - Environment template

## 🔧 How It Works

### On App Start
```typescript
// Loads jobs from database (last 7 days)
await jobService.getAllJobs()
```

### Every 20 seconds
```typescript
// Scans for new jobs via Gemini AI
// Saves new jobs to database
await jobService.saveJobs(newJobs)
```

### Every hour
```typescript
// Deletes jobs older than 1 week
await jobService.deleteOldJobs()
```

## 💾 Database Schema

```sql
CREATE TABLE jobs (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  company text NOT NULL,
  city text NOT NULL,
  contract text NOT NULL,
  time text NOT NULL,
  isNew boolean DEFAULT false,
  description text,
  tasks text[],
  requirements text[],
  salary text,
  email text,
  contactPhone text,
  url text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);
```

## 🎯 Benefits

✅ **Persistent Storage** - Jobs saved across browser sessions  
✅ **Auto Cleanup** - Old jobs deleted automatically  
✅ **No Duplicates** - Smart upsert prevents duplicates  
✅ **Fast Loading** - Database queries faster than API calls  
✅ **Scalable** - Can handle thousands of jobs  
✅ **Free Tier** - Supabase free tier is generous  

## 📊 Monitoring

View your jobs in Supabase Dashboard:
1. Go to your project dashboard
2. Click "Table Editor"
3. Select "jobs" table
4. See all saved jobs with timestamps

## 🐛 Troubleshooting

**Jobs not saving?**
- Check `.env` file exists and has correct credentials
- Check browser console for errors
- Verify Supabase table is created correctly

**Still using mock data?**
- Wait for first sync cycle (20 seconds)
- Or trigger manual sync by reloading page

**Need help?**
- Check `SUPABASE_SETUP.md` for detailed guide
- Check Supabase documentation: https://supabase.com/docs
