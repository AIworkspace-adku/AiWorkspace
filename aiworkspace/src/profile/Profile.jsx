import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teams, setTeams] = useState(['Team Alpha', 'Team Beta']); // Dummy data
  const [tasks, setTasks] = useState([]); // Dummy tasks for calendar
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
      method: 'POST',
      credentials: 'include',
      withCredentials: true, // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/session-timeout');
          }
          else {
            throw new Error('Failed to fetch data');
          }
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setEmail(data.email);
        setUsername(data.username);
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message)
      });
  }

  if (!data) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/profile/update`, {
        username,
        oldEmail: data.email,
        email,
        password
      })
      .then (response => {
        console.log(response.data);
        fetchUserData();
        alert('Changes saved!');
      })
      .catch(error => {
        console.log(error);
      });
    }
    catch (error) {
      console.log(error);
      alert("Error while updating profile");
    }
  };

  const handleAddTask = (date, task) => {
    setTasks([...tasks, { date, task }]);
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Profile</h1>
        <p>Manage your account settings and tasks</p>
      </div>

      {/* Account Section */}
      <div className="account-section">
        <h2>Account Details</h2>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <div className="password-container">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
        <button className="save-button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </div>

      {/* Notifications Section */}
      <div className="notifications-section">
        <h2>Notifications</h2>
        <ul>
          {teams.length > 0 ? (
            teams.map((team, index) => (
              <li key={index} className="notification-item">
                You have been added to <strong>{team}</strong>
              </li>
            ))
          ) : (
            <p>No team invitations</p>
          )}
        </ul>
      </div>

      {/* Calendar Section */}
      <div className="calendar-section">
        <h2>Calendar</h2>
        <div className="calendar-container">
          <input
            type="date"
            onChange={(e) => handleAddTask(e.target.value, 'New Task')}
          />
          <ul>
            {tasks.map((task, index) => (
              <li key={index} className="task-item">
                {task.date}: {task.task}
                <button onClick={() => handleDeleteTask(index)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
