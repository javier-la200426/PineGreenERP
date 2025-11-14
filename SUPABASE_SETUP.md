# 🗄️ Supabase Setup Guide

This guide will help you set up Supabase as your backend for the JobSite Manager application.

## Why Supabase?

Supabase is an excellent choice for this project because:

✅ **PostgreSQL Database**: Powerful, reliable, and scalable
✅ **Real-time Subscriptions**: Perfect for live job updates and worker tracking
✅ **Built-in Authentication**: User management out of the box
✅ **File Storage**: For job completion photos
✅ **Row Level Security**: Database-level security policies
✅ **Auto-generated APIs**: REST and GraphQL endpoints automatically created
✅ **Generous Free Tier**: Perfect for development and MVP
✅ **Excellent TypeScript Support**: Type-safe database queries

## Step 1: Create Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new organization (if first time)

## Step 2: Create a New Project

1. Click "New Project"
2. Fill in the details:
   - **Name**: `jobsite-manager` (or your preferred name)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is perfect to start
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

## Step 3: Get Your API Credentials

1. Go to **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: `eyJhbGc...` (long string)

## Step 4: Configure Your App

1. In your project root, create a `.env` file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your credentials:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Restart your dev server:
```bash
npm run dev
```

## Step 5: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Paste and run this SQL:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Clients table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  company text,
  address text,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Workers table
create table workers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  status text not null default 'available' check (status in ('available', 'on_route', 'busy')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Jobs table
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'completed', 'overdue')),
  client_id uuid references clients(id) on delete cascade,
  worker_id uuid references workers(id) on delete set null,
  service_type text,
  address text,
  scheduled_date timestamp with time zone,
  completed_date timestamp with time zone,
  notes text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Job photos table (for proof of completion)
create table job_photos (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete cascade,
  photo_url text not null,
  uploaded_at timestamp with time zone default now()
);

-- Invoices table
create table invoices (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete cascade,
  client_id uuid references clients(id) on delete cascade,
  amount decimal(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'overdue')),
  due_date timestamp with time zone,
  paid_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Create indexes for better performance
create index idx_jobs_client_id on jobs(client_id);
create index idx_jobs_worker_id on jobs(worker_id);
create index idx_jobs_status on jobs(status);
create index idx_jobs_scheduled_date on jobs(scheduled_date);
create index idx_invoices_client_id on invoices(client_id);
create index idx_invoices_status on invoices(status);

-- Create updated_at trigger function
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add triggers to update updated_at
create trigger update_clients_updated_at before update on clients
  for each row execute function update_updated_at_column();

create trigger update_workers_updated_at before update on workers
  for each row execute function update_updated_at_column();

create trigger update_jobs_updated_at before update on jobs
  for each row execute function update_updated_at_column();
```

4. Click **Run** to execute the SQL

## Step 6: Set Up Row Level Security (RLS)

For security, enable RLS on your tables:

```sql
-- Enable RLS on all tables
alter table clients enable row level security;
alter table workers enable row level security;
alter table jobs enable row level security;
alter table job_photos enable row level security;
alter table invoices enable row level security;

-- For now, allow all operations (you'll refine this later with auth)
create policy "Allow all for development" on clients for all using (true);
create policy "Allow all for development" on workers for all using (true);
create policy "Allow all for development" on jobs for all using (true);
create policy "Allow all for development" on job_photos for all using (true);
create policy "Allow all for development" on invoices for all using (true);
```

**Note**: These policies allow all access for development. When you add authentication, you'll want to create more restrictive policies.

## Step 7: Add Sample Data

```sql
-- Insert sample clients
insert into clients (name, email, phone, company, address, status) values
  ('Eleanor Vance', 'eleanor@innovate.com', '555-0101', 'Innovate Inc.', '123 Tech Street', 'active'),
  ('Marcus Holloway', 'marcus@techsolutions.com', '555-0102', 'Tech Solutions', '456 Innovation Ave', 'active'),
  ('Beatrice Chen', 'beatrice@creativeminds.com', '555-0103', 'Creative Minds', '789 Design Blvd', 'inactive');

-- Insert sample workers
insert into workers (name, email, phone, status) values
  ('John Doe', 'john@jobsite.com', '555-0201', 'available'),
  ('Mike Williams', 'mike@jobsite.com', '555-0202', 'on_route'),
  ('Jane Smith', 'jane@jobsite.com', '555-0203', 'busy');

-- Insert sample jobs
insert into jobs (title, description, status, client_id, worker_id, service_type, address, scheduled_date)
select 
  'Office Renovation',
  'Complete office renovation including painting and flooring',
  'in_progress',
  (select id from clients where email = 'eleanor@innovate.com'),
  (select id from workers where email = 'john@jobsite.com'),
  'Renovation',
  '123 Tech Street',
  now() + interval '2 days'
from (select 1) as dummy;
```

## Step 8: Enable Real-time (Optional)

For live updates:

1. Go to **Database** > **Replication**
2. Enable replication for tables you want to track in real-time:
   - `jobs`
   - `workers`
3. Click **Save**

## Step 9: Set Up Storage (For Photos)

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Create a bucket named `job-photos`
4. Set it to **Public** (for now)
5. Click **Create**

## Step 10: Update Your Code

In `src/hooks/useSupabase.ts`, uncomment the Supabase queries:

```typescript
// Before:
// const { data, error } = await supabase
//   .from('jobs')
//   .select('*')

// After:
const { data, error } = await supabase
  .from('jobs')
  .select('*')
```

## Testing Your Setup

1. Restart your dev server
2. Open browser console
3. The app should now fetch real data from Supabase
4. Check the Network tab to see API calls

## Next Steps

### Authentication
```sql
-- Enable email/password auth in Supabase dashboard
-- Go to Authentication > Providers > Email
```

### Better RLS Policies
```sql
-- Example: Only allow users to see their own jobs
create policy "Users can view their own jobs" on jobs
  for select using (auth.uid() = worker_id);
```

### File Upload
```typescript
// Upload job completion photo
const { data, error } = await supabase.storage
  .from('job-photos')
  .upload(`${jobId}/${Date.now()}.jpg`, file)
```

### Real-time Subscriptions
```typescript
// Listen for job updates
const subscription = supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'jobs' },
    (payload) => console.log('Job updated:', payload)
  )
  .subscribe()
```

## Troubleshooting

**Can't connect to Supabase?**
- Check your `.env` file has correct credentials
- Restart dev server after changing `.env`
- Verify project is not paused (free tier pauses after inactivity)

**RLS blocking queries?**
- Temporarily disable RLS for testing
- Check your policies match your use case
- Use Supabase logs to debug

**CORS errors?**
- Supabase automatically handles CORS
- Make sure you're using the correct project URL
- Check if your project is in the correct region

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Guide](https://supabase.com/docs/guides/realtime)

---

**Need Help?** Check the Supabase Discord community or documentation!

