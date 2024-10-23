import React, { useEffect, useState } from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import { auth, firebaseConfig } from '../firebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber, updateProfile } from 'firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [countryCode, setCountryCode] = useState('+1'); // Default country code
  
  // Initialize Recaptcha
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        'recaptcha-container',
        { size: 'invisible' },
        auth
      );
    }
  };

  // Check if the user is logged in
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/'); // Redirect to login if user isn't logged in
      } else {
        setUser(currentUser); // Set user details
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, [navigate]);

  // Send SMS Verification
  const handleSendSMS = async (e) => {
    e.preventDefault();
    try {
      setupRecaptcha();
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhoneNumber, window.recaptchaVerifier);
      setVerificationId(confirmationResult.verificationId);
      setVerificationStatus('Verification code sent!');
    } catch (error) {
      console.error('Error sending SMS:', error);
      setVerificationStatus('Failed to send SMS. Please try again.');
    }
  };

  // Verify Code and Link Phone Number
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      const credential = auth.PhoneAuthProvider.credential(verificationId, verificationCode);
      await auth.currentUser.linkWithCredential(credential); // Link phone number with user
      await updateProfile(auth.currentUser, { phoneNumber: `${countryCode}${phoneNumber}` });
      setVerificationStatus('Phone number verified and linked successfully!');
    } catch (error) {
      console.error('Error verifying code:', error);
      setVerificationStatus('Invalid code. Please try again.');
    }
  };

  if (!user) return null; // Show nothing while loading

  return (
    <div className="profile-container">
      {/* User Avatar with Initials */}
      <div className="avatar">
        <span>{user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}</span>
      </div>
      <h2>{user.displayName || 'User Name'}</h2>
      <p>Email: {user.email || 'Email not available'}</p>
      <p>Phone: {user.phoneNumber || 'Not linked yet'}</p>

      <form onSubmit={handleSendSMS}>
        <div className="phone-input">
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            <option value="+1">+1 (USA)</option>
            <option value="+91">+91 (India)</option>
            <option value="+44">+44 (UK)</option>
            <option value="+61">+61 (Australia)</option>
          </select>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Verification Code</button>
      </form>

      <form onSubmit={handleVerifyCode}>
        <input
          type="text"
          placeholder="Enter verification code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
          required
        />
        <button type="submit">Verify and Link Phone</button>
      </form>

      {verificationStatus && <p>{verificationStatus}</p>}
      <div id="recaptcha-container"></div> {/* Recaptcha container */}
    </div>
  );
};

export default Profile;
