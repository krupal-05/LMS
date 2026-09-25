import axios from 'axios';

const getBaseURL = () => {
  let envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return `http://${window.location.hostname}:8000/api/v1`;
    }
  }
  return 'http://localhost:8000/api/v1';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Optional: Add response interceptor for handling 401 globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Could handle global logout or token refresh logic here
    }
    return Promise.reject(error);
  }
);

export default api;
