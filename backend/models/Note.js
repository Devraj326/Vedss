const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['love-note', 'study-note', 'reminder', 'memory', 'other'],
    default: 'other'
  },
  tags: [{
    type: String
  }],
  color: {
    type: String,
    default: '#FFB6C1' // Light pink
  },
  pinned: {
    type: Boolean,
    default: false
  },
  mood: {
    type: String,
    enum: ['happy', 'love', 'excited', 'calm', 'motivated', 'grateful', 'other'],
    default: 'happy'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);
