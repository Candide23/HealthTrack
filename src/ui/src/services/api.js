import axios from 'axios';

const API_URL = 'http://localhost:8080/api';  // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_URL,
});

// Auth-related functions
export const login = (username, password) => api.post('/auth/login', { username, password });
export const register = (username, password, email, phoneNumber) => api.post('/auth/register', { username, password, email, phoneNumber });

// Health Metric-related functions
export const getHealthMetrics = () => api.get('/healthmetrics');
export const addHealthMetric = (metricType, value, timestamp, userId) => api.post('/healthmetrics', { metricType, value, timestamp, userId });

// Symptom-related functions
export const getSymptoms = () => api.get('/symptoms');
export const addSymptom = (symptomType, severity, description, timestamp, userId) => api.post('/symptoms', { symptomType, severity, description, timestamp, userId });

// Appointment-related functions
export const getAppointments = () => api.get('/appointments');
export const addAppointment = (doctorName, location, appointmentDate, reasonForVisit, userId) => api.post('/appointments', { doctorName, location, appointmentDate, reasonForVisit, userId });

export default api;
