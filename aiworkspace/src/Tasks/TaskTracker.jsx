import React, { useState } from "react";
import "./TaskTracker.css";

const TaskTracker = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      title: "Design",
      status: "not-started",
      tasks: [
        { id: 1, title: "Wireframe creation", completed: false },
        { id: 2, title: "UI mockup", completed: false },
      ],
      assigned: ["AB", "CD"],
    },
    {
      id: 2,
      title: "Development",
      status: "not-started",
      tasks: [
        { id: 3, title: "Frontend coding", completed: false },
        { id: 4, title: "API integration", completed: false },
      ],
      assigned: ["EF"],
    },
    {
      id: 3,
      title: "Testing",
      status: "not-started",
      tasks: [
        { id: 5, title: "Unit tests", completed: false },
        { id: 6, title: "Integration tests", completed: false },
      ],
      assigned: ["GH"],
    },
  ]);

  const handleTaskToggle = (moduleId, taskId) => {
    const updatedModules = modules.map((module) => {
      if (module.id === moduleId) {
        const updatedTasks = module.tasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        );

        const isInProgress = updatedTasks.some((task) => task.completed);
        const isCompleted = updatedTasks.every((task) => task.completed);

        const status = isCompleted
          ? "completed"
          : isInProgress
          ? "in-progress"
          : "not-started";

        return { ...module, tasks: updatedTasks, status };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "not-started":
        return "red";
      case "in-progress":
        return "yellow";
      case "completed":
        return "green";
      default:
        return "gray";
    }
  };

  return (
    <div className="taskTrackerPage">
      <div className="modulesWrapper">
        {modules.map((module) => (
          <div className="moduleTaskWrapper" key={module.id}>
            {/* Module Card */}
            <div className="moduleCard">
              <div className="moduleHeader">
                <div
                  className="statusBullet"
                  style={{ backgroundColor: getStatusColor(module.status) }}
                ></div>
                <h3>{module.title}</h3>
              </div>
              <div className="progressBar">
                <div
                  className="progressFill"
                  style={{
                    width: `${
                      (module.tasks.filter((task) => task.completed).length /
                        module.tasks.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="assignedMembers">
                {module.assigned.map((initials, index) => (
                  <div key={index} className="memberIcon" title={initials}>
                    {initials}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow Linking to Task Card */}
            <div className="arrowLine"></div>

            {/* Task Card */}
            <div className="taskCard">
              <h4>Tasks</h4>
              {module.tasks.map((task) => (
                <div key={task.id} className="taskItem">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleTaskToggle(module.id, task.id)}
                  />
                  <span>{task.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTracker;
