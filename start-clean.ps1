# PowerShell script to start the dev server with filtered output
$env:NODE_OPTIONS = "--max-old-space-size=8192 --no-warnings"
npm start 2>&1 | Where-Object { 
    $_ -notmatch "DEP_WEBPACK_DEV_SERVER_ON_AFTER_SETUP_MIDDLEWARE" -and 
    $_ -notmatch "DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE" 
}
