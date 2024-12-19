import React, { useState } from 'react';
import './Navbar.css';
import axios from 'axios';

const Navbar = ({ setData, data }) => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = async () => {
    try {
      // Send request to the logout endpoint
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });

      // Clear any client-side stored data (if applicable)
      localStorage.removeItem('authToken'); // If you store a token locally
      setData(null);
      alert('Logged out successfully!');

    } catch (error) {
      console.error('Error logging out:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <nav className={`nav ${menuActive ? 'affix' : ''}`}>
      <div className="container">
        <div className="logo">
          <a href="#">Workspace</a>
        </div>
        {data && (
          <div id="mainListDiv" className={`main_list ${menuActive ? 'show_list' : ''}`}>
          <ul className="navlinks">
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="/docs">editor</a></li>
            <li><a href="/whiteboard">whiteboard</a></li>
            <li><a onClick={(e) => {
              e.preventDefault(); // Prevent the link from reloading the page
              handleLogout();     // Trigger logout logic
            }}>logout</a></li>
          </ul>
        </div>
        )}
        <span className={`navTrigger ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
          <i></i>
          <i></i>
          <i></i>
        </span>
      </div>
    </nav>
  );
};

export default Navbar;
