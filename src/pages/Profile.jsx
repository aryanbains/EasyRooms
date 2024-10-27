import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebaseConfig"; // Ensure this is the correct import
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential } from 'firebase/auth';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");

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

  const requestOTP = () => {
    const recaptchaVerifier = new RecaptchaVerifier("recaptcha-container", { size: "invisible" }, auth);

    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId); // Save the verification ID
        setMessage("OTP sent. Please check your phone.");
      })
      .catch((error) => {
        setMessage(`Failed to send OTP: ${error.message}`);
      });
  };

  const verifyOTP = () => {
    if (!verificationId) {
      setMessage("Verification ID is not set. Please request OTP first.");
      return;
    }

    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential) // Use signInWithCredential from 'firebase/auth'
      .then(() => {
        setMessage("Phone number verified!");
      })
      .catch((error) => {
        setMessage(`Failed to verify OTP: ${error.message}`);
      });
  };

  if (!user) return null; // Show nothing while loading

  return (
    <div>
      <h2>Profile Page</h2>
      <p>Name: {user.displayName || 'User Name'}</p>
      <p>Email: {user.email || 'Email not available'}</p>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={requestOTP}>Request OTP</button>
      <input
        type="text"
        placeholder="OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verifyOTP}>Verify OTP</button>
      <div id="recaptcha-container"></div>
      <p>{message}</p>
    </div>
  );
};

export default Profile;
