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
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem('authToken');
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
              <li><a href="/docs">Editor</a></li>
              <li><a href="/whiteboard">Whiteboard</a></li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleLogout();
                  }}
                >
                  Logout
                </a>
              </li>
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
