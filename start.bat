@echo off
echo 💕 Starting Cute Couple App... 💕

echo.
echo 🔧 Starting backend server...
start "Backend Server" cmd /k "cd /d d:\vedss\cute-couple-app\backend && npm run dev"

echo 🎨 Starting frontend server...
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd /d d:\vedss\cute-couple-app\frontend && npm start"

echo.
echo 🎉 Both servers are starting! 🎉
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo.
echo 💡 Make sure MongoDB is running!
echo 💕 Enjoy your cute couple app! ✨
pause
