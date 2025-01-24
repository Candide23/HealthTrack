import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';
import Notification from '../Notification/Notification';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const notificationRef = useRef(null); // Reference to Notification component
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
      notificationRef.current(); // Trigger notification refresh
    }
  };

  if (loading) {
    return <div className="text-center">Loading user data...</div>;
  }

  if (!user) {
    return (
      <div className="text-center">
        <p>User data not found. Please log in again.</p>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>

      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <h4>Welcome, {user.username}</h4>
              <p>Email: {user.email}</p>
              <p>Phone Number: {user.phoneNumber}</p>

              <div className="btn-group" role="group">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleLogout}
                >
                  Logout
                </button>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={goToProfile}
                >
                  Manage Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="row">
        <div className="col-md-12">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-info text-white">
              <h5 className="card-title mb-0">Notifications</h5>
            </div>
            <div className="card-body p-3">
              <Notification
                fetchNewNotifications={(fetchNotifications) =>
                  (notificationRef.current = fetchNotifications)
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics, Symptoms, and Appointments */}
      <div className="row">
        <div className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="card-title mb-0">Health Metrics</h5>
            </div>
            <div className="card-body p-3">
              <HealthMetric
                triggerNotificationRefresh={triggerNotificationRefresh}
              />
            </div>
          </div>
        </div>

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























