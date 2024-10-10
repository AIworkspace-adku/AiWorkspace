import React, { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className={`nav ${menuActive ? 'affix' : ''}`}>
      <div className="container">
        <div className="logo">
          <a href="#">Workspace</a>
        </div>
        <div id="mainListDiv" className={`main_list ${menuActive ? 'show_list' : ''}`}>
          <ul className="navlinks">
            <li><a href="#">Home</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="/docs">editor</a></li>
            <li><a href="/whiteboard">whiteboard</a></li>
          </ul>
        </div>
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
