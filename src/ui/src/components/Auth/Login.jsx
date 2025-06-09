import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthAPI } from '../../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user came from registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
      setShowWelcomeMessage(true);
      setTimeout(() => setShowWelcomeMessage(false), 5000);
    }

    // Check for remembered credentials
    const rememberedUsername = localStorage.getItem('rememberedUsername');
    if (rememberedUsername) {
      setFormData(prev => ({ ...prev, username: rememberedUsername }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await AuthAPI.login(formData.username.trim(), formData.password);

      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', formData.username.trim());
      } else {
        localStorage.removeItem('rememberedUsername');
      }

      // Show success message briefly
      setError('');

      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err.response ? err.response.data : err.message);

      // Handle different types of errors
      if (err.response?.status === 401) {
        setError('❌ Invalid username or password. Please check your credentials.');
      } else if (err.response?.status === 429) {
        setError('⏰ Too many login attempts. Please try again later.');
      } else if (err.response?.status >= 500) {
        setError('🔧 Server error. Please try again in a few moments.');
      } else {
        setError('❌ Login failed. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('🔄 Forgot password functionality will be implemented soon. Please contact support for now.');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 18) return '☀️ Good Afternoon';
    return '🌙 Good Evening';
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="mb-3">
                    <div className="d-inline-flex align-items-center justify-content-center bg-primary rounded-circle"
                         style={{ width: '80px', height: '80px' }}>
                      <span style={{ fontSize: '2rem' }}>🏥</span>
                    </div>
                  </div>
                  <h2 className="fw-bold text-dark mb-2">Welcome Back!</h2>
                  <p className="text-muted">{getGreeting()}, please sign in to your account</p>
                </div>

                {/* Welcome Message for New Users */}
                {showWelcomeMessage && (
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <span className="me-2">🎉</span>
                    Registration successful! Please sign in with your new account.
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center mb-4">
                    <span className="me-2">⚠️</span>
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      👤 Username
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${error ? 'is-invalid' : formData.username ? 'is-valid' : ''}`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter your username"
                      style={{ borderRadius: '10px' }}
                      autoComplete="username"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      🔒 Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${error ? 'is-invalid' : formData.password ? 'is-valid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        style={{ borderRadius: '10px 0 0 10px' }}
                        autoComplete="current-password"
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 10px 10px 0' }}
                        tabIndex={-1}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      <label className="form-check-label text-muted" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="btn btn-link p-0 text-primary"
                      onClick={handleForgotPassword}
                      style={{ textDecoration: 'none' }}
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    style={{ borderRadius: '10px', background: 'linear-gradient(45deg, #667eea, #764ba2)' }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : (
                      <>🚀 Sign In</>
                    )}
                  </button>

                  {/* Register Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 text-primary fw-bold"
                        onClick={() => navigate('/register')}
                        style={{ textDecoration: 'none' }}
                      >
                        Create one here
                      </button>
                    </p>
                  </div>
                </form>

                {/* Demo Credentials (Remove in production) */}
                <div className="mt-4 p-3 bg-light rounded" style={{ borderRadius: '10px' }}>
                  <h6 className="text-muted mb-2">🧪 Demo Credentials:</h6>
                  <div className="row">
                    <div className="col-6">
                      <small className="text-muted d-block">Username:</small>
                      <code className="text-primary">demo_user</code>
                    </div>
                    <div className="col-6">
                      <small className="text-muted d-block">Password:</small>
                      <code className="text-primary">demo123</code>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm mt-2 w-100"
                    onClick={() => {
                      setFormData({ username: 'demo_user', password: 'demo123' });
                      setError('');
                    }}
                  >
                    Use Demo Credentials
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-white">
                🔒 Secure login with encrypted data transmission
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


