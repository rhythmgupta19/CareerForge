@echo off
echo ==========================================
echo    Testing CareerForge Database Connection
echo ==========================================
cd backend
echo.
echo Attempting to connect to MongoDB Atlas...
echo.
node -e "import('mongoose').then(m => m.default.connect('mongodb+srv://ridamg636_db_user:uGz2lWdWufbmyDJP@cluster0.rvmnqi4.mongodb.net/?appName=Cluster0').then(() => { console.log('=========================================='); console.log('✅ SUCCESS: Database is working perfectly!'); console.log('Your IP address is correctly whitelisted.'); console.log('=========================================='); process.exit(0); }).catch(err => { console.log('=========================================='); console.log('❌ ERROR: Database connection failed.'); console.log('Reason: ' + err.message); console.log('Please ensure you clicked ALLOW ACCESS FROM ANYWHERE in MongoDB Atlas.'); console.log('=========================================='); process.exit(1); }));"
echo.
pause
