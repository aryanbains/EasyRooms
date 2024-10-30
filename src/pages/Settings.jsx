import React, { useState } from 'react';
import './Settings.css';
import Navbar from './Navbar'; // Import Navbar component

const Settings = () => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveChanges = () => {
    // Logic to save changes
    alert('Settings Updated Successfully');
  };

  return (
    <div className="settings-page">
      <Navbar />
      <div className="settings-container">
        <h2>Settings</h2>
        <div className="settings-section">
          <h3>Account Settings</h3>
          <input 
            type="email" 
            placeholder="Update Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="settings-input" 
          />
          <input 
            type="text" 
            placeholder="Update Phone Number" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            className="settings-input" 
          />
          <input 
            type="password" 
            placeholder="Current Password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            className="settings-input" 
          />
          <input 
            type="password" 
            placeholder="New Password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            className="settings-input" 
          />
          <button onClick={handleSaveChanges} className="settings-button">Save Changes</button>
        </div>
        <div className="settings-section">
          <h3>Notification Settings</h3>
          <label>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={(e) => setNotifications(e.target.checked)} 
            />
            Email Notifications
          </label>
        </div>
        <div className="settings-section">
          <h3>Appearance</h3>
          <label>
            <input 
              type="checkbox" 
              checked={darkMode} 
              onChange={(e) => setDarkMode(e.target.checked)} 
            />
            Dark Mode
          </label>
        </div>
      </div>
    </div>
  );
};

export default Settings;
