# JobSite Manager - React Web Application

A modern, responsive, and mobile-friendly job management system built with React, TypeScript, and Tailwind CSS. This application provides separate dashboards for Managers, Workers, and Clients with full bilingual support (English/Spanish).

## 🚀 Features

### Multi-Role Dashboards
- **Manager Dashboard**: Comprehensive oversight of operations, jobs, workers, clients, and reports
- **Worker Dashboard**: Mobile-optimized job list, route view, and job completion interface
- **Client Dashboard**: Appointment management, payment processing, and receipt viewing

### Core Features
- ✅ **Bilingual Support**: Full English and Spanish translations with easy language switching
- ✅ **Dark/Light Mode**: Beautiful dark theme (default) with light mode option
- ✅ **Responsive Design**: Mobile-first approach that works seamlessly on all devices
- ✅ **Modern UI**: Clean, professional interface using Tailwind CSS and Material Symbols
- ✅ **Type-Safe**: Built with TypeScript for better development experience
- ✅ **Supabase Ready**: Pre-configured hooks and types for Supabase integration

### Planned Features
- 🔄 **Route Optimization**: Smart routing for workers (placeholder ready)
- 🔄 **Real-time Updates**: Live job status and worker location tracking
- 🔄 **Payment Integration**: Stripe payment processing (UI ready)
- 🔄 **File Uploads**: Photo uploads for job completion proof

## 📋 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **State Management**: Zustand
- **Internationalization**: i18next
- **Backend (Ready)**: Supabase
- **Icons**: Material Symbols

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- A code editor (VS Code recommended)

### Steps

1. **Clone or navigate to the project directory**
```bash
cd /Users/javierlaveaga/Desktop/CapstonE1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables** (Optional - for Supabase)
```bash
cp .env.example .env
```
Then edit `.env` and add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. **Start the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── Icon.tsx
│   ├── MobileBottomNav.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── pages/              # Page components
│   ├── manager/        # Manager dashboard pages
│   │   ├── Dashboard.tsx
│   │   ├── Jobs.tsx
│   │   ├── Workers.tsx
│   │   ├── Clients.tsx
│   │   └── Reports.tsx
│   ├── worker/         # Worker dashboard pages
│   │   ├── JobList.tsx
│   │   ├── RouteView.tsx
│   │   └── JobCompletion.tsx
│   ├── client/         # Client portal pages
│   │   ├── Appointment.tsx
│   │   ├── Payment.tsx
│   │   └── Receipt.tsx
│   ├── Login.tsx
│   └── Settings.tsx
├── i18n/               # Internationalization
│   ├── config.ts
│   └── locales/
│       ├── en.json
│       └── es.json
├── hooks/              # Custom React hooks
│   └── useSupabase.ts
├── lib/                # External service configs
│   └── supabase.ts
├── store/              # State management
│   └── themeStore.ts
├── App.tsx             # Main app component with routing
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## 🎨 Available Routes

### Manager Routes
- `/manager/dashboard` - Main dashboard with stats and quick actions
- `/manager/jobs` - Job management and tracking
- `/manager/workers` - Worker management
- `/manager/clients` - Client management with detailed views
- `/manager/reports` - Reports and analytics

### Worker Routes (Mobile-Optimized)
- `/worker/jobs` - Today's job list with progress tracking
- `/worker/route` - Route view and optimization (placeholder)
- `/worker/job/:id/complete` - Job completion form with photo upload

### Client Routes
- `/client/appointment` - View appointment details
- `/client/payment` - Payment processing interface
- `/client/receipt` - Payment receipt and confirmation

### Shared Routes
- `/login` - Login page with quick access to all dashboards
- `/settings` - Settings page with language and theme controls

## 🌐 Language Support

The app supports English and Spanish. Users can switch languages in the Settings page.

To add a new language:
1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate all values
3. Import and add it to `src/i18n/config.ts`

## 🎨 Theming

The app uses a custom color scheme defined in `tailwind.config.js`:
- **Primary**: `#137fec` (Blue)
- **Success**: `#28A745` (Green)
- **Warning**: `#F5A623` (Orange)
- **Danger**: `#DC3545` (Red)

Dark mode is enabled by default and can be toggled in Settings.

## 🗄️ Supabase Integration

### Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Add them to your `.env` file
4. Update the database types in `src/lib/supabase.ts` to match your schema

### Database Schema (Recommended)

```sql
-- Jobs table
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  status text not null check (status in ('pending', 'in_progress', 'completed', 'overdue')),
  client_id uuid references clients(id),
  worker_id uuid references workers(id),
  scheduled_date timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Clients table
create table clients (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  company text,
  status text not null check (status in ('active', 'inactive')),
  created_at timestamp with time zone default now()
);

-- Workers table
create table workers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null unique,
  phone text,
  status text not null check (status in ('available', 'on_route', 'busy')),
  created_at timestamp with time zone default now()
);
```

### Using Supabase Hooks

The app includes pre-built hooks in `src/hooks/useSupabase.ts`:

```typescript
import { useJobs, useClients, useWorkers, useAuth } from '@/hooks/useSupabase'

function MyComponent() {
  const { jobs, loading, error } = useJobs()
  // Use the data in your component
}
```

## 🚀 Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory, ready to deploy to any static hosting service.

### Deployment Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **Supabase**: Use Supabase hosting for seamless integration
- **Any static host**: Upload the `dist` folder contents

## 🧪 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🎯 Next Steps

1. **Configure Supabase**: Set up your database and add credentials
2. **Implement Authentication**: Use Supabase Auth for user management
3. **Add Real Data**: Replace mock data with actual Supabase queries
4. **Route Optimization**: Integrate a mapping service (Google Maps, Mapbox)
5. **Payment Processing**: Set up Stripe for payment handling
6. **File Uploads**: Configure Supabase Storage for photo uploads
7. **Real-time Features**: Use Supabase Realtime for live updates

## 📝 Notes

- This is a **proof of concept MVP** with UI/UX complete
- Backend integration points are marked with `TODO` comments
- All pages are fully responsive and mobile-friendly
- The design follows the provided mockups from the `stitch_manager_dashboard 2` folder

## 🤝 Backend Choice: Supabase

**Why Supabase?**
- ✅ **PostgreSQL**: Powerful, reliable, and scalable database
- ✅ **Real-time**: Built-in real-time subscriptions for live updates
- ✅ **Authentication**: Complete auth system out of the box
- ✅ **Storage**: File upload and management included
- ✅ **Row Level Security**: Database-level security policies
- ✅ **Auto-generated APIs**: REST and GraphQL APIs automatically created
- ✅ **Free Tier**: Generous free tier for development and small projects
- ✅ **TypeScript Support**: Excellent TypeScript integration

This is an excellent choice for your use case! Supabase provides everything you need without managing servers.

## 📄 License

This project is private and proprietary.

## 👨‍💻 Support

For questions or issues, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**

