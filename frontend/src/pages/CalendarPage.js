import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Calendar from 'react-calendar';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Heart, 
  Gift,
  BookOpen,
  Bell,
  Edit,
  Trash2,
  X
} from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'other',
    priority: 'medium',
    recurring: false,
    recurringType: 'monthly'
  });

  const eventTypes = [
    { value: 'date', label: '💕 Date', color: '#FF1493' },
    { value: 'anniversary', label: '🎉 Anniversary', color: '#FF6B9D' },
    { value: 'birthday', label: '🎂 Birthday', color: '#FFD93D' },
    { value: 'study', label: '📚 Study', color: '#6BCF7F' },
    { value: 'reminder', label: '🔔 Reminder', color: '#A8E6CF' },
    { value: 'other', label: '📌 Other', color: '#C7CEEA' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#A8E6CF' },
    { value: 'medium', label: 'Medium', color: '#FFD93D' },
    { value: 'high', label: 'High', color: '#FF6B9D' }
  ];

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.date) {
      toast.error('Please fill in the required fields');
      return;
    }

    try {
      if (editingEvent) {
        await axios.put(`/api/events/${editingEvent._id}`, eventForm);
        toast.success('Event updated successfully! 📅💕');
      } else {
        await axios.post('/api/events', eventForm);
        toast.success('Event added successfully! 🎉💕');
      }
      
      fetchEvents();
      resetForm();
    } catch (error) {
      toast.error('Failed to save event');
      console.error('Error saving event:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'other',
      priority: 'medium',
      recurring: false,
      recurringType: 'monthly'
    });
    setShowEventForm(false);
    setEditingEvent(null);
  };

  // Delete event
  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`/api/events/${eventId}`);
      toast.success('Event deleted successfully');
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      toast.error('Failed to delete event');
      console.error('Delete error:', error);
    }
  };

  // Edit event
  const editEvent = (event) => {
    setEventForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split('T')[0],
      time: event.time,
      type: event.type,
      priority: event.priority,
      recurring: event.recurring,
      recurringType: event.recurringType
    });
    setEditingEvent(event);
    setShowEventForm(true);
  };

  // Get events for selected date
  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  };

  // Check if date has events
  const hasEvents = (date) => {
    return getEventsForDate(date).length > 0;
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const upcomingEvents = getUpcomingEvents();

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
      <h1 className="page-title">📅 Our Calendar 💕</h1>

      <div className="grid grid-2" style={{ gap: '2rem', alignItems: 'start' }}>
        {/* Calendar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ color: '#FF1493', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CalendarIcon size={20} />
              Calendar View
            </h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowEventForm(true)}
            >
              <Plus size={16} />
              Add Event
            </button>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            '& .react-calendar': {
              width: '100%',
              border: 'none',
              fontFamily: 'Poppins, sans-serif'
            },
            '& .react-calendar__tile': {
              position: 'relative'
            }
          }}>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              tileClassName={({ date }) => {
                if (hasEvents(date)) {
                  return 'has-events';
                }
                return null;
              }}
              tileContent={({ date }) => {
                const dateEvents = getEventsForDate(date);
                if (dateEvents.length > 0) {
                  return (
                    <div style={{
                      position: 'absolute',
                      bottom: '2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      display: 'flex',
                      gap: '2px'
                    }}>
                      {dateEvents.slice(0, 3).map((event, index) => {
                        const eventType = eventTypes.find(type => type.value === event.type);
                        return (
                          <div
                            key={index}
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: eventType?.color || '#FF1493'
                            }}
                          />
                        );
                      })}
                    </div>
                  );
                }
                return null;
              }}
            />
          </div>
        </div>

        {/* Events for Selected Date */}
        <div className="card">
          <h3 style={{ color: '#FF1493', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={20} />
            Events for {selectedDate.toDateString()}
          </h3>

          {selectedDateEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              <CalendarIcon size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No events for this date</p>
              <button 
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setEventForm({ ...eventForm, date: selectedDate.toISOString().split('T')[0] });
                  setShowEventForm(true);
                }}
              >
                <Plus size={16} />
                Add Event
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedDateEvents.map((event) => {
                const eventType = eventTypes.find(type => type.value === event.type);
                const priority = priorities.find(p => p.value === event.priority);
                
                return (
                  <motion.div
                    key={event._id}
                    className="card"
                    style={{
                      borderLeft: `4px solid ${eventType?.color || '#FF1493'}`,
                      background: 'rgba(255, 255, 255, 0.7)'
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: '#333' }}>{event.title}</h4>
                          <span style={{
                            fontSize: '0.8rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            background: eventType?.color || '#FF1493',
                            color: 'white'
                          }}>
                            {eventType?.label || event.type}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '10px',
                            background: priority?.color || '#FFD93D',
                            color: '#333'
                          }}>
                            {priority?.label || event.priority}
                          </span>
                        </div>
                        
                        {event.description && (
                          <p style={{ color: '#666', marginBottom: '0.5rem' }}>{event.description}</p>
                        )}
                        
                        {event.time && (
                          <p style={{ color: '#999', fontSize: '0.9rem' }}>
                            <Clock size={14} style={{ marginRight: '0.25rem' }} />
                            {event.time}
                          </p>
                        )}
                        
                        {event.recurring && (
                          <p style={{ color: '#999', fontSize: '0.9rem' }}>
                            <Bell size={14} style={{ marginRight: '0.25rem' }} />
                            Repeats {event.recurringType}
                          </p>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.5rem' }}
                          onClick={() => editEvent(event)}
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: '0.5rem', color: '#ff4757', borderColor: '#ff4757' }}
                          onClick={() => deleteEvent(event._id)}
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
      </div>

      {/* Upcoming Events */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ color: '#FF1493', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={20} />
          Upcoming Events (Next 7 Days)
        </h3>

        {upcomingEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
            <Heart size={40} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p>No upcoming events</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {upcomingEvents.map((event) => {
              const eventType = eventTypes.find(type => type.value === event.type);
              const daysUntil = Math.ceil((new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <motion.div
                  key={event._id}
                  className="card"
                  style={{
                    background: `linear-gradient(135deg, ${eventType?.color || '#FF1493'}15, ${eventType?.color || '#FF1493'}05)`,
                    border: `1px solid ${eventType?.color || '#FF1493'}30`
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                      {eventType?.label?.split(' ')[0] || '📌'}
                    </div>
                    <h4 style={{ color: '#333', marginBottom: '0.5rem' }}>{event.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                    <p style={{ 
                      color: eventType?.color || '#FF1493', 
                      fontSize: '0.8rem', 
                      fontWeight: '600' 
                    }}>
                      {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
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
                {editingEvent ? 'Edit Event' : 'Add New Event'}
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
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Event title..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input form-textarea"
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  placeholder="Event description..."
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input"
                    value={eventForm.type}
                    onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                  >
                    {eventTypes.map(type => (
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
                    value={eventForm.priority}
                    onChange={(e) => setEventForm({ ...eventForm, priority: e.target.value })}
                  >
                    {priorities.map(priority => (
                      <option key={priority.value} value={priority.value}>
                        {priority.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={eventForm.recurring}
                    onChange={(e) => setEventForm({ ...eventForm, recurring: e.target.checked })}
                  />
                  <span className="form-label" style={{ margin: 0 }}>Recurring Event</span>
                </label>
              </div>

              {eventForm.recurring && (
                <div className="form-group">
                  <label className="form-label">Repeat</label>
                  <select
                    className="form-input"
                    value={eventForm.recurringType}
                    onChange={(e) => setEventForm({ ...eventForm, recurringType: e.target.value })}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update Event' : 'Add Event'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <style jsx>{`
        .react-calendar {
          width: 100% !important;
          border: none !important;
          font-family: 'Poppins', sans-serif !important;
        }
        
        .react-calendar__tile {
          border-radius: 8px !important;
          border: none !important;
          background: rgba(255, 255, 255, 0.8) !important;
          color: #333 !important;
          padding: 0.75rem 0.5rem !important;
          margin: 2px !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }
        
        .react-calendar__tile:hover {
          background: rgba(255, 20, 147, 0.1) !important;
          transform: scale(1.05) !important;
        }
        
        .react-calendar__tile--active {
          background: linear-gradient(135deg, #FF1493, #FF69B4) !important;
          color: white !important;
        }
        
        .react-calendar__tile.has-events {
          background: rgba(255, 182, 193, 0.2) !important;
          font-weight: 600 !important;
        }
        
        .react-calendar__navigation button {
          border: none !important;
          background: none !important;
          color: #FF1493 !important;
          font-weight: 600 !important;
          font-size: 1rem !important;
          padding: 0.5rem !important;
          border-radius: 8px !important;
          transition: all 0.3s ease !important;
        }
        
        .react-calendar__navigation button:hover {
          background: rgba(255, 20, 147, 0.1) !important;
        }
        
        .react-calendar__month-view__weekdays {
          color: #666 !important;
          font-weight: 600 !important;
          font-size: 0.9rem !important;
        }
        
        .react-calendar__month-view__weekdays__weekday {
          padding: 0.5rem !important;
        }
      `}</style>
    </motion.div>
  );
};

export default CalendarPage;
