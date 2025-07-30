@echo off
REM Production Build Script for Portfolio (Windows)
REM This script creates optimized builds for both portfolio versions

echo 🚀 Building Kai Tran's Professional Portfolio...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist build rmdir /s /q build
if exist dist rmdir /s /q dist

REM Install dependencies
echo 📦 Installing dependencies...
npm ci

REM Copy assets
echo 🖼️  Copying portfolio assets...
npm run copy-assets

REM Build for production
echo 🔨 Building production version...
npm run build

REM Create deployable versions
echo 📄 Creating deployment packages...

REM Create directories
mkdir dist\simple
mkdir dist\full

REM Copy build files
xcopy build\* dist\full\ /e /i /h
xcopy build\* dist\simple\ /e /i /h

REM Create deployment info
echo { > dist\deployment-info.json
echo   "buildDate": "%date% %time%", >> dist\deployment-info.json
echo   "version": "1.0.0", >> dist\deployment-info.json
echo   "author": "Kai Tran", >> dist\deployment-info.json
echo   "purpose": "OJT Portfolio - Fall 2025", >> dist\deployment-info.json
echo   "urls": { >> dist\deployment-info.json
echo     "full": "Full interactive portfolio with all features", >> dist\deployment-info.json
echo     "simple": "Simple, clean version for HR and quick reviews" >> dist\deployment-info.json
echo   }, >> dist\deployment-info.json
echo   "techStack": [ >> dist\deployment-info.json
echo     "React 19", >> dist\deployment-info.json
echo     "TypeScript", >> dist\deployment-info.json
echo     "Styled Components", >> dist\deployment-info.json
echo     "React Grid Layout", >> dist\deployment-info.json
echo     "Three.js" >> dist\deployment-info.json
echo   ] >> dist\deployment-info.json
echo } >> dist\deployment-info.json

echo ✅ Build complete!
echo.
echo 📁 Distribution files:
echo    • dist\full\ - Complete interactive portfolio
echo    • dist\simple\ - Simple HR-friendly version
echo.
echo 🌐 Ready for deployment to any static hosting service!

pause
