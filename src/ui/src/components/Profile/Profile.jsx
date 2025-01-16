import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    if (!userId) {
      setError('User ID not found. Please log in again.');
      localStorage.clear();
      navigate('/login');
      return;
    }
    fetchUserData();
  }, [navigate, userId]);

  const fetchUserData = async () => {
    try {
      console.log('Fetching user data for ID:', userId);
      const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
      console.log('User data fetched:', response.data);
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phoneNumber) ;
      setPassword(''); // Do not prefill password
      setError('');
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
      setError('Failed to load user data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = {
        username,
        email,
        phoneNumber,
        password: password || undefined, // Do not send password if empty
      };

      console.log('Updating user with data:', updatedUser);
      await axios.put(`http://localhost:8080/api/users/${userId}`, updatedUser);

      // Update localStorage with the new user data
      localStorage.setItem('user', JSON.stringify({ id: userId, ...updatedUser }));

      // Trigger storage event for updates in other components
      window.dispatchEvent(new Event('storage'));

      alert('Profile updated successfully.');
      setError('');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      setError('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }
    try {
      console.log('Deleting user with ID:', userId);
      await axios.delete(`http://localhost:8080/api/users/${userId}`);
      alert('User deleted successfully.');
      localStorage.removeItem('user');
      navigate('/register');
    } catch (error) {
      console.error('Error deleting user:', error.response?.data || error.message);
      setError('Failed to delete profile.');
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Manage Profile</h2>
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
          <div className="form-group mb-3">
            <label>Password (leave blank to keep the current password)</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password (optional)"
            />
          </div>
          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Profile
            </button>
          </div>
        </form>
      ) : (
        <p>User not found.</p>
      )}
    </div>
  );
};

export default Profile;







