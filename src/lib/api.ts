import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  // The .NET Web API usually runs on 5000 (HTTP) or 5001 (HTTPS)
  baseURL: 'http://localhost:5000/api', 
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

export default api;
