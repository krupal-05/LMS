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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor: automatically refresh expired access token on 401
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response && error.response.status === 401 && originalRequest && !originalRequest._retry) {
      const url = originalRequest.url || '';
      
      // Do not attempt refresh for login, register, or refresh-token calls
      if (
        url.includes('/users/login') ||
        url.includes('/users/register') ||
        url.includes('/users/refresh-token') ||
        url.includes('/users/refresh')
      ) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // If a refresh is already in flight, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/users/refresh-token');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Clean up any stale session flags
        if (typeof window !== 'undefined') {
          localStorage.removeItem('lms_has_session');
          localStorage.removeItem('lms_user');
          window.dispatchEvent(new Event('lms-session-expired'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
