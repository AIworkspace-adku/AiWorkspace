import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SessionTimeout.css';

const SessionTimeout = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/signin');
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="session-timeout-container">
      <div className="timeout-card">
        <h2>Session Expired</h2>
        <p>Your session has timed out due to inactivity. Please log in again to continue.</p>
        <div className="button-group">
          <button className="btn-primary" onClick={handleLogin}>
            Login Again
          </button>
          <button className="btn-secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
