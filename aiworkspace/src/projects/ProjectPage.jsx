import React from "react";
import { FaComments, FaVideo, FaTasks, FaFileAlt, FaLightbulb, FaRobot } from "react-icons/fa";
import Sidebar from "../components/dashboardpage/Sidebar"; // Ensure Sidebar is consistent
import styles from "./ProjectPage.module.css";

const ProjectPage = () => {
  return (
    <div className={styles.projectPage}>
      {/* Sidebar */}
      <Sidebar />

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
          <a href="#" className={`${styles.navButton} ${styles.active}`}>
            <FaTasks /> Task
          </a>
          <a href="/planning" className={styles.navButton}>
            <FaLightbulb /> Planning
          </a>
          <a href="/docs" className={styles.navButton}>
            <FaFileAlt /> Documentation
          </a>
          <a href="#" className={styles.navButton}>
            <FaRobot /> GPT
          </a>
        </div>

        {/* Placeholder for Page Content */}
        <div className={styles.pageContent}>
          
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
