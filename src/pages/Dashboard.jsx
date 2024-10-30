import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { signOut, updatePassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Navbar from './Navbar';
import DefaultAvatar from '../icons/default-avatar.svg'; // Default avatar image

const Dashboard = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUsername(user.displayName || 'User');
                setImagePreview(user.photoURL || DefaultAvatar);
            } else {
                navigate('/'); // Redirect to login if user is not authenticated
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/'); // Redirect to login on logout
    };

    const handleSaveChanges = async () => {
        if (username) {
            await updateProfile(auth.currentUser, { displayName: username });
        }
        if (password) {
            await updatePassword(auth.currentUser, password);
        }
        alert('Profile Updated Successfully');
        setIsEditing(false);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.classList.toggle('dark-theme');
    };

    return (
        <div className={`dashboard-wrapper ${darkMode ? 'dark' : ''}`}>
            <Navbar />
            <header className="dashboard-header">
                <div className="user-info">
                    <img src={imagePreview} alt="Profile" className="profile-picture" />
                    <h2>Welcome, {username}</h2>
                </div>
                <div className="header-buttons">
                    <button onClick={toggleDarkMode}>
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <section className="quick-links">
                <div className="card" onClick={() => navigate('/profile')}>
                    <h3>Profile</h3>
                    <p>View and edit your personal details</p>
                </div>
                <div className="card" onClick={() => navigate('/settings')}>
                    <h3>Settings</h3>
                    <p>Manage account preferences</p>
                </div>
                <div className="card">
                    <h3>Activity Log</h3>
                    <p>Check your recent activities</p>
                </div>
            </section>
            {isEditing ? (
                <div className="edit-profile">
                    <h3>Edit Profile</h3>
                    <input
                        type="text"
                        placeholder="Change Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleSaveChanges}>Save Changes</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    Edit Profile
                </button>
            )}
        </div>
    );
};

export default Dashboard;
