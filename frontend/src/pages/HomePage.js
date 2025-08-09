import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Camera, Calendar, BookOpen, StickyNote, Sparkles, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: <Camera size={40} />,
      title: "Photo Gallery",
      description: "Upload and share your beautiful memories together 📸",
      link: "/photos",
      color: "linear-gradient(135deg, #FF6B9D, #FF8E9B)"
    },
    {
      icon: <Calendar size={40} />,
      title: "Our Calendar",
      description: "Never miss important dates and sweet reminders 📅",
      link: "/calendar",
      color: "linear-gradient(135deg, #A8E6CF, #7FCDCD)"
    },
    {
      icon: <BookOpen size={40} />,
      title: "Study Together",
      description: "Stay motivated with study tools and timers 📚",
      link: "/study",
      color: "linear-gradient(135deg, #FFD93D, #6BCF7F)"
    },
    {
      icon: <StickyNote size={40} />,
      title: "Love Notes",
      description: "Write sweet notes and memories for each other 💕",
      link: "/notes",
      color: "linear-gradient(135deg, #C7CEEA, #B19CD9)"
    }
  ];

  const sweetMessages = [
    "Good morning, beautiful! Have an amazing day! ☀️💕",
    "Remember to drink water and take care of yourself! 💧✨",
    "You're doing great with your studies! Keep it up! 📚💪",
    "Don't forget how amazing and loved you are! 🥰💖",
    "Take a break and stretch - you deserve it! 🤗🌸"
  ];

  const todayMessage = sweetMessages[new Date().getDay() % sweetMessages.length];

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Heart size={60} style={{ color: '#FF1493', marginBottom: '1rem' }} />
        </motion.div>
        
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to Our Cute App! 💕
        </motion.h1>
        
        <motion.p 
          style={{ 
            fontSize: '1.2rem', 
            color: '#666', 
            maxWidth: '600px', 
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          A special place for us to share memories, plan our future, and support each other's dreams ✨
        </motion.p>
      </div>

      {/* Daily Sweet Message */}
      <motion.div 
        style={{
          background: 'linear-gradient(135deg, #FFE4E6, #FFF0F5)',
          border: '2px solid #FFB6C1',
          borderRadius: '20px',
          padding: '2rem',
          textAlign: 'center',
          marginBottom: '3rem',
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
      >
        <Sparkles 
          size={30} 
          style={{ 
            position: 'absolute', 
            top: '1rem', 
            right: '1rem', 
            color: '#FFD700',
            animation: 'sparkle 3s ease-in-out infinite'
          }} 
        />
        <h3 style={{ color: '#FF1493', marginBottom: '1rem', fontSize: '1.5rem' }}>
          💝 Today's Sweet Message
        </h3>
        <p style={{ fontSize: '1.1rem', color: '#333', fontWeight: '500' }}>
          {todayMessage}
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-2" style={{ gap: '2rem' }}>
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to={feature.link} 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div 
                className="card"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7)), ${feature.color}`,
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ color: 'white', marginBottom: '1rem' }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#333'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#666', 
                  lineHeight: '1.5',
                  fontSize: '1rem'
                }}>
                  {feature.description}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <motion.div 
        style={{
          marginTop: '3rem',
          padding: '2rem',
          background: 'linear-gradient(135deg, #F0F8FF, #E6E6FA)',
          borderRadius: '20px',
          border: '2px solid rgba(255, 182, 193, 0.3)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <h3 style={{ 
          textAlign: 'center', 
          marginBottom: '2rem', 
          color: '#FF1493',
          fontSize: '1.5rem',
          fontWeight: '700'
        }}>
          🎯 Quick Actions
        </h3>
        
        <div className="grid grid-4" style={{ gap: '1rem' }}>
          <motion.button 
            className="btn btn-primary"
            style={{ justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gift size={20} />
            Add Memory
          </motion.button>
          
          <motion.button 
            className="btn btn-secondary"
            style={{ justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={20} />
            New Event
          </motion.button>
          
          <motion.button 
            className="btn btn-outline"
            style={{ justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen size={20} />
            Study Timer
          </motion.button>
          
          <motion.button 
            className="btn btn-primary"
            style={{ justifyContent: 'center' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StickyNote size={20} />
            Love Note
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
