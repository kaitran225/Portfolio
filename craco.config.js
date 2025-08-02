const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Suppress webpack dev server deprecation warnings
      if (webpackConfig.devServer) {
        webpackConfig.devServer.setupMiddlewares = undefined;
        
        // Use the new setupMiddlewares option instead
        webpackConfig.devServer.setupMiddlewares = (middlewares, devServer) => {
          return middlewares;
        };
      }

      // Optimize chunks for better caching and loading
      if (env === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            cacheGroups: {
              // Vendor libraries chunk
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
                reuseExistingChunk: true,
                chunks: 'all',
              },
              // React and related libraries
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/,
                name: 'react-vendor',
                priority: 20,
                reuseExistingChunk: true,
                chunks: 'all',
              },
              // Material-UI and emotion
              mui: {
                test: /[\\/]node_modules[\\/](@mui|@emotion)[\\/]/,
                name: 'mui-vendor',
                priority: 20,
                reuseExistingChunk: true,
                chunks: 'all',
              },
              // Framer Motion (heavy animation library)
              framerMotion: {
                test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
                name: 'framer-motion',
                priority: 30,
                reuseExistingChunk: true,
                chunks: 'all',
              },
              // Styled Components
              styledComponents: {
                test: /[\\/]node_modules[\\/]styled-components[\\/]/,
                name: 'styled-components',
                priority: 20,
                reuseExistingChunk: true,
                chunks: 'all',
              },
              // Large components chunk
              components: {
                test: /[\\/]src[\\/]components[\\/](DevProjectPage|DesignProjectPage|SkillsVisualization|EnhancedHeroSection)[\\/]/,
                name: 'large-components',
                priority: 15,
                reuseExistingChunk: true,
                chunks: 'all',
                minSize: 40000,
              },
              // Common components
              common: {
                name: 'common',
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
                chunks: 'all',
              },
            },
          },
        };

        // Enable tree shaking optimizations
        webpackConfig.optimization.usedExports = true;
        webpackConfig.optimization.sideEffects = false;

        // Add module concatenation (scope hoisting)
        webpackConfig.optimization.concatenateModules = true;

        // Optimize module IDs for better caching
        webpackConfig.optimization.moduleIds = 'deterministic';
        webpackConfig.optimization.chunkIds = 'deterministic';
      }
      
      return webpackConfig;
    },
  },
  
  // Additional CRACO configurations
  babel: {
    plugins: [
      // Remove console.log in production
      process.env.NODE_ENV === 'production' ? 'babel-plugin-transform-remove-console' : null,
    ].filter(Boolean),
  },
  
  devServer: {
    // Additional dev server configuration
    client: {
      overlay: {
        warnings: false,
        errors: true,
      },
    },
  },
};
