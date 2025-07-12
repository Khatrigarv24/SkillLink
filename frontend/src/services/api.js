import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding token to authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};

export const skillService = {
  getSkills: () => api.get('/skills'),
  getUserSkills: () => api.get('/skills/me'),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export const swapService = {
  getSwaps: () => api.get('/swap'),
  createSwap: (data) => api.post('/swap', data),
  updateSwapStatus: (id, status) => api.put(`/swap/${id}/status`, { status }),
};

export const matchService = {
  getMatches: () => api.get('/matches'),
};

export const ratingService = {
  createRating: (data) => api.post('/ratings', data),
  getUserRatings: (userId) => api.get(`/ratings/${userId}`),
};

export const endorsementService = {
  createEndorsement: (data) => api.post('/endorsements', data),
  getUserEndorsements: (userId) => api.get(`/endorsements/${userId}`),
};

export default api;