import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center position-relative" style={{ background: '#f8f9fa' }}>
      {/* Clean gradient background */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          opacity: 0.1,
          zIndex: 0
        }}
      />

      <div className="container" style={{ zIndex: 10, position: 'relative' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <div className="text-center">
              {/* Logo */}
              <div className="mb-5">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 shadow-lg"
                  style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                >
                  <i className="bi bi-heart-pulse-fill text-white" style={{ fontSize: '3.5rem' }}></i>
                </div>
              </div>

              {/* Clear Title */}
              <h1 className="display-3 fw-bold mb-4 text-dark">
                Welcome to HealthTrack
              </h1>

              <p className="lead fs-4 mb-5 mx-auto text-secondary" style={{ maxWidth: '700px' }}>
                Your comprehensive health companion for tracking metrics, managing symptoms, and scheduling appointments
              </p>

              {/* Feature Cards */}
              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        <i className="bi bi-graph-up-arrow text-primary" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-3">Track Metrics</h4>
                      <p className="text-muted">Monitor your vital health statistics and visualize trends over time</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        <i className="bi bi-clipboard2-pulse text-success" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-3">Log Symptoms</h4>
                      <p className="text-muted">Keep detailed records of symptoms for better health insights</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body p-4 text-center">
                      <div className="mb-3">
                        <i className="bi bi-calendar-check text-info" style={{ fontSize: '3rem' }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-3">Manage Appointments</h4>
                      <p className="text-muted">Schedule and track all your medical appointments</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5">
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow"
                  style={{ minWidth: '200px' }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-success btn-lg px-5 py-3 rounded-pill fw-bold shadow"
                  style={{ minWidth: '200px' }}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Link>
              </div>

              {/* Footer */}
              <p className="text-muted">
                <i className="bi bi-shield-check me-2"></i>
                Secure, Private, and Always Available
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;