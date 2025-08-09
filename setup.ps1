# 🚀 Quick Setup Script for Cute Couple App

Write-Host "💕 Welcome to the Cute Couple App Setup! 💕" -ForegroundColor Magenta

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is available
Write-Host "`n🍃 Checking MongoDB..." -ForegroundColor Cyan
Write-Host "💡 Make sure MongoDB is installed and running, or use MongoDB Atlas" -ForegroundColor Yellow

# Setup Backend
Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Cyan
Set-Location backend

Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies!" -ForegroundColor Red
    exit 1
}

# Setup Frontend
Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Cyan
Set-Location ../frontend

Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies!" -ForegroundColor Red
    exit 1
}

# Return to root directory
Set-Location ..

Write-Host "`n🎉 Setup Complete! 🎉" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start MongoDB (if running locally):" -ForegroundColor White
Write-Host "   mongod" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. In a new terminal, start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm start" -ForegroundColor Gray
Write-Host ""
Write-Host "📱 The app will be available at http://localhost:3000" -ForegroundColor Magenta
Write-Host "🔧 The API will be available at http://localhost:5000" -ForegroundColor Magenta
Write-Host ""
Write-Host "💕 Enjoy your cute couple app! ✨" -ForegroundColor Magenta
