@echo off
echo ================================
echo KuppiSite Deployment Helper
echo ================================
echo.

echo This script will help you deploy KuppiSite to Vercel with the correct settings.
echo.

:menu
echo Select an option:
echo 1. Test MongoDB Connection
echo 2. Check Environment Variables
echo 3. Push to GitHub
echo 4. View Deployment Instructions
echo 5. Exit
echo.
set /p option="Enter option number: "

if "%option%"=="1" goto test_mongodb
if "%option%"=="2" goto check_env
if "%option%"=="3" goto push_github
if "%option%"=="4" goto view_instructions
if "%option%"=="5" goto end
goto menu

:test_mongodb
echo.
echo Testing MongoDB connection...
cd server
node test-mongodb-connection.js
cd ..
echo.
pause
goto menu

:check_env
echo.
echo === Client Environment Variables ===
if exist client\.env.local (
  echo [CLIENT] .env.local exists:
  type client\.env.local
) else (
  echo [WARNING] client\.env.local not found!
)
echo.
if exist client\.env.production (
  echo [CLIENT] .env.production exists:
  type client\.env.production
) else (
  echo [WARNING] client\.env.production not found!
)
echo.
echo === Server Environment Variables ===
if exist server\.env (
  echo [SERVER] .env exists:
  type server\.env
) else (
  echo [WARNING] server\.env not found!
)
echo.
echo NOTE: Remember to set these environment variables in Vercel dashboard:
echo - Server: MONGODB_URI, JWT_SECRET, JWT_EXPIRE, CORS_ORIGIN
echo - Client: REACT_APP_SERVER_URL
echo.
pause
goto menu

:push_github
echo.
set /p branch="Enter branch name to push (default: deployment): "
if "%branch%"=="" set branch=deployment
echo Pushing to GitHub on branch: %branch%
git checkout %branch%
git add .
set /p message="Enter commit message: "
git commit -m "%message%"
git push origin %branch%
echo.
echo Don't forget to deploy to Vercel after pushing!
echo.
pause
goto menu

:view_instructions
echo.
echo Opening deployment instructions...
start "" "VERCEL_DEPLOYMENT_STEPS.md"
echo.
pause
goto menu

:end
echo.
echo Thanks for using the KuppiSite Deployment Helper!
echo.
