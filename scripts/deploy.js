#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * Automates the deployment process with pre-deployment checks
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

const runCommand = (command, description) => {
  try {
    log(`\n${colors.blue}▶ ${description}...${colors.reset}`);
    execSync(command, { stdio: 'inherit' });
    log(`${colors.green}✅ ${description} completed successfully${colors.reset}`);
  } catch (error) {
    log(`${colors.red}❌ ${description} failed${colors.reset}`, colors.red);
    log(`Error: ${error.message}`, colors.red);
    process.exit(1);
  }
};

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    log(`${colors.green}✅ ${description} exists${colors.reset}`);
    return true;
  } else {
    log(`${colors.yellow}⚠️  ${description} not found${colors.reset}`);
    return false;
  }
};

const main = async () => {
  log(`${colors.cyan}${colors.bright}🚀 Vercel Deployment Script${colors.reset}`);
  log(`${colors.cyan}================================${colors.reset}\n`);

  // Pre-deployment checks
  log(`${colors.magenta}${colors.bright}📋 Pre-deployment checks:${colors.reset}`);
  
  const requiredFiles = [
    { path: 'package.json', desc: 'Package.json' },
    { path: 'vercel.json', desc: 'Vercel config' },
    { path: 'src/index.tsx', desc: 'Main React entry point' },
    { path: 'public/index.html', desc: 'HTML template' },
    { path: 'scripts/copyAssets.js', desc: 'Copy assets script' }
  ];

  let allFilesExist = true;
  requiredFiles.forEach(({ path, desc }) => {
    if (!checkFile(path, desc)) {
      allFilesExist = false;
    }
  });

  if (!allFilesExist) {
    log(`${colors.red}❌ Some required files are missing. Please fix the issues above.${colors.reset}`);
    process.exit(1);
  }

  // Check if Vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    log(`${colors.green}✅ Vercel CLI is installed${colors.reset}`);
  } catch (error) {
    log(`${colors.yellow}⚠️  Vercel CLI not found. Installing...${colors.reset}`);
    runCommand('npm install -g vercel', 'Installing Vercel CLI');
  }

  // Install dependencies
  runCommand('npm install', 'Installing dependencies');

  // Run tests
  log(`\n${colors.magenta}${colors.bright}🧪 Running tests:${colors.reset}`);
  runCommand('npm run test:ci', 'Running test suite');

  // Type check
  runCommand('npx tsc --noEmit', 'TypeScript type checking');

  // Build project locally to verify
  log(`\n${colors.magenta}${colors.bright}🔨 Building project:${colors.reset}`);
  runCommand('npm run build', 'Building for production');

  // Deploy to Vercel
  log(`\n${colors.magenta}${colors.bright}🚀 Deploying to Vercel:${colors.reset}`);
  
  const args = process.argv.slice(2);
  const isProd = args.includes('--prod') || args.includes('-p');
  
  if (isProd) {
    log(`${colors.yellow}🌟 Deploying to PRODUCTION...${colors.reset}`);
    runCommand('vercel --prod', 'Production deployment');
  } else {
    log(`${colors.blue}🔍 Deploying to preview...${colors.reset}`);
    runCommand('vercel', 'Preview deployment');
  }

  // Success message
  log(`\n${colors.green}${colors.bright}🎉 Deployment completed successfully!${colors.reset}`);
  log(`${colors.cyan}📱 Your portfolio is now live on Vercel${colors.reset}`);
  
  if (!isProd) {
    log(`${colors.yellow}💡 To deploy to production, run: npm run deploy:prod${colors.reset}`);
  }
};

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  log(`${colors.red}💥 Uncaught Exception: ${error.message}${colors.reset}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`${colors.red}💥 Unhandled Rejection at: ${promise} reason: ${reason}${colors.reset}`);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  log(`${colors.red}💥 Script failed: ${error.message}${colors.reset}`);
  process.exit(1);
});
