module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress webpack dev server deprecation warnings
      if (webpackConfig.devServer) {
        webpackConfig.devServer.setupMiddlewares = undefined;
        
        // Use the new setupMiddlewares option instead
        webpackConfig.devServer.setupMiddlewares = (middlewares, devServer) => {
          return middlewares;
        };
      }
      
      return webpackConfig;
    },
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
