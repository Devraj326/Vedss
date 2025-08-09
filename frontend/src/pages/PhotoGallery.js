import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Upload, 
  Heart, 
  Download, 
  Trash2, 
  Eye, 
  X,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react';

const PhotoGallery = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Upload form data
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: ''
  });

  // Fetch photos from backend
  const fetchPhotos = async () => {
    try {
      const response = await axios.get('/api/photos');
      setPhotos(response.data);
    } catch (error) {
      toast.error('Failed to load photos');
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Handle file drop
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    setUploading(true);
    const file = acceptedFiles[0];
    
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('title', uploadForm.title || file.name);
    formData.append('description', uploadForm.description);

    try {
      const response = await axios.post('/api/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Photo uploaded successfully! 📸💕');
        fetchPhotos();
        setUploadForm({ title: '', description: '' });
      }
    } catch (error) {
      toast.error('Failed to upload photo');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  }, [uploadForm]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  // Delete photo
  const deletePhoto = async (photoId, photoPath) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      await axios.delete(`/api/photos/${photoId}`);
      toast.success('Photo deleted successfully');
      setPhotos(photos.filter(photo => photo._id !== photoId));
      setSelectedPhoto(null);
    } catch (error) {
      toast.error('Failed to delete photo');
      console.error('Delete error:', error);
    }
  };

  // Filter photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         photo.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFavorites = !filterFavorites || photo.favorite;
    return matchesSearch && matchesFavorites;
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
      <h1 className="page-title">📸 Our Photo Gallery 💕</h1>

      {/* Upload Section */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#FF1493', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upload size={20} />
          Upload New Memory
        </h3>
        
        <div className="grid grid-2" style={{ marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="Give your photo a cute title..."
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-input"
              placeholder="Add a sweet description..."
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
            />
          </div>
        </div>

        <div 
          {...getRootProps()} 
          style={{
            border: '3px dashed #FFB6C1',
            borderRadius: '15px',
            padding: '2rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: isDragActive ? 'rgba(255, 182, 193, 0.1)' : 'rgba(255, 255, 255, 0.5)',
            transition: 'all 0.3s ease'
          }}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div>
              <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
              <p>Uploading your beautiful memory... 💕</p>
            </div>
          ) : (
            <div>
              <Upload size={40} style={{ color: '#FF1493', margin: '0 auto 1rem' }} />
              {isDragActive ? (
                <p style={{ color: '#FF1493', fontSize: '1.1rem' }}>Drop your photo here! 📸</p>
              ) : (
                <div>
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    Drag & drop a photo here, or click to select
                  </p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>
                    Max file size: 10MB • Supported: PNG, JPG, JPEG, GIF, WebP
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
                placeholder="Search photos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <button
            className={`btn ${filterFavorites ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterFavorites(!filterFavorites)}
          >
            <Heart size={16} />
            Favorites
          </button>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <Heart size={60} style={{ color: '#FFB6C1', margin: '0 auto 1rem' }} />
          <h3 style={{ color: '#666', marginBottom: '1rem' }}>
            {searchTerm || filterFavorites ? 'No photos match your search' : 'No photos yet'}
          </h3>
          <p style={{ color: '#999' }}>
            {searchTerm || filterFavorites ? 'Try adjusting your filters' : 'Upload your first memory together! 💕'}
          </p>
        </div>
      ) : (
        <div className={`grid ${viewMode === 'grid' ? 'grid-3' : 'grid-1'}`}>
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo._id}
              className="card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              style={{ 
                cursor: 'pointer',
                overflow: 'hidden',
                padding: viewMode === 'list' ? '1rem' : '0'
              }}
              onClick={() => setSelectedPhoto(photo)}
            >
              {viewMode === 'grid' ? (
                <>
                  <img
                    src={`http://localhost:5000/${photo.path}`}
                    alt={photo.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '15px 15px 0 0'
                    }}
                  />
                  <div style={{ padding: '1rem' }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>{photo.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {photo.description}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.8rem' }}>
                      {new Date(photo.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={`http://localhost:5000/${photo.path}`}
                    alt={photo.title}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ marginBottom: '0.5rem', color: '#333' }}>{photo.title}</h4>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                      {photo.description}
                    </p>
                    <p style={{ color: '#999', fontSize: '0.8rem' }}>
                      {new Date(photo.uploadDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: '0.5rem' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPhoto(photo);
                      }}
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      className="btn btn-outline"
                      style={{ padding: '0.5rem', color: '#ff4757', borderColor: '#ff4757' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePhoto(photo._id, photo.path);
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Photo Modal */}
      {selectedPhoto && (
        <motion.div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedPhoto(null)}
        >
          <motion.div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '90vw',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#FF1493' }}>{selectedPhoto.title}</h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={24} color="#666" />
              </button>
            </div>
            
            <img
              src={`http://localhost:5000/${selectedPhoto.path}`}
              alt={selectedPhoto.title}
              style={{
                width: '100%',
                maxHeight: '60vh',
                objectFit: 'contain',
                borderRadius: '15px',
                marginBottom: '1rem'
              }}
            />
            
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: '#666', marginBottom: '0.5rem' }}>{selectedPhoto.description}</p>
              <p style={{ color: '#999', fontSize: '0.9rem' }}>
                Uploaded on {new Date(selectedPhoto.uploadDate).toLocaleDateString()}
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <a
                href={`http://localhost:5000/${selectedPhoto.path}`}
                download={selectedPhoto.originalName}
                className="btn btn-primary"
              >
                <Download size={16} />
                Download
              </a>
              <button
                className="btn btn-outline"
                style={{ color: '#ff4757', borderColor: '#ff4757' }}
                onClick={() => deletePhoto(selectedPhoto._id, selectedPhoto.path)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PhotoGallery;
