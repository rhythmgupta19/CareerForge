@echo off
echo ==========================================
echo    Pushing CareerForge to GitHub
echo ==========================================

echo.
echo Initializing Git repository...
git init

echo.
echo Adding all files (except node_modules and .env)...
git add .

echo.
echo Committing files...
git commit -m "Initial commit of CareerForge full-stack app"

echo.
echo Setting main branch...
git branch -M main

echo.
echo Linking to GitHub repository...
git remote add origin https://github.com/rhythmgupta19/CareerForge.git

echo.
echo Pushing code to GitHub...
git push -u origin main --force

echo.
echo Successfully pushed to GitHub!
pause
