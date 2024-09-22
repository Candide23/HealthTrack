import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// For Logging In
export const login = (credentials) => {
  return axios.post(`${API_URL}/login`, credentials);
};

// For Registering
export const register = (userData) => {
  return axios.post(`${API_URL}/users`, userData);
};

// Fetch Health Metrics
export const getHealthMetrics = () => {
  return axios.get(`${API_URL}/health-metrics`);
};

// Create a Health Metric
export const createHealthMetric = (metric) => {
  return axios.post(`${API_URL}/health-metrics`, metric);
};

// Fetch Symptoms
export const getSymptoms = () => {
  return axios.get(`${API_URL}/symptoms`);
};

// Create a Symptom
export const createSymptom = (symptom) => {
  return axios.post(`${API_URL}/symptoms`, symptom);
};

// Fetch Appointments
export const getAppointments = () => {
  return axios.get(`${API_URL}/appointments`);
};

// Create an Appointment
export const createAppointment = (appointment) => {
  return axios.post(`${API_URL}/appointments`, appointment);
};
