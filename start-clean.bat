@echo off
REM Wrapper script to suppress webpack dev server deprecation warnings
cd /d "%~dp0"
npm run start:silent 2>&1 | findstr /v "DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE" | findstr /v "DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE"
