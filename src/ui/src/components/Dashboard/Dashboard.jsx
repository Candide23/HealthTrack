import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';
import Notification from '../Notification/Notification';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (!savedUser) {
      navigate('/login');
    } else {
      setUser(savedUser);
    }
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const triggerNotificationRefresh = () => {
    if (notificationRef.current) {
      notificationRef.current();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <p>User data not found. Please log in again.</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header bg-white shadow-sm mb-4">
        <div className="container-fluid">
          <div className="row align-items-center py-3">
            <div className="col-md-6">
              <h2 className="mb-0">
                <span className="text-primary">👋</span> Welcome back, {user.username}!
              </h2>
              <p className="text-muted mb-0 small">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className="col-md-6 text-md-right">
              <button
                className="btn btn-outline-primary btn-sm mr-2"
                onClick={goToProfile}
              >
                <i className="fas fa-user"></i> Profile
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {/* Notifications Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm notification-card">
              <div className="card-header bg-gradient-info text-white border-0">
                <h5 className="mb-0">
                  <i className="fas fa-bell"></i> Notifications
                </h5>
              </div>
              <div className="card-body">
                <Notification
                  fetchNewNotifications={(fetchNotifications) =>
                    (notificationRef.current = fetchNotifications)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="row">
          {/* Health Metrics */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100 metric-card">
              <div className="card-header bg-gradient-primary text-white border-0">
                <h5 className="mb-0">
                  <i className="fas fa-heartbeat"></i> Health Metrics
                </h5>
              </div>
              <div className="card-body">
                <HealthMetric
                  triggerNotificationRefresh={triggerNotificationRefresh}
                />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100 symptom-card">
              <div className="card-header bg-gradient-success text-white border-0">
                <h5 className="mb-0">
                  <i className="fas fa-notes-medical"></i> Symptoms
                </h5>
              </div>
              <div className="card-body">
                <Symptom />
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="col-lg-4 col-md-12 mb-4">
            <div className="card border-0 shadow-sm h-100 appointment-card">
              <div className="card-header bg-gradient-warning text-white border-0">
                <h5 className="mb-0">
                  <i className="fas fa-calendar-check"></i> Appointments
                </h5>
              </div>
              <div className="card-body">
                <Appointment />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="row mt-4">
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm text-center quick-stat">
              <div className="card-body">
                <i className="fas fa-heartbeat text-danger fa-2x mb-2"></i>
                <h6 className="text-muted">Health Status</h6>
                <h4 className="text-success">Good</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm text-center quick-stat">
              <div className="card-body">
                <i className="fas fa-calendar text-primary fa-2x mb-2"></i>
                <h6 className="text-muted">Next Appointment</h6>
                <h4 className="text-primary">--</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm text-center quick-stat">
              <div className="card-body">
                <i className="fas fa-pills text-warning fa-2x mb-2"></i>
                <h6 className="text-muted">Active Medications</h6>
                <h4 className="text-warning">0</h4>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6 mb-3">
            <div className="card border-0 shadow-sm text-center quick-stat">
              <div className="card-body">
                <i className="fas fa-clipboard-list text-info fa-2x mb-2"></i>
                <h6 className="text-muted">Recent Symptoms</h6>
                <h4 className="text-info">0</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;























