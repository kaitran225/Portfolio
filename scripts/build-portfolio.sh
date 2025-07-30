#!/bin/bash
# Production Build Script for Portfolio
# This script creates optimized builds for both portfolio versions

echo "🚀 Building Kai Tran's Professional Portfolio..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Copy assets
echo "🖼️  Copying portfolio assets..."
npm run copy-assets

# Build for production
echo "🔨 Building production version..."
npm run build

# Create deployable versions
echo "📄 Creating deployment packages..."

# Create simple version
mkdir -p dist/simple
mkdir -p dist/full

# Copy build files
cp -r build/* dist/full/
cp -r build/* dist/simple/

# Modify simple version index.html to load simple view by default
sed -i 's/<\/title>/<\/title><script>window.history.replaceState({}, "", "?view=simple");<\/script>/' dist/simple/index.html

# Create deployment info
cat > dist/deployment-info.json << EOF
{
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "author": "Kai Tran",
  "purpose": "OJT Portfolio - Fall 2025",
  "urls": {
    "full": "Full interactive portfolio with all features",
    "simple": "Simple, clean version for HR and quick reviews"
  },
  "techStack": [
    "React 19",
    "TypeScript",
    "Styled Components", 
    "React Grid Layout",
    "Three.js"
  ]
}
EOF

# Create ZIP packages for easy distribution
echo "📦 Creating distribution packages..."
cd dist/
zip -r "KaiTran-Portfolio-Full.zip" full/
zip -r "KaiTran-Portfolio-Simple.zip" simple/
cd ..

echo "✅ Build complete!"
echo ""
echo "📁 Distribution files:"
echo "   • dist/full/ - Complete interactive portfolio"
echo "   • dist/simple/ - Simple HR-friendly version"  
echo "   • dist/KaiTran-Portfolio-Full.zip"
echo "   • dist/KaiTran-Portfolio-Simple.zip"
echo ""
echo "🌐 Ready for deployment to any static hosting service!"
