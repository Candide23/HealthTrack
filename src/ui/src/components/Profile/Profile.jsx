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
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      let userId = null;

      try {
        // Get user ID from localStorage
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        const userData = JSON.parse(storedUser);
        userId = userData?.id;

        if (!userId) {
          setError('User ID not found. Please log in again.');
          setLoading(false);
          setTimeout(() => {
            localStorage.clear();
            navigate('/login');
          }, 2000);
          return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in again.');
          setTimeout(() => {
            localStorage.clear();
            navigate('/login');
          }, 2000);
          return;
        }

        console.log('Fetching user data for ID:', userId);
        console.log('Token:', token);

        const response = await api.get(`/users/${userId}`);

        if (response.data) {
          setUser(response.data);
          setUsername(response.data.username || '');
          setEmail(response.data.email || '');
          setPhoneNumber(response.data.phoneNumber || '');
          setError('');
        } else {
          setError('User data not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);

        if (error.response?.status === 403) {
          try {
            const allUsersResponse = await api.get('/users');
            const currentUser = allUsersResponse.data.find(u => u.id === userId);

            if (currentUser) {
              setUser(currentUser);
              setUsername(currentUser.username || '');
              setEmail(currentUser.email || '');
              setPhoneNumber(currentUser.phoneNumber || '');
              setError('');
              return;
            } else {
              setError('User not found.');
            }
          } catch (fallbackError) {
            console.error('Fallback fetch failed:', fallbackError);
            setError('Access denied. Please log in again.');
            setTimeout(() => {
              localStorage.clear();
              navigate('/login');
            }, 2000);
          }
        } else if (error.response?.status === 404) {
          setError('User not found.');
        } else if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          setTimeout(() => {
            localStorage.clear();
            navigate('/login');
          }, 2000);
        } else {
          setError('Failed to load user data. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const storedUser = localStorage.getItem('user');
      const userData = JSON.parse(storedUser);
      const userId = userData?.id;

      if (!userId) {
        setError('User ID not found. Please log in again.');
        return;
      }

      const updatedUser = {
        username,
        email,
        phoneNumber,
        password: password || undefined,
      };

      const response = await api.put(`/users/${userId}`, updatedUser);

      if (response.data) {
        const updatedUserData = { id: userId, ...updatedUser };
        if (!updatedUserData.password) {
          delete updatedUserData.password;
        }
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        window.dispatchEvent(new Event('storage'));

        setSuccess('Profile updated successfully!');
        setPassword('');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 400) {
        setError('Invalid data provided. Please check your inputs.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        setTimeout(() => {
          localStorage.clear();
          navigate('/login');
        }, 2000);
      } else {
        setError('Failed to update profile. Please try again.');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
      return;
    }

    try {
      const storedUser = localStorage.getItem('user');
      const userData = JSON.parse(storedUser);
      const userId = userData?.id;

      if (!userId) {
        setError('User ID not found.');
        return;
      }

      await api.delete(`/users/${userId}`);
      localStorage.clear();
      navigate('/register');
    } catch (error) {
      console.error('Error deleting profile:', error);
      setError('Failed to delete profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card border-0 shadow-lg rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3" style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-person-circle text-primary fs-2"></i>
                  </div>
                  <h2 className="fw-bold mb-1">Manage Profile</h2>
                  <p className="text-muted">Update your personal information</p>
                </div>

                {/* Alerts */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                    <button type="button" className="btn-close" onClick={() => setError('')}></button>
                  </div>
                )}

                {success && (
                  <div className="alert alert-success alert-dismissible fade show d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>{success}</div>
                    <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                  </div>
                )}

                {user ? (
                  <form onSubmit={handleUpdate}>
                    {/* Username Field */}
                    <div className="mb-4">
                      <label htmlFor="username" className="form-label fw-semibold">
                        <i className="bi bi-person me-2 text-primary"></i>
                        Username
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Enter your username"
                      />
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2 text-primary"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="Enter your email"
                      />
                    </div>

                    {/* Phone Number Field */}
                    <div className="mb-4">
                      <label htmlFor="phoneNumber" className="form-label fw-semibold">
                        <i className="bi bi-telephone me-2 text-primary"></i>
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">
                        <i className="bi bi-lock me-2 text-primary"></i>
                        New Password
                      </label>
                      <input
                        type="password"
                        className="form-control form-control-lg rounded-3"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave blank to keep current password"
                      />
                      <div className="form-text">
                        <i className="bi bi-info-circle me-1"></i>
                        Only fill this if you want to change your password
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-grid gap-3 mt-5">
                      <button type="submit" className="btn btn-primary btn-lg rounded-3 d-flex align-items-center justify-content-center">
                        <i className="bi bi-check-lg me-2"></i>
                        Update Profile
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-lg rounded-3 d-flex align-items-center justify-content-center"
                        onClick={handleDelete}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete Account
                      </button>
                    </div>

                    {/* Back to Dashboard Link */}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => navigate('/dashboard')}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Dashboard
                      </button>
                    </div>
                  </form>
                ) : (
                  <div>
                    {!error && (
                      <div className="alert alert-warning d-flex align-items-center" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        <div>User not found. Please log in again.</div>
                      </div>
                    )}
                    <div className="text-center mt-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => navigate('/login')}
                      >
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Go to Login
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;









