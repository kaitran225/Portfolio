# Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project directory**
   ```bash
   vercel
   ```

4. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy with Git Integration

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect repository on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect it's a React app

3. **Configure deployment settings** (optional)
   - Framework Preset: `Create React App`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

## ⚙️ Configuration Details

### Build Settings
- **Framework**: Create React App (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x (recommended)

### Vercel Configuration Features
- ✅ **Modern Config Format**: Using `headers`, `rewrites`, `redirects` (not legacy `routes`)
- ✅ **SPA Routing**: Automatic React Router support with catch-all rewrite
- ✅ **Clean URLs**: Enabled for better SEO
- ✅ **Trailing Slash**: Disabled for consistency

### Environment Variables (Optional)
Add these in Vercel dashboard → Project → Settings → Environment Variables:

```
REACT_APP_SITE_URL=https://your-domain.vercel.app
REACT_APP_GA_TRACKING_ID=your-google-analytics-id
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### Custom Domain Setup
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS settings as instructed
4. SSL certificate will be auto-generated

## 🔧 Optimization Features

### Performance Optimizations
- ✅ **Asset Caching**: Static assets cached for 1 year
- ✅ **Compression**: Automatic gzip compression
- ✅ **Image Optimization**: Automatic WebP conversion
- ✅ **CDN**: Global edge network distribution
- ✅ **HTTP/2**: Enabled by default

### Security Headers
- ✅ **HTTPS**: Force SSL redirect
- ✅ **Security Headers**: XSS protection, content type sniffing protection
- ✅ **Frame Protection**: Prevents clickjacking
- ✅ **HSTS**: HTTP Strict Transport Security

### SEO Features
- ✅ **Meta Tags**: Proper social media meta tags
- ✅ **Sitemap**: Auto-served at `/sitemap.xml`
- ✅ **Robots.txt**: SEO directives at `/robots.txt`
- ✅ **Structured Data**: JSON-LD for rich snippets

## 📊 Monitoring & Analytics

### Vercel Analytics
- Enable in Project Settings → Analytics
- Get real-time performance metrics
- Monitor Core Web Vitals

### Build Performance
- Check build logs in deployment dashboard
- Monitor build duration and bundle size
- Use `npm run analyze` locally for bundle analysis

## 🔍 Troubleshooting

### Common Issues

**Build Fails**
```bash
# Check dependencies locally
npm install
npm run build

# Check for TypeScript errors
npx tsc --noEmit
```

**Assets Not Loading**
- Ensure all assets are in `public/` directory
- Check `copyAssets.js` script execution
- Verify asset paths in components

**Routing Issues**
- Vercel handles SPA routing automatically
- Check `vercel.json` rewrites configuration
- Ensure React Router is configured correctly

**Performance Issues**
- Enable Vercel Analytics
- Check lighthouse scores
- Review bundle size with `npm run analyze`

### Support Commands

```bash
# Local preview (simulates Vercel environment)
vercel dev

# Check deployment status
vercel ls

# View deployment logs
vercel logs [deployment-url]

# Roll back to previous deployment
vercel rollback [deployment-url]
```

## 🌐 Post-Deployment Checklist

- [ ] Test all routes and navigation
- [ ] Verify contact form functionality
- [ ] Check responsive design on mobile
- [ ] Test loading performance
- [ ] Validate SEO meta tags
- [ ] Confirm analytics tracking
- [ ] Test external links (GitHub, social media)
- [ ] Verify asset loading (images, fonts)

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Create React App on Vercel](https://vercel.com/guides/deploying-react-with-vercel)
- [Custom Domains](https://vercel.com/docs/concepts/projects/custom-domains)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Pro Tip**: Vercel provides automatic deployments on every git push to your main branch. This ensures your portfolio is always up-to-date with your latest changes!
