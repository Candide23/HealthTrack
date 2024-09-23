import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import the CSS for custom styles

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to MediTrack</h1>
        <p className="home-description">
          Track your health metrics, log symptoms, and manage medical appointments in one convenient place.
        </p>
        <div className="home-buttons">
          <Link to="/login" className="btn btn-primary home-btn">Login</Link>
          <Link to="/register" className="btn btn-outline-primary home-btn">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
