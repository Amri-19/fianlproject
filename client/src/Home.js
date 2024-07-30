import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Home = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <nav>
        <Link to="/appointments">Make an Appointment</Link>
        <Link to="/admin">Admin Panel</Link>
      </nav>
    </div>
  );
};

export default Home;
