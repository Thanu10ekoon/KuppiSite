@echo off
echo ==================================
echo MongoDB Connection Troubleshooter
echo ==================================
echo.

:menu
echo Choose an option:
echo 1. Test MongoDB Connection
echo 2. Configure Local MongoDB Environment
echo 3. View Atlas Connection String Format
echo 4. Check IP Whitelist Instructions
echo 5. Exit
echo.
set /p option="Enter option number: "

if "%option%"=="1" goto test_connection
if "%option%"=="2" goto configure_env
if "%option%"=="3" goto show_format
if "%option%"=="4" goto ip_whitelist
if "%option%"=="5" goto end
goto menu

:test_connection
echo.
echo Testing MongoDB connection...
cd server
node test-mongodb-connection.js
cd ..
pause
goto menu

:configure_env
echo.
echo This will create a .env file in your server directory.
set /p mongo_uri="Enter your MongoDB URI: "
set /p jwt_secret="Enter a JWT Secret (or press Enter for random): "

if "%jwt_secret%"=="" (
  echo Using random JWT secret
  set jwt_secret=%RANDOM%%RANDOM%%RANDOM%
)

echo Creating .env file...
(
echo MONGODB_URI=%mongo_uri%
echo JWT_SECRET=%jwt_secret%
echo JWT_EXPIRE=30d
echo CORS_ORIGIN=http://localhost:3000,https://kuppisite.vercel.app,https://kuppi-site.vercel.app
) > server\.env

echo Environment file created at server\.env
pause
goto menu

:show_format
echo.
echo MongoDB Atlas Connection String Format:
echo.
echo mongodb+srv://username:password@cluster-name.mongodb.net/database-name?retryWrites=true^&w=majority
echo.
echo Important parts:
echo - username: Your MongoDB Atlas database user
echo - password: Your database user's password
echo - cluster-name: The name of your cluster
echo - database-name: The name of your database
echo.
echo Special character handling:
echo - If your password contains special characters, they need to be URL encoded
echo - For example, @ becomes %%40, # becomes %%23
echo.
pause
goto menu

:ip_whitelist
echo.
echo MongoDB Atlas IP Whitelist Instructions:
echo.
echo 1. Log in to your MongoDB Atlas account
echo 2. Select your project
echo 3. Go to Network Access in the left sidebar
echo 4. Click "ADD IP ADDRESS"
echo 5. Click "ALLOW ACCESS FROM ANYWHERE" (adds 0.0.0.0/0 to your whitelist)
echo 6. Click "Confirm"
echo.
echo This allows connections from Vercel's serverless functions.
echo.
pause
goto menu

:end
echo.
echo Thank you for using the MongoDB Connection Troubleshooter!
echo.
