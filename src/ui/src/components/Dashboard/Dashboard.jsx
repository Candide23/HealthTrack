import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">User Dashboard</h2>

      <div className="row">
        {/* Profile Section */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">User Profile</h5>
              <p className="card-text">View and update your profile details.</p>
              <button className="btn btn-primary" onClick={() => navigate('/profile')}>
                Go to Profile
              </button>
            </div>
          </div>
        </div>

        {/* Health Metrics Section */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Health Metrics</h5>
              <p className="card-text">Track your health metrics like weight, blood pressure, etc.</p>
              <button className="btn btn-success" onClick={() => navigate('/healthmetrics')}>
                View Health Metrics
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Appointments</h5>
              <p className="card-text">Manage your upcoming appointments with doctors or specialists.</p>
              <button className="btn btn-info" onClick={() => navigate('/appointments')}>
                View Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Symptom Tracker Section */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Symptom Tracker</h5>
              <p className="card-text">Log your daily symptoms and track patterns over time.</p>
              <button className="btn btn-warning" onClick={() => navigate('/symptoms')}>
                Track Symptoms
              </button>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="col-12 col-md-6 col-lg-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Settings</h5>
              <p className="card-text">Update account settings and preferences.</p>
              <button className="btn btn-secondary" onClick={() => navigate('/settings')}>
                Account Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

