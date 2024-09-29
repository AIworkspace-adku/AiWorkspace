import React, { useState } from 'react';
import './Signin.css';
import Navbar from '../../components/navbar/Navbar';

const Signin = () => {
  const [isSignup, setIsSignup] = useState(false);

  const toggleForm = () => {
    setIsSignup(!isSignup);
  };

  return (
    
    <div className="signin-container">
      <div className="form-wrapper">
        <div className="form-container">
          <div className="glass-card">
            <h2 className="title">{isSignup ? 'Register' : 'Login'}</h2>
            <form className="form">
              <div className="input-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" required />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" required />
              </div>

              {isSignup && (
                <>
                  <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                      type="password"
                      name="confirm-password"
                      id="confirm-password"
                      required
                    />
                  </div>
                </>
              )}
              

              

              <button type="submit" className="btn">
                {isSignup ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <p className="toggle-message">
              {isSignup
                ? 'Already have an account?'
                : "Don't have an account?"}{' '}
              <span onClick={toggleForm} className="toggle-link">
                {isSignup ? 'Login' : 'Register'}
              </span>
            </p>

            <div className="social-message">
              <div className="line" />
              <p className="message">or continue with</p>
              <div className="line" />
            </div>

            <button className="btn google-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="google-icon"
              >
                <path
                  fill="#4285F4"
                  d="M44.5 20H24v8.5h11.8C34.9 33.5 30 36 24 36c-7 0-13-6-13-13s6-13 13-13c3 0 5.6 1.1 7.6 3l5.8-5.8C33.7 4.3 29.2 2.5 24 2.5 12.8 2.5 3.5 11.8 3.5 23S12.8 43.5 24 43.5c10.5 0 19.5-8 19.5-19.5 0-1-.1-2-.3-3z"
                />
                <path
                  fill="#34A853"
                  d="M10.5 14.7l6.5 4.8C19.5 16 21.6 15 24 15c3 0 5.6 1.1 7.6 3l5.8-5.8C33.7 4.3 29.2 2.5 24 2.5c-6.5 0-12.1 3.6-15 9l-6-4.5z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 43.5c5.2 0 9.7-1.8 13.1-4.8l-5.8-4.5c-1.7 1.2-3.8 2-6.3 2-6 0-10.9-4.4-11.8-10.2l-6.5 5c3.1 5.9 9.4 10 16.5 10z"
                />
                <path
                  fill="#EA4335"
                  d="M44.5 20H24v8.5h11.8C34.9 33.5 30 36 24 36c-7 0-13-6-13-13s6-13 13-13c3 0 5.6 1.1 7.6 3l5.8-5.8C33.7 4.3 29.2 2.5 24 2.5 12.8 2.5 3.5 11.8 3.5 23S12.8 43.5 24 43.5c10.5 0 19.5-8 19.5-19.5 0-1-.1-2-.3-3z"
                />
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
