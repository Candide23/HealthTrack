import React from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';
import './Dashboard.css'; // Custom styles for the dashboard

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user data from localStorage
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user from localStorage
    navigate('/login'); // Redirect to login page
    navigate('/'); // Redirect to home page after logout

  };

  // Navigate to the Profile page
  const goToProfile = () => {
    navigate('/profile'); // Assuming you have a route for profile management
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>

      {/* User Welcome Section */}
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <h4>Welcome, {user ? user.username : 'User'}</h4>
              <p>Email: {user ? user.email : ''}</p>
              <p>Phone Number: {user ? user.phoneNumber : ''}</p>

              {/* Add Logout Button */}
              <button className="btn btn-danger  btn-sm" onClick={handleLogout}>
                Logout
              </button>

              {/* Button to go to Profile */}
              <button className="btn btn-primary  btn-sm" onClick={goToProfile}>
                Manage Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout for Health Metrics, Symptoms, and Appointments */}
      <div className="row">
        {/* Health Metrics */}
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Health Metrics</h5>
            </div>
            <div className="card-body p-3">
              <HealthMetric /> {/* Just summary */}
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-success text-white">
              <h5 className="card-title mb-0">Symptoms</h5>
            </div>
            <div className="card-body p-3">
              <Symptom /> {/* Just summary */}
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-warning text-white">
              <h5 className="card-title mb-0">Appointments</h5>
            </div>
            <div className="card-body p-3">
              <Appointment /> {/* Just summary */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;













