import React from 'react';
import './HomePage.css';
import Navbar from './Navbar'; // Import Navbar component

const HomePage = () => {
  return (
    <div className="homepage">
      <Navbar /> {/* Render Navbar here */}

      <header className="hero-section">
        <h1>Welcome to EasyRooms</h1>
        <p>Connect, share, and communicate with your friends effortlessly.</p>
        <a href="/signup" className="btn-primary">Get Started</a>
      </header>

      <section id="features" className="features-section">
        <h2>Features</h2>
        <div className="features-container">
          <div className="feature">
            <h3>Real-Time Messaging</h3>
            <p>Chat in real-time with your friends and family.</p>
          </div>
          <div className="feature">
            <h3>File Sharing</h3>
            <p>Easily share files and media in your conversations.</p>
          </div>
          <div className="feature">
            <h3>Secure and Private</h3>
            <p>Your data is protected with end-to-end encryption.</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <h2>About Us</h2>
        <p>We are a team of developers passionate about creating seamless communication experiences. Our mission is to connect people through technology.</p>
      </section>

      <footer className="footer">
        <p>&copy; 2024 EasyRooms. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
