import React, { useEffect, useState } from 'react';
import api from '../../services/api';
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
      const response = await api.get(`/users/${userId}`);
      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPhoneNumber(response.data.phoneNumber);
      setPassword(''); // Do not prefill password
      setError('');
    } catch (error) {
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
        password: password || undefined,
      };

      await api.put(`/users/${userId}`, updatedUser);

      localStorage.setItem('user', JSON.stringify({ id: userId, ...updatedUser }));

      window.dispatchEvent(new Event('storage'));

      alert('Profile updated successfully.');
      setError('');
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to update profile.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }
    try {
      await api.delete(`/users/${userId}`);
      alert('User deleted successfully.');
      localStorage.removeItem('user');
      navigate('/register');
    } catch (error) {
      setError('Failed to delete profile.');
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '500px' }}>
        <div className="card-header bg-primary text-white text-center">
          <h3>Manage Profile</h3>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {user ? (
            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label small">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label small">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control form-control-sm"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phoneNumber" className="form-label small">
                  Phone Number
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label small">
                  Password (leave blank to keep current password)
                </label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (optional)"
                />
              </div>
              <div className="d-flex justify-content-between mt-3">
                <button type="submit" className="btn btn-success btn-sm">
                  Update Profile
                </button>
                <button type="button" className="btn btn-danger btn-sm" onClick={handleDelete}>
                  Delete Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="alert alert-warning">User not found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;










