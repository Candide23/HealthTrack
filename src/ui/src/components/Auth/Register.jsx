import React, { useState } from 'react';
import { AuthAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: ''
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error, info
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    // Username validation
    if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number (at least 10 digits)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;

    const strengthLevels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = ['danger', 'warning', 'warning', 'info', 'success'];

    return {
      level: strengthLevels[strength - 1] || 'Very Weak',
      color: strengthColors[strength - 1] || 'danger',
      percentage: (strength / 5) * 100
    };
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors below');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await AuthAPI.register(formData);

      setMessage('🎉 Registration successful! Redirecting to login...');
      setMessageType('success');

      // Clear form
      setFormData({
        username: '',
        password: '',
        email: '',
        phoneNumber: ''
      });

      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration failed:', err.response?.data || err.message);
      setMessage(err.response?.data?.message || '❌ Registration failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
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
                  <h2 className="fw-bold text-dark mb-2">Create Your Account</h2>
                  <p className="text-muted">Join HealthTrack to start monitoring your health</p>
                </div>

                {/* Message Display */}
                {message && (
                  <div className={`alert alert-${messageType === 'success' ? 'success' : messageType === 'error' ? 'danger' : 'info'} d-flex align-items-center`}>
                    <span className="me-2">
                      {messageType === 'success' ? '✅' : messageType === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    {message}
                  </div>
                )}

                <form onSubmit={handleRegister}>
                  {/* Username Field */}
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-semibold">
                      👤 Username
                    </label>
                    <input
                      type="text"
                      className={`form-control form-control-lg ${validationErrors.username ? 'is-invalid' : formData.username ? 'is-valid' : ''}`}
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a unique username"
                      style={{ borderRadius: '10px' }}
                      required
                    />
                    {validationErrors.username && (
                      <div className="invalid-feedback">{validationErrors.username}</div>
                    )}
                    {formData.username && !validationErrors.username && (
                      <div className="valid-feedback">Looks good!</div>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">
                      🔒 Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className={`form-control form-control-lg ${validationErrors.password ? 'is-invalid' : formData.password && passwordStrength.percentage >= 60 ? 'is-valid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a strong password"
                        style={{ borderRadius: '10px 0 0 10px' }}
                        required
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderRadius: '0 10px 10px 0' }}
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">Password Strength:</small>
                          <small className={`text-${passwordStrength.color} fw-bold`}>
                            {passwordStrength.level}
                          </small>
                        </div>
                        <div className="progress" style={{ height: '4px' }}>
                          <div
                            className={`progress-bar bg-${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {validationErrors.password && (
                      <div className="invalid-feedback d-block">{validationErrors.password}</div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control form-control-lg ${validationErrors.email ? 'is-invalid' : formData.email && !validationErrors.email ? 'is-valid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      style={{ borderRadius: '10px' }}
                      required
                    />
                    {validationErrors.email && (
                      <div className="invalid-feedback">{validationErrors.email}</div>
                    )}
                    {formData.email && !validationErrors.email && (
                      <div className="valid-feedback">Valid email address!</div>
                    )}
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-4">
                    <label htmlFor="phoneNumber" className="form-label fw-semibold">
                      📱 Phone Number
                    </label>
                    <input
                      type="tel"
                      className={`form-control form-control-lg ${validationErrors.phoneNumber ? 'is-invalid' : formData.phoneNumber && !validationErrors.phoneNumber ? 'is-valid' : ''}`}
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      style={{ borderRadius: '10px' }}
                      required
                    />
                    {validationErrors.phoneNumber && (
                      <div className="invalid-feedback">{validationErrors.phoneNumber}</div>
                    )}
                    {formData.phoneNumber && !validationErrors.phoneNumber && (
                      <div className="valid-feedback">Valid phone number!</div>
                    )}
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
                        Creating Account...
                      </>
                    ) : (
                      <>🚀 Create Account</>
                    )}
                  </button>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Already have an account?{' '}
                      <button
                        type="button"
                        className="btn btn-link p-0 text-primary fw-bold"
                        onClick={() => navigate('/login')}
                        style={{ textDecoration: 'none' }}
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-center mt-4">
              <small className="text-white">
                🔒 Your data is secure and protected with industry-standard encryption
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;


