import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import styles from "./TasksSection.module.css";

const TasksSection = ({ userData }) => {

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    try {
      axios.post("http://localhost:5000/fetchTasks", {
        email: userData.email,
      })
        .then((response) => {
          setTasks(response.data.tasks);
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }, [userData]);

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
  const handleUpdateTask = async (id, moduleId, status, statusUpdate) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateTask`, {
        moduleId: moduleId,
        taskId: id,
        taskName: editTaskName,
        assignedTo: [],
        status: status,
        statusUpdate: statusUpdate,
      })

      if (response.data.updatedTask) {
        setTasks(
          tasks.map((task) =>
            task._id === id
              ? response.data.updatedTask
              : task
          )
        );

        setEditTaskId(null);
        setEditTaskName("");
      }
      else {
        console.log("No task found");
      }
    }
    catch (error) {
      console.log(error);
    }
  };

  // Edit a task
  const handleEditTask = (task) => {
    setEditTaskId(task._id);
    setEditTaskName(task.taskName);
  };

  // Delete a task
  const handleDeleteTask = async (moduleId, taskId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/deleteTask`, {
        moduleId: moduleId,
        taskId: taskId,
      })

      if (response.data.deletedTask) {
        setTasks(tasks.filter((task) => task._id !== taskId))
      }
      else {
        console.log("No modules found");
      }
    }
    catch (error) {
      console.log(error);
    }
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
            key={task._id}
            className={`${styles.taskItem} ${task.status && styles.completed}`}
          >
            <div className={styles.taskContent}>
              <input
                type="checkbox"
                checked={task.status}
                onChange={() => handleUpdateTask(task._id, task.owner.moduleId, !task.status, true)}
                className={styles.checkbox}
              />
              {editTaskId === task._id ? (
                <input
                  type="text"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className={styles.editInput}
                />
              ) : (
                <span className={styles.taskName}>{task.taskName}</span>
              )}
            </div>
            <div className={styles.taskActions}>
              {editTaskId === task._id ? (
                <button
                  onClick={() => handleUpdateTask(task._id, task.owner.moduleId, false, false)}
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
                    onClick={() => handleDeleteTask(task.owner.moduleId, task._id)}
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
