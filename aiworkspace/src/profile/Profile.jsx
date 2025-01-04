import React, { useState } from 'react';
import './Profile.css';

const Profile = () => {
  const [username, setUsername] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [teams, setTeams] = useState(['Team Alpha', 'Team Beta']); // Dummy data
  const [tasks, setTasks] = useState([]); // Dummy tasks for calendar

  const handleSaveChanges = () => {
    alert('Changes saved!'); // Placeholder for actual functionality
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
          />
        </div>
        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
