import React, { useState } from 'react';
import Navbar from '../Navbar';
import './ContactPage.css';
import { db } from '../../firebaseConfig'; // Adjust the import path as needed
import { collection, addDoc } from 'firebase/firestore';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'contacts'), {
        name,
        email,
        message,
        timestamp: new Date(),
      });

      alert('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <h2>Contact Us</h2>
        <p>We'd love to hear from you. Please fill out the form below and we'll get in touch with you shortly.</p>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="contact-input"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            className="contact-input"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="contact-input"
            placeholder="Your Message"
            rows="5"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <button type="submit" className="contact-button">Send Message</button>
        </form>
      </div>
    </>
  );
};

export default ContactPage;
