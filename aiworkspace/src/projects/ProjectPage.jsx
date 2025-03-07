// frontend/src/ProjectPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaComments, FaVideo, FaTasks, FaFileAlt, FaLightbulb, FaRobot } from 'react-icons/fa';
import Sidebar from '../components/dashboardpage/Sidebar.jsx';
import TaskTracker from '../Tasks/TaskTracker.jsx';
import Docs from '../App_docs.js';
import Gpt from '../chatGpt/Gpt.jsx';
import styles from './ProjectPage.module.css';
import Scheduler from './Scheduler.jsx';
import FloatingChat from '../components/FloatingChat.jsx'; // Add this import

const ProjectPage = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('task');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [teamId, setTeamId] = useState(null);
  const [showChat, setShowChat] = useState(false); // Add this state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
          method: 'POST',
          credentials: 'include',
          withCredentials: true,
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/session-timeout');
          } else {
            throw new Error('Failed to fetch data');
          }
        }
        const userData = await response.json();
        updateLastAccess();
        setData(userData);

        const projectRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}`, {
          withCredentials: true,
        });
        setTeamId(projectRes.data.owner.teamId);
      } catch (error) {
        console.log(error);
        setError(error.message);
      }
    };

    const updateLastAccess = () => {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}/last-access`, { withCredentials: true })
        .then((response) => console.log(response.data))
        .catch((error) => setError(error.message));
    };

    fetchData();
  }, [projectId, navigate]);

  if (!data || !projectId) {
    return <div>Loading...</div>;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'task':
        return <TaskTracker projId={projectId} userData={data} />;
      case 'documentation':
        return <Docs projId={projectId} />;
      case 'gpt':
        return <Gpt />;
      case 'scheduler':
        return <Scheduler projectId={projectId} />;
      default:
        return <div>Select an option from the navbar</div>;
    }
  };

  return (
    <div className={styles.projectPage}>
      <Sidebar setData={setData} userData={data} />
      <div className={styles.mainContent}>
        <div className={styles.topRightButtons}>
          <button onClick={() => setShowChat(true)} className={styles.chatButton}>
            <FaComments /> Chat
          </button>
          <a href='/meeting' className={styles.videoCallButton}>
            <FaVideo /> Video Call
          </a>
        </div>
        <div className={styles.floatingNavbar}>
          <button
            className={`${styles.navButton} ${activeTab === 'task' ? styles.active : ''}`}
            onClick={() => setActiveTab('task')}
          >
            <FaTasks /> Task
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'documentation' ? styles.active : ''}`}
            onClick={() => setActiveTab('documentation')}
          >
            <FaFileAlt /> Documentation
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'gpt' ? styles.active : ''}`}
            onClick={() => setActiveTab('gpt')}
          >
            <FaRobot /> GPT
          </button>
          <button
            className={`${styles.navButton} ${activeTab === 'scheduler' ? styles.active : ''}`}
            onClick={() => setActiveTab('scheduler')}
          >
            Scheduler
          </button>
        </div>
        <div className={styles.pageContent}>{renderActiveComponent()}</div>
      </div>
      {showChat && teamId && (
        <FloatingChat teamId={teamId} onClose={() => setShowChat(false)} />
      )}
    </div>
  );
};

export default ProjectPage;