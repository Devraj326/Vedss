import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  BookOpen, 
  Clock, 
  Play, 
  Pause, 
  Square, 
  Plus,
  Edit,
  Trash2,
  X,
  CheckCircle,
  Circle,
  Target,
  Award,
  BarChart3,
  ExternalLink,
  Brain,
  Timer
} from 'lucide-react';

const StudyPage = () => {
  const [studyItems, setStudyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerTime, setTimerTime] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const [studyForm, setStudyForm] = useState({
    title: '',
    description: '',
    type: 'assignment',
    subject: '',
    priority: 'medium',
    dueDate: '',
    resources: [],
    flashcards: []
  });

  const [pomodoroSettings, setPomodoroSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessionsUntilLongBreak: 4
  });

  const [pomodoroSession, setPomodoroSession] = useState({
    currentSession: 1,
    isBreak: false,
    timeLeft: 25 * 60
  });

  const studyTypes = [
    { value: 'assignment', label: '📝 Assignment', color: '#FF6B9D' },
    { value: 'exam', label: '🎯 Exam', color: '#FF1493' },
    { value: 'project', label: '🚀 Project', color: '#6BCF7F' },
    { value: 'reading', label: '📚 Reading', color: '#A8E6CF' },
    { value: 'flashcard', label: '🃏 Flashcards', color: '#C7CEEA' },
    { value: 'note', label: '📋 Notes', color: '#FFD93D' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#A8E6CF' },
    { value: 'medium', label: 'Medium', color: '#FFD93D' },
    { value: 'high', label: 'High', color: '#FF6B9D' }
  ];

  // Fetch study items
  const fetchStudyItems = async () => {
    try {
      const response = await axios.get('/api/study');
      setStudyItems(response.data);
    } catch (error) {
      toast.error('Failed to load study items');
      console.error('Error fetching study items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudyItems();
  }, []);

  // Timer effects
  useEffect(() => {
    let interval = null;
    if (timerRunning && timerTime > 0) {
      interval = setInterval(() => {
        setTimerTime(time => time - 1);
      }, 1000);
    } else if (timerTime === 0 && timerRunning) {
      setTimerRunning(false);
      toast.success('Timer finished! Great job! 🎉');
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerTime]);

  // Pomodoro timer effect
  useEffect(() => {
    let interval = null;
    if (timerRunning && pomodoroSession.timeLeft > 0) {
      interval = setInterval(() => {
        setPomodoroSession(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (pomodoroSession.timeLeft === 0 && timerRunning) {
      handlePomodoroComplete();
    }
    return () => clearInterval(interval);
  }, [timerRunning, pomodoroSession.timeLeft]);

  const handlePomodoroComplete = () => {
    setTimerRunning(false);
    
    if (pomodoroSession.isBreak) {
      // Break finished, start work session
      setPomodoroSession(prev => ({
        ...prev,
        isBreak: false,
        timeLeft: pomodoroSettings.workTime * 60,
        currentSession: prev.currentSession + 1
      }));
      toast.success('Break time over! Ready to focus? 💪');
    } else {
      // Work session finished, start break
      const isLongBreak = pomodoroSession.currentSession % pomodoroSettings.sessionsUntilLongBreak === 0;
      const breakTime = isLongBreak ? pomodoroSettings.longBreakTime : pomodoroSettings.breakTime;
      
      setPomodoroSession(prev => ({
        ...prev,
        isBreak: true,
        timeLeft: breakTime * 60
      }));
      
      toast.success(`Work session complete! Time for a ${isLongBreak ? 'long' : 'short'} break! 🎉`);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!studyForm.title) {
      toast.error('Please enter a title');
      return;
    }

    try {
      if (editingItem) {
        await axios.put(`/api/study/${editingItem._id}`, studyForm);
        toast.success('Study item updated successfully! 📚💕');
      } else {
        await axios.post('/api/study', studyForm);
        toast.success('Study item added successfully! 🎯💕');
      }
      
      fetchStudyItems();
      resetForm();
    } catch (error) {
      toast.error('Failed to save study item');
      console.error('Error saving study item:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setStudyForm({
      title: '',
      description: '',
      type: 'assignment',
      subject: '',
      priority: 'medium',
      dueDate: '',
      resources: [],
      flashcards: []
    });
    setShowForm(false);
    setEditingItem(null);
  };

  // Toggle completion
  const toggleCompletion = async (itemId, completed) => {
    try {
      await axios.put(`/api/study/${itemId}`, { completed: !completed });
      fetchStudyItems();
      toast.success(completed ? 'Marked as incomplete' : 'Great job! Task completed! 🎉');
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/study/${itemId}`);
      toast.success('Study item deleted successfully');
      setStudyItems(studyItems.filter(item => item._id !== itemId));
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  // Edit item
  const editItem = (item) => {
    setStudyForm({
      title: item.title,
      description: item.description,
      type: item.type,
      subject: item.subject,
      priority: item.priority,
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
      resources: item.resources || [],
      flashcards: item.flashcards || []
    });
    setEditingItem(item);
    setShowForm(true);
  };

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start custom timer
  const startCustomTimer = (minutes) => {
    setActiveTimer('custom');
    setTimerTime(minutes * 60);
    setTimerRunning(true);
    toast.success(`Timer started for ${minutes} minutes! Focus time! 💪`);
  };

  // Start pomodoro
  const startPomodoro = () => {
    setActiveTimer('pomodoro');
    setPomodoroSession({
      currentSession: 1,
      isBreak: false,
      timeLeft: pomodoroSettings.workTime * 60
    });
    setTimerRunning(true);
    toast.success('Pomodoro session started! Focus time! 🍅');
  };

  // Stop timer
  const stopTimer = () => {
    setTimerRunning(false);
    setActiveTimer(null);
    setTimerTime(0);
    setPomodoroSession({
      currentSession: 1,
      isBreak: false,
      timeLeft: pomodoroSettings.workTime * 60
    });
    toast.success('Timer stopped');
  };

  // Get stats
  const getStats = () => {
    const completed = studyItems.filter(item => item.completed).length;
    const total = studyItems.length;
    const highPriority = studyItems.filter(item => item.priority === 'high' && !item.completed).length;
    const overdue = studyItems.filter(item => {
      if (!item.dueDate || item.completed) return false;
      return new Date(item.dueDate) < new Date();
    }).length;

    return { completed, total, highPriority, overdue };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="page-title">📚 Study Together 💕</h1>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #6BCF7F15, #6BCF7F05)' }}>
          <CheckCircle size={30} style={{ color: '#6BCF7F', marginBottom: '0.5rem' }} />
          <h3 style={{ color: '#333' }}>{stats.completed}/{stats.total}</h3>
          <p style={{ color: '#666' }}>Completed</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FF6B9D15, #FF6B9D05)' }}>
          <Target size={30} style={{ color: '#FF6B9D', marginBottom: '0.5rem' }} />
          <h3 style={{ color: '#333' }}>{stats.highPriority}</h3>
          <p style={{ color: '#666' }}>High Priority</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #FFD93D15, #FFD93D05)' }}>
          <Clock size={30} style={{ color: '#FFD93D', marginBottom: '0.5rem' }} />
          <h3 style={{ color: '#333' }}>{stats.overdue}</h3>
          <p style={{ color: '#666' }}>Overdue</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', background: 'linear-gradient(135deg, #C7CEEA15, #C7CEEA05)' }}>
          <Award size={30} style={{ color: '#C7CEEA', marginBottom: '0.5rem' }} />
          <h3 style={{ color: '#333' }}>{Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%</h3>
          <p style={{ color: '#666' }}>Progress</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          className={`btn ${activeTab === 'tasks' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('tasks')}
        >
          <BookOpen size={16} />
          Study Tasks
        </button>
        <button
          className={`btn ${activeTab === 'timer' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('timer')}
        >
          <Timer size={16} />
          Study Timer
        </button>
        <button
          className={`btn ${activeTab === 'flashcards' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('flashcards')}
        >
          <Brain size={16} />
          Flashcards
        </button>
      </div>

      {/* Study Tasks Tab */}
      {activeTab === 'tasks' && (
        <>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#FF1493', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={20} />
                Study Tasks
              </h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <Plus size={16} />
                Add Task
              </button>
            </div>

            {studyItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#666' }}>
                <BookOpen size={60} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <h3>No study tasks yet</h3>
                <p style={{ marginBottom: '1rem' }}>Add your first study task to get started!</p>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <Plus size={16} />
                  Add Your First Task
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {studyItems.map((item) => {
                  const studyType = studyTypes.find(type => type.value === item.type);
                  const priority = priorities.find(p => p.value === item.priority);
                  const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && !item.completed;
                  
                  return (
                    <motion.div
                      key={item._id}
                      className="card"
                      style={{
                        borderLeft: `4px solid ${studyType?.color || '#FF1493'}`,
                        background: item.completed ? 'rgba(108, 207, 127, 0.1)' : isOverdue ? 'rgba(255, 107, 157, 0.1)' : 'rgba(255, 255, 255, 0.7)',
                        opacity: item.completed ? 0.8 : 1
                      }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
                          <button
                            onClick={() => toggleCompletion(item._id, item.completed)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                          >
                            {item.completed ? (
                              <CheckCircle size={24} style={{ color: '#6BCF7F' }} />
                            ) : (
                              <Circle size={24} style={{ color: '#999' }} />
                            )}
                          </button>
                          
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <h4 style={{ 
                                color: '#333', 
                                textDecoration: item.completed ? 'line-through' : 'none' 
                              }}>
                                {item.title}
                              </h4>
                              <span style={{
                                fontSize: '0.8rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '10px',
                                background: studyType?.color || '#FF1493',
                                color: 'white'
                              }}>
                                {studyType?.label || item.type}
                              </span>
                              <span style={{
                                fontSize: '0.8rem',
                                padding: '0.2rem 0.5rem',
                                borderRadius: '10px',
                                background: priority?.color || '#FFD93D',
                                color: '#333'
                              }}>
                                {priority?.label || item.priority}
                              </span>
                              {isOverdue && (
                                <span style={{
                                  fontSize: '0.8rem',
                                  padding: '0.2rem 0.5rem',
                                  borderRadius: '10px',
                                  background: '#ff4757',
                                  color: 'white'
                                }}>
                                  Overdue
                                </span>
                              )}
                            </div>
                            
                            {item.description && (
                              <p style={{ color: '#666', marginBottom: '0.5rem' }}>{item.description}</p>
                            )}
                            
                            {item.subject && (
                              <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                Subject: {item.subject}
                              </p>
                            )}
                            
                            {item.dueDate && (
                              <p style={{ color: isOverdue ? '#ff4757' : '#999', fontSize: '0.9rem' }}>
                                <Clock size={14} style={{ marginRight: '0.25rem' }} />
                                Due: {new Date(item.dueDate).toLocaleDateString()}
                              </p>
                            )}
                            
                            {item.progress > 0 && (
                              <div style={{ marginTop: '0.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                  <span style={{ fontSize: '0.8rem', color: '#666' }}>Progress</span>
                                  <span style={{ fontSize: '0.8rem', color: '#666' }}>{item.progress}%</span>
                                </div>
                                <div style={{ 
                                  width: '100%', 
                                  height: '6px', 
                                  background: '#f0f0f0', 
                                  borderRadius: '3px',
                                  overflow: 'hidden'
                                }}>
                                  <div style={{
                                    width: `${item.progress}%`,
                                    height: '100%',
                                    background: studyType?.color || '#FF1493',
                                    transition: 'width 0.3s ease'
                                  }} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.5rem' }}
                            onClick={() => editItem(item)}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="btn btn-outline"
                            style={{ padding: '0.5rem', color: '#ff4757', borderColor: '#ff4757' }}
                            onClick={() => deleteItem(item._id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Study Timer Tab */}
      {activeTab === 'timer' && (
        <div className="grid grid-2" style={{ gap: '2rem' }}>
          {/* Pomodoro Timer */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#FF1493', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              🍅 Pomodoro Timer
            </h3>
            
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: pomodoroSession.isBreak ? '#6BCF7F' : '#FF1493',
              marginBottom: '1rem' 
            }}>
              {formatTime(activeTimer === 'pomodoro' ? pomodoroSession.timeLeft : pomodoroSettings.workTime * 60)}
            </div>
            
            <p style={{ 
              fontSize: '1.2rem', 
              color: '#666', 
              marginBottom: '2rem' 
            }}>
              {activeTimer === 'pomodoro' ? (
                pomodoroSession.isBreak ? 'Break Time! 😌' : 'Focus Time! 💪'
              ) : (
                'Ready to focus?'
              )}
            </p>
            
            {activeTimer === 'pomodoro' && (
              <p style={{ color: '#999', marginBottom: '1rem' }}>
                Session {pomodoroSession.currentSession}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {activeTimer !== 'pomodoro' ? (
                <button className="btn btn-primary" onClick={startPomodoro}>
                  <Play size={16} />
                  Start Pomodoro
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setTimerRunning(!timerRunning)}
                  >
                    {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                    {timerRunning ? 'Pause' : 'Resume'}
                  </button>
                  <button className="btn btn-outline" onClick={stopTimer}>
                    <Square size={16} />
                    Stop
                  </button>
                </>
              )}
            </div>
            
            <div style={{ textAlign: 'left' }}>
              <h4 style={{ color: '#333', marginBottom: '1rem' }}>Settings</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Work Time:</span>
                  <span>{pomodoroSettings.workTime} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Break Time:</span>
                  <span>{pomodoroSettings.breakTime} min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Long Break:</span>
                  <span>{pomodoroSettings.longBreakTime} min</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Custom Timer */}
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#FF1493', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Timer size={20} />
              Custom Timer
            </h3>
            
            <div style={{ 
              fontSize: '3rem', 
              fontWeight: '700', 
              color: '#6BCF7F',
              marginBottom: '2rem' 
            }}>
              {formatTime(activeTimer === 'custom' ? timerTime : 0)}
            </div>
            
            {activeTimer === 'custom' ? (
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setTimerRunning(!timerRunning)}
                >
                  {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                  {timerRunning ? 'Pause' : 'Resume'}
                </button>
                <button className="btn btn-outline" onClick={stopTimer}>
                  <Square size={16} />
                  Stop
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h4 style={{ color: '#333' }}>Quick Start</h4>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-outline" onClick={() => startCustomTimer(15)}>
                    15 min
                  </button>
                  <button className="btn btn-outline" onClick={() => startCustomTimer(30)}>
                    30 min
                  </button>
                  <button className="btn btn-outline" onClick={() => startCustomTimer(45)}>
                    45 min
                  </button>
                  <button className="btn btn-outline" onClick={() => startCustomTimer(60)}>
                    1 hour
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Flashcards Tab */}
      {activeTab === 'flashcards' && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Brain size={60} style={{ color: '#C7CEEA', marginBottom: '1rem' }} />
          <h3 style={{ color: '#333', marginBottom: '1rem' }}>Flashcards Coming Soon!</h3>
          <p style={{ color: '#666' }}>
            We're working on an amazing flashcard system to help you study better! 🃏✨
          </p>
        </div>
      )}

      {/* Study Item Form Modal */}
      {showForm && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => resetForm()}
        >
          <motion.div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ color: '#FF1493' }}>
                {editingItem ? 'Edit Study Item' : 'Add New Study Item'}
              </h3>
              <button
                onClick={resetForm}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={studyForm.title}
                  onChange={(e) => setStudyForm({ ...studyForm, title: e.target.value })}
                  placeholder="Study task title..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={studyForm.description}
                  onChange={(e) => setStudyForm({ ...studyForm, description: e.target.value })}
                  placeholder="Task description..."
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input"
                    value={studyForm.type}
                    onChange={(e) => setStudyForm({ ...studyForm, type: e.target.value })}
                  >
                    {studyTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-input"
                    value={studyForm.priority}
                    onChange={(e) => setStudyForm({ ...studyForm, priority: e.target.value })}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    className="form-input"
                    value={studyForm.subject}
                    onChange={(e) => setStudyForm({ ...studyForm, subject: e.target.value })}
                    placeholder="Subject name..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={studyForm.dueDate}
                    onChange={(e) => setStudyForm({ ...studyForm, dueDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudyPage;
