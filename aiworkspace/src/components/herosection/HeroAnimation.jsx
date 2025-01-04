import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";
import "./HeroAnimation.css";

const HeroAnimation = () => {
  const [graphData, setGraphData] = useState({
    labels: Array.from({ length: 10 }, (_, i) => `Task ${i + 1}`),
    datasets: [
      {
        label: "Team Progress",
        data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  });

  const [cursors, setCursors] = useState([
    { id: 1, name: "Ayush", top: "20%", left: "30%", color: "#00ffcc" },
    { id: 2, name: "Krithik", top: "50%", left: "70%", color: "#ff007f" },
  ]);

  const [tasks, setTasks] = useState(["Create Landing Page", "Setup Authentication", "Integrate API"]);

  useEffect(() => {
    const moveCursors = () => {
      setCursors((prev) =>
        prev.map((cursor) => ({
          ...cursor,
          top: `${Math.random() * 70 + 10}%`,
          left: `${Math.random() * 70 + 10}%`,
        }))
      );
    };

    const cursorInterval = setInterval(moveCursors, 2000);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    const graphUpdateInterval = setInterval(() => {
      setGraphData((prev) => ({
        ...prev,
        datasets: [
          {
            ...prev.datasets[0],
            data: Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)),
          },
        ],
      }));
    }, 2000);

    const taskUpdateInterval = setInterval(() => {
      setTasks((prev) => {
        const newTask = `Task ${prev.length + 1}`;
        return [...prev.slice(1), newTask];
      });
    }, 3000);

    return () => {
      clearInterval(graphUpdateInterval);
      clearInterval(taskUpdateInterval);
    };
  }, []);

  return (
    <div className="hero-animation">
      {/* Cursors */}
      <div className="cursors">
        {cursors.map((cursor) => (
          <div
            key={cursor.id}
            className="cursor"
            style={{
              top: cursor.top,
              left: cursor.left,
              backgroundColor: cursor.color,
              boxShadow: `0 0 10px ${cursor.color}`,
            }}
          >
            {cursor.name}
          </div>
        ))}
      </div>

      {/* Task List */}
      <div className="todo-list">
        <h3>Tasks:</h3>
        <ul>
          {tasks.map((task, index) => (
            <li key={index} className="fade-in-out">
              {task}
            </li>
          ))}
        </ul>
      </div>

      {/* Typing Animation */}
      <div className="typing-area">
        <p className="typing-animation">Collaborating in real-time... 🚀</p>
      </div>

      {/* Graph Animation */}
      <div className="graph-area">
        <Line data={graphData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
      </div>
    </div>
  );
};

export default HeroAnimation;
