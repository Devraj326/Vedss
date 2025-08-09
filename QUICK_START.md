# 💕 Cute Couple App - Quick Start Guide

## 🎉 Your app is ready to use!

### 🚀 Quick Start (Easiest Way)

**Option 1: Double-click the start.bat file**
- Simply double-click `start.bat` in the root folder
- This will open both backend and frontend servers automatically

**Option 2: Use PowerShell**
```powershell
# Navigate to the app folder
cd "d:\vedss\cute-couple-app"

# Run the start script
.\start.ps1
```

### 🔧 Manual Start (If you prefer)

**Step 1: Start MongoDB**
- If using local MongoDB: Run `mongod` in terminal
- If using MongoDB Atlas: Make sure your connection string is in `.env`

**Step 2: Start Backend Server**
```powershell
cd "d:\vedss\cute-couple-app\backend"
npm run dev
```

**Step 3: Start Frontend (in a new terminal)**
```powershell
cd "d:\vedss\cute-couple-app\frontend"
npm start
```

### 🌐 Access Your App

- **Frontend (Your App)**: http://localhost:3000
- **Backend API**: http://localhost:5000

### 📱 App Features

#### 🏠 Home Page
- Sweet daily messages
- Quick access to all features
- Beautiful animations

#### 📸 Photo Gallery
- Upload photos with drag & drop
- Add titles and descriptions
- Search and filter photos
- View photos in fullscreen

#### 📅 Calendar
- Add special dates and events
- Set reminders for important occasions
- Different event types (dates, anniversaries, birthdays, study)
- View upcoming events

#### 📚 Study Tools
- Create study tasks and assignments
- Pomodoro timer (25min work, 5min break)
- Custom study timers
- Track progress and priorities

#### 📝 Love Notes
- Write sweet notes for each other
- Different note types and colors
- Add mood emojis
- Tag and organize notes
- Pin important notes

#### 🔔 Sweet Notifications
- Automatic reminders to drink water, take breaks
- Event notifications
- Study encouragement messages

### 💡 Tips for Using the App

1. **Upload Photos**: Drag and drop photos in the gallery section
2. **Add Events**: Use the calendar to add important dates
3. **Study Together**: Use the study tools to stay motivated
4. **Write Notes**: Leave sweet messages for each other
5. **Stay Hydrated**: The app will remind you to drink water! 💧

### 🎨 Customization

The app uses a beautiful pink and pastel color scheme with:
- Smooth animations
- Glass morphism effects
- Responsive design for mobile and desktop
- Cute icons and emojis

### ⚠️ Important Notes

1. **MongoDB**: Make sure MongoDB is running before starting the app
2. **Ports**: The app uses ports 3000 (frontend) and 5000 (backend)
3. **File Uploads**: Photos are stored in the `backend/uploads` folder
4. **Data**: All your data is stored in MongoDB

### 🆘 Troubleshooting

**If the app doesn't start:**
1. Make sure Node.js is installed: `node --version`
2. Make sure MongoDB is running
3. Check if ports 3000 and 5000 are available
4. Try running `npm install` in both frontend and backend folders

**If photos don't upload:**
1. Check file size (max 10MB)
2. Make sure the uploads folder exists in backend
3. Check file format (PNG, JPG, JPEG, GIF, WebP)

### 💕 Enjoy Your App!

This app is designed with love to help couples:
- 📸 Preserve beautiful memories
- 📅 Never miss important dates
- 📚 Support each other's goals
- 💝 Express love through notes
- 🌟 Stay motivated together

**Have fun using your cute couple app! ✨💕**
