#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Deployment preparation script for portfolio
console.log('🚀 Preparing Portfolio for Production Deployment...\n');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'public/index.html',
  'src/App.tsx',
  'craco.config.js'
];

console.log('📋 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.error(`❌ ${file} missing`);
    process.exit(1);
  }
});

// Check environment variables
console.log('\n🔧 Environment Configuration:');
const envVars = {
  'NODE_ENV': process.env.NODE_ENV || 'development',
  'REACT_APP_GA_MEASUREMENT_ID': process.env.REACT_APP_GA_MEASUREMENT_ID || 'Not set',
  'GENERATE_SOURCEMAP': process.env.GENERATE_SOURCEMAP || 'true'
};

Object.entries(envVars).forEach(([key, value]) => {
  console.log(`   ${key}: ${value}`);
});

// Create optimized production build
console.log('\n🏗️  Building optimized production bundle...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Analyze build output
console.log('\n📊 Analyzing build output...');
const buildDir = 'build';
if (fs.existsSync(buildDir)) {
  const stats = getBuildStats(buildDir);
  console.log(`   Total files: ${stats.totalFiles}`);
  console.log(`   Total size: ${(stats.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`   JS files: ${stats.jsFiles} (${(stats.jsSize / 1024).toFixed(2)} KB)`);
  console.log(`   CSS files: ${stats.cssFiles} (${(stats.cssSize / 1024).toFixed(2)} KB)`);
  console.log(`   Image files: ${stats.imageFiles} (${(stats.imageSize / 1024).toFixed(2)} KB)`);
  
  // Check for large files
  if (stats.largeFiles.length > 0) {
    console.log('\n⚠️  Large files detected (>1MB):');
    stats.largeFiles.forEach(file => {
      console.log(`   ${file.name}: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    });
  }
} else {
  console.error('❌ Build directory not found');
  process.exit(1);
}

// Run bundle analysis
console.log('\n📈 Running bundle analysis...');
try {
  execSync('node scripts/bundle-analysis.js', { stdio: 'inherit' });
} catch (error) {
  console.log('⚠️  Bundle analysis script not found or failed');
}

// Generate deployment files
console.log('\n📄 Generating deployment files...');

// Create .env.production template
const envProductionTemplate = `# Production Environment Variables
NODE_ENV=production
GENERATE_SOURCEMAP=false
REACT_APP_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Portfolio Configuration
REACT_APP_PORTFOLIO_NAME=Your Portfolio
REACT_APP_PORTFOLIO_URL=https://yourportfolio.com
REACT_APP_CONTACT_EMAIL=contact@yourportfolio.com

# Performance Settings
REACT_APP_PRELOAD_IMAGES=true
REACT_APP_LAZY_LOAD_THRESHOLD=0.1

# SEO Configuration
REACT_APP_DEFAULT_META_DESCRIPTION=Professional portfolio showcasing development and design projects
REACT_APP_DEFAULT_META_KEYWORDS=portfolio,developer,designer,projects,skills
`;

fs.writeFileSync('.env.production.template', envProductionTemplate);
console.log('✅ Created .env.production.template');

// Create Vercel configuration
const vercelConfig = {
  "version": 2,
  "name": "portfolio",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*\\.(js|css|ico|png|jpg|jpeg|gif|svg|webp))",
      "headers": {
        "cache-control": "public, max-age=31536000"
      }
    },
    {
      "src": "/sitemap.xml",
      "headers": {
        "content-type": "application/xml"
      }
    },
    {
      "src": "/robots.txt",
      "headers": {
        "content-type": "text/plain"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
};

fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
console.log('✅ Created vercel.json');

// Create Netlify configuration
const netlifyConfig = `[build]
  publish = "build"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "20"
  NPM_FLAGS = "--legacy-peer-deps"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/static/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
`;

fs.writeFileSync('netlify.toml', netlifyConfig);
console.log('✅ Created netlify.toml');

// Create GitHub Actions workflow
const githubWorkflow = `name: Deploy Portfolio

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
      
    - name: Run tests
      run: npm test -- --coverage --ci
      
    - name: Build
      run: npm run build
      env:
        NODE_ENV: production
        GENERATE_SOURCEMAP: false
        REACT_APP_GA_MEASUREMENT_ID: \${{ secrets.GA_MEASUREMENT_ID }}
        
    - name: Deploy to Vercel
      uses: vercel/action@v1
      with:
        vercel-token: \${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: \${{ secrets.ORG_ID }}
        vercel-project-id: \${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
`;

if (!fs.existsSync('.github')) {
  fs.mkdirSync('.github');
}
if (!fs.existsSync('.github/workflows')) {
  fs.mkdirSync('.github/workflows');
}
fs.writeFileSync('.github/workflows/deploy.yml', githubWorkflow);
console.log('✅ Created .github/workflows/deploy.yml');

// Create deployment checklist
const deploymentChecklist = `# 🚀 Portfolio Deployment Checklist

## Pre-Deployment Setup

### 1. Environment Configuration
- [ ] Copy \`.env.production.template\` to \`.env.production\`
- [ ] Set \`REACT_APP_GA_MEASUREMENT_ID\` to your Google Analytics ID
- [ ] Update \`REACT_APP_PORTFOLIO_URL\` with your domain
- [ ] Update contact email and other portfolio details

### 2. Content Review
- [ ] Update personal information in \`src/data/profile.ts\`
- [ ] Review and update project descriptions
- [ ] Ensure all images are optimized (WebP format available)
- [ ] Check all external links are working
- [ ] Verify contact form is configured

### 3. Performance Optimization
- [ ] Run \`npm run build\` to verify build success
- [ ] Check bundle size with \`node scripts/bundle-analysis.js\`
- [ ] Verify Core Web Vitals in Lighthouse
- [ ] Test on mobile devices and different screen sizes

## Deployment Options

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: \`npm i -g vercel\`
2. Login: \`vercel login\`
3. Deploy: \`vercel --prod\`
4. Configure custom domain in Vercel dashboard

### Option 2: Netlify
1. Connect GitHub repository to Netlify
2. Set build command: \`npm run build\`
3. Set publish directory: \`build\`
4. Configure environment variables in Netlify dashboard

### Option 3: GitHub Pages
1. Install gh-pages: \`npm install --save-dev gh-pages\`
2. Add to package.json scripts: \`"deploy": "gh-pages -d build"\`
3. Run: \`npm run deploy\`

## Post-Deployment Verification

### 1. Functionality Testing
- [ ] Test all navigation and routing
- [ ] Verify contact form submission
- [ ] Check project filtering and search
- [ ] Test theme switching
- [ ] Verify mobile responsiveness

### 2. Performance Testing
- [ ] Run Lighthouse audit (aim for 90+ scores)
- [ ] Test loading speed with fast/slow connections
- [ ] Verify image optimization is working
- [ ] Check for console errors

### 3. SEO & Analytics
- [ ] Verify Google Analytics is tracking
- [ ] Submit sitemap to Google Search Console
- [ ] Test social media previews (Open Graph)
- [ ] Check structured data with Google Rich Results Test

### 4. Security & Best Practices
- [ ] Verify HTTPS is enabled
- [ ] Check security headers are set
- [ ] Test for accessibility compliance
- [ ] Verify no sensitive data is exposed

## Monitoring & Maintenance

### Regular Tasks
- [ ] Monitor Google Analytics for user behavior
- [ ] Check for broken links monthly
- [ ] Update dependencies quarterly
- [ ] Review and update content regularly
- [ ] Monitor Core Web Vitals

### Performance Monitoring
- [ ] Set up uptime monitoring (e.g., UptimeRobot)
- [ ] Monitor Lighthouse scores
- [ ] Track conversion metrics
- [ ] Review error logs

## Troubleshooting

### Common Issues
- **Build fails**: Check for TypeScript errors, missing dependencies
- **Images not loading**: Verify optimized images exist, check file paths
- **Routing issues**: Ensure hosting platform supports SPA routing
- **Analytics not working**: Check GA ID, verify production environment
- **Performance issues**: Review bundle analysis, check for large assets

### Debug Commands
\`\`\`bash
# Check build
npm run build

# Analyze bundle
node scripts/bundle-analysis.js

# Run tests
npm test

# Check for security vulnerabilities
npm audit

# Performance testing
npm run build && npx serve -s build
\`\`\`

---

✅ **Ready for deployment!** Follow this checklist to ensure a smooth launch.
`;

fs.writeFileSync('DEPLOYMENT.md', deploymentChecklist);
console.log('✅ Created DEPLOYMENT.md');

// Final summary
console.log('\n✅ Deployment preparation complete!');
console.log('\n📋 Next Steps:');
console.log('1. Review and update .env.production.template');
console.log('2. Follow the deployment checklist in DEPLOYMENT.md');
console.log('3. Choose your deployment platform (Vercel/Netlify/GitHub Pages)');
console.log('4. Configure domain and analytics');
console.log('5. Run post-deployment verification tests');

// Helper function to analyze build output
function getBuildStats(buildDir) {
  const stats = {
    totalFiles: 0,
    totalSize: 0,
    jsFiles: 0,
    jsSize: 0,
    cssFiles: 0,
    cssSize: 0,
    imageFiles: 0,
    imageSize: 0,
    largeFiles: []
  };

  function analyzeDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        analyzeDirectory(filePath);
      } else {
        stats.totalFiles++;
        stats.totalSize += stat.size;
        
        const ext = path.extname(file).toLowerCase();
        
        if (ext === '.js') {
          stats.jsFiles++;
          stats.jsSize += stat.size;
        } else if (ext === '.css') {
          stats.cssFiles++;
          stats.cssSize += stat.size;
        } else if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico'].includes(ext)) {
          stats.imageFiles++;
          stats.imageSize += stat.size;
        }
        
        // Track large files (>1MB)
        if (stat.size > 1024 * 1024) {
          stats.largeFiles.push({
            name: path.relative(buildDir, filePath),
            size: stat.size
          });
        }
      }
    });
  }
  
  analyzeDirectory(buildDir);
  return stats;
}
