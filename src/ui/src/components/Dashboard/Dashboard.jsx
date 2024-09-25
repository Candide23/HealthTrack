import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';
import './Dashboard.css'; 

const Dashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))); 
  const navigate = useNavigate();

 
  useEffect(() => {
    const updatedUser = JSON.parse(localStorage.getItem('user'));
    if (!updatedUser) {
      navigate('/login'); 
    }
    setUser(updatedUser);
  }, [navigate]);


  const handleLogout = () => {
    localStorage.clear(); 
    navigate('/'); 
  };

    const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Dashboard</h2>

   
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <h4>Welcome, {user ? user.username : 'User'}</h4>
              <p>Email: {user ? user.email : ''}</p>
              <p>Phone Number: {user ? user.phoneNumber : ''}</p>

          
              <div className="btn-group" role="group">
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
                <button className="btn btn-primary btn-sm" onClick={goToProfile}>
                  Manage Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
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















