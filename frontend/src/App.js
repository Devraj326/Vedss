import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import io from 'socket.io-client';
import { 
  Camera, 
  Calendar, 
  BookOpen, 
  Heart, 
  StickyNote,
  Bell,
  Sparkles
} from 'lucide-react';

// Import pages
import PhotoGallery from './pages/PhotoGallery';
import CalendarPage from './pages/CalendarPage';
import StudyPage from './pages/StudyPage';
import NotesPage from './pages/NotesPage';
import HomePage from './pages/HomePage';

import './App.css';

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:5000');

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Listen for sweet reminders
    socket.on('sweetReminder', (data) => {
      toast(data.message, {
        icon: '💕',
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)',
          color: '#333',
          fontWeight: '500',
          border: '2px solid #FF69B4',
          borderRadius: '20px',
        },
      });
      setNotifications(prev => [...prev, data]);
    });

    // Listen for event reminders
    socket.on('eventReminder', (data) => {
      toast(data.message, {
        icon: '🎉',
        duration: 6000,
        style: {
          background: 'linear-gradient(135deg, #FFE4E6, #FFF0F5)',
          color: '#333',
          fontWeight: '500',
          border: '2px solid #FF1493',
          borderRadius: '20px',
        },
      });
      setNotifications(prev => [...prev, data]);
    });

    return () => {
      socket.off('sweetReminder');
      socket.off('eventReminder');
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Toaster position="top-right" />
        
        {/* Header */}
        <header className="app-header">
          <div className="header-content">
            <motion.div 
              className="logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <Heart className="logo-icon" />
              <span>Our Cute App</span>
              <Sparkles className="sparkle" />
            </motion.div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="nav-bar">
          <div className="nav-container">
            <NavLink to="/" className="nav-link">
              <Heart size={20} />
              <span>Home</span>
            </NavLink>
            <NavLink to="/photos" className="nav-link">
              <Camera size={20} />
              <span>Photos</span>
            </NavLink>
            <NavLink to="/calendar" className="nav-link">
              <Calendar size={20} />
              <span>Calendar</span>
            </NavLink>
            <NavLink to="/study" className="nav-link">
              <BookOpen size={20} />
              <span>Study</span>
            </NavLink>
            <NavLink to="/notes" className="nav-link">
              <StickyNote size={20} />
              <span>Notes</span>
            </NavLink>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/photos" element={<PhotoGallery />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/notes" element={<NotesPage />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* Floating Action Button for Notifications */}
        {notifications.length > 0 && (
          <motion.div 
            className="notification-fab"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Bell size={20} />
            <span className="notification-count">{notifications.length}</span>
          </motion.div>
        )}
      </div>
    </Router>
  );
}

export default App;
