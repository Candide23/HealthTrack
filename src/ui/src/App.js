import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';  // Import Home component
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard'; // Import Dashboard component
import HealthMetric from './components/HealthMetric/HealthMetric';
import Symptom from './components/Symptom/Symptom';
import Appointment from './components/Appointment/Appointment';
import Profile from './components/Profile/Profile';
import Notification from './components/Notification/Notification';



function App() {
  return (
    <Router>
      <Routes>
        {/* Home Route */}
        <Route path="/" element={<Home />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* Profile Management */}


        {/* Other Routes */}
        <Route path="/healthmetrics" element={<HealthMetric />} />
        <Route path="/symptoms" element={<Symptom />} />
        <Route path="/appointments" element={<Appointment />} />
        <Route path="/notification" element={<Notification />} /> {/* Notifications Management */}

      </Routes>
    </Router>
  );
}

export default App;








