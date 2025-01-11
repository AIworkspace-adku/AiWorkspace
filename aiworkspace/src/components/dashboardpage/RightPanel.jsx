import React from 'react';
import styles from './RightPanel.module.css';
import ProgressChart from './ProgressChart.jsx';

const RightPanel = ({ userName }) => {
  return (
    <div className={styles.rightPanel}>
      <h3>{userName}'s Performance</h3>
      <ProgressChart />
    </div>
  );
};

export default RightPanel;
