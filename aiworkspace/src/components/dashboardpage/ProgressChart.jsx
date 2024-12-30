import React from 'react';
import styles from './ProgressChart.module.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ProgressChart = () => {
  const data = {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets: [
      {
        label: 'Tasks Completed',
        data: [5, 2, 7, 4, 6, 3, 8],
        backgroundColor: '#4caf50'
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: { ticks: { color: '#eee' } },
      y: { ticks: { color: '#eee' } }
    },
    plugins: {
      legend: { labels: { color: '#eee' } },
      title: {
        display: true,
        text: 'Weekly Task Completion',
        color: '#eee'
      }
    }
  };

  return (
    <div className={styles.chartContainer}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ProgressChart;
