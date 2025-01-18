import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './ProjectCards.module.css';

const dummyProjects = [
  { name: "Project Alpha", progress: 40 },
  { name: "Project Beta", progress: 75 },
  { name: "Project Gamma", progress: 20 },
];

const ProjectCards = ({ userData }) => {

  const [recentProjects, setProjects] = useState([]);

  useEffect(() => {
    try {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/recentProjects`, {
        email: userData.email,
      })
        .then((response) => {
          setProjects(response.data.recentProjects);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className={styles.projectCardsContainer}>
      {recentProjects.length > 0 && recentProjects.map((proj, idx) => (
        <div className={styles.card} key={idx} onClick={() => window.location.href = `/projects/${proj._id}`}>
          <h4>{proj.projName}</h4>
          <div className={styles.progressBarBackground}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${proj.progress}%` }}
            ></div>
          </div>
          <span>{proj.progress.toFixed(2)}% completed</span>
        </div>
      ))}

      {recentProjects.length === 0 && (
        <div className={styles.card}>
          <h4>Add Projects +</h4>
          <div className={styles.progressBarBackground}>
            <div
              className={styles.progressBarFill}
              // style={{ width: `${proj.progress}%` }}
            ></div>
          </div>
          <span>Monitor progress by creating tasks</span>
        </div>
      )}
    </div>
  );
};

export default ProjectCards;
