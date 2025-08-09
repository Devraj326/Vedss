# 💕 Cute Couple App

A beautiful and feature-rich React application designed for couples to share memories, plan events, and support each other's goals. Built with love and attention to detail! ✨

## 🌟 Features

### 📸 Photo Gallery
- Upload and organize beautiful memories together
- Drag & drop photo uploads
- Photo filtering and search
- Full-screen photo viewer
- Download and delete photos

### 📅 Calendar & Events
- Interactive calendar with event visualization
- Add special dates, anniversaries, study sessions
- Event reminders and notifications
- Recurring events support
- Different event types with color coding

### 📚 Study Tools
- Task management for assignments and projects
- Pomodoro timer for focused study sessions
- Custom study timers
- Progress tracking
- Priority levels and due dates

### 📝 Love Notes & Memories
- Write and save sweet notes for each other
- Different note types (love notes, study notes, reminders, memories)
- Mood tracking with emojis
- Color-coded notes
- Tag system for organization
- Pin important notes

### 🔔 Sweet Reminders
- Automatic reminders to drink water, take breaks, etc.
- Event notifications
- Real-time notifications via WebSocket
- Cute motivational messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router** - Navigation
- **Framer Motion** - Beautiful animations
- **Styled Components** - CSS-in-JS styling
- **Socket.io Client** - Real-time notifications
- **React Calendar** - Calendar component
- **React Dropzone** - File uploads
- **React Hot Toast** - Notifications
- **Lucide React** - Beautiful icons
- **Axios** - HTTP requests

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB & Mongoose** - Database
- **Socket.io** - Real-time communication
- **Multer** - File uploads
- **Node Cron** - Scheduled tasks
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   cd cute-couple-app
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/cute-couple-app
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on http://localhost:5000

3. **Start the frontend (in a new terminal)**
   ```bash
   cd frontend
   npm start
   ```
   The frontend will run on http://localhost:3000

## 📱 Features Overview

### Home Page
- Welcome message with daily sweet reminders
- Quick access to all features
- Beautiful gradient design with animations

### Photo Gallery
- Upload photos with titles and descriptions
- Grid and list view modes
- Search and filter capabilities
- Responsive image gallery

### Calendar
- Monthly calendar view with event indicators
- Add/edit/delete events
- Different event types (dates, anniversaries, birthdays, study, reminders)
- Upcoming events preview

### Study Tools
- Task management with priorities
- Pomodoro timer (25min work, 5min break)
- Custom timers
- Progress tracking
- Statistics dashboard

### Notes
- Colorful sticky notes interface
- Different note types and moods
- Tag system for organization
- Pin important notes
- Search and filter functionality

## 🎨 Design Features

- **Cute pastel color scheme** with pink, lavender, and soft gradients
- **Smooth animations** powered by Framer Motion
- **Responsive design** that works on desktop and mobile
- **Beautiful icons** from Lucide React
- **Glass morphism effects** for modern UI
- **Hover and interaction effects** for better UX

## 🔔 Notification System

The app includes a real-time notification system that sends:
- **Sweet reminders** every 2 hours (drink water, take breaks, etc.)
- **Event reminders** 1 hour before scheduled events
- **Study encouragement** and motivational messages
- **Task completion celebrations**

## 🛡️ Data Models

### Photo
- Title, description, filename
- Upload date, file size
- Tags and favorites
- File path and metadata

### Event
- Title, description, date, time
- Event type and priority
- Recurring settings
- Notification status

### Study Item
- Title, description, type, subject
- Due date, priority, progress
- Time tracking
- Resources and flashcards

### Note
- Title, content, type
- Tags, color, mood
- Pin status
- Creation and update dates

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or your preferred MongoDB hosting
2. Configure environment variables for production
3. Deploy to Heroku, Vercel, or your preferred platform

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to Netlify, Vercel, or your preferred static hosting

## 🤝 Contributing

This is a personal project, but feel free to fork it and customize it for your own relationship! 💕

## 📝 License

This project is open source and available under the MIT License.

## 💖 Made with Love

Created with lots of love and attention to detail for an amazing relationship! Every feature is designed to bring couples closer together and support each other's dreams and goals.

---

**Enjoy using your cute couple app! 💕✨**
