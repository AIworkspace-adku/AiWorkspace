import React, { useState } from "react";
import "./MyTask.css";

const MyTask = () => {
  // Sample demo data
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project ABC",
      team: "Team XYZ",
      tasks: [
        {
          id: 1,
          description: "Task 1",
          deadline: "2025-01-20",
          completed: false,
        },
        {
          id: 2,
          description: "Task 2",
          deadline: "2025-01-22",
          completed: false,
        },
        {
          id: 3,
          description: "Task 3",
          deadline: "2025-01-18",
          completed: false,
        },
      ],
    },
    {
      id: 2,
      name: "Project DEF",
      team: "Team ABC",
      tasks: [
        {
          id: 1,
          description: "Task 1",
          deadline: "2025-01-19",
          completed: false,
        },
        {
          id: 2,
          description: "Task 2",
          deadline: "2025-01-25",
          completed: false,
        },
      ],
    },
  ]);

  // Toggle the completion of a task
  const handleTaskCompletion = (projectId, taskId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        project.tasks = project.tasks.map((task) => {
          if (task.id === taskId) {
            return { ...task, completed: !task.completed }; // Toggle completion
          }
          return task;
        });
      }
      return project;
    });
    setProjects(updatedProjects); // Update the state
  };

  return (
    <div className="myTaskContainer">
      <h1 className="pageTitle">My Tasks</h1>
      <div className="projectsContainer">
        {projects.map((project) => (
          <div className="projectCard" key={project.id}>
            <div className="projectHeader">
              <div className="projectName">{project.name}</div>
              <div className="teamName">{project.team}</div>
            </div>
            <div className="taskList">
              {project.tasks
                .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)) // Sort tasks by deadline
                .map((task) => (
                  <div
                    className="taskItem"
                    key={task.id}
                    onClick={() => handleTaskCompletion(project.id, task.id)} // Toggle on click
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleTaskCompletion(project.id, task.id)}
                    />
                    <div
                      className={`taskDescription ${task.completed ? "completed" : ""}`}
                    >
                      {task.description}
                    </div>
                    <div className="taskDeadline">{task.deadline}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyTask;
