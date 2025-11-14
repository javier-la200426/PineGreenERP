# 🚀 Quick Start Guide

Get your JobSite Manager app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including React, TypeScript, Tailwind CSS, and more.

## Step 2: Start Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5173`

## Step 3: Explore the Dashboards

### Manager Dashboard (Desktop)
Visit: `http://localhost:5173/manager/dashboard`
- View stats and analytics
- Schedule new jobs
- Monitor worker status
- Access reports

### Worker Dashboard (Mobile-Optimized)
Visit: `http://localhost:5173/worker/jobs`
- View today's job list
- Track progress
- Complete jobs with photos
- Navigate routes

### Client Portal
Visit: `http://localhost:5173/client/appointment`
- View appointment details
- Make payments
- Download receipts

### Login Page
Visit: `http://localhost:5173/login`
- Quick access to all dashboards
- Demo login (no auth required yet)

## Step 4: Change Language

1. Go to Settings: `http://localhost:5173/settings`
2. Click on "Spanish" or "English" button
3. The entire app will switch languages instantly!

## Step 5: Toggle Theme

1. Go to Settings
2. Click the theme toggle switch
3. Switch between Dark Mode (default) and Light Mode

## Next Steps (Optional)

### Add Supabase Backend

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy `.env.example` to `.env`
4. Add your Supabase URL and key to `.env`
5. Uncomment the Supabase code in `src/hooks/useSupabase.ts`

### Customize Design

- Edit colors in `tailwind.config.js`
- Modify translations in `src/i18n/locales/`
- Update components in `src/components/`

## 🎯 Key Features to Test

✅ **Responsive Design**: Resize your browser to see mobile/tablet/desktop views
✅ **Language Switch**: Toggle between English and Spanish
✅ **Dark/Light Mode**: Switch themes in settings
✅ **Navigation**: Click through different dashboard sections
✅ **Forms**: Try filling out the job scheduling form
✅ **Mobile Nav**: Check the bottom navigation on worker pages

## 📱 Test on Mobile

1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Visit `http://YOUR_IP:5173` on your phone
3. Test the worker dashboard for mobile experience

## 🐛 Troubleshooting

**Port already in use?**
```bash
npm run dev -- --port 3000
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors?**
```bash
npm run build
```

## 🎨 Design System

- **Primary Color**: Blue (#137fec)
- **Success**: Green (#28A745)
- **Warning**: Orange (#F5A623)
- **Danger**: Red (#DC3545)
- **Font**: Inter (Google Fonts)
- **Icons**: Material Symbols

## 📚 Learn More

- Read the full [README.md](./README.md) for detailed documentation
- Check `src/pages/` for page components
- Look at `src/components/` for reusable components
- Explore `src/i18n/locales/` for translations

---

**Happy Coding! 🎉**

