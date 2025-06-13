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

// ✅ FIXED AuthAPI using your existing endpoints
export const AuthAPI = {
  login: async (username, password) => {
    try {
      // Create Basic Auth header
      const authHeader = 'Basic ' + window.btoa(`${username}:${password}`);

      // Try to get all users with authentication - this will validate credentials
      const response = await api.get('/users', {
        headers: { Authorization: authHeader }
      });

      // Find the user with matching username from the response
      const users = response.data;
      const user = users.find(u => u.username === username);

      if (user) {
        // Store user data and auth token
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', authHeader);
        return user;
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Login error:', error);
      // If 401, it means credentials are wrong
      if (error.response?.status === 401) {
        throw new Error('Invalid username or password');
      }
      throw error;
    }
  },

  register: async (data) => {
    return api.post('/users', data);
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('rememberedUsername');
  },

  getCurrentUser: async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      // Get fresh user data using the user ID
      return api.get(`/users/${user.id}`);
    }
    throw new Error('No user logged in');
  }
};

// ✅ Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Check if this is an open endpoint that doesn't need authentication
  const isOpenEndpoint = (
    config.method === 'post' && config.url === '/users'
  );

  if (!isOpenEndpoint) {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
  }

  return config;
});

// ✅ Response interceptor for error handling
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

    // Handle authentication errors
    if (error.response?.status === 401) {
      // Clear stored auth data on 401
      AuthAPI.logout();

      // Redirect to login if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Health Metrics API
export const HealthMetricAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/healthMetrics?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/healthMetrics/${id}`),
  create: (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.post('/healthMetrics', { ...data, userId: user?.id });
  },
  update: (id, data) => api.put(`/healthMetrics/${id}`, data),
  delete: (id) => api.delete(`/healthMetrics/${id}`),
};

// Symptoms API
export const SymptomAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/symptoms?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/symptoms/${id}`),
  create: (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.post('/symptoms', { ...data, userId: user?.id });
  },
  update: (id, data) => api.put(`/symptoms/${id}`, data),
  delete: (id) => api.delete(`/symptoms/${id}`),
};

// Appointments API
export const AppointmentAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/appointments?userId=${user?.id}`);
  },
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.post('/appointments', { ...data, userId: user?.id });
  },
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`),
};

// Notifications API
export const NotificationAPI = {
  getAll: () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return api.get(`/notifications/user/${user?.id}`);
  },
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;








