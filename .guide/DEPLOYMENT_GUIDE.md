# 🚀 Portfolio Deployment Guide

## Quick Deploy Options for OJT Applications

### 🌟 **Recommended: Vercel (Free)**
```bash
npm i -g vercel
npm run build-portfolio
vercel --prod
```
**Result**: Instant HTTPS deployment with custom domain options

### 🌟 **Alternative: Netlify (Free)**
1. Run `npm run build-portfolio`
2. Drag `build/` folder to [netlify.com/drop](https://netlify.com/drop)
3. **Result**: Live URL in seconds

### 🌟 **GitHub Pages (Free)**
```bash
npm i -g gh-pages
npm run build-portfolio
npx gh-pages -d build
```
**Result**: `https://[username].github.io/Portfolio`

## 📱 Two Versions Strategy

### **For Applications**
- **HR/Non-Technical**: Send link with `?view=simple`
- **Technical Team**: Send main link (full interactive)
- **Email Template**:
```
Subject: Kai Tran - Portfolio for [Company] OJT Position

Hi [Recruiter Name],

Please find my portfolio at:
• Quick Overview: [URL]?view=simple
• Full Interactive: [URL]

Available for OJT Fall 2025 (Sep-Dec 2025)
Best regards, Kai Tran
```

## 🏢 Platform-Specific Instructions

### **Vercel** (Recommended)
```bash
# One-time setup
npm i -g vercel
vercel login

# Deploy
npm run build-portfolio
vercel --prod

# Custom domain (optional)
vercel domains add kaitran.dev
```

### **Netlify**
```bash
# Via CLI
npm i -g netlify-cli
netlify login
npm run build-portfolio
netlify deploy --prod --dir build

# Via Web (Easier)
# 1. Build: npm run build-portfolio
# 2. Visit: netlify.com/drop
# 3. Drag build/ folder
```

### **AWS S3 + CloudFront**
```bash
# Install AWS CLI
npm run build-portfolio

# Upload to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront (if using)
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### **Firebase Hosting**
```bash
npm i -g firebase-tools
firebase login
firebase init hosting
npm run build-portfolio
firebase deploy
```

## 🎯 URL Structure for Applications

### **Simple Version** (HR-Friendly)
- `https://kaitran-portfolio.vercel.app?view=simple`
- Clean, professional, fast-loading
- Perfect for initial screening

### **Full Version** (Technical)
- `https://kaitran-portfolio.vercel.app`
- Interactive features, technical showcase
- For technical interviews

## 📄 For PDF/Print Version

### **Generate PDF**
1. Visit: `[URL]?view=simple`
2. Browser: Print → Save as PDF
3. **Result**: Clean, professional PDF for applications

### **Automated PDF Generation**
```bash
# Using Puppeteer (optional)
npm install puppeteer
node scripts/generate-pdf.js
```

## 🔧 Environment Configuration

### **Environment Variables**
```bash
# .env.production
REACT_APP_ENV=production
REACT_APP_ANALYTICS_ID=your_id
GENERATE_SOURCEMAP=false
```

### **Custom Domain Setup**
1. **Vercel**: Add domain in dashboard
2. **Netlify**: Domain settings → Add custom domain  
3. **Update DNS**: Point to hosting provider

## 📊 Analytics & Tracking

### **Google Analytics** (Optional)
```bash
npm install gtag
# Add tracking ID to environment variables
```

### **Simple Visitor Counter**
- Most hosting platforms provide basic analytics
- View counts helpful for application tracking

## 🚀 Production Checklist

### **Pre-Deployment**
- [ ] Run `npm run build-portfolio`
- [ ] Test both view modes locally
- [ ] Check mobile responsiveness
- [ ] Verify all links work
- [ ] Test terminal commands

### **Post-Deployment**
- [ ] Test live URLs (both versions)
- [ ] Check loading speeds
- [ ] Verify mobile display
- [ ] Test on different browsers
- [ ] Share links in applications

## 📱 QR Code Generation

### **For Business Cards/CV**
```bash
# Generate QR codes for portfolio URLs
# Use: qr-code-generator.com
# Simple: [URL]?view=simple
# Full: [URL]
```

---

## 🎯 Application Strategy

### **Email Template**
```
Subject: OJT Application - Kai Tran - Full-Stack Developer

Dear [Company] Hiring Team,

I am applying for the OJT position for Fall 2025 (Sep-Dec 2025).

Portfolio: 
• Overview: [URL]?view=simple
• Interactive: [URL]

Key Skills: React, TypeScript, Node.js, AWS, Docker

Thank you for your consideration.

Best regards,
Kai Tran
[Contact Information]
```

### **CV Integration**
- Include both URLs in CV
- QR code for easy mobile access
- Mention dual-view capability

---

*This deployment guide ensures your portfolio is accessible, professional, and optimized for OJT applications at prestigious companies.*
