import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HealthMetric from '../HealthMetric/HealthMetric';
import Symptom from '../Symptom/Symptom';
import Appointment from '../Appointment/Appointment';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user')).id;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phoneNumber);
    } catch (error) {
      console.error('Error fetching user data:', error.response.data);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username,
        email,
        phoneNumber,
      };
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);
      setError('');
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Error updating profile:', error.response.data);
      setError('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      alert('User deleted successfully.');
      localStorage.removeItem('user');
      navigate('/register');
    } catch (error) {
      console.error('Error deleting user:', error.response.data);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="text-center mb-4">Profile</h2>
              {error && <div className="alert alert-danger">{error}</div>}
              {user ? (
                <form onSubmit={handleUpdate}>
                  <div className="form-group mb-3">
                    <label>Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Update Profile
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-block mt-3"
                    onClick={handleDelete}
                  >
                    Delete Profile
                  </button>
                </form>
              ) : (
                <p>Loading profile...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CRUD Components for Health Metrics, Symptoms, and Appointments below the profile */}
      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Manage Health Metrics</h3>
              <HealthMetric />
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Manage Symptoms</h3>
              <Symptom />
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-5 mb-5">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="text-center mb-4">Manage Appointments</h3>
              <Appointment />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


