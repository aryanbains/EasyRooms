import React, { useEffect, useState } from 'react';
import './HomePage.css';
import Navbar from './Navbar';
import emailjs from 'emailjs-com';

const HomePage = () => {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        target.scrollIntoView({ behavior: 'smooth' });
      }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email address");
      return;
    }

    const templateParams = {
      to_email: email,
      from_name: 'EasyRooms Team',
      from_email: 'noreply@easyrooms.com',
    };

    emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.REACT_APP_EMAILJS_USER_ID
    ).then((response) => {
      console.log('Email sent successfully!', response.status, response.text);
      alert(`Invitation sent to ${email}`);
      setEmail('');
    }, (error) => {
      console.log('Failed to send email.', error);
      alert('Failed to send the invitation. Please try again.');
    });
  };

  return (
    <div className="homepage">
      <Navbar />
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
      <section id="testimonials" className="testimonials-section">
        <h2>What Our Users Say</h2>
        <div className="testimonials-container">
          <div className="testimonial">
            <p>"EasyRooms has changed the way I communicate with my friends. It's fast, secure, and user-friendly."</p>
            <h4>- Jane Doe</h4>
          </div>
          <div className="testimonial">
            <p>"The file sharing feature is a game-changer. I can send important documents instantly without any hassle."</p>
            <h4>- John Smith</h4>
          </div>
          <div className="testimonial">
            <p>"I love the real-time messaging and the security features. EasyRooms ensures my conversations are private."</p>
            <h4>- Sarah Johnson</h4>
          </div>
        </div>
      </section>
      <section id="invite" className="invite-section">
        <h2>Invite Your Friends</h2>
        <p>Enter your friend's email address to send them an invitation:</p>
        <div className="invite-form">
          <input
            type="email"
            placeholder="Friend's Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleInvite} className="btn-primary">Invite</button>
        </div>
      </section>
      <footer className="footer">
        <p>&copy; 2024 EasyRooms. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
