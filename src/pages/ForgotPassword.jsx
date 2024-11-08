import React, { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import './ForgotPassword.css'; // Updated CSS file name

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
      setError('');
      setEmail(''); // Clear the input field
    } catch (err) {
      setError('Error sending password reset email. Please try again.');
      setMessage('');
    }
  };

  return (
    <div className="forgot-password-page-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="forgot-password-success-message">{message}</p>}
      {error && <p className="forgot-password-error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
