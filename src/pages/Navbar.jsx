import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import './Navbar.css';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    auth.signOut();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        EasyRooms
      </Link>
      <div className="hamburger" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <ul className={`nav-links ${isMenuOpen ? 'expanded' : ''}`}>
        <li><a href="#features">Features</a></li>
        <li><Link to="/rooms">Rooms</Link></li>
        <li><a href="#about">About</a></li>
        <li><a href="/contact">Contact</a></li>
        {user ? (
          <li className="navbar-user">
            <button className="user-button" onClick={toggleDropdown}>
              {user.displayName || 'User'}
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button onClick={() => navigate('/dashboard')}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </li>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
