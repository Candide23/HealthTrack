import React from 'react';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';
import './Dashboard.css'; // Custom styles for the dashboard

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')); // Get logged-in user data from localStorage

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
              <HealthMetric />
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
              <Symptom />
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
              <Appointment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;











