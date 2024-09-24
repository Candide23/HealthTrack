import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      console.error('Error fetching user data:', error);
      setError('Failed to load user data.');
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
      console.error('Error updating profile:', error);
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
      console.error('Error deleting user:', error);
      setError('Failed to delete profile.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center ">Manage Profile</h2>
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
          <button type="submit" className="btn btn-primary btn-sm">
              Update Profile
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
          >
              Delete Profile
          </button>
        </form>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;



