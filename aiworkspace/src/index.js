import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';


// Lazy-loaded components
const Signin = lazy(() => import('./signup/signin/Signin.jsx'));
const Register = lazy(() => import('./signup/register/Register.jsx'));
const Docs = lazy(() => import('./App_docs.js'));
const White = lazy(() => import('./whiteboard/White.jsx'));
const DashboardPage = lazy(() => import('./components/dashboardpage/DashboardPage.jsx'));
const TeamPage = lazy(() => import('../src/teams/TeamPage.jsx'));
const ProjectPage = lazy(() => import('../src/projects/ProjectPage.jsx'));
const TaskTracker = lazy(() => import('../src/Tasks/TaskTracker.jsx'));
const Profile = lazy(() => import('../src/profile/Profile.jsx'));
const SessionTimeout = lazy(() => import('./session/SessionTimeout.jsx'));
const Scheduler =lazy(() => import('../src/projects/Scheduler.jsx'));
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route exact path="/" element={<App />} />
          <Route exact path="/signin" element={<Signin />} />
          <Route exact path="/register" element={<Register />} />
          <Route path="/docs" element={<Docs />} />
          <Route exact path="/whiteboard" element={<White />} />
          <Route exact path="/dashboard" element={<DashboardPage />} />
          <Route path="/teams/:teamId" element={<TeamPage />} />
          <Route path="/projects/:projectId" element={<ProjectPage />} />
          <Route path="/tasktracker" element={<TaskTracker />} />
          <Route path="/profile" element={<Profile />} />
          <Route exact path="/session-timeout" element={<SessionTimeout />} />
          <Route path="/scheduler" element={<Scheduler />} />
        </Routes>
      </Suspense>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
