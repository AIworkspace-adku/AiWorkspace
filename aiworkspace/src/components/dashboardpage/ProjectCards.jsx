import React from 'react';
import styles from './ProjectCards.module.css';

const dummyProjects = [
  { name: "Project Alpha", progress: 40 },
  { name: "Project Beta", progress: 75 },
  { name: "Project Gamma", progress: 20 },
];

const ProjectCards = () => {
  return (
    <div className={styles.projectCardsContainer}>
      {dummyProjects.map((proj, idx) => (
        <div className={styles.card} key={idx}>
          <h4>{proj.name}</h4>
          <div className={styles.progressBarBackground}>
            <div 
              className={styles.progressBarFill} 
              style={{ width: `${proj.progress}%` }}
            ></div>
          </div>
          <span>{proj.progress}% completed</span>
        </div>
      ))}
    </div>
  );
};

export default ProjectCards;
