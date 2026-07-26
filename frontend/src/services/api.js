import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000/api/v1`;
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
