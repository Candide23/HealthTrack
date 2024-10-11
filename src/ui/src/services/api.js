import axios from 'axios';

// Base URL for API requests
const API_BASE_URL = 'http://localhost:8080/api';

// Common configuration for Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // Ensures credentials (cookies) are included
  headers: {
    'Content-Type': 'application/json'
  }
});

// API for HealthMetric
export const HealthMetricAPI = {
  getAll: (userId) => api.get(`/healthMetrics?userId=${userId}`),
  getById: (id) => api.get(`/healthMetrics/${id}`),
  create: (data) => api.post('/healthMetrics', data),
  update: (id, data) => api.put(`/healthMetrics/${id}`, data),
  delete: (id) => api.delete(`/healthMetrics/${id}`)
};

// API for Symptom
// Add Symptom API methods to the SymptomAPI object
export const SymptomAPI = {
  getAll: (userId) => api.get(`/symptoms?userId=${userId}`),
  getById: (id) => api.get(`/symptoms/${id}`),
  create: (data) => api.post('/symptoms', data),
  update: (id, data) => api.put(`/symptoms/${id}`, data),
  delete: (id) => api.delete(`/symptoms/${id}`)
};


// API for Appointment
export const AppointmentAPI = {
  getAll: (userId) => api.get(`/appointments?userId=${userId}`),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`)
};

// API for Notifications
export const NotificationAPI = {
  // Get all notifications for a specific user
  getAll: (userId) => api.get(`/notifications/user/${userId}`),
  
  // Mark a notification as read by its ID
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),



};







