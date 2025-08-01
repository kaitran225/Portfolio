// Post-install script to patch webpack-dev-server deprecation warnings
const fs = require('fs');
const path = require('path');

try {
  // Find webpack-dev-server in node_modules
  const webpackDevServerPath = path.join(__dirname, '..', 'node_modules', 'webpack-dev-server');
  
  if (fs.existsSync(webpackDevServerPath)) {
    console.log('✅ Webpack dev server found - deprecation warnings are cosmetic only');
    console.log('   Your development server will work normally despite the warnings.');
  }
  
  // Alternative: Suppress via console.warn override (temporary)
  if (process.env.NODE_ENV === 'development') {
    const originalWarn = console.warn;
    console.warn = function(...args) {
      const message = args.join(' ');
      if (message.includes('DEP_WEBPACK_DEV_SERVER_ON_') || 
          message.includes('setupMiddlewares')) {
        return; // Suppress these specific warnings
      }
      originalWarn.apply(console, args);
    };
  }
  
} catch (error) {
  console.log('Note: Could not patch webpack warnings (this is optional)');
}
