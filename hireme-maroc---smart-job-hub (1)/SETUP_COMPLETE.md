# 🎉 Supabase CLI Setup Complete!

## ✅ What We've Done:

1. ✅ Installed Supabase CLI (v2.62.10)
2. ✅ Logged into your Supabase account
3. ✅ Linked to project "hirememaroc" (zfhxgosamaeeuxmhqjkj)
4. ✅ Created `jobs` table with proper schema
5. ✅ Created `.env` file template

## 📋 Next Steps (Required):

### 1. Get Your Supabase Anon Key
1. Open: https://supabase.com/dashboard/project/zfhxgosamaeeuxmhqjkj/settings/api
2. Copy the **anon** / **public** key (long string starting with `eyJ...`)
3. Open `.env` file in your project
4. Replace `your_anon_key_here` with the copied key

### 2. Get Your Google Gemini API Key
1. Open: https://aistudio.google.com/app/apikey
2. Create or copy your API key
3. Open `.env` file
4. Replace `your_gemini_api_key_here` with the copied key

### 3. Restart Your Dev Server
After adding the keys to `.env`, restart the server:
```powershell
# Stop the current server (Ctrl+C)
# Then run:
npm run dev
```

## 🗄️ Database Schema Created:

```sql
jobs table:
- id (TEXT, PRIMARY KEY) - Unique job identifier
- title (TEXT) - Job title
- company (TEXT) - Company name
- location (TEXT) - Job location
- description (TEXT) - Job description
- url (TEXT) - Link to job posting
- source (TEXT) - Job board source
- created_at (TIMESTAMP) - Auto-generated timestamp
```

## 🔍 Useful Supabase CLI Commands:

```powershell
# View all your projects
supabase projects list

# View remote database tables
supabase db dump --linked

# Pull database schema
supabase db pull

# Push new migrations
supabase db push

# View project API settings
# Open: https://supabase.com/dashboard/project/zfhxgosamaeeuxmhqjkj/settings/api
```

## 🚀 How the App Works Now:

1. **On Load**: Fetches all jobs from database (last 7 days)
2. **Every 20 seconds**: Scans 20+ Moroccan job sites via Gemini AI
3. **Saves to DB**: New jobs automatically saved to Supabase
4. **Auto-cleanup**: Jobs older than 7 days deleted every hour
5. **Filters**: Search, city, and contract type filters work on database data

## ⚠️ Important Notes:

- The `.env` file is gitignored for security
- Never commit API keys to version control
- The Supabase URL is: `https://zfhxgosamaeeuxmhqjkj.supabase.co`
- Row Level Security (RLS) is enabled with public access policy

## 🔧 If You Encounter Issues:

1. **Can't connect**: Check if keys in `.env` are correct
2. **No jobs loading**: Check browser console for errors
3. **Scraping not working**: Verify Gemini API key is valid
4. **Database errors**: Check Supabase dashboard logs

## 📊 Monitor Your Database:

- Dashboard: https://supabase.com/dashboard/project/zfhxgosamaeeuxmhqjkj
- Table Editor: https://supabase.com/dashboard/project/zfhxgosamaeeuxmhqjkj/editor
- API Logs: https://supabase.com/dashboard/project/zfhxgosamaeeuxmhqjkj/logs

---

**Ready to test?** Add your API keys to `.env` and restart the server!
