import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { auth, storage, db } from "../firebaseConfig";
import { RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"; // Import deleteObject from firebase/storage
import { doc, updateDoc } from "firebase/firestore";
import Navbar from "./Navbar";
import './Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [message, setMessage] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        navigate('/');
      } else {
        setUser(currentUser);
        setUsername(currentUser.displayName || "User");
        setImagePreview(currentUser.photoURL || "");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const requestOTP = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      { size: "invisible" },
      auth
    );
    signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        setVerificationId(confirmationResult.verificationId);
        setMessage("OTP sent. Please check your phone.");
      })
      .catch((error) => {
        setMessage(`Failed to send OTP: ${error.message}`);
      });
  };

  const verifyOTP = () => {
    if (!verificationId) {
      setMessage("Verification ID not set. Request OTP first.");
      return;
    }
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    signInWithCredential(auth, credential)
      .then(() => setMessage("Phone number verified!"))
      .catch((error) => setMessage(`Failed to verify OTP: ${error.message}`));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadProfileImage = async () => {
    if (!profileImage) return;
    const imageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(imageRef, profileImage);
    const url = await getDownloadURL(imageRef);
    await updateProfile(user, { photoURL: url });
    setImagePreview(url);
    setMessage("Profile image updated!");
  };

  const removeProfileImage = async () => {
    if (!user.photoURL) return;
    const imageRef = ref(storage, `profileImages/${user.uid}`);
    await deleteObject(imageRef);
    await updateProfile(user, { photoURL: null });
    setImagePreview("");
    setMessage("Profile image removed!");
  };

  const updateUsername = async () => {
    await updateProfile(user, { displayName: username });
    await updateDoc(doc(db, "users", user.uid), { displayName: username });
    setMessage("Username updated!");
  };

  if (!user) return null;

  return (
    <div className="profile-page-modern-updated">
      <Navbar />
      <div className="profile-container-modern-updated">
        <div className="avatar-modern-updated">
          <img src={imagePreview || "/default-avatar.png"} alt="Profile" className="avatar-img-modern-updated" />
        </div>
        <h2 className="profile-title">Edit Profile</h2>
        <div className="profile-section-updated">
          <input
            type="text"
            placeholder="Update Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-modern-updated"
          />
          <button onClick={updateUsername} className="button-modern-updated">Save Username</button>
        </div>
        <div className="profile-section-updated">
          <input type="file" onChange={handleProfileImageChange} className="input-modern-updated" />
          <button onClick={uploadProfileImage} className="button-modern-updated">Upload Profile Image</button>
          <button onClick={removeProfileImage} className="button-modern-updated">Remove Profile Image</button>
        </div>
        <div className="profile-section-updated">
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="input-modern-updated"
          />
          <button onClick={requestOTP} className="button-modern-updated">Request OTP</button>
        </div>
        <div className="profile-section-updated">
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input-modern-updated"
          />
          <button onClick={verifyOTP} className="button-modern-updated">Verify OTP</button>
        </div>
        <div id="recaptcha-container"></div>
        <p className="message-modern-updated">{message}</p>
      </div>
    </div>
  );
};

export default Profile;
