@echo off
echo ==========================================
echo    Fixing CareerForge Environment
echo ==========================================

echo.
echo 1. Stopping all stuck Node.js servers...
taskkill /F /IM node.exe /T 2>nul

echo.
echo 2. Deleting broken frontend cache...
cd frontend
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
call npm cache clean --force

echo.
echo 3. Reinstalling frontend packages cleanly...
call npm install --legacy-peer-deps
cd ..

echo.
echo ==========================================
echo    Starting the Full-Stack App
echo ==========================================
echo Starting Backend and Frontend simultaneously...
call npm run dev
pause
