import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import styles from "./TasksSection.module.css";

const TasksSection = () => {
  const [tasks, setTasks] = useState([
    { id: 1, task: "Complete UI Mockups", done: false },
    { id: 2, task: "Fix Navbar Bug", done: false },
    { id: 3, task: "Prepare Backend Routes", done: true },
  ]);

  const [newTaskName, setNewTaskName] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");

  // Add a new task
  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    const newTask = { id: Date.now(), task: newTaskName, done: false };
    setTasks([...tasks, newTask]);
    setNewTaskName("");
  };

  // Toggle task completion
  const handleToggleDone = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, done: !task.done } : task
    );
    setTasks(updatedTasks);
  };

  // Edit a task
  const handleEditTask = (task) => {
    setEditTaskId(task.id);
    setEditTaskName(task.task);
  };

  // Save edited task
  const handleSaveEditTask = () => {
    const updatedTasks = tasks.map((task) =>
      task.id === editTaskId ? { ...task, task: editTaskName } : task
    );
    setTasks(updatedTasks);
    setEditTaskId(null);
    setEditTaskName("");
  };

  // Delete a task
  const handleDeleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <div className={styles.tasksContainer}>
      <div className={styles.header}>
        <h3>Your Tasks</h3>
        <div className={styles.addTask}>
          <input
            type="text"
            placeholder="Add new task..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            className={styles.addInput}
          />
          <button onClick={handleAddTask} className={styles.addButton}>
            <FaPlus />
          </button>
        </div>
      </div>
      <ul className={styles.taskList}>
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`${styles.taskItem} ${task.done && styles.completed}`}
          >
            <div className={styles.taskContent}>
              <input
                type="checkbox"
                checked={task.done}
                onChange={() => handleToggleDone(task.id)}
                className={styles.checkbox}
              />
              {editTaskId === task.id ? (
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.taskName}>{task.task}</span>
              )}
            </div>
            <div className={styles.taskActions}>
              {editTaskId === task.id ? (
                <button
                  onClick={handleSaveEditTask}
                  className={styles.actionButton}
                >
                  <FaCheck />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleEditTask(task)}
                    className={styles.actionButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className={styles.actionButton}
                  >
                    <FaTrash />
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksSection;
