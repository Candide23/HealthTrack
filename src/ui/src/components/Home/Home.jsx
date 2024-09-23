import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Custom CSS for the homepage

const Home = () => {
  return (
    <div className="home-container">
      <div className="overlay">
        <div className="content text-center">
          <h1 className="display-4 text-light">Welcome to HealthTrack</h1>
          <p className="lead text-light">
            Manage your health metrics, symptoms, and appointments in one place.
          </p>
          <div className="mt-5">
            <Link to="/login" className="btn btn-primary btn-lg mr-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-success btn-lg">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
