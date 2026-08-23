import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // The .NET Web API is running on port 5128
  baseURL: 'http://localhost:5128/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      try {
        // Get the token from local storage (Zustand persists it here)
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const { state } = JSON.parse(authStorage);
          if (state?.token) {
            config.headers.Authorization = `Bearer ${state.token}`;
          }
        }
      } catch (error) {
        console.error("Error parsing auth token from local storage", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear the persisted zustand state to force logout
        localStorage.removeItem('auth-storage');
        // Prevent redirect loops if already on login page
        if (!window.location.pathname.includes('/auth/login')) {
          window.location.href = '/auth/login?session_expired=true';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
