import React, { useEffect } from 'react';
import './Hero.css';
import Navbar from '../navbar/Navbar.jsx';

const Hero = ({ data }) => {
  useEffect(() => {
    const dustContainer = document.querySelector('.dust-container');

    // Generate initial particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'dust-particle';
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDelay = `${Math.random() * 4}s`;
      dustContainer.appendChild(particle);
    }

    // Cursor tracking effect
    const handleMouseMove = (e) => {
      const particles = document.querySelectorAll('.dust-particle');
      particles.forEach((particle) => {
        const rect = particle.getBoundingClientRect();
        const distanceX = e.clientX - rect.left;
        const distanceY = e.clientY - rect.top;
        const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);

        // Apply a small offset based on cursor proximity
        const maxOffset = 20; // Maximum offset distance
        const offsetX = maxOffset * (distanceX / distance) * Math.min(1 / distance, 0.1);
        const offsetY = maxOffset * (distanceY / distance) * Math.min(1 / distance, 0.1);

        particle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="hero-container">

      <div className="hero-content">
        
        <h1 className="hero-title">AI-Powered Workspace for Teams</h1>
        <p className="hero-tagline">
          Improve your project management and team efficiency with the help of AI and us
        </p>
        <div className="hero-buttons">
          <a href="/signin" className="cta-button primary">Start for Free</a>
        </div>
      </div>

      <div className="dust-container"></div>
    </div>
  );
};

export default Hero;
