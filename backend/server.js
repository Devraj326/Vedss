const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://vedss-v0.vercel.app",
      "https://vedss-v0-czqbx0opq-devraj326s-projects.vercel.app",
      /^https:\/\/.*\.vercel\.app$/
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://vedss-v0.vercel.app",
    "https://vedss-v0-czqbx0opq-devraj326s-projects.vercel.app",
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// MongoDB connection with better error handling
let isDBConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cute-couple-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('💕 Connected to MongoDB successfully!');
    isDBConnected = true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Quick Fix Options:');
    console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('2. Use MongoDB Atlas (Free): https://www.mongodb.com/atlas');
    console.log('3. Update MONGODB_URI in .env file with your connection string');
    console.log('4. See MONGODB_SETUP.md for detailed instructions');
    console.log('\n💡 App will continue running with limited functionality...');
    console.log('📱 Frontend will still work for testing the UI!');
    isDBConnected = false;
  }
};

connectDB();

mongoose.connection.on('connected', () => {
  console.log('💕 MongoDB connection established');
  isDBConnected = true;
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
  isDBConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('💔 MongoDB disconnected');
  isDBConnected = false;
});

// Middleware to check DB connection
const checkDB = (req, res, next) => {
  if (!isDBConnected) {
    return res.status(503).json({ 
      error: 'Database not connected', 
      message: 'Please set up MongoDB. See MONGODB_SETUP.md for instructions.' 
    });
  }
  next();
};

// Import models
const Photo = require('./models/Photo');
const Event = require('./models/Event');
const StudyItem = require('./models/StudyItem');
const Note = require('./models/Note');

// Multer configuration for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('💕 User connected');
  
  socket.on('disconnect', () => {
    console.log('💔 User disconnected');
  });
});

// Routes

// Health check endpoint (works without DB)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running! 💕', 
    database: isDBConnected ? 'Connected 🟢' : 'Not Connected 🔴',
    message: isDBConnected ? 'All systems go!' : 'Please set up MongoDB for full functionality'
  });
});

// Photo routes
app.post('/api/photos/upload', checkDB, upload.single('photo'), async (req, res) => {
  try {
    const { title, description } = req.body;
    const photo = new Photo({
      title: title || 'Untitled',
      description: description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadDate: new Date()
    });
    
    await photo.save();
    res.json({ success: true, photo });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/photos', checkDB, async (req, res) => {
  try {
    const photos = await Photo.find().sort({ uploadDate: -1 });
    res.json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/photos/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (photo) {
      // Delete file from filesystem
      if (fs.existsSync(photo.path)) {
        fs.unlinkSync(photo.path);
      }
      await Photo.findByIdAndDelete(req.params.id);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Event/Calendar routes
app.post('/api/events', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/events/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Study items routes
app.post('/api/study', async (req, res) => {
  try {
    const studyItem = new StudyItem(req.body);
    await studyItem.save();
    res.json({ success: true, studyItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/study', async (req, res) => {
  try {
    const studyItems = await StudyItem.find().sort({ createdAt: -1 });
    res.json(studyItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/study/:id', async (req, res) => {
  try {
    const studyItem = await StudyItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, studyItem });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/study/:id', async (req, res) => {
  try {
    await StudyItem.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Notes routes
app.post('/api/notes', async (req, res) => {
  try {
    const note = new Note(req.body);
    await note.save();
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/notes/:id', async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, note });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Sweet reminders system
const sweetReminders = [
  "💧 Time to drink some water, beautiful! Stay hydrated! 💕",
  "🌸 Take a deep breath and smile - you're amazing! ✨",
  "📚 How's your study session going? You're doing great! 💪",
  "☀️ Don't forget to take a little break and stretch! 🤗",
  "💖 You're absolutely wonderful - just a reminder! 🥰",
  "🍎 Have you eaten something healthy today? Take care of yourself! 💝",
  "🌙 Remember to get enough sleep tonight - sweet dreams! 😴",
  "📝 Check your to-do list - you've got this! 🎯",
  "🎵 Play your favorite song and dance a little! 💃",
  "🌺 You're loved and appreciated more than you know! 💕"
];

// Send sweet reminders every 2 hours
cron.schedule('0 */2 * * *', () => {
  const randomReminder = sweetReminders[Math.floor(Math.random() * sweetReminders.length)];
  io.emit('sweetReminder', {
    message: randomReminder,
    timestamp: new Date()
  });
  console.log('💕 Sweet reminder sent:', randomReminder);
});

// Check for upcoming events and send notifications
cron.schedule('*/30 * * * *', async () => {
  try {
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    const upcomingEvents = await Event.find({
      date: {
        $gte: now,
        $lte: oneHourFromNow
      },
      notified: { $ne: true }
    });
    
    upcomingEvents.forEach(async (event) => {
      io.emit('eventReminder', {
        message: `🎉 Upcoming event: ${event.title} in 1 hour! 💕`,
        event: event,
        timestamp: new Date()
      });
      
      // Mark as notified
      event.notified = true;
      await event.save();
      
      console.log('📅 Event reminder sent:', event.title);
    });
  } catch (error) {
    console.error('Error checking events:', error);
  }
});

server.listen(PORT, () => {
  console.log(`💕 Server running on port ${PORT}`);
});
