import React, { useEffect, useState } from 'react';
import styles from './MainContent.module.css';
import ProjectCards from './ProjectCards.jsx';
import TasksSection from './TasksSection.jsx';
import ScheduleSection from './ScheduleSection.jsx';

const MainContent = ({ userData }) => {
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    // Fetch tasks from backend
    // Example: GET /api/tasks?userName=userName
    // Here we simulate with dummy data:
    const dummyTasks = [
      { id: 1, task: "Complete UI Mockups", done: false },
      { id: 2, task: "Fix navbar bug", done: true }
    ];
    setTasks(dummyTasks);

    // Fetch schedule for today's date (or a specific day)
    // Example: GET /api/schedule?day=2024-12-15
    // Simulate with dummy data:
    const todaySchedule = [
      { time: '08:00', activity: 'Review tasks' },
      { time: '09:00', activity: 'Team Standup' },
      { time: '11:00', activity: 'Client Meeting' },
      { time: '14:00', activity: 'Development Work' },
      { time: '16:00', activity: 'Wrap Up' }
    ];
    setSchedule(todaySchedule);
  }, [userData]);

  // Handlers for tasks
  const handleAddTask = () => {
    // Show modal or prompt, then send POST to backend, update state
    const newTask = { id: Date.now(), task: "New Task", done: false };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (id) => {
    // Show modal or prompt to update, then PUT to backend, update state
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, task: t.task + ' (updated)' } : t);
    setTasks(updatedTasks);
  };

  const handleRemoveTask = (id) => {
    // DELETE request to backend
    const filtered = tasks.filter(t => t.id !== id);
    setTasks(filtered);
  };

  return (
    <div className={styles.mainContent}>
      <h2 className={styles.greeting}>Welcome back, {userData.username}</h2>

      {/* Project Cards in glass morph card */}
      <div className={styles.projectsSection}>
        <h3>Recently Worked On</h3>
        <ProjectCards userData = {userData} />
      </div>

      {/* Bottom section: Tasks (non-glass), Schedule (glass morph) */}
      <div className={styles.bottomSection}>
        <div className={styles.tasksWrapper}>
          <TasksSection 
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onRemoveTask={handleRemoveTask}
          />
        </div>
        <div className={styles.scheduleWrapper}>
          <ScheduleSection schedule={schedule} />
        </div>
      </div>
    </div>
  );
};

export default MainContent;
