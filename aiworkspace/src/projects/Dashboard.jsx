import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import "./Dashboard.css";

// Register necessary components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Example data for the charts
  const teamCompletionData = {
    labels: ['Alice', 'Bob', 'Charlie', 'Dave'],
    datasets: [
      {
        label: 'Work Done by Team Members',
        data: [80, 55, 90, 70],
        backgroundColor: '#4fa3e1',  // Blue for dark theme
        borderColor: '#2b2d42',      // Darker border for contrast
        borderWidth: 1,
        hoverBackgroundColor: '#7b8fa1',
      },
    ],
  };

  const overdueTasksData = {
    labels: ['Alice', 'Bob', 'Charlie', 'Dave'],
    datasets: [
      {
        label: 'Overdue Tasks Assigned',
        data: [1, 2, 0, 1],
        backgroundColor: '#2b8be1', // Blue shade for overdue tasks
        borderColor: '#2b2d42',     // Dark border
        borderWidth: 1,
        hoverBackgroundColor: '#6390c1',
      },
    ],
  };

  return (
    <div className="dashboardContainer">
      <div className="topSection">
        <h2 className="sectionTitle">Project Modules</h2>
        <div className="modulesContainer">
          <div className="moduleCard">
            <h3 className="moduleName">Module ABC</h3>
            <div className="assignedUsers">
              <img src="user1.png" alt="user1" className="avatar" />
              <img src="user2.png" alt="user2" className="avatar" />
            </div>
            <div className="progressBar">
              <div className="progress" style={{ width: '70%' }}>70%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottomSection">
        <div className="chartContainer">
          <h2 className="sectionTitle">Work Done by Team Members</h2>
          <Pie data={teamCompletionData} />
        </div>

        <div className="chartContainer">
          <h2 className="sectionTitle">Overdue Tasks</h2>
          <Bar data={overdueTasksData} options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Tasks Not Completed After Deadline'
              },
            },
            scales: {
              x: {
                ticks: {
                  color: '#ffffff', // Text color for X axis
                },
              },
              y: {
                ticks: {
                  color: '#ffffff', // Text color for Y axis
                },
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
