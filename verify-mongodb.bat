@echo off
echo =================================================
echo MongoDB Connection Verifier for KuppiSite
echo =================================================
echo.

REM Check if node is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Error: Node.js is required but not found.
  echo Please install Node.js from https://nodejs.org/
  exit /b 1
)

echo Testing MongoDB connection...
echo.

cd server

REM Check if server folder exists
if not exist test-mongodb-connection.js (
  echo Error: Cannot find test-mongodb-connection.js in the server folder.
  exit /b 1
)

REM Run the MongoDB connection test script
node test-mongodb-connection.js

REM Verify deployment if specified
if "%1"=="--prod" (
  echo.
  echo Testing MongoDB connection in production...
  node verify-mongodb-deployment.js
)

echo.
echo =================================================
echo.
echo If you're experiencing MongoDB connection issues in Vercel:
echo.
echo 1. Ensure your MongoDB Atlas IP access list includes 0.0.0.0/0
echo 2. Verify your connection string is properly set in Vercel env vars
echo 3. Check that your MongoDB Atlas user has correct permissions
echo 4. Verify your Atlas cluster is running (not paused)
echo.
echo For more help, see MONGODB_ATLAS_CONFIG.md
echo =================================================
