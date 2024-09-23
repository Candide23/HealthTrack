import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';  // Import the new Home component
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HealthMetric from './components/HealthMetric/HealthMetric';
import Symptom from './components/Symptom/Symptom';
import Appointment from './components/Appointment/Appointment';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Add Home route */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/health-metrics" element={<HealthMetric />} />
        <Route path="/symptoms" element={<Symptom />} />
        <Route path="/appointments" element={<Appointment />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;



