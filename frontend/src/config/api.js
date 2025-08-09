import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios default base URL
axios.defaults.baseURL = API_BASE_URL;

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  photos: `${API_BASE_URL}/api/photos`,
  events: `${API_BASE_URL}/api/events`,
  study: `${API_BASE_URL}/api/study`,
  notes: `${API_BASE_URL}/api/notes`,
  socket: API_BASE_URL
};

export default API_ENDPOINTS;
