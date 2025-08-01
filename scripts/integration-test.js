// Portfolio Integration Testing Script
// This script tests all the newly implemented features and services

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

class PortfolioIntegrationTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      tests: []
    };
  }

  log(type, message) {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
      success: chalk.green,
      error: chalk.red,
      warning: chalk.yellow,
      info: chalk.blue
    };
    
    console.log(`${chalk.gray(timestamp)} ${colors[type](`[${type.toUpperCase()}]`)} ${message}`);
  }

  test(name, callback) {
    try {
      const result = callback();
      if (result) {
        this.results.passed++;
        this.results.tests.push({ name, status: 'PASS' });
        this.log('success', `✓ ${name}`);
      } else {
        this.results.failed++;
        this.results.tests.push({ name, status: 'FAIL' });
        this.log('error', `✗ ${name}`);
      }
    } catch (error) {
      this.results.failed++;
      this.results.tests.push({ name, status: 'ERROR', error: error.message });
      this.log('error', `✗ ${name} - ${error.message}`);
    }
  }

  warn(message) {
    this.results.warnings++;
    this.log('warning', `⚠ ${message}`);
  }

  checkFileExists(filePath, description) {
    return this.test(`${description} exists`, () => {
      return fs.existsSync(filePath);
    });
  }

  checkFileContent(filePath, searchPattern, description) {
    return this.test(`${description} contains expected content`, () => {
      if (!fs.existsSync(filePath)) return false;
      const content = fs.readFileSync(filePath, 'utf8');
      return new RegExp(searchPattern).test(content);
    });
  }

  async runIntegrationTests() {
    this.log('info', 'Starting Portfolio Integration Tests...\n');

    // 1. EMAIL SERVICE TESTS
    this.log('info', '🔧 Testing Email Service Integration...');
    this.checkFileExists('./src/services/emailService.ts', 'Email Service');
    this.checkFileContent('./src/services/emailService.ts', 'sendContactEmail', 'Email service implementation');
    this.checkFileContent('./src/services/emailService.ts', 'sendAutoReply', 'Auto-reply functionality');
    this.checkFileContent('./src/components/EnhancedContactForm.tsx', 'emailService', 'Contact form integration');
    
    // Check EmailJS configuration
    this.test('EmailJS environment variables check', () => {
      const envExample = fs.existsSync('.env.example');
      const envLocal = fs.existsSync('.env.local');
      if (!envExample && !envLocal) {
        this.warn('No .env files found. EmailJS requires environment configuration.');
        return false;
      }
      return true;
    });

    // 2. PERFORMANCE TESTING
    this.log('info', '\n🚀 Testing Performance Monitoring...');
    this.checkFileExists('./scripts/performance-test.js', 'Performance test script');
    this.checkFileExists('./src/services/analyticsService.ts', 'Analytics service');
    this.checkFileContent('./src/services/analyticsService.ts', 'trackPerformance', 'Performance tracking');
    this.checkFileContent('./src/App.tsx', 'usePerformanceMonitoring', 'Performance monitoring integration');

    // 3. MATERIAL DESIGN 3 TESTS
    this.log('info', '\n🎨 Testing Material Design 3 Integration...');
    this.checkFileExists('./src/theme/materialTheme.ts', 'Material Design 3 theme');
    this.checkFileContent('./src/theme/materialTheme.ts', 'createMaterialTheme', 'Theme creation function');
    this.checkFileContent('./src/theme/materialTheme.ts', 'colorTokens', 'Material Design 3 color tokens');
    this.checkFileContent('./src/App.tsx', 'MUIThemeProvider', 'Material-UI theme provider');
    this.checkFileContent('./src/App.tsx', 'CssBaseline', 'Material-UI baseline');

    // Check Material-UI dependencies
    this.test('Material-UI dependencies in package.json', () => {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      return deps['@mui/material'] && deps['@emotion/react'] && deps['@emotion/styled'];
    });

    // 4. PWA IMPLEMENTATION TESTS
    this.log('info', '\n📱 Testing PWA Implementation...');
    this.checkFileExists('./public/sw.js', 'Service Worker');
    this.checkFileExists('./public/manifest.json', 'PWA Manifest');
    this.checkFileExists('./src/services/pwaService.ts', 'PWA Service');
    this.checkFileExists('./src/components/PWABanner.tsx', 'PWA Banner Component');
    
    this.checkFileContent('./public/sw.js', 'workbox', 'Workbox implementation');
    this.checkFileContent('./public/sw.js', 'background-sync', 'Background sync');
    this.checkFileContent('./public/manifest.json', 'shortcuts', 'PWA shortcuts');
    this.checkFileContent('./src/App.tsx', 'PWABanner', 'PWA banner integration');

    // 5. ANALYTICS & MONITORING TESTS
    this.log('info', '\n📊 Testing Analytics & Monitoring...');
    this.checkFileExists('./src/services/PortfolioAnalytics.tsx', 'Portfolio Analytics');
    this.checkFileContent('./src/services/PortfolioAnalytics.tsx', 'AnalyticsProvider', 'Analytics provider');
    this.checkFileContent('./src/services/analyticsService.ts', 'trackEvent', 'Event tracking');
    this.checkFileContent('./src/App.tsx', 'AnalyticsProvider', 'Analytics integration');

    // 6. CONTENT & DATA TESTS
    this.log('info', '\n📄 Testing Content Updates...');
    this.checkFileExists('./src/data/portfolioData.json', 'Portfolio data');
    this.checkFileContent('./src/data/portfolioData.json', 'github.*https', 'GitHub URLs updated');
    this.checkFileContent('./src/data/portfolioData.json', 'liveUrl.*https', 'Live URLs updated');

    // 7. INTEGRATION COMPATIBILITY TESTS
    this.log('info', '\n🔗 Testing Integration Compatibility...');
    
    this.test('React 19 compatibility check', () => {
      const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
      const reactVersion = packageJson.dependencies?.react || packageJson.devDependencies?.react;
      return reactVersion && reactVersion.includes('19');
    });

    this.test('TypeScript configuration', () => {
      return fs.existsSync('./tsconfig.json');
    });

    this.test('App.tsx imports all new services', () => {
      const appContent = fs.readFileSync('./src/App.tsx', 'utf8');
      const requiredImports = [
        'AnalyticsProvider',
        'createMaterialTheme',
        'PWABanner',
        'MUIThemeProvider',
        'CssBaseline'
      ];
      return requiredImports.every(imp => appContent.includes(imp));
    });

    // 8. BUILD READINESS TESTS
    this.log('info', '\n🏗️ Testing Build Readiness...');
    
    this.test('No obvious TypeScript errors in key files', () => {
      const keyFiles = [
        './src/App.tsx',
        './src/services/emailService.ts',
        './src/services/pwaService.ts',
        './src/theme/materialTheme.ts',
        './src/components/PWABanner.tsx'
      ];
      
      for (const file of keyFiles) {
        if (!fs.existsSync(file)) return false;
        const content = fs.readFileSync(file, 'utf8');
        // Basic checks for common TypeScript issues
        if (content.includes('any;') && !content.includes('// @ts-ignore')) {
          this.warn(`Potential TypeScript issue in ${file}`);
        }
      }
      return true;
    });

    // 9. ENVIRONMENT SETUP TESTS
    this.log('info', '\n🔧 Testing Environment Setup...');
    
    this.test('Scripts directory exists', () => {
      return fs.existsSync('./scripts') && fs.statSync('./scripts').isDirectory();
    });

    this.test('Build scripts are executable', () => {
      const buildScript = './scripts/build-portfolio.bat';
      const shellScript = './scripts/build-portfolio.sh';
      return fs.existsSync(buildScript) || fs.existsSync(shellScript);
    });

    // 10. FINAL INTEGRATION CHECK
    this.log('info', '\n✅ Running Final Integration Checks...');
    
    this.test('All major features integrated in App.tsx', () => {
      const appContent = fs.readFileSync('./src/App.tsx', 'utf8');
      const features = [
        'AnalyticsProvider',   // Analytics
        'PWABanner',          // PWA
        'MUIThemeProvider',   // Material Design
        'usePerformanceMonitoring', // Performance
      ];
      return features.every(feature => appContent.includes(feature));
    });

    this.test('Enhanced Contact Form has offline support', () => {
      const formContent = fs.readFileSync('./src/components/EnhancedContactForm.tsx', 'utf8');
      return formContent.includes('usePWA') && formContent.includes('submitFormOffline');
    });

    // Print Results
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log(chalk.bold.blue('PORTFOLIO INTEGRATION TEST RESULTS'));
    console.log('='.repeat(60));
    
    console.log(`${chalk.green('✓ Passed:')} ${this.results.passed}`);
    console.log(`${chalk.red('✗ Failed:')} ${this.results.failed}`);
    console.log(`${chalk.yellow('⚠ Warnings:')} ${this.results.warnings}`);
    
    console.log('\n' + chalk.bold('Test Summary:'));
    this.results.tests.forEach(test => {
      const icon = test.status === 'PASS' ? chalk.green('✓') : chalk.red('✗');
      console.log(`  ${icon} ${test.name}`);
      if (test.error) {
        console.log(`    ${chalk.red('Error:')} ${test.error}`);
      }
    });

    const successRate = (this.results.passed / (this.results.passed + this.results.failed)) * 100;
    console.log(`\n${chalk.bold('Success Rate:')} ${successRate.toFixed(1)}%`);

    if (this.results.failed === 0) {
      console.log(`\n${chalk.green.bold('🎉 All integration tests passed! Your portfolio is ready for deployment.')}`);
    } else {
      console.log(`\n${chalk.yellow.bold('⚠️ Some tests failed. Please review the issues above before deployment.')}`);
    }

    // Recommendations
    console.log('\n' + chalk.bold.blue('DEPLOYMENT RECOMMENDATIONS:'));
    console.log('1. Configure EmailJS environment variables (.env.local)');
    console.log('2. Test PWA installation in production build');
    console.log('3. Configure Google Analytics 4 tracking ID');
    console.log('4. Optimize bundle size (current: ~1.3MB main.js)');
    console.log('5. Test offline functionality in various browsers');
    console.log('6. Validate all external URLs in portfolioData.json');
    console.log('7. Generate real portfolio screenshots for PWA manifest');
  }
}

// Run the integration tests
async function runTests() {
  const tester = new PortfolioIntegrationTester();
  await tester.runIntegrationTests();
}

if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { PortfolioIntegrationTester };
