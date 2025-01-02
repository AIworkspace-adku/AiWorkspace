import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";
import "./TaskTracker.css";

const TaskTracker = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Module 1",
      tasks: [
        { id: 101, title: "Complete UI Mockups", assignedTo: ["John Doe"], done: false },
        { id: 102, title: "Fix Navbar Bug", assignedTo: ["Jane Smith"], done: false },
      ],
      assignedTo: ["Alice Brown"],
    },
    {
      id: 2,
      title: "Module 2",
      tasks: [],
      assignedTo: ["Bob Marley"],
    },
  ]);

  const [teamMembers] = useState(["John Doe", "Jane Smith", "Alice Brown", "Bob Marley"]);
  const [newModule, setNewModule] = useState({ title: "", assignedTo: [] });
  const [showAddModule, setShowAddModule] = useState(false);
  const [showAddTask, setShowAddTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", assignedTo: [] });

  // Calculate progress and bullet color dynamically
  const getProgress = (tasks) => {
    if (!tasks || tasks.length === 0) return 0; // No tasks
    const completed = tasks.filter((task) => task.done).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getBulletColor = (tasks) => {
    const progress = getProgress(tasks);
    if (progress === 0) return "red";
    if (progress > 0 && progress < 100) return "yellow";
    return "green";
  };

  // Add a new module
  const handleAddModule = () => {
    if (!newModule.title.trim()) return;
    setModules([
      ...modules,
      {
        id: Date.now(),
        title: newModule.title,
        tasks: [],
        assignedTo: newModule.assignedTo,
      },
    ]);
    setNewModule({ title: "", assignedTo: [] });
    setShowAddModule(false);
  };

  // Add a new task to a module
  const handleAddTask = (moduleId) => {
    if (!newTask.title.trim()) return;
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              tasks: [
                ...module.tasks,
                { id: Date.now(), title: newTask.title, assignedTo: newTask.assignedTo, done: false },
              ],
            }
          : module
      )
    );
    setNewTask({ title: "", assignedTo: [] });
    setShowAddTask(null);
  };

  // Toggle task completion
  const handleToggleTask = (moduleId, taskId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              tasks: module.tasks.map((task) =>
                task.id === taskId ? { ...task, done: !task.done } : task
              ),
            }
          : module
      )
    );
  };

  // Delete a task
  const handleDeleteTask = (moduleId, taskId) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              tasks: module.tasks.filter((task) => task.id !== taskId),
            }
          : module
      )
    );
  };

  // Delete a module
  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter((module) => module.id !== moduleId));
  };

  return (
    <div className="task-tracker">
      {/* Add Module Button */}
      <button className="add-module-button" onClick={() => setShowAddModule(true)}>
        Add Module
      </button>

      {/* Add Module Form */}
      {showAddModule && (
        <div className="floating-form">
          <input
            type="text"
            placeholder="Module Name"
            value={newModule.title}
            onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
            className="input-field"
          />
          <div className="member-checkbox-list">
            {teamMembers.map((member) => (
              <label key={member} className="checkbox-label">
                <input
                  type="checkbox"
                  value={member}
                  checked={newModule.assignedTo.includes(member)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewModule({
                        ...newModule,
                        assignedTo: [...newModule.assignedTo, member],
                      });
                    } else {
                      setNewModule({
                        ...newModule,
                        assignedTo: newModule.assignedTo.filter((m) => m !== member),
                      });
                    }
                  }}
                />
                {member}
              </label>
            ))}
          </div>
          <button className="save-button" onClick={handleAddModule}>
            Save
          </button>
          <button className="cancel-button" onClick={() => setShowAddModule(false)}>
            Cancel
          </button>
        </div>
      )}

      <div className="module-task-container">
        {modules.map((module) => (
          <div key={module.id} className="module-task-wrapper">
            {/* Module Card */}
            <div className="module-card">
              <span
                className="status-bullet"
                style={{ backgroundColor: getBulletColor(module.tasks) }}
              ></span>
              <div className="module-header">
                <h3>{module.title}</h3>
                <div className="avatars">
                  {module.assignedTo.map((member, index) => (
                    <div
                      key={index}
                      className="avatar"
                      title={member}
                    >
                      {member.split(" ").map((name) => name[0]).join("")}
                    </div>
                  ))}
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${getProgress(module.tasks)}%`,
                  }}
                ></div>
              </div>
              <button
                className="add-task-button"
                onClick={() => setShowAddTask(module.id)}
              >
                Add Task
              </button>
              <button
                className="delete-module-button"
                onClick={() => handleDeleteModule(module.id)}
              >
                <FaTrash />
              </button>
            </div>

            {/* Task Card */}
            <div className="task-card">
              {module.tasks.map((task) => (
                <div key={task.id} className="task-item">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => handleToggleTask(module.id, task.id)}
                  />
                  <span>{task.title}</span>
                  <div className="avatars">
                    {task.assignedTo.map((member, index) => (
                      <div
                        key={index}
                        className="avatar"
                        title={member}
                      >
                        {member.split(" ").map((name) => name[0]).join("")}
                      </div>
                    ))}
                  </div>
                  <button
                    className="action-button"
                    onClick={() => handleDeleteTask(module.id, task.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Task Form */}
            {showAddTask === module.id && (
              <div className="floating-form">
                <input
                  type="text"
                  placeholder="Task Name"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="input-field"
                />
                <div className="member-checkbox-list">
                  {teamMembers.map((member) => (
                    <label key={member} className="checkbox-label">
                      <input
                        type="checkbox"
                        value={member}
                        checked={newTask.assignedTo.includes(member)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewTask({
                              ...newTask,
                              assignedTo: [...newTask.assignedTo, member],
                            });
                          } else {
                            setNewTask({
                              ...newTask,
                              assignedTo: newTask.assignedTo.filter((m) => m !== member),
                            });
                          }
                        }}
                      />
                      {member}
                    </label>
                  ))}
                </div>
                <button className="save-button" onClick={() => handleAddTask(module.id)}>
                  Save
                </button>
                <button className="cancel-button" onClick={() => setShowAddTask(null)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTracker;
