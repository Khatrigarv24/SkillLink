import axios from 'axios';

// Fix the API_URL by ensuring it has a proper value
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Make sure the URL doesn't end with a slash if we're appending paths
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor with additional debugging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log the full URL being requested for debugging
    console.log(`Making request to: ${config.baseURL}/${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => {
    console.log('Login request to:', `${API_URL}/api/auth/login`);
    return api.post('api/auth/login', credentials);
  },
  signup: (userData) => api.post('api/auth/signup', userData),
  getProfile: () => api.get('api/users/me'),
  updateProfile: (data) => api.put('api/users/me', data),
};

export const userService = {
  getUsers: () => api.get('api/users'),
  getUser: (id) => api.get(`api/users/${id}`),
};

export const skillService = {
  getSkills: () => api.get('api/skills'),
  getUserSkills: () => api.get('api/skills/me'),
  createSkill: (data) => api.post('api/skills', data),
  updateSkill: (id, data) => api.put(`api/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`api/skills/${id}`),
};

export const swapService = {
  getSwaps: () => api.get('api/swap'),
  createSwap: (data) => {
    console.log('Creating swap with data:', data);
    return api.post('api/swap', data);
  },
  updateSwapStatus: (id, status) => api.put(`api/swap/${id}/status`, { status }),
};

export const matchService = {
  getMatches: () => {
    console.log('Fetching matches');
    return api.get('api/matches');
  },
};

export const ratingService = {
  createRating: (data) => api.post('api/ratings', data),
  getUserRatings: (userId) => api.get(`api/ratings/${userId}`),
};

export const endorsementService = {
  createEndorsement: (data) => api.post('api/endorsements', data),
  getUserEndorsements: (userId) => api.get(`api/endorsements/${userId}`),
};

export default api;