# 🚀 Start Cute Couple App

Write-Host "💕 Starting Cute Couple App... 💕" -ForegroundColor Magenta

# Start backend server in background
Write-Host "`n🔧 Starting backend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\vedss\cute-couple-app\backend'; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🎨 Starting frontend server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\vedss\cute-couple-app\frontend'; npm start"

Write-Host "`n🎉 Both servers are starting! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Magenta
Write-Host "🔧 Backend API: http://localhost:5000" -ForegroundColor Magenta
Write-Host ""
Write-Host "💡 Make sure MongoDB is running!" -ForegroundColor Yellow
Write-Host "💕 Enjoy your cute couple app! ✨" -ForegroundColor Magenta
