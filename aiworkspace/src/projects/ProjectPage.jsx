import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaComments, FaVideo, FaTasks, FaFileAlt, FaLightbulb, FaRobot } from "react-icons/fa";
import Sidebar from "../components/dashboardpage/Sidebar.jsx"; // Ensure Sidebar is consistent
import TaskTracker from "../Tasks/TaskTracker.jsx"; // Import your task tracker component
// import GanttChart from "../projects/GanttChart"; // Dummy planning component
import Docs from "../App_docs.js"; // Dummy documentation component
import Gpt from "../chatGpt/Gpt.jsx"; // Dummy GPT component
import styles from "./ProjectPage.module.css";
import Scheduler from "./Scheduler.jsx";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("task"); // Default tab: Task
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the protected route
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/protected`, {
      method: "POST",
      credentials: "include",
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
        updateLastAccess();
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });

      const updateLastAccess = () => {
        console.log("Updating last access");
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/projects/${projectId}/last-access`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            setError(error.message);
          });
      }
  }, []);

  if (!data || !projectId) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "task":
        return <TaskTracker projId={projectId} userData = {data} />;
      case "planning":
        // return <GanttChart />;
      case "documentation":
        return <Docs projId={projectId} />;
      case "gpt":
        return <Gpt />;
        case "scheduler":
          return <Scheduler projectId = {projectId} />;
      default:
        return <div>Select an option from the navbar</div>;
    }
  };

  return (
    <div className={styles.projectPage}>
      {/* Sidebar */}
      <Sidebar setData={setData} userData={data} />

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Top Right Chat & Video Call Buttons */}
        <div className={styles.topRightButtons}>
          <a href="#" className={styles.chatButton}>
            <FaComments /> Chat
          </a>
          <a href="#" className={styles.videoCallButton}>
            <FaVideo /> Video Call
          </a>
        </div>

        {/* Floating Navbar */}
        <div className={styles.floatingNavbar}>
          <button
            className={`${styles.navButton} ${
              activeTab === "task" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("task")}
          >
            <FaTasks /> Task
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "planning" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("planning")}
          >
            <FaLightbulb /> Planning
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "documentation" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("documentation")}
          >
            <FaFileAlt /> Documentation
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "gpt" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("gpt")}
          >
            <FaRobot /> GPT
          </button>
          <button
            className={`${styles.navButton} ${
              activeTab === "scheduler" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("scheduler")}
          >Scheduler</button>
        </div>

        {/* Dynamic Page Content */}
        <div className={styles.pageContent}>{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default ProjectPage;
