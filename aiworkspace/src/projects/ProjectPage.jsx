import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaComments, FaVideo, FaTasks, FaFileAlt, FaLightbulb, FaRobot } from "react-icons/fa";
import Sidebar from "../components/dashboardpage/Sidebar"; // Ensure Sidebar is consistent
import styles from "./ProjectPage.module.css";

const ProjectPage = () => {
  const { projId } = useParams();
  console.log(projId);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the protected route
    fetch('http://localhost:5000/protected', {
      method: 'POST',
      credentials: 'include',
      withCredentials: true, // Include cookies in the request
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message)
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>; // Show loading message if data is still being fetched
  }

  return (
    <div className={styles.projectPage}>
      {/* Sidebar */}
      <Sidebar userData = {data} />

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
          <a href={`/docs/${projId}`} className={styles.navButton}>
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
