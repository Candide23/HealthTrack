import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

// Create an Axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Ensures credentials (cookies) are included
  headers: {
    'Content-Type': 'application/json',
  },
});





export const AuthAPI = {
  login: async (username, password) => {
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);
    const response = await api.get('/users', {
      headers: {
        Authorization: authHeader,
      },
    });

    // Find the user matching the username
    const user = response.data.find((u) => u.username === username);

    if (user) {
      // Save user data and token
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', authHeader); // Save Basic Auth token
      return user;
    } else {
      throw new Error('Invalid username or password'); // Handle authentication failure
    }
  },
};

// Attach a request interceptor to add the token to the headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token; // Ensure 'Basic' or 'Bearer' prefix is correct
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// API for Health Metrics
export const HealthMetricAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/healthMetrics?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/healthMetrics/${id}`),
  create: (data) => api.post('/healthMetrics', data),
  update: (id, data) => api.put(`/healthMetrics/${id}`, data),
  delete: (id) => api.delete(`/healthMetrics/${id}`),
};

// API for Symptoms
export const SymptomAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/symptoms?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/symptoms/${id}`),
  create: (data) => api.post('/symptoms', data),
  update: (id, data) => api.put(`/symptoms/${id}`, data),
  delete: (id) => api.delete(`/symptoms/${id}`),
};

// API for Appointments
export const AppointmentAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/appointments?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// API for Notifications
export const NotificationAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/notifications/user/${user?.id}`);
  },
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;








