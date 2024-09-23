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
  getAll: () => api.get('/healthMetrics'),
  getById: (id) => api.get(`/healthMetrics/${id}`),
  create: (data) => api.post('/healthMetrics', data),
  update: (id, data) => api.put(`/healthMetrics/${id}`, data),
  delete: (id) => api.delete(`/healthMetrics/${id}`)
};

// API for Symptom
// Add Symptom API methods to the SymptomAPI object
export const SymptomAPI = {
  getAll: () => api.get('/symptoms'),
  getById: (id) => api.get(`/symptoms/${id}`),
  create: (data) => api.post('/symptoms', data),
  update: (id, data) => api.put(`/symptoms/${id}`, data),
  delete: (id) => api.delete(`/symptoms/${id}`)
};


// API for Appointment
export const AppointmentAPI = {
  getAll: () => api.get('/appointments'),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  delete: (id) => api.delete(`/appointments/${id}`)
};

// API for User
export const UserAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};


