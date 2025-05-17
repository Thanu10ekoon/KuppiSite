@echo off
echo ======================================
echo KuppiSite Deployment Helper
echo ======================================
echo.
echo This script will help you deploy the KuppiSite application to Vercel
echo.
echo Step 1: Committing changes to git
echo ---------------------------------------
git add .
git commit -m "Fix ESLint issues and prepare for deployment"
git push

echo.
echo Step 2: Deploying the application
echo ---------------------------------------
echo Client deployment instructions:
echo 1. Go to Vercel dashboard
echo 2. Import your repository
echo 3. Set Root Directory to 'client'
echo 4. Framework preset: Create React App
echo 5. Environment Variables:
echo    REACT_APP_SERVER_URL: https://kuppisite.vercel.app/api
echo.
echo Server deployment instructions:
echo 1. Go to Vercel dashboard
echo 2. Import your repository (or create a new project if you already did one)
echo 3. Set Root Directory to 'server'
echo 4. Environment Variables:
echo    MONGODB_URI: mongodb+srv://thantenthousand:KhhnM8r1t3aSSM4P@kuppisite1.ao5c8v0.mongodb.net/?retryWrites=true&w=majority&appName=KuppiSite1
echo    JWT_SECRET: 12345ajijiadv
echo    JWT_EXPIRE: 30d
echo    CORS_ORIGIN: http://localhost:3000,https://kuppi-site.vercel.app,https://kuppisite.vercel.app
echo    NODE_ENV: production
echo.
echo Step 3: Verification
echo ---------------------------------------
echo After deployment, visit:
echo - https://kuppi-site.vercel.app/debug (or your actual client URL)
echo - Check that API connectivity works
echo - Test registration and login
echo.
echo For detailed verification steps, see DEPLOYMENT_VERIFICATION.md
echo.
pause
