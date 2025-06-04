import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

// Create an Axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ AuthAPI with both login and register
export const AuthAPI = {
  login: async (username, password) => {
    const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);
    const response = await api.get('/users', {
      headers: {
        Authorization: authHeader,
      },
    });

    const user = response.data.find((u) => u.username === username);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', authHeader);
      return user;
    } else {
      throw new Error('Invalid username or password');
    }
  },

  // ✅ FIXED: Use /users endpoint (POST) instead of /users/register
  register: async (data) => {
    return api.post('/users', data);
  },
};

// ✅ Attach token interceptor OUTSIDE AuthAPI
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      fullURL: `${error.config?.baseURL}${error.config?.url}`,
      responseData: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

// Health Metrics
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

// Symptoms
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

// Appointments
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

// Notifications
export const NotificationAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/notifications/user/${user?.id}`);
  },
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;








