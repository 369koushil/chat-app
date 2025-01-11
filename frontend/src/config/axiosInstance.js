import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3444',  // Replace with your backend base URL
});

// Add Authorization header for each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
