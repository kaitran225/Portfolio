@echo off
echo Starting Portfolio Development Server...
echo.
echo Note: Webpack deprecation warnings are cosmetic and can be ignored.
echo Your application will work perfectly despite these warnings.
echo.
set NODE_OPTIONS=--max-old-space-size=8192
set NODE_NO_WARNINGS=1
npm start
