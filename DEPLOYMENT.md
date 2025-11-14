# 🚀 Deployment Guide

This guide covers deploying your JobSite Manager app to production.

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest)

**Why Vercel?**
- Zero configuration
- Automatic HTTPS
- Global CDN
- Free tier generous
- Perfect for React/Vite apps

**Steps:**

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Set Environment Variables**
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

5. **Deploy to Production**
```bash
vercel --prod
```

**Done!** Your app is live at `https://your-app.vercel.app`

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

2. **Login**
```bash
netlify login
```

3. **Build**
```bash
npm run build
```

4. **Deploy**
```bash
netlify deploy --prod --dir=dist
```

5. **Set Environment Variables**
- Go to Site Settings > Environment Variables
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Option 3: GitHub Pages (Free Static Hosting)

**Steps:**

1. **Update `vite.config.ts`**
```typescript
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. **Install gh-pages**
```bash
npm install -D gh-pages
```

3. **Add to `package.json`**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

4. **Deploy**
```bash
npm run deploy
```

5. **Enable GitHub Pages**
- Go to repo Settings > Pages
- Source: `gh-pages` branch

### Option 4: Supabase Hosting (Coming Soon)

Supabase is adding hosting features. Check their docs for updates.

## Environment Variables

### Required Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Setting in Different Platforms

**Vercel:**
```bash
vercel env add VARIABLE_NAME
```

**Netlify:**
Site Settings > Environment Variables > Add Variable

**GitHub Actions:**
Repository Settings > Secrets > New repository secret

## Build Optimization

### 1. Analyze Bundle Size
```bash
npm run build
```

Check `dist/` folder size. Should be under 500KB for optimal loading.

### 2. Enable Compression

Most platforms (Vercel, Netlify) automatically compress. For custom servers:

**nginx:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 3. Add Cache Headers

**Vercel** (`vercel.json`):
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Configure DNS

## SSL/HTTPS

All recommended platforms provide free SSL certificates automatically via Let's Encrypt.

## Performance Checklist

Before deploying:

- [ ] Run `npm run build` successfully
- [ ] Test production build locally: `npm run preview`
- [ ] Check bundle size (should be < 500KB)
- [ ] Verify all environment variables are set
- [ ] Test on mobile devices
- [ ] Check loading speed (< 3 seconds)
- [ ] Verify all routes work
- [ ] Test language switching
- [ ] Test theme switching

## Monitoring

### Add Analytics

**Google Analytics:**
```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

**Vercel Analytics:**
```bash
npm install @vercel/analytics
```

```typescript
// In main.tsx
import { Analytics } from '@vercel/analytics/react'

// Add to your app
<Analytics />
```

### Error Tracking

**Sentry:**
```bash
npm install @sentry/react
```

```typescript
// In main.tsx
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production"
})
```

## CI/CD Pipeline

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
          
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Database Migrations

When updating Supabase schema:

1. **Test in Development**
```sql
-- Run new migrations in Supabase SQL Editor
```

2. **Backup Production Data**
```bash
# In Supabase Dashboard: Database > Backups
```

3. **Apply to Production**
```sql
-- Run same migrations in production
```

4. **Verify**
```bash
# Test app functionality
```

## Rollback Plan

If deployment fails:

**Vercel:**
```bash
vercel rollback
```

**Netlify:**
- Go to Deploys
- Click on previous successful deploy
- Click "Publish deploy"

**GitHub Pages:**
```bash
git revert HEAD
git push
npm run deploy
```

## Security Checklist

Before going live:

- [ ] Environment variables not in code
- [ ] Supabase RLS policies enabled
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] API keys are anon keys (not service keys)
- [ ] No console.logs with sensitive data
- [ ] Error messages don't expose internals

## Post-Deployment

### 1. Test Everything
- [ ] All routes load
- [ ] Forms submit correctly
- [ ] Images load
- [ ] Language switching works
- [ ] Theme switching works
- [ ] Mobile responsive
- [ ] Fast loading (< 3s)

### 2. Monitor
- Check error logs daily
- Monitor performance metrics
- Track user analytics
- Watch for 404s

### 3. Optimize
- Review slow queries
- Optimize images
- Add caching where needed
- Monitor bundle size

## Troubleshooting

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Environment variables not working:**
- Restart dev server after changes
- Check variable names (must start with `VITE_`)
- Verify they're set in deployment platform

**404 on refresh:**
Add redirect rules:

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

**Netlify** (`public/_redirects`):
```
/*    /index.html   200
```

## Scaling Considerations

As your app grows:

1. **CDN**: Use Cloudflare for additional caching
2. **Database**: Upgrade Supabase plan for more connections
3. **Monitoring**: Add comprehensive logging
4. **Backups**: Automate database backups
5. **Load Testing**: Test with tools like k6 or Artillery

## Cost Estimates

**Free Tier (Development):**
- Vercel: Free
- Netlify: Free
- Supabase: Free (up to 500MB database)
- Total: $0/month

**Production (Small Business):**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Domain: $12/year
- Total: ~$46/month

**Production (Growing Business):**
- Vercel Team: $20/user/month
- Supabase Team: $599/month
- Monitoring: $50/month
- Total: ~$670/month

## Support Resources

- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Vite**: [vitejs.dev/guide](https://vitejs.dev/guide)

---

**Ready to Deploy?** Start with Vercel for the easiest experience! 🚀

