# JobSite Manager

A job management web application for coordinating work between managers, workers, and clients. Built with React, TypeScript, and Supabase.

## Current State

This is a working MVP with three separate dashboards and live database integration.

### What's Working

**Frontend (Complete)**
- Manager dashboard with job scheduling, worker monitoring, and reports
- Worker mobile app with job lists and route view
- Client portal for appointments and payments
- Bilingual support (English/Spanish) with instant language switching
- Dark/light theme toggle
- Fully responsive design for mobile, tablet, and desktop

**Backend (Partially Integrated)**
- Supabase PostgreSQL database with 3 tables (jobs, clients, workers)
- Manager Jobs page pulls live data from database
- Sample data loaded (5 jobs, 4 clients, 5 workers)
- Row Level Security enabled

**Not Yet Implemented**
- User authentication
- Job creation/editing forms connected to database
- Worker and Client pages connected to database
- Route optimization feature
- File uploads for job completion photos
- Payment processing integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Start the development server:
```bash
npm run dev
```

4. Open http://localhost:5173

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           
│   ├── manager/     # Manager dashboard pages
│   ├── worker/      # Worker mobile pages
│   └── client/      # Client portal pages
├── hooks/           # Supabase data hooks
├── i18n/            # English and Spanish translations
└── lib/             # Supabase configuration
```

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- i18next for internationalization
- Supabase for backend (PostgreSQL database)
- Zustand for state management

## Database Schema

The Supabase database has three main tables:

**clients** - Customer information
- id, name, email, company, phone, status

**workers** - Employee information  
- id, name, email, phone, status (available/on_route/busy)

**jobs** - Work orders
- id, title, description, status, client_id, worker_id, address, scheduled_date

## Available Routes

**Manager (Desktop)**
- /manager/dashboard - Overview with stats
- /manager/jobs - Job list (connected to database)
- /manager/workers - Worker management
- /manager/clients - Client management
- /manager/reports - Analytics

**Worker (Mobile)**
- /worker/jobs - Today's job list
- /worker/route - Route view
- /worker/job/:id/complete - Job completion form

**Client**
- /client/appointment - Appointment details
- /client/payment - Payment form
- /client/receipt - Payment confirmation

**Shared**
- /login - Login page
- /settings - Language and theme settings

## Next Steps

To complete the MVP:

1. Connect remaining pages to Supabase (uncomment hooks in useSupabase.ts)
2. Implement authentication with Supabase Auth
3. Add job creation/editing functionality
4. Connect file upload for job photos
5. Integrate payment processing (Stripe)
6. Add route optimization feature

## Development Notes

- The app defaults to dark mode
- Language preference is saved in localStorage
- All database queries use the hooks in src/hooks/useSupabase.ts
- To add more pages to the database, uncomment the relevant code in the hooks file

## License

Private project - All rights reserved
