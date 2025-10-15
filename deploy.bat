@echo off
REM ImageOptimizer Vercel Deployment Script for Windows
REM Run this script to automatically prepare and deploy your project

echo 🚀 Starting ImageOptimizer Deployment to Vercel...

REM Step 1: Check if git is initialized
echo [INFO] Checking git repository...
if not exist ".git" (
    echo [INFO] Initializing git repository...
    git init
    echo [SUCCESS] Git repository initialized
) else (
    echo [SUCCESS] Git repository already exists
)

REM Step 2: Install dependencies
echo [INFO] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully

REM Step 3: Run build test
echo [INFO] Testing build...
npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build test failed. Please fix errors before deploying
    pause
    exit /b 1
)
echo [SUCCESS] Build test passed

REM Step 4: Add all files to git
echo [INFO] Adding files to git...
git add .
echo [SUCCESS] Files added to git

REM Step 5: Create commit
echo [INFO] Creating commit...
git commit -m "Deploy: Ready for Vercel deployment - %date% %time%"

REM Step 6: Check if remote exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] No GitHub remote found. Please add your GitHub repository:
    echo git remote add origin https://github.com/yourusername/imageoptimizer.git
    echo git branch -M main
    echo git push -u origin main
    pause
    exit /b 1
)

REM Step 7: Push to GitHub
echo [INFO] Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] Failed to push to GitHub. Please check your GitHub credentials
    pause
    exit /b 1
)
echo [SUCCESS] Code pushed to GitHub successfully

REM Step 8: Final instructions
echo.
echo 🎉 Deployment preparation complete!
echo.
echo Next steps:
echo 1. Go to https://vercel.com
echo 2. Sign up with GitHub
echo 3. Click 'New Project'
echo 4. Import your 'imageoptimizer' repository
echo 5. Click 'Deploy'
echo.
echo Your site will be live at: https://your-project-name.vercel.app
echo.
echo Need help? Check VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions
echo.
pause
