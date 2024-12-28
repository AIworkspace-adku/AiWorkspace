import React from 'react';
import styles from './DashboardPage.module.css';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import RightPanel from './RightPanel';

const DashboardPage = () => {
  // Define the user name directly here
  const userName = localStorage.getItem('username') || 'User';

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar userName={userName} />
      <MainContent userName={userName} />
    </div>
  );
};

export default DashboardPage;
