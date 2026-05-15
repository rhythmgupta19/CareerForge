@echo off
echo ==========================================
echo    Starting CareerForge Frontend Setup
echo ==========================================
cd frontend
echo.
echo Installing dependencies (this might take a minute)...
call npm install --legacy-peer-deps
echo.
echo Starting the web app...
call npm run dev
pause
