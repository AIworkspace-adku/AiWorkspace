import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';
import Signin from './signup/signin/Signin.jsx';
import Register from './signup/register/Register.jsx';
import Docs from './App_docs.js'
import White from './whiteboard/White.jsx';
import DashboardPage from './components/dashboardpage/DashboardPage.jsx';
import TeamPage from '../src/teams/TeamPage.jsx';
// import GanttChart from '../src/projects/GanttChart.jsx';
import ProjectPage from '../src/projects/ProjectPage.jsx';
import TaskTracker from '../src/Tasks/TaskTracker.jsx';
import Profile from '../src/profile/Profile.jsx';
import SessionTimeout from './session/SessionTimeout.jsx';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="/docs" element={<Docs />} />
        <Route exact path="/whiteboard" element={<White />} />
        <Route exact path="/dashboard" element={<DashboardPage />} />
        <Route path="/teams/:teamId" element={<TeamPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        {/* <Route path="/planning" element={<GanttChart />} /> */}
        <Route path="/tasktracker" element={<TaskTracker />} />
        <Route path="/profile" element={<Profile />} />
        <Route exact path="/session-timeout" element={<SessionTimeout />} />
      </Routes>
    </Router>

  </React.StrictMode>
);


reportWebVitals();
