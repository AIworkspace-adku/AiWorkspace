import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaComments, FaVideo, FaTasks, FaFileAlt, FaLightbulb, FaRobot } from "react-icons/fa";
import Sidebar from "../components/dashboardpage/Sidebar"; // Ensure Sidebar is consistent
import TaskTracker from "../Tasks/TaskTracker"; // Import your task tracker component
import GanttChart from "../projects/GanttChart"; // Dummy planning component
import Docs from "../App_docs"; // Dummy documentation component
import Gpt from "../chatGpt/Gpt"; // Dummy GPT component
import styles from "./ProjectPage.module.css";

const ProjectPage = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("task"); // Default tab: Task
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the protected route
    fetch("http://localhost:5000/protected", {
      method: "POST",
      credentials: "include",
      withCredentials: true, // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 403) {
						navigate('/session-timeout');
					}
					else {
						throw new Error('Failed to fetch data');
					}
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  }, []);

  if (!data || !projectId) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "task":
        return <TaskTracker projId={projectId} userData = {data} />;
      case "planning":
        return <GanttChart />;
      case "documentation":
        return <Docs projId={projectId} />;
      case "gpt":
        return <Gpt />;
      default:
        return <div>Select an option from the navbar</div>;
    }
  };

  return (
    <div className={styles.projectPage}>
      {/* Sidebar */}
      <Sidebar userData={data} />

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
        </div>

        {/* Dynamic Page Content */}
        <div className={styles.pageContent}>{renderActiveComponent()}</div>
      </div>
    </div>
  );
};

export default ProjectPage;
