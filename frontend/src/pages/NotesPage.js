import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  StickyNote, 
  Plus, 
  Heart, 
  Edit,
  Trash2,
  X,
  Pin,
  Search,
  Filter,
  Smile,
  ThumbsUp,
  Star,
  Coffee,
  BookOpen
} from 'lucide-react';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterMood, setFilterMood] = useState('all');

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    type: 'other',
    tags: [],
    color: '#FFB6C1',
    mood: 'happy'
  });

  const [tagInput, setTagInput] = useState('');

  const noteTypes = [
    { value: 'love-note', label: '💕 Love Note', color: '#FF1493' },
    { value: 'study-note', label: '📚 Study Note', color: '#6BCF7F' },
    { value: 'reminder', label: '🔔 Reminder', color: '#FFD93D' },
    { value: 'memory', label: '🌟 Memory', color: '#A8E6CF' },
    { value: 'other', label: '📝 Other', color: '#C7CEEA' }
  ];

  const moods = [
    { value: 'happy', label: '😊 Happy', emoji: '😊' },
    { value: 'love', label: '😍 In Love', emoji: '😍' },
    { value: 'excited', label: '🤩 Excited', emoji: '🤩' },
    { value: 'calm', label: '😌 Calm', emoji: '😌' },
    { value: 'motivated', label: '💪 Motivated', emoji: '💪' },
    { value: 'grateful', label: '🙏 Grateful', emoji: '🙏' },
    { value: 'other', label: '🤔 Other', emoji: '🤔' }
  ];

  const colors = [
    '#FFB6C1', // Light Pink
    '#FFC0CB', // Pink
    '#FFE4E6', // Very Light Pink
    '#E6E6FA', // Lavender
    '#F0F8FF', // Alice Blue
    '#FFEFD5', // Papaya Whip
    '#F0FFF0', // Honeydew
    '#FFF8DC', // Cornsilk
    '#FFFACD', // Lemon Chiffon
    '#FFE4B5'  // Moccasin
  ];

  // Fetch notes
  const fetchNotes = async () => {
    try {
      const response = await axios.get('/api/notes');
      setNotes(response.data);
    } catch (error) {
      toast.error('Failed to load notes');
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!noteForm.title || !noteForm.content) {
      toast.error('Please fill in the title and content');
      return;
    }

    try {
      const noteData = {
        ...noteForm,
        tags: noteForm.tags.filter(tag => tag.trim() !== '')
      };

      if (editingNote) {
        await axios.put(`/api/notes/${editingNote._id}`, noteData);
        toast.success('Note updated successfully! 📝💕');
      } else {
        await axios.post('/api/notes', noteData);
        toast.success('Note added successfully! 💖');
      }
      
      fetchNotes();
      resetForm();
    } catch (error) {
      toast.error('Failed to save note');
      console.error('Error saving note:', error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNoteForm({
      title: '',
      content: '',
      type: 'other',
      tags: [],
      color: '#FFB6C1',
      mood: 'happy'
    });
    setTagInput('');
    setShowForm(false);
    setEditingNote(null);
  };

  // Delete note
  const deleteNote = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      await axios.delete(`/api/notes/${noteId}`);
      toast.success('Note deleted successfully');
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (error) {
      toast.error('Failed to delete note');
      console.error('Delete error:', error);
    }
  };

  // Edit note
  const editNote = (note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      type: note.type,
      tags: note.tags || [],
      color: note.color,
      mood: note.mood
    });
    setEditingNote(note);
    setShowForm(true);
  };

  // Toggle pin
  const togglePin = async (noteId, pinned) => {
    try {
      await axios.put(`/api/notes/${noteId}`, { pinned: !pinned });
      fetchNotes();
      toast.success(pinned ? 'Note unpinned' : 'Note pinned! 📌');
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  // Add tag
  const addTag = () => {
    if (tagInput.trim() && !noteForm.tags.includes(tagInput.trim())) {
      setNoteForm({
        ...noteForm,
        tags: [...noteForm.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setNoteForm({
      ...noteForm,
      tags: noteForm.tags.filter(tag => tag !== tagToRemove)
    });
  };

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.tags && note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
    const matchesType = filterType === 'all' || note.type === filterType;
    const matchesMood = filterMood === 'all' || note.mood === filterMood;
    
    return matchesSearch && matchesType && matchesMood;
  });

  // Sort notes (pinned first, then by creation date)
  const sortedNotes = filteredNotes.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

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
      <h1 className="page-title">📝 Our Love Notes 💕</h1>

      {/* Controls */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#666'
              }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <select
            className="form-input"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Types</option>
            {noteTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          
          <select
            className="form-input"
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="all">All Moods</option>
            {moods.map(mood => (
              <option key={mood.value} value={mood.value}>
                {mood.label}
              </option>
            ))}
          </select>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={16} />
            Add Note
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      {sortedNotes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Heart size={60} style={{ color: '#FFB6C1', margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>
            {searchTerm || filterType !== 'all' || filterMood !== 'all' ? 'No notes match your search' : 'No notes yet'}
          </h3>
          <p style={{ color: '#999', marginBottom: '2rem' }}>
            {searchTerm || filterType !== 'all' || filterMood !== 'all' ? 'Try adjusting your filters' : 'Start writing your first love note! 💕'}
          </p>
          {(!searchTerm && filterType === 'all' && filterMood === 'all') && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <Plus size={16} />
              Write Your First Note
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-3" style={{ gap: '1.5rem' }}>
          {sortedNotes.map((note, index) => {
            const noteType = noteTypes.find(type => type.value === note.type);
            const mood = moods.find(m => m.value === note.mood);
            
            return (
              <motion.div
                key={note._id}
                className="card"
                style={{
                  background: note.color || '#FFB6C1',
                  border: `2px solid ${note.color ? `${note.color}80` : '#FFB6C1'}`,
                  position: 'relative',
                  cursor: 'pointer'
                }}
                initial={{ opacity: 0, scale: 0.9, rotateZ: Math.random() * 4 - 2 }}
                animate={{ opacity: 1, scale: 1, rotateZ: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotateZ: 1 }}
                onClick={() => editNote(note)}
              >
                {/* Pin indicator */}
                {note.pinned && (
                  <Pin 
                    size={16} 
                    style={{ 
                      position: 'absolute', 
                      top: '0.5rem', 
                      right: '0.5rem', 
                      color: '#FF1493' 
                    }} 
                  />
                )}
                
                {/* Note Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ color: '#333', flex: 1, margin: 0 }}>{note.title}</h4>
                    <span style={{ fontSize: '1.2rem' }}>{mood?.emoji || '😊'}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{
                      fontSize: '0.8rem',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '10px',
                      background: noteType?.color || '#FF1493',
                      color: 'white'
                    }}>
                      {noteType?.label || note.type}
                    </span>
                  </div>
                </div>
                
                {/* Note Content */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    color: '#333', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 4,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {note.content}
                  </p>
                </div>
                
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                      {note.tags.slice(0, 3).map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          style={{
                            fontSize: '0.7rem',
                            padding: '0.2rem 0.4rem',
                            borderRadius: '8px',
                            background: 'rgba(255, 255, 255, 0.7)',
                            color: '#333'
                          }}
                        >
                          #{tag}
                        </span>
                      ))}
                      {note.tags.length > 3 && (
                        <span style={{
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.7)',
                          color: '#666'
                        }}>
                          +{note.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Note Footer */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  borderTop: '1px solid rgba(255, 255, 255, 0.5)',
                  paddingTop: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#666'
                }}>
                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        color: note.pinned ? '#FF1493' : '#999'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePin(note._id, note.pinned);
                      }}
                    >
                      <Pin size={14} />
                    </button>
                    
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        editNote(note);
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    
                    <button
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4757' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note._id);
                      }}
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

      {/* Note Form Modal */}
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
              maxWidth: '600px',
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
                {editingNote ? 'Edit Note' : 'Write a New Note'}
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
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  placeholder="Give your note a sweet title..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Content *</label>
                <textarea
                  className="form-input form-textarea"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="Write your heart out..."
                  required
                  style={{ minHeight: '150px' }}
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-input"
                    value={noteForm.type}
                    onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                  >
                    {noteTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Mood</label>
                  <select
                    className="form-input"
                    value={noteForm.mood}
                    onChange={(e) => setNoteForm({ ...noteForm, mood: e.target.value })}
                  >
                    {moods.map(mood => (
                      <option key={mood.value} value={mood.value}>
                        {mood.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Color</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: noteForm.color === color ? '3px solid #FF1493' : '2px solid #ddd',
                        background: color,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setNoteForm({ ...noteForm, color })}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tags</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={addTag}
                  >
                    Add
                  </button>
                </div>
                
                {noteForm.tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {noteForm.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          fontSize: '0.9rem',
                          padding: '0.3rem 0.6rem',
                          borderRadius: '12px',
                          background: '#FFB6C1',
                          color: '#333',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#666',
                            padding: 0,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNote ? 'Update Note' : 'Save Note'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NotesPage;
