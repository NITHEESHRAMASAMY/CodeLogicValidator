import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_BASE_URL || '';
const API = axios.create({
  baseURL: rawBaseURL ? `${rawBaseURL.replace(/\/+$/, '')}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('clv_jwt_token') || sessionStorage.getItem('clv_jwt_token');
    if (token && token.includes('.')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle authentication expiry
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token if expired or unauthorized
      localStorage.removeItem('clv_jwt_token');
      sessionStorage.removeItem('clv_jwt_token');
      localStorage.removeItem('clv_user');
    }
    return Promise.reject(error);
  }
);

export default API;
