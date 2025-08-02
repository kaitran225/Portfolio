# Use Node.js 18 Alpine for smaller image size (perfect for Render.com free tier)
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps for React 19 compatibility
RUN npm ci --only=production --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - Use nginx alpine for serving static files
FROM nginx:1.25-alpine

# Copy built application to nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration for single-page application
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check for Render.com
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
