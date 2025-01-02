import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Signin from './signup/signin/Signin';
import Register from './signup/register/Register';
import Docs from './App_docs'
import White from './whiteboard/White';
import DashboardPage from './components/dashboardpage/DashboardPage';
import TeamPage from '../src/teams/TeamPage';
import GanttChart from '../src/projects/GanttChart';
import ProjectPage from '../src/projects/ProjectPage';
import TaskTracker from '../src/Tasks/TaskTracker';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<App />} />
        <Route exact path="/signin" element={<Signin />} />
        <Route exact path="/register" element={<Register />} />
        <Route path="/docs/:projId" element={<Docs />} />
        <Route exact path="/whiteboard" element={<White />} />
        <Route exact path="/dashboard" element={<DashboardPage />} />
        <Route path="/teams/:teamId" element={<TeamPage />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/planning" element={<GanttChart />} />
        <Route path="/tasktracker" element={<TaskTracker />} />
      </Routes>
    </Router>

  </React.StrictMode>
);


reportWebVitals();
